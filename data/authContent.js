/**
 * Static UI content for Authentication pages (Login and Signup).
 * Stored separately so no UI strings are hardcoded in components.
 */

export const authFeatures = [
  {
    id: "file-online",
    title: "File RTI",
    subtitle: "Online",
    icon: "document",
  },
  {
    id: "track-app",
    title: "Track",
    subtitle: "Application",
    icon: "clock",
  },
  {
    id: "get-response",
    title: "Get",
    subtitle: "Response",
    icon: "chat",
  },
];

export const loginContent = {
  hero: {
    badgeText: "AI-Powered",
    headline: "Your Right to Know.",
    highlight: "Made Simpler.",
    description: "Submit RTI applications, track their progress, and receive official responses — all in one place.",
    trackerCard: {
      title: "RTI Application",
      trackingId: "RTI-2026-00124",
      statusBadge: "✦ In Review",
      steps: [
        { id: 1, label: "Submitted", status: "completed" },
        { id: 2, label: "Under Review", status: "current" },
        { id: 3, label: "Response", status: "pending" },
      ],
    },
  },
  form: {
    title: "Welcome",
    titleItalic: "back",
    subtitle: "Sign in to your RTI portal account.",
    roles: [
      { id: "citizen", label: "Citizen" },
      { id: "officer", label: "Officer" },
    ],
    emailPlaceholder: "Email address",
    passwordPlaceholder: "Password",
    forgotPasswordText: "Forgot password?",
    submitButtonText: "Sign in",
    dividerText: "or continue with",
    googleButtonText: "Continue with Google",
    noAccountText: "Don't have an account?",
    signupLinkText: "Create one for free",
  },
};

export const signupContent = {
  hero: {
    badgeText: "For Citizens Only",
    headline: "Create Your",
    highlight: "Citizen Account",
    description: "Register as a citizen to file RTI requests, track applications, and get responses online.",
  },
  form: {
    badgeAria: "Citizen Registration",
    title: "Create Citizen Account",
    subtitle: "Sign up to access RTI services.",
    fullNamePlaceholder: "Full Name",
    emailPlaceholder: "Email Address",
    mobilePlaceholder: "Mobile Number",
    passwordPlaceholder: "Password",
    confirmPasswordPlaceholder: "Confirm Password",
    termsText: "I agree to the",
    termsLink: "Terms of Service",
    andText: "and",
    privacyLink: "Privacy Policy",
    submitButtonText: "Create Account",
    haveAccountText: "Already have an account?",
    signinLinkText: "Sign in",
    officerNotice: "Officer accounts are created by the Administrator only.",
  },
};
