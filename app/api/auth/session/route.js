import { NextResponse } from "next/server";
import prisma from "@/lib/prisma.js";
import { signToken, hashPassword } from "@/lib/auth.js";

/**
 * Universal Session Bridge for Firebase, OAuth, and Local Credentials.
 * Sets the essential 'saral_session' HTTP-only cookie for Edge Middleware verification.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      email,
      fullName,
      role = "CITIZEN",
      avatarUrl,
      isDigiLockerVerified = false,
      firebaseUid,
    } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email address is required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanRole = (role || "CITIZEN").toUpperCase();
    const cleanName = (fullName || (cleanRole === "CITIZEN" ? "Citizen User" : "Officer User")).trim();
    const cleanAvatar =
      avatarUrl ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256";

    let dbUser = null;

    try {
      // 1. Look up user by email
      dbUser = await prisma.user.findUnique({
        where: { email: cleanEmail },
        include: { citizenProfile: true, officerProfile: true },
      });

      // 2. If found, only update name if previous name was empty or generic placeholder
      if (dbUser) {
        const isPlaceholder = !dbUser.fullName || dbUser.fullName === "Citizen User" || dbUser.fullName === "User";
        if (isPlaceholder && cleanName && cleanName !== "Citizen User" && cleanName !== "Rahul Sharma") {
          dbUser = await prisma.user.update({
            where: { id: dbUser.id },
            data: {
              fullName: cleanName,
              avatarUrl: cleanAvatar || dbUser.avatarUrl,
            },
            include: { citizenProfile: true, officerProfile: true },
          });
        }
      } else {
        // If not found, provision in database
        const dummyHash = await hashPassword(`SARAL_AUTH_${cleanEmail}_${Date.now()}`);
        dbUser = await prisma.user.create({
          data: {
            email: cleanEmail,
            passwordHash: dummyHash,
            fullName: cleanName,
            role: cleanRole,
            avatarUrl: cleanAvatar,
            isDigiLockerVerified: Boolean(isDigiLockerVerified),
            isActive: true,
            ...(cleanRole === "CITIZEN"
              ? {
                  citizenProfile: {
                    create: {
                      digiLockerId: isDigiLockerVerified ? "DL-VERIFIED" : null,
                    },
                  },
                }
              : {}),
          },
          include: { citizenProfile: true, officerProfile: true },
        });

        // Audit log
        try {
          await prisma.auditLog.create({
            data: {
              userId: dbUser.id,
              action: "USER_REGISTERED_VIA_FIREBASE",
              entityName: "User",
              entityId: dbUser.id,
            },
          });
        } catch (e) {}
      }

      // Seed personalized welcome notification if user has 0 notifications
      try {
        const notifCount = await prisma.notification.count({ where: { userId: dbUser.id } });
        if (notifCount === 0) {
          let welcomeTitle = `Welcome to SARAL RTI, ${dbUser.fullName}!`;
          let welcomeMessage = `Your citizen account (${cleanEmail}) is ready. Explore verified encyclopedias, complete DigiLocker citizenship verification, and file statutory RTIs under Section 6(1).`;
          let welcomeLink = "/dashboard";

          if (dbUser.role === "ADMIN") {
            welcomeTitle = `Welcome to SARAL Administration!`;
            welcomeMessage = `Your master administration portal (${cleanEmail}) is active with platform governance, officer management, and statutory audit oversight.`;
            welcomeLink = "/dashboard";
          } else if (dbUser.role === "OFFICER") {
            welcomeTitle = `Welcome to SARAL Officer Desk, ${dbUser.fullName}!`;
            welcomeMessage = `Your designated officer workstation (${cleanEmail}) is ready. Complete DigiLocker identity verification to inspect assigned Section 6(1) petitions.`;
            welcomeLink = "/dashboard";
          }

          await prisma.notification.create({
            data: {
              userId: dbUser.id,
              title: welcomeTitle,
              message: welcomeMessage,
              type: "SYSTEM",
              link: welcomeLink,
              isRead: false,
            },
          });
        }
      } catch (nErr) {}
    } catch (dbErr) {
      console.warn("Database lookup/create skipped or offline, using virtual user:", dbErr.message);
      dbUser = {
        id: firebaseUid || `usr_${Date.now()}`,
        email: cleanEmail,
        fullName: cleanName,
        role: cleanRole,
        avatarUrl: cleanAvatar,
        isDigiLockerVerified: Boolean(isDigiLockerVerified),
      };
    }

    // 3. Issue signed JWT for Edge Runtime verification
    const token = signToken({
      userId: dbUser.id,
      email: dbUser.email,
      role: dbUser.role,
      fullName: dbUser.fullName,
    });

    const safeUser = {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.fullName,
      fullName: dbUser.fullName,
      phone: dbUser.phone || "",
      role: dbUser.role,
      avatarUrl: dbUser.avatarUrl || cleanAvatar,
      isDigiLockerVerified: Boolean(dbUser.isDigiLockerVerified),
      citizenProfile: dbUser.citizenProfile || (dbUser.role === "CITIZEN" ? {
        addressLine: "",
        district: "",
        state: "",
        pincode: "",
      } : null),
      officerProfile: dbUser.officerProfile || null,
    };

    const response = NextResponse.json({
      success: true,
      message: "Session established successfully.",
      user: safeUser,
      token,
    });

    // 4. Set the HTTP-Only cookie recognized by middleware.js
    response.cookies.set("saral_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Session creation error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create session." },
      { status: 500 }
    );
  }
}
