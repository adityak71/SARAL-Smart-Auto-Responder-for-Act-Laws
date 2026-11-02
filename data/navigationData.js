/**
 * Navigation configuration, navbar links, and comprehensive civic footer directory.
 */
export const navigationLinks = [
  { id: "home", label: "Home", href: "/" },
  { id: "dashboard", label: "Dashboard", href: "/dashboard" },
  { id: "general-info", label: "General Info", href: "/general-info" },
  { id: "how-it-works", label: "How It Works", href: "/how-it-works" },
  { id: "about", label: "About", href: "/about" },
  { id: "contact", label: "Contact", href: "/contact" },
  { id: "tracking", label: "Tracking", href: "/tracking" },
];

export const userProfileData = {
  name: "Rahul Sharma",
  role: "Verified Citizen",
  verificationBadge: "DigiLocker Verified",
  email: "rahul.sharma@citizen.in",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
  menuItems: [
    { label: "Citizen Dashboard", href: "/dashboard", icon: "dashboard" },
    { label: "My Filed RTIs", href: "/tracking", icon: "folder_open", badge: "3 Active" },
    { label: "Drafted Applications", href: "/dashboard", icon: "edit_note", badge: "1" },
    { label: "Official Certified Responses", href: "/dashboard", icon: "verified" },
    { label: "Account & Preferences", href: "/dashboard", icon: "settings" },
  ],
};

export const footerCivicDirectory = {
  brand: {
    title: "SARAL",
    tagline: "Smart Auto-Responder for Act Laws",
    hindiTagline: "सरल — सूचना का अधिकार पोर्टल",
    authority: "Public Transparency & Citizen Empowerment Initiative",
    motto: "सत्यमेव जयते • Transparency at Every Citizen's Fingertips",
    description:
      "SARAL is an AI-assisted digital public infrastructure platform that empowers Indian citizens to draft, submit, and track Right to Information (RTI) applications with zero legal complexity, direct treasury fee settlement, and statutory 30-day compliance tracking.",
  },
  quickLinks: [
    { label: "Citizen Dashboard", href: "/dashboard" },
    { label: "Track RTI Application", href: "/tracking" },
    { label: "The 4-Step Citizen Flow", href: "/how-it-works" },
    { label: "About SARAL Mission", href: "/about" },
    { label: "Citizen Helpdesk & FAQs", href: "/contact" },
    { label: "File New RTI Petition", href: "/login" },
  ],
  statutoryResources: [
    { label: "RTI Act 2005 (Full Statute)", href: "https://rti.gov.in", isExternal: true },
    { label: "Section 6(1) Filing Guidelines", href: "/how-it-works" },
    { label: "Section 19(1) First Appeal Guide", href: "/tracking" },
    { label: "Section 8 Exemptions Clarification", href: "/about" },
    { label: "Central Information Commission (CIC)", href: "https://cic.gov.in", isExternal: true },
    { label: "BPL Category Fee Exemption Rules", href: "/contact" },
  ],
  nationalPortals: [
    { label: "National Portal of India", href: "https://india.gov.in", isExternal: true },
    { label: "Digital India Corporation", href: "https://digitalindia.gov.in", isExternal: true },
    { label: "DigiLocker National Cloud", href: "https://digilocker.gov.in", isExternal: true },
    { label: "MyGov Citizen Engagement", href: "https://mygov.in", isExternal: true },
    { label: "e-Courts Services Portal", href: "https://ecourts.gov.in", isExternal: true },
    { label: "CPGRAMS Grievance Portal", href: "https://pgportal.gov.in", isExternal: true },
  ],
  citizenSupport: {
    tollFree: "1800-11-7272 (1800-RTI-SARAL)",
    workingHours: "Monday to Saturday, 09:30 AM – 06:00 PM IST",
    email: "helpdesk@saral-rti.gov.in",
    grievanceEmail: "nodalofficer@saral-rti.gov.in",
    address: "National Transparency Innovation Hub, CGO Complex, Lodhi Road, New Delhi – 110003",
  },
  complianceBadges: [
    { label: "Section 6(1) Compliant", icon: "gavel" },
    { label: "30-Day Mandatory Clock", icon: "timer" },
    { label: "₹10 Standard Treasury Fee", icon: "payments" },
    { label: "DigiLocker Verified Citizen ID", icon: "badge" },
    { label: "DPDP Act 2023 Encrypted", icon: "lock" },
  ],
  disclaimer:
    "Disclaimer: SARAL is an independent AI-assisted public transparency bridge built to streamline the application process under the Right to Information Act, 2005. Official responses are verified, prepared, and approved by designated Public Information Officers (PIOs) of the respective public authorities.",
  copyright: `© ${new Date().getFullYear()} SARAL RTI Initiative. Developed for Indian Citizens under the framework of the Right to Information Act, 2005.`,
};
