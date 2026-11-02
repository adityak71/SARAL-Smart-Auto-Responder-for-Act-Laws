/**
 * 4-Step Citizen Journey & AI Assistant Architecture
 * Based on reference/saral_how_it_works_citizen_journey_ai_assistant
 */
export const howItWorksSteps = [
  {
    stepNumber: "01",
    tag: "STAGE 01 : CITIZEN INPUT",
    title: "Describe Your Concern in Simple Words",
    description:
      "Speak or write in Hindi, English, Hinglish, or your local language. No legal jargon required. Tell us what you want to know: broken roads, delayed scholarship funds, hospital medicine availability, or government tender details.",
    badge: "Vernacular Voice & Text Supported",
    badgeIcon: "mic",
    mockup: {
      type: "input",
      header: "Citizen Audio & Text Terminal",
      detectedLanguage: "Hindi / Hinglish Detected",
      citizenQuote:
        "“Mere gaon ki road 2 saal se tooti hai. Baar baar complaint ki koi nahi sunta. Humein tender ki copy, sanctioned amount aur thekedar ka naam chahiye.”",
      copilotLabel: "SARAL Copilot NLP Structuring",
      scopeNodes: [
        "Public Works Scope: Bitumen Road Maintenance",
        "Records: Sanctioned Tender & Work Order",
        "Financials: Total Bill Disbursements Cleared",
        "Identity: Contractor Name & Executive Engineer",
      ],
    },
  },
  {
    stepNumber: "02",
    tag: "STAGE 02 : AI ASSISTANCE & LEGAL MAPPING",
    title: "Instant Section 6(1) Structuring & Ministry Mapping",
    description:
      "SARAL's domain-trained AI identifies the competent public authority (Central, State, or Local Panchayat), checks for Section 8 public interest exclusions, and converts informal questions into legally structured RTI questions that cannot be rejected on technical grounds.",
    badge: "Semantic Gazette Matching",
    badgeIcon: "psychology",
    mockup: {
      type: "legal",
      header: "Jurisdictional Engine & Section 6(1) Structuring",
      ministry: "Ministry of Rural Development / State PWD",
      classificationScore: "99.2% Jurisdiction Confidence",
      exemptionsCheck: "Exemption Check: 100% Public Record (Section 8 Clean)",
      statutoryClauses: [
        "Clause 1: Certified copy of Sanction Order and GFR Allocation.",
        "Clause 2: Name & Vendor Registration of Awarded Contractor.",
        "Clause 3: Certified extracts of Measurement Book (MB) recordings.",
      ],
    },
  },
  {
    stepNumber: "03",
    tag: "STAGE 03 : DESIGNATED OFFICER REVIEW",
    title: "Public Information Officer (PIO) Official Desk",
    description:
      "SARAL does not invent government responses. Applications are securely routed to the designated PIO. The officer uses AI assistance to retrieve authorized archive records, review draft answers, and apply their official digital seal.",
    badge: "Human-in-the-Loop Officer Scrutiny",
    badgeIcon: "verified_user",
    mockup: {
      type: "officer",
      header: "Public Information Officer (PIO) Verification Desk",
      officer: "Er. Rameshwar Verma (Designated PIO, PWD)",
      verifiedRecords: "4 Official Record Files Retrieved from Archive",
      actionStatus: "Official Response Verified & Digitally Signed",
    },
  },
  {
    stepNumber: "04",
    tag: "STAGE 04 : TRANSPARENT DELIVERY & TRACKING",
    title: "Live Statutory Tracking & Certified Delivery",
    description:
      "Follow your application through real-time milestones with a countdown to the statutory 30-day deadline. Download tamper-proof digitally signed responses directly to DigiLocker, or access one-click First Appeal drafting if an officer fails to reply.",
    badge: "Section 19(1) Appeal Protection",
    badgeIcon: "timer",
    mockup: {
      type: "delivery",
      header: "Certified Resolution & DigiLocker Delivery",
      turnaround: "Turnaround: 18 Days (Within 30-Day Legal Limit)",
      dispatchDelivery: "Certified PDF Dispatched with Digital Watermark",
      appealProtection: "Automatic Section 19(1) First Appeal Memorandum Ready if Delayed",
    },
  },
];
