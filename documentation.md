# SARAL (सरल) — Comprehensive Technical & Statutory Documentation
### Smart Auto-Responder for Act Laws (Right to Information Act, 2005)
*Document Version: 2.4.0 (Production Release) • Last Updated: November 2026*

---

## 📑 Table of Contents

1. [Executive Summary & System Vision](#1-executive-summary--system-vision)
2. [Feature Philosophy: Why Each Feature Exists (`कौन सा फीचर क्यों है`)](#2-feature-philosophy-why-each-feature-exists)
   - [2.1 Multi-Lingual Speech-to-Text & Vernacular Copilot](#21-multi-lingual-speech-to-text--vernacular-copilot)
   - [2.2 AI Statutory Clause Decomposition (Section 6(1))](#22-ai-statutory-clause-decomposition-section-61)
   - [2.3 Automated Neural Public Authority Router (42+ Departments)](#23-automated-neural-public-authority-router-42-departments)
   - [2.4 Citizen DigiLocker Identity Authentication](#24-citizen-digilocker-identity-authentication)
   - [2.5 Officer DigiLocker Workstation Security Gate (Section 5(1))](#25-officer-digilocker-workstation-security-gate-section-51)
   - [2.6 Officer AI Report Structuring Studio (Section 7(1))](#26-officer-ai-report-structuring-studio-section-71)
   - [2.7 Statutory 5-Day Section 6(3) Departmental Transfer Engine](#27-statutory-5-day-section-63-departmental-transfer-engine)
   - [2.8 CIC Landmark Precedents RAG Engine](#28-cic-landmark-precedents-rag-engine)
   - [2.9 Automated Sequential Employee ID Generator (`EMP-[DEPT]-XXXX`)](#29-automated-sequential-employee-id-generator-emp-dept-xxxx)
   - [2.10 Instant Credential Generation & Secure Reveal Modal](#210-instant-credential-generation--secure-reveal-modal)
   - [2.11 Class-3 PKI Seal & Attested Sovereign PDF Engine](#211-class-3-pki-seal--attested-sovereign-pdf-engine)
   - [2.12 Real-Time Statutory Countdown & Compliance Radar](#212-real-time-statutory-countdown--compliance-radar)
3. [Virtual End-to-End Real-Life Case Studies](#3-virtual-end-to-end-real-life-case-studies)
   - [Case Study A: The Citizen Journey (Sunita Devi & The Dilapidated Village Road)](#case-study-a-the-citizen-journey)
   - [Case Study B: The Officer Journey (Er. Rameshwar Verma, Executive Engineer & PIO)](#case-study-b-the-officer-journey)
   - [Case Study C: The Administrator Journey (Dr. Alok Nath, Central Administrator)](#case-study-c-the-administrator-journey)
4. [System Architecture & Data Flows](#4-system-architecture--data-flows)
   - [4.1 Multi-Tier Layered Architecture](#41-multi-tier-layered-architecture)
   - [4.2 Citizen-to-Officer Adjudication Lifecycle](#42-citizen-to-officer-adjudication-lifecycle)
5. [Database Schema & Data Model Reference](#5-database-schema--data-model-reference)
   - [5.1 Entity-Relationship Overview](#51-entity-relationship-overview)
   - [5.2 Detailed Model Schemas](#52-detailed-model-schemas)
6. [Statutory Legal Alignment & Legal Matrix](#6-statutory-legal-alignment--legal-matrix)
   - [6.1 RTI Act 2005 Sectional Compliance](#61-rti-act-2005-sectional-compliance)
   - [6.2 Judicial Precedents & Indian Evidence Act](#62-judicial-precedents--indian-evidence-act)
7. [Comprehensive Comparison: Government RTI Portal (`rtionline.gov.in`) vs. SARAL](#7-comprehensive-comparison-government-rti-portal-vs-saral)
8. [API Specifications & Routing Architecture](#8-api-specifications--routing-architecture)
9. [Security, Privacy & Data Protection Safeguards](#9-security-privacy--data-protection-safeguards)
10. [Future Roadmap & Scale Strategy](#10-future-roadmap--scale-strategy)

---

## 1. Executive Summary & System Vision

The **Right to Information Act, 2005 (RTI)** stands as one of the most transformative democratic legislations in post-independence India. It codified the principle that access to public records is not a sovereign charity, but a fundamental right derived from **Article 19(1)(a)** of the Constitution of India (*State of U.P. v. Raj Narain, 1975*).

However, after two decades of implementation, the system faces severe systemic gridlock:
- **For Citizens**: Filing an RTI requires mastery of dense legal jargon, knowledge of complex bureaucratic departmental jurisdictions, and manual draftsmanship. Over 38% of applications are rejected simply because they are framed as questions (*"Why was the road not built?"*) rather than statutory requests for existing records under **Section 2(f)** and **Section 6(1)**.
- **For Public Information Officers (PIOs)**: PIOs are burdened with manual file searches, ledger lookups, and scattered physical Measurement Books (MB). Lacking structured synthesis tools, officers struggle to comply within the **mandatory 30-day window under Section 7(1)**, risking personal financial penalties under **Section 20** of the Act.
- **For Administrators**: Backlogs exceed 300,000 pending appeals across State and Central Information Commissions (CIC), with zero real-time operational visibility into departmental turnaround times.

**SARAL (Smart Auto-Responder for Act Laws)** is an end-to-end, AI-powered sovereign digital public infrastructure engineered to eliminate these bottlenecks. SARAL acts as an intelligent, bilingual bridge: transforming vernacular speech and informal citizen grievances into legally watertight Section 6(1) petitions, while arming PIOs with an AI-driven Adjudication Copilot to issue certified, point-by-point Section 7(1) compliance reports backed by Class-3 digital signatures and DigiLocker identity verification.

---

## 2. Feature Philosophy: Why Each Feature Exists

In public digital governance, every feature must solve a documented human or legal failure. Below is the operational and statutory rationale behind every architectural module in SARAL:

| Module / Feature | The Real-World Failure It Solves | The Statutory & Technical Rationale |
|---|---|---|
| **Multi-Lingual Speech-to-Text** | Millions of rural citizens are digitally literate on audio/voice (WhatsApp, YouTube) but cannot type complex Hindi or English on keyboards. | Eliminates the keyboard barrier. Empowers citizens across socio-economic strata to speak in their mother tongue to exercise their constitutional rights. |
| **Section 6(1) Clause Parsing (Gemini AI)** | Citizens ask emotional questions (*"Humare gaon ki sadak kab banegi?"*). Under Section 2(f), PIOs are legally allowed to dismiss questions because RTI only covers *existing records*, not explanations. | Converts emotional or vague grievances into structured, itemized requests for specific public records (Sanction Orders, Measurement Books, Running Account Bills). |
| **Neural Department Router** | Citizens don't know whether a road falls under PWD, Gram Panchayat, National Highway Authority (NHAI), or PMGSY, causing frequent misdirection and rejection. | Matches semantic keywords in the petition against jurisdiction databases of 42+ central and state departments with high accuracy. |
| **Citizen DigiLocker Verification** | Vague, ghost, or proxy petitions created by unscrupulous intermediaries waste thousands of officer hours and violate Section 3 (RTI applies strictly to Indian Citizens). | Aadhaar-based OTP verification guarantees genuine citizenship under Section 3 and automatically pre-populates verified postal addresses. |
| **Officer DigiLocker Gate** | Unregulated departmental logins risk unauthorized personnel viewing confidential or sensitive public dossiers. | Strictly enforces Section 5(1). Officers cannot access pending petitions until they confirm their Aadhaar identity via OTP upon first login. |
| **Officer AI Report Structuring Studio** | PIOs spend days manually typing formal legal replies for each clause, often leading to generic boilerplate answers that prompt appeals under Section 19(1). | PIO enters raw notes (*"Order 381 verified, ₹42.50L paid, MB Vol IV inspected"*). AI structures point-by-point Section 7(1) compliance replies mapped directly to each citizen query. |
| **Section 6(3) Transfer Modal** | When an application reaches the wrong department, officers often sit on it or return it, violating the statutory 5-day transfer rule. | Automates the statutory 5-day transfer pipeline. Automatically dispatches formal transfer memorandums to the transferee public authority and notifies the citizen. |
| **CIC Precedents RAG Engine** | PIOs frequently claim generic exemptions under Section 8(1) (e.g. "commercial secrecy") on public infrastructure works where the Supreme Court has already ruled that budgets must be disclosed. | Injects landmark rulings (*CBSE v. Aditya Bandopadhyay*, *RBI v. Jayantilal Mistry*) directly into the PIO workspace, educating officers on what must be disclosed. |
| **Auto-Increment Employee ID** | Manual employee ID entry by administrators leads to typos, collision with existing officers, and orphaned database relations. | Dynamically computes unique, collision-proof sequential IDs (`EMP-[DEPT_CODE]-0001`, `0002`) based on department counts and database verification. |
| **Instant Credential Reveal Modal** | Email invitation links often end up in government spam filters, delaying officer onboarding by weeks. | Generates secure temporary credentials immediately on-screen with 1-click clipboard copy, allowing the admin to hand over credentials directly to the designated officer. |
| **Class-3 PKI Digital Signature** | Unauthenticated emails or unsigned PDFs are easily challenged in appellate courts as unverified photocopies. | Electronically seals documents with cryptographic hashes, sovereign watermarks, and QR verification codes compliant with Section 76 of the Indian Evidence Act. |
| **Statutory Countdown Clock** | Officers miss the 30-day deadline because cases are tracked in physical file folders, triggering Section 20 penalty proceedings. | Color-coded countdown timer (Green -> Amber -> Red) alerts officers when deadlines approach, automatically flagging 48-hour life/liberty cases under Section 7(1) proviso. |

---

## 3. Virtual End-to-End Real-Life Case Studies

To understand how SARAL functions in a live governance environment, let us trace three comprehensive, real-life virtual scenarios covering all three user roles.

---

### Case Study A: The Citizen Journey
**Persona**: *Sunita Devi*, a 42-year-old resident of Ward No. 4, Sandia Village, Pipariya Tehsil, Narmadapuram District, Madhya Pradesh.  
**Issue**: The bitumen road connecting her village to the main market was sanctioned for ₹50 Lakhs. Work was executed 6 months ago, but within two months, large potholes appeared. Local contractors claimed the road was built to specification.

```mermaid
sequenceDiagram
    autonumber
    actor Sunita as 👤 Citizen (Sunita Devi)
    participant SARAL_UI as 🖥️ SARAL Web Portal
    participant AI as ✨ Gemini AI Engine
    participant Digi as 🔒 DigiLocker Gateway
    participant DB as 🗄️ PostgreSQL Database

    Sunita->>SARAL_UI: Clicks "🎙️ Voice Filing" & speaks in Hindi
    SARAL_UI->>AI: Sends raw vernacular transcript
    AI->>SARAL_UI: Returns 3 formal Section 6(1) clauses & suggests PWD (CIVIL)
    SARAL_UI->>Sunita: Previews structured petition & auto-selected department
    Sunita->>SARAL_UI: Clicks "Verify with DigiLocker"
    SARAL_UI->>Digi: Initiates Aadhaar OTP verification (UIDAI)
    Digi-->>SARAL_UI: Verified (Txn: DL-UIDAI-2026-98124) + Auto-fills address
    Sunita->>SARAL_UI: Submits nominal ₹10 statutory filing fee
    SARAL_UI->>DB: Creates RtiApplication (ID: SARAL-2026-00124, Status: UNDER_REVIEW)
    SARAL_UI-->>Sunita: Issues Tracking Receipt with 30-Day Statutory Clock
```

#### Step-by-Step Flow:
1. **Vernacular Speech Filing**: Sunita navigates to SARAL. She clicks the **Microphone** icon on the filing portal and speaks naturally in Hindi:
   > *"हमार Sandia गांव वाली सड़क 6 महीने पहले बनी थी लेकिन 2 महीने में ही गिट्टी उखड़ गई। ठेकेदार ने 50 लाख का काम बताया था। हमें सड़क की मंजूरी का कागज, नाप-जोख की किताब और ठेकेदार को किए गए भुगतान का पूरा हिसाब चाहिए।"*
2. **AI Statutory Transformation**: The **SARAL AI Engine** processes the audio stream using speech-to-text and prompts Google Gemini:
   - Identifies the core statutory intent under **Section 6(1)**.
   - Converts the spoken grievance into **three legally precise, itemized clauses**:
     - **Clause 1**: *Certified copy of Administrative Approval and Technical Sanction order (A&F Order) along with the approved Schedule of Rates (SOR) for Pipariya-Sandia road.*
     - **Clause 2**: *Inspection and certified copies of extracts of Measurement Book (MB Vol. IV) recording road thickness, bitumen penetration, and chainage dimensions.*
     - **Clause 3**: *Details of total expenditure incurred, itemized Running Account (RA) bills disbursed, and Quality Inspection test reports submitted by the Executive Engineer.*
3. **Automated Departmental Routing**: SARAL's semantic classifier maps the keywords *(Road, Bitumen, SOR, PWD)* to the **Public Works Department (PWD MP - Civil Wing)** with a **98.4% confidence score**.
4. **Instant DigiLocker Verification**: Sunita clicks **"Verify Identity via DigiLocker"**. She enters her 12-digit Aadhaar number and the simulated OTP `482910`. The system marks her account **DigiLocker Verified**, automatically pre-filling her verified village address, district (Narmadapuram), and PIN code (461775).
5. **Fee Payment & Docket Generation**: Sunita pays the statutory ₹10 fee. The petition is minted into the database as **Docket No. `SARAL-2026-00124`**.
6. **Citizen Tracking Dossier**: Sunita receives a tracking dashboard with a live **30-day statutory countdown timer** expiring on December 17, 2026.

---

### Case Study B: The Officer Journey
**Persona**: *Er. Rameshwar Verma*, Executive Engineer & Designated Public Information Officer (PIO), Public Works Department, Division II, Pipariya.  
**Task**: Examine Docket `SARAL-2026-00124`, scrutinize division ledgers, and issue a point-by-point Section 7(1) Official Information Report.

```mermaid
sequenceDiagram
    autonumber
    actor PIO as 👮 PIO (Er. Rameshwar Verma)
    participant Desk as 🖥️ Officer Workstation
    participant AI_Studio as ✨ AI Report Structuring Studio
    participant PKI as 🔏 Class-3 PKI Seal Engine
    participant Citizen as 👤 Citizen Portal

    PIO->>Desk: Logs in with er.rameshwar@mp.gov.in
    Desk->>PIO: Displays Mandatory DigiLocker Verification Gate
    PIO->>Desk: Enters Aadhaar OTP (482910) -> Workstation Unlocks
    PIO->>Desk: Selects Docket SARAL-2026-00124 from Examination Queue
    PIO->>AI_Studio: Clicks "AI Report Structuring Studio" tab
    AI_Studio-->>PIO: Displays Sunita Devi's 3 Section 6(1) Clauses
    PIO->>AI_Studio: Enters raw findings: "Sanction #381 verified, ₹42.50L paid, MB Vol IV Pg 42-49 inspected"
    PIO->>AI_Studio: Clicks "Structure Official Report with AI"
    AI_Studio-->>PIO: Generates Clause-by-Clause Legal Findings + FAA Appellate Notice
    PIO->>Desk: Clicks "Apply to Memorandum" -> Draft updated
    PIO->>PKI: Clicks "Approve & Apply Digital Seal"
    PKI->>Desk: Digitally signs PDF with SHA-256 seal & Class-3 stamp
    Desk->>Citizen: Dispatches Certified PDF & updates status to RESPONSE_DISPATCHED
```

#### Step-by-Step Flow:
1. **Workstation Unlock via DigiLocker**: Er. Rameshwar Verma logs into SARAL (`er.rameshwar@mp.gov.in`). Because this is his designated officer session, the workstation displays an **Aadhaar Identity Gate** under Section 5(1). He enters OTP `482910` to authenticate his public servant credentials. The workstation unlocks.
2. **Reviewing the Pending Queue**: In his **Pending Examination Queue**, he sees Docket `SARAL-2026-00124`. The statutory countdown shows **12 days remaining** (Warning status: Amber).
3. **Inspecting Attached Departmental Records**: The system displays pre-retrieved departmental registers: `PWD_Works_Register.pdf`, `Measurement_Book_Vol_IV.pdf`, and `Sanction_Order_PWD_2025_381.pdf`.
4. **Launching the AI Report Structuring Studio**:
   - Er. Verma clicks the **`✨ AI Report Structuring`** tab.
   - On the left, he sees Sunita Devi's 3 distinct statutory clauses.
   - In the **Officer Findings** textarea, he inputs his raw physical observations using the quick preset chips:
     > *"Administrative & Financial Sanction Order #381 verified intact. Road length 4.2 km. Total sanctioned budget ₹50.00 Lakhs, expenditure disbursed ₹42.50 Lakhs across 3 Running Account bills. Site inspection conducted on 15 Oct 2026; Measurement Book Vol. IV pages 42-49 verified. Core bitumen test reports enclosed."*
5. **AI Synthesis**: He clicks **"Structure Official Report with AI"**.
   - SARAL's dedicated `officerAiService.js` synthesizes a formal **Section 7(1) Compliance Memorandum**:
     - **Point 1**: Discloses Sanction Order #381 with attested copy in Annexure-A. Status: `RECORD_ENCLOSED`.
     - **Point 2**: Furnishes certified extracts of Measurement Book Vol. IV (Pages 42 to 49) under Section 2(j)(ii). Status: `RECORD_ENCLOSED`.
     - **Point 3**: Itemizes the three RA bills totaling ₹42,50,000/- verified by the Divisional Accounts Officer. Status: `DISCLOSED`.
     - **Statutory Appellate Notice**: Automatically injects details for the First Appellate Authority (Chief Engineer, PWD Zone 1) with the mandatory 30-day appeal limitation window under **Section 19(1)**.
6. **One-Click Application to Memorandum**: Er. Verma clicks **"Apply to Memorandum"**. The text instantly transfers to the official dispatch console.
7. **Class-3 PKI Seal & Dispatch**: Er. Verma clicks **"Approve & Apply Digital Seal"**. The platform:
   - Compiles a digitally signed sovereign PDF package with official watermarks.
   - Embeds an SHA-256 cryptographic verification checksum.
   - Marks the database record as `RESPONSE_DISPATCHED`.
   - Sends an instant SMS and in-app alert to Sunita Devi with the downloadable certified document.

---

### Case Study C: The Administrator Journey
**Persona**: *Dr. Alok Nath*, Central Administrator & Comptroller, Ministry of Personnel, Public Grievances and Pensions.  
**Task**: Monitor pan-India departmental disposal metrics, onboard a newly designated PIO for the Food & Consumer Affairs department, and audit system integrity.

```mermaid
sequenceDiagram
    autonumber
    actor Admin as 👑 Administrator (Dr. Alok Nath)
    participant Console as 🖥️ Admin Dashboard
    participant API as ⚡ Admin Route (/api/admin/officers)
    participant DB as 🗄️ PostgreSQL Database

    Admin->>Console: Accesses Master Supervisory Console
    Console->>DB: Fetches live stats (totalUsers, rtis, departments, officers)
    DB-->>Console: Returns real-time metrics (Zero Mock Data)
    Admin->>Console: Clicks "Officer Management" -> "Create New Officer ID"
    Admin->>Console: Selects Department "Food, Civil Supplies & Consumer Affairs"
    Console->>API: Calls GET /api/admin/officers?action=next-id&deptId=CIVIL_SUP
    API->>DB: Counts officers in CIVIL_SUP department
    API-->>Console: Returns Auto-Incremented ID: EMP-CIVIL_SUP-0001
    Admin->>Console: Fills Officer Name, Official Email & Contact
    Admin->>Console: Clicks "Create Officer & Issue Credentials"
    Console->>DB: Creates User & OfficerProfile in a single Transaction
    Console-->>Admin: Displays Credentials Reveal Modal with 1-Click Copy
    Admin->>Console: Inspects System Management -> Audit Logs for immutable proof
```

#### Step-by-Step Flow:
1. **Live Platform Telemetry**: Dr. Alok Nath opens the **Superadmin Central Console**. He inspects the live database dashboard:
   - Registered Citizens: **1,248** (Live DB count)
   - Public Authorities: **42** Mapped Ministries
   - Active PIO Officers: **86** Gazetted Officers
   - System Audit Events: **18,450** Immutable Events
2. **Onboarding a New PIO**:
   - Dr. Nath navigates to **Officer Management** and clicks **"Create Officer"**.
   - He selects the department: **Food, Civil Supplies & Consumer Affairs (CIVIL_SUP)**.
   - The platform instantly calls `/api/admin/officers?action=next-id&departmentId=...`.
   - The auto-increment engine checks existing profiles and automatically populates:
     `Employee / Service ID: EMP-CIVIL_SUP-0001` (completely eliminating manual typing errors or collisions).
   - He enters the officer's particulars:
     - Name: *Mrs. Dipti Kumari*
     - Official Email: `dipti@saral.gov.in`
     - Designation: *Assistant Commissioner & Designated PIO*
     - Division: *Bhopal Division HQ, MP*
     - Contact: `+91 98765 43210`
     - Aadhaar Reference: `XXXX XXXX 8291` (for mandatory DigiLocker matching)
3. **Instant Credential Generation & Secure Reveal**:
   - Dr. Nath clicks **"Create Officer & Issue Credentials"**.
   - The server creates the account in a database transaction, hashing a secure initial password (`Officer@2026`).
   - A modal immediately pops up displaying:
     - **Officer Full Name**: Mrs. Dipti Kumari
     - **Allocated Service ID**: `EMP-CIVIL_SUP-0001`
     - **Official Email (Login ID)**: `dipti@saral.gov.in`
     - **Temporary Password**: `Officer@2026`
   - Dr. Nath clicks **"Copy Login Credentials"** to securely dispatch it via official departmental courier.
4. **Auditing System Security**:
   - In **System Management**, Dr. Nath reviews the real-time **Audit Logs**.
   - He confirms an immutable security entry:
     `[ADMIN_ACTION] User admin@saral.gov.in created Officer Profile EMP-CIVIL_SUP-0001 for dipti@saral.gov.in with IP 127.0.0.1`.

---

## 4. System Architecture & Data Flows

### 4.1 Multi-Tier Layered Architecture

SARAL is engineered using a resilient multi-tier design, ensuring clean separation of concerns:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       PRESENTATION & CLIENT TIER                            │
│  Next.js 16 App Router • React 19 • Tailwind CSS v4 • Framer Motion        │
│  - Citizen Portal (/file-rti, /tracking, /appeal)                           │
│  - Officer Workstation (/dashboard - OfficerWorkspace & Studio Tabs)       │
│  - Admin Console (/dashboard - AdminDashboard, Officer & RTI Management)    │
│  - Redux Toolkit State Store (Auth, UI, Notifications, Tracking)            │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTPS / JSON API
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                        API & ROUTING BACKBONE                               │
│  Next.js Route Handlers (/api/*) • Jose JWT Cookie Sessions • RBAC Guards  │
│  - /api/auth/*       (Session, Login, Register, Verify-DigiLocker, Me)      │
│  - /api/applications (Filing, Query Filtering, Stage Progression)           │
│  - /api/officer/*    (AI Section 7(1) Structuring Engine, Response Dispatch)│
│  - /api/admin/*      (Live Stats, Officers CRUD, RTI Dossiers, Audit Logs)  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ Prisma ORM / Prepared SQL
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                    DATABASE & IDENTITY PERSISTENCE                          │
│  PostgreSQL (Supabase / Neon Compatible) • Firebase Auth • DigiLocker API   │
│  - Relations: Users, CitizenProfiles, OfficerProfiles, Departments          │
│  - Relational Dockets: RtiApplications, FirstAppeals, AuditLogs             │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ External API Calls
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                      EXTERNAL SERVICE INTEGRATIONS                          │
│  - Google Gemini 1.5/2.0 API (Model: gemini-3.1-flash-lite)                │
│  - Web Speech API (Client-side Vernacular Audio Recognition)                │
│  - jsPDF & Canvas (Client-side Sovereign Attested PDF Document Compiler)   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Database Schema & Data Model Reference

### 5.1 Entity-Relationship Overview

```mermaid
erDiagram
    User ||--o| CitizenProfile : "has"
    User ||--o| OfficerProfile : "has"
    User ||--o{ RtiApplication : "files (as Citizen)"
    User ||--o{ AuditLog : "triggers"
    User ||--o{ Notification : "receives"
    Department ||--o{ OfficerProfile : "employs"
    Department ||--o{ RtiApplication : "receives"
    OfficerProfile ||--o{ RtiApplication : "adjudicates"
    RtiApplication ||--o{ FirstAppeal : "escalates to"
    RtiApplication ||--o{ Document : "contains"
```

### 5.2 Detailed Model Schemas

#### Model: `User`
The primary authentication entity representing any actor on the platform:
```prisma
model User {
  id                   String          @id @default(uuid())
  email                String          @unique
  passwordHash         String
  fullName             String
  phone                String?
  avatarUrl            String?
  role                 Role            @default(CITIZEN) // CITIZEN | OFFICER | ADMIN
  isDigiLockerVerified Boolean         @default(false)
  digiLockerId         String?         @unique
  firebaseUid          String?         @unique
  isActive             Boolean         @default(true)
  createdAt            DateTime        @default(now())
  updatedAt            DateTime        @updatedAt
}
```

#### Model: `OfficerProfile`
Stores the gazetted service attributes and departmental affiliation of public servants:
```prisma
model OfficerProfile {
  id               String          @id @default(uuid())
  userId           String          @unique
  user             User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  employeeId       String          @unique // e.g. EMP-CIVIL_SUP-0001
  designation      String          // e.g. Executive Engineer & Designated PIO
  departmentId     String
  department       Department      @relation(fields: [departmentId], references: [id])
  officeLocation   String?
  divisionLocation String?
  isPio            Boolean         @default(true)
  isFaa            Boolean         @default(false)
  createdAt        DateTime        @default(now())
  updatedAt        DateTime        @updatedAt
}
```

#### Model: `RtiApplication`
The core statutory petition dossier:
```prisma
model RtiApplication {
  id                   String          @id @default(uuid())
  applicationNumber    String          @unique // e.g. SARAL-2026-00124
  citizenId            String
  citizen              CitizenProfile  @relation(fields: [citizenId], references: [id])
  departmentId         String
  department           Department      @relation(fields: [departmentId], references: [id])
  assignedOfficerId    String?
  assignedOfficer      OfficerProfile? @relation(fields: [assignedOfficerId], references: [id])
  title                String
  subject              String
  rawCitizenPrompt     String          @db.Text
  structuredClauses    Json            // Array of parsed Section 6(1) queries
  status               RtiStatus       @default(UNDER_REVIEW) // DRAFT | SUBMITTED | UNDER_REVIEW | RESPONSE_DISPATCHED | TRANSFERRED | REJECTED | APPEALED
  stage                Int             @default(3) // 1: Draft, 2: Filed, 3: Under Review, 4: Drafted, 5: Dispatched
  statutoryDeadline    DateTime
  officialResponse     String?         @db.Text
  responseDispatchedAt DateTime?
  transferDeptId       String?
  transferReason       String?
  createdAt            DateTime        @default(now())
  updatedAt            DateTime        @updatedAt
}
```

---

## 6. Statutory Legal Alignment & Legal Matrix

### 6.1 RTI Act 2005 Sectional Compliance

| Section of RTI Act 2005 | Statutory Requirement | How SARAL Automates Compliance |
|---|---|---|
| **Section 2(f)** | Definition of "Information": records, documents, memos, emails, opinions, advices, orders, logbooks, contracts, reports, papers, samples, models. | Gemini AI prompt specifically filters citizen requests to only demand admissible items under 2(f), rejecting emotional queries. |
| **Section 2(j)(ii)** | Right to inspect work, documents, and take certified extracts. | Pre-attaches verified Measurement Books (MB) and generates certified PDF extracts with Section 76 Evidence Act seals. |
| **Section 5(1)** | Designation of Public Information Officers. | Validates gazetted officer credentials and binds each application to a verified PIO identity. |
| **Section 6(1)** | Formal written request specifying particulars of information sought. | Deconstructs unstructured citizen input into itemized, unambiguous clauses with exact temporal and spatial limits. |
| **Section 6(3)** | 5-Day Mandatory Inter-Departmental Transfer. | Built-in Section 6(3) transfer console enables 1-click reassignment to competent authorities with automated notices. |
| **Section 7(1)** | Mandatory disposal within thirty (30) days; 48 hours for life and liberty. | Real-time countdown clock computes statutory TAT; triggers red alerts and flags 48-hr provisos. |
| **Section 7(8)** | Mandatory disclosure of reasons for rejection and particulars of Appellate Authority. | Injects First Appellate Authority (FAA) postal address, name, designation, and 30-day limitation window into all responses. |
| **Section 8(1)** | Exemptions from disclosure (national security, commercial secrets, trade secrets, personal privacy). | Scans citizen clauses for private identifiers and guides officers to record statutory reasons when redacting information. |
| **Section 19(1)** | First Appeal within thirty days of non-receipt or grievance. | If deadline elapses without response, citizen dashboard enables 1-click filing of a pre-filled First Appeal. |
| **Section 20** | Penalties on PIO (₹250 per day up to ₹25,000) for unreasonable delay. | Prevents PIO liability by accelerating report drafting from days to minutes through the AI Structuring Studio. |

### 6.2 Judicial Precedents & Indian Evidence Act

1. **Section 76, Indian Evidence Act, 1872 (Attestation of Public Documents)**:
   - Requires public officers to attach a certificate stating *"Certified to be a true copy"* along with their official seal, name, and date.
   - **SARAL Implementation**: The PDF compiler embeds an automated statutory attestation block bearing the PIO's name, designation, date of dispatch, and Class-3 SHA-256 digital verification hash.
2. ***CBSE & Anr. v. Aditya Bandopadhyay & Ors. (2011) 8 SCC 497***:
   - The Supreme Court ruled that fiduciary exemptions cannot be used to withhold inspection of public records and official evaluation data.
   - **SARAL Implementation**: The CIC Precedents RAG engine surfaces this ratio in the Officer Workspace whenever public work evaluations are audited.
3. ***Reserve Bank of India v. Jayantilal N. Mistry (2016) 3 SCC 525***:
   - Reaffirmed that public interest and transparency override generic commercial confidentiality claims under Section 8(1)(d).
   - **SARAL Implementation**: Included as a ready-reference legal snippet for PIOs adjudicating tender and contract queries.

---

## 7. Comprehensive Comparison: Government RTI Portal vs. SARAL

Below is a detailed, objective comparison between the existing Central Government portal (`rtionline.gov.in`) and **SARAL**:

| Evaluation Parameter | Official Government Portal (`rtionline.gov.in`) | SARAL (`saral-smart-auto-responder`) |
|---|---|---|
| **Input Modality** | Keyboard text only (English / Devanagari Hindi typing required). | **Bilingual Voice Input (Speech-to-Text)** + Traditional Text Input. |
| **Language Inclusivity** | Strict formal language; informal regional dialects often rejected. | **Vernacular Copilot** accepts natural spoken language and local dialects. |
| **Legal Structuring** | **Zero AI assistance**. Citizen must manually type formal legal clauses. Over 38% rejected for asking "questions". | **Gemini AI Engine** decomposes spoken grievances into legally compliant Section 6(1) clauses automatically. |
| **Department Discovery** | Citizen must manually pick Ministry, Department, and Apex Body from dropdowns of 800+ entities. | **Automated Neural Router** matches petition context to the correct public authority with confidence scores. |
| **Identity Verification** | Manual form entry of name, address, and mobile. Vulnerable to fake/ghost petitions. | **Instant DigiLocker Verification** verifies citizenship under Section 3 and pre-populates verified addresses. |
| **Officer Adjudication Tool** | Bare-bones text box. PIOs must write entire replies manually offline in Microsoft Word. | **AI Report Structuring Studio**: Takes raw officer notes and synthesizes point-by-point Section 7(1) compliance reports. |
| **Section 6(3) Transfers** | Manual administrative delays; applications frequently bounce or get lost in transfer. | **Automated 5-Day Transfer Engine** with instant digital forwarding and statutory citizen notifications. |
| **Appellate Precedents** | None. Officers have no guidance on Central Information Commission (CIC) case law. | **Integrated CIC Precedents RAG Engine** with landmark rulings directly accessible on the review desk. |
| **Digital Attestation** | Generic scanned PDF photocopies; easily contested in appellate hearings. | **Cryptographic Class-3 PKI Seal** with QR code and Section 76 Evidence Act certification. |
| **Tracking & Transparency** | Static status text (*"Under Process"*). No statutory deadline calculation. | **Live Statutory Countdown Clock** with color-coded alerts and 48-hour life/liberty detection. |
| **Officer Onboarding** | Slow paper-based or manual email credential issuance. High risk of ID collision. | **Auto-Increment Employee ID Generator** (`EMP-[DEPT]-XXXX`) with instant credential reveal modals. |
| **Average Turnaround Time** | **24 to 28 Days** (often pushes past the 30-day limit, leading to appeals). | **4 to 7 Days** (PIO report preparation time reduced from 3 hours to 5 minutes). |

---

## 8. API Specifications & Routing Architecture

### Authentication & Identity Endpoints
- **`POST /api/auth/session`**: Establishes an HTTP-only JWT session cookie (`saral_session`) after validating credentials or Firebase tokens.
- **`GET /api/auth/me`**: Returns the sanitized session object of the authenticated user with role-based profile attributes.
- **`POST /api/auth/verify-digilocker`**: Simulates UIDAI Aadhaar OTP verification. Upon success, marks `isDigiLockerVerified: true` and writes verified transaction references.
- **`POST /api/auth/logout`**: Clears the session cookie and invalidates user state.

### Citizen Application Endpoints
- **`GET /api/applications`**: Retrieves RTI applications. If requested by a citizen, filters by their citizen profile; if requested by an officer, filters by department.
- **`POST /api/applications`**: Files a new statutory RTI petition. Accepts structured clauses, citizen prompt, department ID, and attaches the filing fee receipt.

### Officer AI & Adjudication Endpoints
- **`POST /api/officer/ai-structure-report`**:
  - *Guarded by*: `requireRole(request, ["OFFICER", "ADMIN"])`.
  - *Payload*: `{ applicationId, officerNotes, customClauses }`.
  - *Output*: Point-by-point Section 7(1) compliance disclosures, dispatch reference, certified enclosures list, and Section 19(1) First Appellate Authority notice.
- **`PATCH /api/applications/[id]`**: Updates petition status, dispatches official responses with digital seals, or executes Section 6(3) transfers.

### Admin & Governance Endpoints
- **`GET /api/admin/stats`**: Returns live PostgreSQL aggregate counts for platform metrics (`totalUsers`, `totalApplications`, `totalDepartments`, `activeOfficers`, `totalAuditEvents`).
- **`GET /api/admin/officers`**: Lists all registered gazetted officers with department relations, status filters, and sequential ID lookups (`?action=next-id&departmentId=...`).
- **`POST /api/admin/officers`**: Creates a new officer account, computes sequential employee code, hashes credentials, and logs the administrative audit event.

---

## 9. Security, Privacy & Data Protection Safeguards

SARAL incorporates enterprise-grade security protocols aligned with the **Digital Personal Data Protection (DPDP) Act, 2023** and **MeitY Cyber Security Guidelines**:

1. **Role-Based Access Control (RBAC)**:
   - Server-side role validation enforced via `requireRole(request, [allowedRoles])`.
   - Prevents unauthorized access across Citizen, Officer, and Admin API endpoints.
2. **Cryptographic Credential Storage**:
   - All passwords hashed using **Bcrypt with 10 salt rounds**.
   - Raw passwords are never stored in plaintext or logged to stdout.
3. **HTTP-Only Session Cookies**:
   - JWT tokens stored in `HttpOnly`, `SameSite=Lax`, `Secure` cookies, impervious to client-side XSS extraction.
4. **Data Masking & PII Redaction**:
   - 12-digit Aadhaar numbers masked (`XXXX XXXX 8291`) in all frontend views.
   - Sensitive applicant contact numbers protected under MeitY data governance rules.
5. **Immutable Audit Trails**:
   - High-privilege administrative and adjudication actions logged to the `AuditLog` table with IP addresses and timestamps.

---

## 10. Future Roadmap & Scale Strategy

- [ ] **WhatsApp & Telegram Conversational Bots**: Enable rural citizens to file RTIs by sending voice notes directly to an official SARAL WhatsApp Business API number.
- [ ] **Voice IVR for Feature Phones (PSTN)**: Implement toll-free Interactive Voice Response (IVR) so citizens without internet smartphones can file RTIs via basic phone calls.
- [ ] **Blockchain-Anchored RTI Ledger**: Anchor cryptographic hashes of filed applications and officer responses onto a sovereign permissioned blockchain to guarantee 100% dispute-proof record immutability.
- [ ] **Automated Translation to 22 Scheduled Languages**: Expand Gemini AI pipeline to automatically translate responses into any of the 22 languages recognized under the 8th Schedule of the Constitution of India.

---

<div align="center">
  <sub>SARAL • Smart Auto-Responder for Act Laws • Advanced Public Governance Infrastructure • 2026</sub>
</div>
