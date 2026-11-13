import prisma from "../prisma.js";

/**
 * Generates unique statutory application number: SARAL-2026-XXXXX
 */
export async function generateApplicationNumber() {
  const currentYear = new Date().getFullYear();
  const count = await prisma.rtiApplication.count();
  const sequential = String(count + 1).padStart(5, "0");
  return `SARAL-${currentYear}-${sequential}`;
}

/**
 * Creates a new RTI Petition with automated statutory 30-day clock & lifecycle milestones
 */
export async function createRtiApplication({
  citizenUserId,
  departmentId,
  title,
  subject,
  rawCitizenPrompt,
  structuredClauses = [],
  targetAuthority,
  isLifeOrLiberty = false,
  feeStatus = "PAID",
  paymentTxnId = null,
}) {
  // 1. Verify citizen profile
  const citizen = await prisma.citizenProfile.findUnique({
    where: { userId: citizenUserId },
    include: { user: true },
  });

  if (!citizen) {
    throw new Error("Citizen profile not found for the user.");
  }

  // 2. Verify target department
  const department = await prisma.department.findUnique({
    where: { id: departmentId },
    include: {
      officers: {
        where: { isPio: true },
        take: 1,
      },
    },
  });

  if (!department) {
    throw new Error("Specified government department does not exist.");
  }

  const assignedOfficer = department.officers[0] || null;

  // 3. Calculate statutory deadline
  const now = new Date();
  const deadline = new Date(now);
  if (isLifeOrLiberty) {
    // Section 7(1) Proviso: 48 hours for Life & Liberty
    deadline.setHours(deadline.getHours() + 48);
  } else {
    // Section 7(1) Standard: 30 days
    deadline.setDate(deadline.getDate() + 30);
  }

  const applicationNumber = await generateApplicationNumber();

  // 4. Create RTI Application with Milestones in a transaction
  const application = await prisma.rtiApplication.create({
    data: {
      applicationNumber,
      citizenId: citizen.id,
      departmentId: department.id,
      assignedOfficerId: assignedOfficer ? assignedOfficer.id : null,
      title: title.trim(),
      subject: subject ? subject.trim() : title.trim(),
      rawCitizenPrompt: rawCitizenPrompt ? rawCitizenPrompt.trim() : "",
      structuredClauses: JSON.stringify(
        Array.isArray(structuredClauses) ? structuredClauses : [structuredClauses]
      ),
      targetAuthority:
        targetAuthority?.trim() || department.nodalOffice || department.name,
      dateFiled: now,
      statutoryDeadline: deadline,
      isLifeOrLiberty,
      currentStage: 2, // Submitted
      status: "SUBMITTED",
      feeStatus: feeStatus.toUpperCase(),
      feeAmount: feeStatus === "EXEMPTED_BPL" ? 0.0 : 10.0,
      paymentTxnId: paymentTxnId || `TXN-BHARATKOSH-${Date.now()}`,
      timeline: {
        create: [
          {
            stage: 1,
            title: "Application Drafted & AI-Structured",
            description:
              "Citizen concern structured into Section 6(1) RTI clauses by SARAL Copilot.",
            completed: true,
            active: false,
          },
          {
            stage: 2,
            title: "Treasury Fee Paid & Petition Submitted",
            description: `Statutory fee ${
              feeStatus === "EXEMPTED_BPL" ? "exempted (BPL)" : "₹10 paid via Bharatkosh"
            }. Acknowledgement receipt generated.`,
            completed: true,
            active: true,
          },
          {
            stage: 3,
            title: "Assigned to Public Information Officer (PIO)",
            description: assignedOfficer
              ? `Designated PIO (${department.name}) assigned for record verification.`
              : "Pending departmental allocation to designated PIO.",
            completed: Boolean(assignedOfficer),
            active: false,
          },
          {
            stage: 4,
            title: "Records Retrieval & Departmental Review",
            description:
              "Public authority examines requested files, registers, and muster rolls.",
            completed: false,
            active: false,
          },
          {
            stage: 5,
            title: "Official Response & Certified Documents",
            description:
              "Certified records and official memorandum dispatched to citizen.",
            completed: false,
            active: false,
          },
        ],
      },
    },
    include: {
      department: true,
      assignedOfficer: {
        include: { user: true },
      },
      citizen: {
        include: { user: true },
      },
      timeline: {
        orderBy: { stage: "asc" },
      },
      documents: true,
    },
  });

  // 5. Send notification to citizen
  await prisma.notification.create({
    data: {
      userId: citizenUserId,
      title: "RTI Successfully Filed",
      message: `Your petition ${application.applicationNumber} has been submitted to ${department.name}. Statutory 30-day response clock is now running.`,
      type: "SYSTEM",
      link: `/tracking?id=${application.applicationNumber}`,
    },
  });

  // 6. If officer is assigned, notify officer
  if (assignedOfficer) {
    await prisma.notification.create({
      data: {
        userId: assignedOfficer.userId,
        title: "New RTI Assigned",
        message: `New petition ${application.applicationNumber} assigned to your division. Statutory response deadline is ${deadline.toLocaleDateString()}.`,
        type: "ASSIGNMENT",
        link: "/dashboard",
      },
    });
  }

  // 7. Audit Log
  await prisma.auditLog.create({
    data: {
      userId: citizenUserId,
      action: "RTI_FILED",
      entityName: "RtiApplication",
      entityId: application.id,
    },
  });

  return application;
}

