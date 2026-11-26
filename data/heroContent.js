/**
 * Content for the main landing page hero section and feature trust badges.
 * Built with realistic Indian civic tech terminology, vernacular prompts, and statutory safeguards.
 */
export const heroContent = {
  badge: "Right to Information Act, 2005",
  titlePart1: "File your RTI online",
  titlePart2: "Track every reply",
  hindiSubhead: "सत्यमेव जयते • नागरिकों के लिए सुलभ, पारदर्शी एवं सरल आरटीआई",
  description:
    "Access public information without bureaucratic red tape. SARAL uses intelligent AI to structure your concerns into Section 6(1) legal clauses, identify responsible government departments, and track statutory 30-day response clocks — all through one simple, dignified platform.",
  ctas: {
    primary: {
      label: "File an RTI Application",
      href: "/login",
    },
    secondary: {
      label: "Track Status",
      href: "/tracking",
    },
    walkthrough: {
      label: "Watch 1-Min Walkthrough",
    },
  },
  complianceTags: [
    { label: "Section 6(1) Compliant", icon: "verified", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200/80" },
    { label: "Hindi, Hinglish & English", icon: "translate", bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200/80" },
    { label: "Zero Legal Background Needed", icon: "shield", bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200/80" },
  ],
  securityNote:
    "End-to-end encrypted citizen submission. Statutory government fee (₹10) settled directly via official treasury gateway.",
  promptPromptsHeader: "Try Common Citizen RTI Inquiries:",
  promptPromptsSub: "Auto-structures vernacular speech into formal legal petitions in seconds",
  promptExamples: [
    {
      id: "road",
      emoji: "🛣️",
      title: "Pothole & Road Budget",
      department: "Rural Development & Panchayati Raj",
      rawText: "Mere gaon ke road banne ka kitna budget pass hua tha aur kis thekedar ko tender mila? Kaam kab khatam hona tha?",
      clauses: [
        "Certified copy of Sanctioned Administrative & Financial Approval for road stretch.",
        "Name, vendor ID and completion deadline of awarded contractor.",
        "Itemized Measurement Book (MB) recordings and Running Account disbursements.",
      ],
    },
    {
      id: "school",
      emoji: "🎓",
      title: "School Lab Grant Audit",
      department: "School Education & Literacy",
      rawText: "Hamare Govt High School mein computer lab ke liye kitna paisa sanction hua aur kitne computers aaye?",
      clauses: [
        "Certified expenditure voucher for Samagra Shiksha ICT scheme grant.",
        "Equipment stock register extracts signed by the Headmaster.",
        "Physical verification report of desktop computer installations.",
      ],
    },
    {
      id: "water",
      emoji: "💧",
      title: "Drinking Water Pipeline",
      department: "Urban Development & Municipal Works",
      rawText: "Pichle 2 mahine se ward mein paani ganda aa raha hai. Pipeline repair ka kya kaam hua aur test report kahan hai?",
      clauses: [
        "Weekly potability biological test reports for Municipal Water Tank #4.",
        "Work orders sanctioned for leak identification and pipeline desilting.",
        "Logbook of citizen water grievance complaints received during August-October.",
      ],
    },
    {
      id: "ration",
      emoji: "🌾",
      title: "PDS Ration Quota",
      department: "Food, Civil Supplies & Consumer Affairs",
      rawText: "Ration card apply kiye 6 mahine ho gaye, ration dealer bolta hai quota nahi aaya. Godown stock register dekhna hai.",
      clauses: [
        "Monthly grain allocation and dispatch register for Fair Price Shop #108.",
        "Status of pending NFSA new ration card applications for Ward 7.",
        "Point-of-Sale (e-PoS) biometric transaction logs for past 3 months.",
      ],
    },
  ],
  trustStrip: [
    {
      title: "RTI Act 2005",
      subtitle: "100% Statutory compliance",
      icon: "gavel",
      color: "indigo",
    },
    {
      title: "30-Day Mandatory Clock",
      subtitle: "Legal countdown to response",
      icon: "timer",
      color: "cyan",
    },
    {
      title: "₹10 Standard Fee",
      subtitle: "Direct treasury settlement",
      icon: "payments",
      color: "purple",
    },
    {
      title: "DigiLocker Verified",
      subtitle: "Authentic citizen identity",
      icon: "badge",
      color: "emerald",
    },
  ],
};
