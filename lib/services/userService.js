import prisma from "../prisma.js";
import { hashPassword, comparePassword, signToken } from "../auth.js";

/**
 * Registers a new citizen or officer with RBAC profile creation
 */
export async function registerUser({
  email,
  password,
  fullName,
  phone,
  role = "CITIZEN",
  profileData = {},
}) {
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });

  if (existingUser) {
    throw new Error("An account with this email address already exists.");
  }

  const passwordHash = await hashPassword(password);

  const normalizedRole = role.toUpperCase();
  if (!["CITIZEN", "OFFICER", "ADMIN"].includes(normalizedRole)) {
    throw new Error("Invalid user role specified.");
  }

  // Create User and specific Role Profile in transaction
  const newUser = await prisma.user.create({
    data: {
      email: email.toLowerCase().trim(),
      passwordHash,
      fullName: fullName.trim(),
      phone: phone?.trim() || null,
      role: normalizedRole,
      isDigiLockerVerified: Boolean(profileData.isDigiLockerVerified),
      avatarUrl:
        profileData.avatarUrl ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
      ...(normalizedRole === "CITIZEN"
        ? {
            citizenProfile: {
              create: {
                addressLine: profileData.addressLine || null,
                district: profileData.district || null,
                state: profileData.state || null,
                pincode: profileData.pincode || null,
                digiLockerId: profileData.digiLockerId || null,
              },
            },
          }
        : {}),
      ...(normalizedRole === "OFFICER" && profileData.departmentId
        ? {
            officerProfile: {
              create: {
                departmentId: profileData.departmentId,
                employeeId:
                  profileData.employeeId ||
                  `EMP-${Date.now().toString().slice(-6)}`,
                designation: profileData.designation || "Designated PIO",
                officeLocation: profileData.officeLocation || "District Office",
                isPio: true,
                isFaa: false,
              },
            },
          }
        : {}),
    },
    include: {
      citizenProfile: true,
      officerProfile: {
        include: { department: true },
      },
    },
  });

  // Log audit trail
  await prisma.auditLog.create({
    data: {
      userId: newUser.id,
      action: "USER_REGISTERED",
      entityName: "User",
      entityId: newUser.id,
    },
  });

  // Create welcome notification
  await prisma.notification.create({
    data: {
      userId: newUser.id,
      title: "Welcome to SARAL RTI",
      message: `Your verified ${normalizedRole.toLowerCase()} account has been created. Start drafting your RTI or accessing public records.`,
      type: "SYSTEM",
      link: normalizedRole === "OFFICER" ? "/dashboard" : "/tracking",
    },
  });

  const token = signToken({
    userId: newUser.id,
    email: newUser.email,
    role: newUser.role,
    fullName: newUser.fullName,
  });

  const { passwordHash: _, ...safeUser } = newUser;
  return { user: safeUser, token };
}

/**
 * Authenticates user credentials and checks role match
 */
export async function authenticateUser({ email, password, role }) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
    include: {
      citizenProfile: true,
      officerProfile: {
        include: { department: true },
      },
    },
  });

  if (!user || !user.isActive) {
    throw new Error("Invalid email or password.");
  }

  const isValidPassword = await comparePassword(password, user.passwordHash);
  if (!isValidPassword) {
    throw new Error("Invalid email or password.");
  }

  // If a role was specified in the login form, check permission
  if (role && role.toUpperCase() !== user.role && user.role !== "ADMIN") {
    throw new Error(
      `Your account is registered as '${user.role}'. Please select the '${user.role}' tab to sign in.`
    );
  }

  // Log successful login audit
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: "USER_LOGIN",
      entityName: "User",
      entityId: user.id,
    },
  });

  const token = signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    fullName: user.fullName,
  });

  const { passwordHash: _, ...safeUser } = user;
  return { user: safeUser, token };
}

/**
 * Retrieves full user profile by user ID
 */
export async function getUserById(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      citizenProfile: true,
      officerProfile: {
        include: { department: true },
      },
    },
  });

  if (!user) return null;

  const { passwordHash: _, ...safeUser } = user;
  return safeUser;
}

/**
 * Updates user profile particulars
 */
export async function updateUserProfile(userId, data) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { citizenProfile: true, officerProfile: true },
  });

  if (!user) throw new Error("User not found.");

  const updateData = {};
  if (data.fullName !== undefined) updateData.fullName = data.fullName.trim();
  if (data.phone !== undefined) updateData.phone = data.phone.trim();
  if (data.avatarUrl !== undefined) updateData.avatarUrl = data.avatarUrl;

  if (user.role === "CITIZEN" && user.citizenProfile) {
    updateData.citizenProfile = {
      update: {
        addressLine: data.addressLine !== undefined ? data.addressLine : user.citizenProfile.addressLine,
        district: data.district !== undefined ? data.district : user.citizenProfile.district,
        state: data.state !== undefined ? data.state : user.citizenProfile.state,
        pincode: data.pincode !== undefined ? data.pincode : user.citizenProfile.pincode,
      },
    };
  }

  if (user.role === "OFFICER" && user.officerProfile) {
    updateData.officerProfile = {
      update: {
        designation: data.designation !== undefined ? data.designation : user.officerProfile.designation,
        officeLocation: data.officeLocation !== undefined ? data.officeLocation : user.officerProfile.officeLocation,
      },
    };
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    include: {
      citizenProfile: true,
      officerProfile: { include: { department: true } },
    },
  });

  await prisma.auditLog.create({
    data: {
      userId,
      action: "USER_PROFILE_UPDATED",
      entityName: "User",
      entityId: userId,
    },
  });

  const { passwordHash: _, ...safeUser } = updatedUser;
  return safeUser;
}

/**
 * Changes user password with validation of existing password
 */
export async function changeUserPassword(userId, { currentPassword, newPassword }) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new Error("User not found.");

  const isMatch = await comparePassword(currentPassword, user.passwordHash);
  if (!isMatch) throw new Error("Current password is incorrect.");

  if (!newPassword || newPassword.length < 6) {
    throw new Error("New password must be at least 6 characters.");
  }

  const passwordHash = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });

  await prisma.auditLog.create({
    data: {
      userId,
      action: "PASSWORD_CHANGED",
      entityName: "User",
      entityId: userId,
    },
  });

  return { success: true, message: "Password updated successfully." };
}

/**
 * Permanently deletes citizen account under DPDP Act 2023
 */
export async function deleteCitizenAccount(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new Error("User not found.");

  if (user.role !== "CITIZEN") {
    throw new Error("Only Citizen accounts can be deleted via this option. Officer and Admin accounts require ministerial decommission.");
  }

  // Delete user (cascades to citizenProfile, notifications, etc.)
  await prisma.user.delete({
    where: { id: userId },
  });

  return { success: true, message: "Citizen account permanently removed under DPDP Act 2023." };
}
