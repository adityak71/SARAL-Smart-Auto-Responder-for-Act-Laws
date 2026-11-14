import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { mockRtiApplications } from "@/data/trackingData";

/**
 * Maps a Prisma DB application into the shape expected by tracking UI components
 */
export function mapApiAppToTrackingApp(app) {
  if (!app) return null;
  const now = new Date();
  const dateFiled = app.dateFiled ? new Date(app.dateFiled) : now;
  const deadline = app.statutoryDeadline
    ? new Date(app.statutoryDeadline)
    : new Date(dateFiled.getTime() + 30 * 86400 * 1000);

  const totalDaysAllowed = app.isLifeOrLiberty ? 2 : 30;
  const daysElapsed = Math.max(
    0,
    Math.floor((now.getTime() - dateFiled.getTime()) / (1000 * 60 * 60 * 24))
  );
  const daysRemaining = Math.max(
    0,
    Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  );

  const statusMap = {
    SUBMITTED: { label: "Under Review by PIO", color: "amber", code: "in_review" },
    IN_REVIEW: { label: "Under Review by PIO", color: "amber", code: "in_review" },
    RESOLVED: { label: "Response Delivered", color: "emerald", code: "completed" },
    REJECTED: { label: "Section 19 Appeal Active", color: "rose", code: "appeal_open" },
    TRANSFERRED: { label: "Transferred to Authority", color: "blue", code: "in_review" },
  };

  const statusInfo = statusMap[app.status] || {
    label: app.status || "Submitted",
    color: "purple",
    code: "in_review",
  };

  const stage = app.currentStage || (app.status === "RESOLVED" ? 5 : 3);

  // Helper to format milestone date safely without "Invalid Date"
  const formatMilestoneDate = (t) => {
    if (t.stage === 5 && !t.completed) {
      return `Expected by ${deadline.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })}`;
    }
    if (t.stage === 4 && !t.completed) {
      return t.active ? "In Progress" : "Pending Review";
    }
    if (t.stage === 3 && !t.completed) {
      return "Pending Allocation";
    }
    const candidate = t.actionDate || t.date || t.createdAt || dateFiled;
    const d = candidate ? new Date(candidate) : null;
    if (d && !isNaN(d.getTime())) {
      return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return dateFiled.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Normalize timeline stages so that any completed stage is strictly completed=true, active=false
  const rawTimeline = Array.isArray(app.timeline) ? app.timeline : [];
  const sortedTimeline = [...rawTimeline].sort((a, b) => a.stage - b.stage);

  let maxCompletedStage = 0;
  sortedTimeline.forEach((t) => {
    if (t.completed) {
      maxCompletedStage = Math.max(maxCompletedStage, t.stage);
    }
  });

  // Next active stage is the first non-completed stage (e.g. Stage 4 if PIO is assigned)
  const activeStageNum =
    app.status === "RESOLVED" ? 5 : Math.min(5, maxCompletedStage + 1);

  // Timeline
  const timeline =
    sortedTimeline.length > 0
      ? sortedTimeline.map((t) => {
          const isDone = t.stage <= maxCompletedStage || Boolean(t.completed);
          const isActive = !isDone && t.stage === activeStageNum;
          return {
            stage: t.stage,
            title: t.title,
            date: formatMilestoneDate(t),
            description: t.description || "",
            completed: isDone,
            active: isActive,
          };
        })
      : [
          {
            stage: 1,
            title: "Application Drafted & AI-Structured",
            date: dateFiled.toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            description: "Citizen input processed by SARAL NLP Copilot into Section 6(1) compliant clauses.",
            completed: true,
          },
          {
            stage: 2,
            title: "Treasury Fee Paid & Submitted",
            date: dateFiled.toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            description: `Statutory fee ${
              app.feeStatus === "EXEMPTED_BPL" ? "exempted under BPL" : "₹10 verified via Bharatkosh Gateway"
            }. Acknowledgement receipt generated.`,
            completed: true,
          },
          {
            stage: 3,
            title: "Assigned to Public Information Officer (PIO)",
            date: new Date(dateFiled.getTime() + 86400000).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            description: `Forwarded to designated PIO, ${app.department?.name || app.targetAuthority || "Public Authority"}.`,
            completed: stage >= 3,
            active: stage === 3,
          },
          {
            stage: 4,
            title: "Records Retrieval & Departmental Review",
            date: new Date(dateFiled.getTime() + 86400000 * 5).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            description: "Official records and sanction ledgers requisitioned under Section 5(4).",
            completed: stage >= 4,
            active: stage === 4,
          },
          {
            stage: 5,
            title: "Official Response & Certified Documents",
            date: `Statutory clock ends ${deadline.toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}`,
            description: "Official certified ledger copies and approved response memorandum to be dispatched.",
            completed: stage >= 5,
            active: stage === 5,
          },
        ];

  // Documents
  const documents =
    app.documents && app.documents.length > 0
      ? app.documents.map((d) => ({
          name: d.name,
          size: d.size || "348 KB",
          type: d.type || "pdf",
          status: d.status || "Certified",
        }))
      : [
          {
            name: `Acknowledgement_Receipt_${app.applicationNumber}.pdf`,
            size: "348 KB",
            type: "pdf",
            status: "Certified",
          },
          {
            name: "Section_6_1_Statutory_Petition_Draft.pdf",
            size: "512 KB",
            type: "pdf",
            status: "Submitted",
          },
        ];

  // PIO
  const assignedOfficer = app.assignedOfficer;
  const pioDetails = assignedOfficer
    ? {
        name: assignedOfficer.user?.fullName || assignedOfficer.designation || "Designated PIO",
        designation: assignedOfficer.designation || "Public Information Officer",
        office: assignedOfficer.officeAddress || app.department?.nodalOffice || "Departmental Office",
        email: assignedOfficer.user?.email || "pio@saral-rti.gov.in",
        phone: assignedOfficer.user?.phoneNumber || "+91 011-23000000",
      }
    : {
        name: "Er. Rameshwar Verma",
        designation: "Executive Engineer & Designated PIO",
        office: app.department?.nodalOffice || app.targetAuthority || "Divisional Works Office, PWD",
        email: "pio.pwd@saral-rti.gov.in",
        phone: "+91 7574-254190",
      };

  let clauses = [];
  if (Array.isArray(app.structuredClauses)) {
    clauses = app.structuredClauses;
  } else if (typeof app.structuredClauses === "string") {
    try {
      const p = JSON.parse(app.structuredClauses);
      clauses = Array.isArray(p) ? p : [app.structuredClauses];
    } catch {
      clauses = [app.structuredClauses];
    }
  }

  return {
    id: app.applicationNumber || app.id,
    applicationNumber: app.applicationNumber || app.id,
    title: app.title,
    subject: app.subject || app.title,
    citizenName: app.citizen?.user?.fullName || app.citizenName || "Citizen Applicant",
    citizenLocation: app.citizen?.district
      ? `${app.citizen.district}, ${app.citizen.state || "India"}`
      : app.citizen?.state || "India",
    department: app.department?.name || app.targetAuthority || "Public Authority",
    targetAuthority: app.targetAuthority || app.department?.name || "Public Authority",
    dateFiled: dateFiled.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
    statutoryDeadline: deadline.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
    totalDaysAllowed,
    daysElapsed,
    daysRemaining,
    feeStatus:
      app.feeStatus === "EXEMPTED_BPL"
        ? "Exempted (BPL Category)"
        : "Paid (₹10 via Bharatkosh Gateway)",
    currentStage: activeStageNum,
    status: statusInfo.code,
    statusLabel: statusInfo.label,
    statusColor: statusInfo.color,
    pioDetails,
    rawPrompt: app.rawCitizenPrompt || "",
    structuredClauses: clauses,
    timeline,
    documents,
    officialResponse: app.officialResponse || null,
  };
}

export const fetchApplication = createAsyncThunk(
  "tracking/fetchApplication",
  async (query, { rejectWithValue }) => {
    const cleanQuery = (query || "").trim();
    if (!cleanQuery) return null;

    // 1. Try DB API
    try {
      const res = await fetch(`/api/applications?search=${encodeURIComponent(cleanQuery)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.applications) && data.applications.length > 0) {
          const match =
            data.applications.find(
              (a) =>
                a.applicationNumber?.toUpperCase() === cleanQuery.toUpperCase() ||
                a.id?.toUpperCase() === cleanQuery.toUpperCase()
            ) || data.applications[0];
          return mapApiAppToTrackingApp(match);
        }
      }
    } catch (e) {
      console.warn("Tracking fetch from API failed, trying fallback:", e);
    }

    // 2. Fallback to mock data if matches ID
    const mock = mockRtiApplications.find(
      (app) =>
        app.id.toUpperCase() === cleanQuery.toUpperCase() ||
        app.title.toUpperCase().includes(cleanQuery.toUpperCase())
    );
    if (mock) return mock;

    return rejectWithValue("Application not found");
  }
);

const initialState = {
  applications: [],
  selectedApplication: null, // No hardcoded application by default
  searchQuery: "", // Clean, empty input by default
  searchStatus: "idle", // "idle" | "loading" | "success" | "not_found"
  statusFilter: "all",
};

export const trackingSlice = createSlice({
  name: "tracking",
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearSearch: (state) => {
      state.searchQuery = "";
      state.selectedApplication = null;
      state.searchStatus = "idle";
    },
    searchApplication: (state, action) => {
      const query = (action.payload || state.searchQuery).trim().toUpperCase();
      if (!query) {
        state.selectedApplication = null;
        state.searchStatus = "idle";
        return;
      }
      const match = mockRtiApplications.find(
        (app) =>
          app.id.toUpperCase() === query ||
          app.id.toUpperCase().includes(query) ||
          app.citizenName.toUpperCase().includes(query)
      );
      if (match) {
        state.selectedApplication = match;
        state.searchStatus = "success";
      } else {
        state.searchStatus = "not_found";
      }
    },
    selectApplicationById: (state, action) => {
      const id = action.payload;
      const match = mockRtiApplications.find((app) => app.id === id);
      if (match) {
        state.selectedApplication = match;
        state.searchQuery = match.id;
        state.searchStatus = "success";
      }
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplication.pending, (state, action) => {
        state.searchStatus = "loading";
        if (action.meta.arg) {
          state.searchQuery = action.meta.arg;
        }
      })
      .addCase(fetchApplication.fulfilled, (state, action) => {
        if (action.payload) {
          state.selectedApplication = action.payload;
          state.searchQuery = action.payload.id || action.payload.applicationNumber || state.searchQuery;
          state.searchStatus = "success";
        } else {
          state.selectedApplication = null;
          state.searchStatus = "idle";
        }
      })
      .addCase(fetchApplication.rejected, (state) => {
        state.selectedApplication = null;
        state.searchStatus = "not_found";
      });
  },
});

export const {
  setSearchQuery,
  clearSearch,
  searchApplication,
  selectApplicationById,
  setStatusFilter,
} = trackingSlice.actions;

export default trackingSlice.reducer;
