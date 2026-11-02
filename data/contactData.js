/**
 * Contact page metadata, categories, regional desks, and statutory FAQs.
 * Matches reference/saral_contact_us_light_mode.
 */
export const contactInquiryCategories = [
  { id: "filing", label: "RTI Filing Assistance", defaultSubject: "Assistance with drafting an RTI application" },
  { id: "mapping", label: "Department Mapping Issue", defaultSubject: "Cannot locate the competent public authority" },
  { id: "technical", label: "Portal & Gateway Support", defaultSubject: "Issue with DigiLocker or ₹10 Treasury payment" },
  { id: "first-appeal", label: "Section 19(1) First Appeal", defaultSubject: "No response from Public Information Officer after 30 days" },
  { id: "officer-access", label: "Officer Desk Onboarding", defaultSubject: "Government Officer requesting PIO Portal Access" },
  { id: "general", label: "General Administrative Query", defaultSubject: "General question regarding the RTI Act, 2005" },
];

export const helpdeskOffices = [
  {
    city: "New Delhi (Headquarters)",
    name: "Central Citizen Support & RTI Innovation Cell",
    address: "Room 402, 4th Floor, CGO Complex, Lodhi Road, New Delhi – 110003",
    email: "helpdesk@saral-rti.gov.in",
    phone: "+91 11 2436 7890 / 1800-11-7272",
    timing: "Mon – Sat, 09:30 AM to 06:00 PM IST",
  },
  {
    city: "Bhopal (Central Regional Cell)",
    name: "Madhya Pradesh & Central State Nodal Desk",
    address: "Vallabh Bhavan Extension, Arera Hills, Bhopal, MP – 462004",
    email: "centraldesk.mp@saral-rti.gov.in",
    phone: "+91 755 277 4100",
    timing: "Mon – Fri, 10:00 AM to 05:30 PM IST",
  },
  {
    city: "Chennai (Southern Regional Cell)",
    name: "South Zone Transparency Facilitation Desk",
    address: "Rajaji Bhavan, Besant Nagar, Chennai, Tamil Nadu – 600090",
    email: "southdesk@saral-rti.gov.in",
    phone: "+91 44 2491 5520",
    timing: "Mon – Fri, 10:00 AM to 05:30 PM IST",
  },
];

export const statutoryFaqs = [
  {
    question: "Kya main Hindi ya Hinglish mein RTI daal sakta hoon?",
    answer:
      "Haan, bilkul! RTI Act 2005 ke Section 6(1) ke mutabiq aap Hindi, English ya kisi bhi official bhasha mein RTI file kar sakte hain. SARAL AI aapke bol-chaal ke sabdon ko standard legal format mein structure karta hai taaki koi officer technical grounds par mana na kare.",
  },
  {
    question: "Agar officer 30 din mein jawab na de to kya hoga?",
    answer:
      "RTI Act 2005 ke Section 7(1) ke under Public Information Officer (PIO) ko 30 dino ke andar jawab dena anivarya hai. Agar 30 din beet jate hain, toh SARAL automatic alert bhejta hai aur Section 19(1) ke tehat First Appeal ka draft bina kisi extra fee ke generate kar deta hai.",
  },
  {
    question: "RTI file karne ki sarkari fee kitni hai aur kaise pay hoti hai?",
    answer:
      "Central government aur zyadatar states ke liye standard statutory application fee ₹10 hai. Below Poverty Line (BPL) card holders ke liye RTI Act ke tahat 100% fee exemption hai (₹0). Payment direct official government treasury gateway (Bharatkosh / UPI) ke zariye hoti hai.",
  },
  {
    question: "Kya SARAL AI khud sarkari response generate karta hai?",
    answer:
      "Nahi! Yeh ek bohot zaroori rule hai: SARAL AI sirf citizen ki petition draft karne aur relevant records dhoondhne mein help karta hai. Official government response sirf aur sirf authorized Public Information Officer (PIO) hi approve, digitally sign aur issue kar sakte hain.",
  },
  {
    question: "Kya meri personal details safe aur encrypted hain?",
    answer:
      "Haan. SARAL platform Digital Personal Data Protection (DPDP) Act, 2023 compliant hai. Citizen submissions end-to-end encrypted hain aur aapki identity sirf authorized nodal officer ke paas verified verification ke liye use hoti hai.",
  },
];