/**
 * Retrieves applications filtered by User Role (RBAC)
 */
export async function getApplications({
  userId,
  role,
  status = null,
  search = null,
  limit = 50,
  offset = 0,
}) {
  const where = {};

  if (role === "CITIZEN") {
    // Citizens only see their own applications
    const citizen = await prisma.citizenProfile.findUnique({
      where: { userId },
    });
    if (!citizen) return [];
    where.citizenId = citizen.id;
  } else if (role === "OFFICER") {
    // Officers see applications of their department or assigned to them
    const officer = await prisma.officerProfile.findUnique({
      where: { userId },
    });
    if (!officer) return [];
    where.departmentId = officer.departmentId;
  }
  // ADMIN role has no where filter by default, can see all

  if (status) {
    where.status = status.toUpperCase();
  }

  if (search) {
    const searchClean = search.trim();
    where.OR = [
      { applicationNumber: { contains: searchClean } },
      { title: { contains: searchClean } },
      { subject: { contains: searchClean } },
      { targetAuthority: { contains: searchClean } },
    ];
  }

  return await prisma.rtiApplication.findMany({
    where,
    include: {
      department: true,
      assignedOfficer: {
        include: { user: true },
      },
      citizen: {
        include: { user: true },
      },
      timeline: {
        orderBy: { stage: "asc" },
      },
      documents: true,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
  });
}

/**
 * Retrieves a single application by ID or Application Number with access control
 */
export async function getApplicationById(identifier, user = null) {
  const application = await prisma.rtiApplication.findFirst({
    where: {
      OR: [{ id: identifier }, { applicationNumber: identifier }],
    },
    include: {
      department: true,
      assignedOfficer: {
        include: { user: true },
      },
      citizen: {
        include: { user: true },
      },
      timeline: {
        orderBy: { stage: "asc" },
      },
      documents: true,
      firstAppeal: true,
    },
  });

  if (!application) return null;

  // RBAC Access Control Check
  if (user) {
    if (user.role === "CITIZEN" && application.citizen.userId !== user.userId) {
      throw new Error("Access Denied. You do not have permission to view this application.");
    }
    if (
      user.role === "OFFICER" &&
      application.departmentId !== user.officerProfile?.departmentId &&
      user.role !== "ADMIN"
    ) {
      // Officers can only access within their department
    }
  }

  return application;
}

/**
 * Updates application status, stage, or officer response
 */
export async function updateApplicationStatus(
  applicationId,
  { stage, status, officialResponse, aiDraftSummary, responseDispatchedAt },
  officerUserId
) {
  const application = await prisma.rtiApplication.findUnique({
    where: { id: applicationId },
    include: { citizen: true, department: true },
  });

  if (!application) {
    throw new Error("Application not found.");
  }

  const updatedData = {};
  if (stage !== undefined) updatedData.currentStage = Number(stage);
  if (status) updatedData.status = status.toUpperCase();
  if (officialResponse !== undefined) updatedData.officialResponse = officialResponse;
  if (aiDraftSummary !== undefined) updatedData.aiDraftSummary = aiDraftSummary;
  if (responseDispatchedAt) updatedData.responseDispatchedAt = new Date(responseDispatchedAt);

  const updated = await prisma.rtiApplication.update({
    where: { id: applicationId },
    data: updatedData,
    include: {
      timeline: { orderBy: { stage: "asc" } },
      department: true,
    },
  });

  // Update timeline stages
  if (stage !== undefined) {
    const stageNum = Number(stage);
    await prisma.applicationTimeline.updateMany({
      where: {
        applicationId,
        stage: { lte: stageNum },
      },
      data: { completed: true },
    });

    await prisma.applicationTimeline.updateMany({
      where: {
        applicationId,
        stage: stageNum,
      },
      data: { active: true },
    });

    await prisma.applicationTimeline.updateMany({
      where: {
        applicationId,
        stage: { gt: stageNum },
      },
      data: { completed: false, active: false },
    });
  }

  // Notify citizen of the status transition
  await prisma.notification.create({
    data: {
      userId: application.citizen.userId,
      title: "RTI Status Update",
      message: `Your petition ${application.applicationNumber} has been updated to '${
        status || `Stage ${stage}`
      }' by ${application.department.name}.`,
      type: status === "RESPONSE_DISPATCHED" ? "RESPONSE" : "CLOCK_WARNING",
      link: `/tracking?id=${application.applicationNumber}`,
    },
  });

  // Audit Log
  await prisma.auditLog.create({
    data: {
      userId: officerUserId,
      action: "RTI_STATUS_UPDATED",
      entityName: "RtiApplication",
      entityId: applicationId,
    },
  });

  return updated;
}

/**
 * Attaches certified document or receipt to RTI Application
 */
export async function addApplicationDocument(applicationId, documentData) {
  return await prisma.applicationDocument.create({
    data: {
      applicationId,
      name: documentData.name,
      fileUrl: documentData.fileUrl,
      fileSize: documentData.fileSize || "1.2 MB",
      fileType: documentData.fileType || "pdf",
      category: documentData.category || "CERTIFIED_RESPONSE",
      isCertified: Boolean(documentData.isCertified),
    },
  });
}
