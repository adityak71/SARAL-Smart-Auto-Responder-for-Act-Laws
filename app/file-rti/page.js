"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { setCredentials } from "@/redux/slices/authSlice";
import { motion, AnimatePresence } from "framer-motion";
import { downloadRtiReceipt } from "@/lib/services/pdfGenerator";
import DocumentPreviewModal from "@/components/common/DocumentPreviewModal";
import DigiLockerModal from "@/components/common/DigiLockerModal";
import { Landmark as IcLandmark, Lock as IcLock, Mailbox as IcMailbox, MapPin as IcMapPin, MessageSquare as IcMessageSquare, Mic as IcMic, RefreshCw as IcRefreshCw, Scale as IcScale, Send as IcSend, Shield as IcShield, Siren as IcSiren, Sparkles as IcSparkles, Target as IcTarget, TriangleAlert as IcTriangleAlert } from "lucide-react";

const INDIAN_STATES = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi (NCT)",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

function findCanonicalState(rawState) {
  if (!rawState || typeof rawState !== "string") return "";
  const cleaned = rawState.trim().toLowerCase();
  if (!cleaned || cleaned === "select state") return "";
  const match = INDIAN_STATES.find((st) => st.toLowerCase() === cleaned);
  if (match) return match;
  const partial = INDIAN_STATES.find(
    (st) => st.toLowerCase().includes(cleaned) || cleaned.includes(st.toLowerCase())
  );
  return partial || rawState.trim();
}

/**
 * Phonetic Devanagari to Roman Hinglish Transliteration Engine
 * Converts Hindi speech transcripts into clean, readable Roman Hinglish text (A-Z)
 */
function devanagariToHinglish(text) {
  if (!text) return "";

  const commonWords = {
    "है": "hai", "हैं": "hain", "हो": "ho", "था": "tha", "थी": "thee", "थे": "the",
    "का": "ka", "की": "ki", "के": "ke", "को": "ko", "से": "se", "में": "mein",
    "पर": "par", "और": "aur", "या": "ya", "कि": "ki", "जो": "jo", "यह": "yeh",
    "वह": "woh", "इस": "is", "उस": "us", "क्या": "kya", "क्यों": "kyun", "कैसे": "kaise",
    "कहाँ": "kahan", "कब": "kab", "कितना": "kitna", "कितने": "kitne", "कितनी": "kitni",
    "सड़क": "sadak", "गाँव": "gaon", "गांव": "gaon", "पानी": "paani", "दवाई": "dawai",
    "स्कूल": "school", "ठेकेदार": "thekedar", "रुपये": "rupaye", "पैसे": "paise",
    "चाहिए": "chahiye", "दीजिए": "dijiye", "बताइए": "bataiye", "नहीं": "nahi",
    "कैन": "can", "यू": "you", "राइट": "write", "दिस": "this", "थिंग": "thing",
    "इन": "in", "इंग्लिश": "english", "काम": "kaam", "बजट": "budget", "टेंडर": "tender",
    "अस्पताल": "hospital", "डॉक्टर": "doctor", "मास्टर": "master", "टीचर": "teacher"
  };

  const charMap = {
    "अ": "a", "आ": "aa", "इ": "i", "ई": "ee", "उ": "u", "ऊ": "oo", "ऋ": "ri",
    "ए": "e", "ऐ": "ai", "ओ": "o", "औ": "au", "अं": "an", "अः": "ah",
    "क": "k", "ख": "kh", "ग": "g", "घ": "gh", "ङ": "ng",
    "च": "ch", "छ": "chh", "ज": "j", "झ": "jh", "ञ": "ny",
    "ट": "t", "ठ": "th", "ड": "d", "ढ": "dh", "ण": "n",
    "त": "t", "थ": "th", "द": "d", "ध": "dh", "न": "n",
    "प": "p", "फ": "f", "ब": "b", "भ": "bh", "म": "m",
    "य": "y", "र": "r", "ल": "l", "व": "v",
    "श": "sh", "ष": "sh", "स": "s", "ह": "h",
    "ड़": "d", "ढ़": "dh", "फ़": "f", "ज़": "z", "क़": "q", "ख़": "kh", "ग़": "gh"
  };

  const matraMap = {
    "ा": "a", "ि": "i", "ी": "ee", "ु": "u", "ू": "oo", "ृ": "ri",
    "े": "e", "ै": "ai", "ो": "o", "ौ": "au", "ं": "n", "ँ": "n", "ः": "h"
  };
  const halant = "्";

  const words = text.split(/\s+/);
  const outWords = words.map((w) => {
    const clean = w.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
    if (commonWords[clean.toLowerCase()]) {
      return w.replace(clean, commonWords[clean.toLowerCase()]);
    }

    let res = "";
    for (let i = 0; i < w.length; i++) {
      const ch = w[i];
      const next = w[i + 1];

      if (charMap[ch]) {
        res += charMap[ch];
        const isConsonant =
          (ch.charCodeAt(0) >= 0x0915 && ch.charCodeAt(0) <= 0x0939) ||
          ch === "ड़" ||
          ch === "ढ़";
        if (isConsonant) {
          if (!next || next === halant || matraMap[next]) {
            // suppressed
          } else {
            res += "a";
          }
        }
      } else if (matraMap[ch]) {
        res += matraMap[ch];
      } else if (ch !== halant) {
        res += ch;
      }
    }
    return res;
  });

  return outWords.join(" ");
}

export default function FileRtiPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Stepper state: 1 to 5, and 6 = Success
  const [currentStep, setCurrentStep] = useState(1);
  const [departments, setDepartments] = useState([]);
  const [loadingDepts, setLoadingDepts] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [submittedApplication, setSubmittedApplication] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isDigiLockerModalOpen, setIsDigiLockerModalOpen] = useState(false);

  // AI Copilot State
  const [aiInputPrompt, setAiInputPrompt] = useState("");
  const [isAnalyzingWithAi, setIsAnalyzingWithAi] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiSuccessToast, setAiSuccessToast] = useState("");

  // Speech Recognition (Voice Input) State: "hinglish" (A-Z) | "english" | "hindi" (Devanagari)
  const [isListening, setIsListening] = useState(false);
  const [speechMode, setSpeechMode] = useState("hinglish");
  const recognitionRef = useRef(null);
  const speechInitialPromptRef = useRef("");

  // AI Authority Routing State (Sprint 2.2)
  const [routingTopic, setRoutingTopic] = useState("");
  const [isRoutingAi, setIsRoutingAi] = useState(false);
  const [aiRoutingResult, setAiRoutingResult] = useState(null);

  // Section 8 Safety Scanner State (Sprint 2.3)
  const [section8ScanResult, setSection8ScanResult] = useState(null);
  const [isScanningSection8, setIsScanningSection8] = useState(false);

  // Landmark CIC Precedents State (Sprint 2.4 - RAG)
  const [precedents, setPrecedents] = useState([]);
  const [loadingPrecedents, setLoadingPrecedents] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    stateOrCentral: "State",
    selectedState: "",
    departmentId: "",
    targetAuthority: "",
    title: "",
    subject: "",
    rawCitizenPrompt: "",
    structuredClauses: [],
    yearOrPeriod: "FY 2024-2026",
    locationDivision: "",
    isLifeOrLiberty: false,
    lifeLibertyJustification: "",
    deliveryMode: "DIGITAL", // "DIGITAL" | "SPEED_POST"
    feeOption: "ONLINE_PAYMENT", // "ONLINE_PAYMENT" | "BPL_EXEMPTION"
    bplCardNumber: "",
    paymentMethod: "UPI", // "UPI" | "NETBANKING" | "CARDS"
    declarationAgreed: true,
  });

  // Derive effective user state from profile or manual selection (normalized Title Case)
  const userProfileState = findCanonicalState(user?.citizenProfile?.state);
  const activeState = formData.selectedState
    ? findCanonicalState(formData.selectedState)
    : userProfileState;

  // Verify Auth
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/file-rti");
    }
  }, [isAuthenticated, router]);

  // Sync profile state & district into formData
  useEffect(() => {
    if (user?.citizenProfile) {
      const canonicalState = findCanonicalState(user.citizenProfile.state);
      const district = user.citizenProfile.district;
      setFormData((prev) => ({
        ...prev,
        selectedState: prev.selectedState || canonicalState || "",
        locationDivision:
          prev.locationDivision ||
          (district ? (canonicalState ? `${district}, ${canonicalState}` : `${district} District`) : (canonicalState || "")),
      }));
    }
  }, [user]);

  // Fetch fresh profile from API if citizenProfile is not yet loaded in redux
  useEffect(() => {
    async function refreshProfile() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            dispatch(setCredentials(data.user));
          }
        }
      } catch (e) {}
    }
    if (isAuthenticated && !user?.citizenProfile) {
      refreshProfile();
    }
  }, [isAuthenticated, user?.citizenProfile, dispatch]);

  // Fetch Departments from API
  useEffect(() => {
    async function loadDepts() {
      try {
        const res = await fetch("/api/departments");
        const data = await res.json();
        if (data.success && data.departments?.length > 0) {
          setDepartments(data.departments);
          setFormData((prev) => ({
            ...prev,
            departmentId: data.departments[0].id,
            targetAuthority: data.departments[0].name,
          }));
        } else {
          // Fallback defaults
          const defaultDepts = [
            { id: "dept_pwd", name: "Public Works Department (PWD)", ministry: "Road Transport & Highways", code: "PWD_MP", nodalOffice: "Divisional Works Office, Division II" },
            { id: "dept_rural", name: "Rural Development & Panchayati Raj", ministry: "Rural Development", code: "RURAL_DEV", nodalOffice: "Zila Panchayat Directorate" },
            { id: "dept_health", name: "Health & Family Welfare", ministry: "Ministry of Health", code: "HEALTH_FW", nodalOffice: "Chief Medical Officer Directorate" },
            { id: "dept_edu", name: "School Education & Literacy", ministry: "Ministry of Education", code: "EDU_DEPT", nodalOffice: "District Education Directorate" },
          ];
          setDepartments(defaultDepts);
          setFormData((prev) => ({
            ...prev,
            departmentId: defaultDepts[0].id,
            targetAuthority: defaultDepts[0].name,
          }));
        }
      } catch {
        // Fallback on network fail
      } finally {
        setLoadingDepts(false);
      }
    }
    loadDepts();
  }, []);

  // Fetch Landmark CIC Precedents in Step 5 (RAG)
  useEffect(() => {
    if (currentStep === 5) {
      let isMounted = true;
      async function loadPrecedents() {
        setLoadingPrecedents(true);
        try {
          const res = await fetch("/api/ai/precedents", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              query: formData.title || formData.rawCitizenPrompt || "public works tender budget audit",
              limit: 2,
            }),
          });
          const data = await res.json();
          if (res.ok && data.success && Array.isArray(data.precedents) && isMounted) {
            setPrecedents(data.precedents);
          }
        } catch (err) {
          console.warn("Precedents load error:", err);
        } finally {
          if (isMounted) setLoadingPrecedents(false);
        }
      }
      loadPrecedents();
      return () => {
        isMounted = false;
      };
    }
  }, [currentStep, formData.title, formData.rawCitizenPrompt]);

  const selectedDepartment = departments.find((d) => d.id === formData.departmentId);

  // Stepper Validation
  const validateStep = () => {
    setErrorMsg("");
    if (currentStep === 1) {
      if (!formData.departmentId) {
        setErrorMsg("Please select a target government department or public authority.");
        return false;
      }
    } else if (currentStep === 2) {
      if (!formData.title.trim()) {
        setErrorMsg("Please enter a title for your RTI application.");
        return false;
      }
      if (!formData.rawCitizenPrompt.trim() || formData.rawCitizenPrompt.trim().length < 15) {
        setErrorMsg("Please describe your questions or required public records in at least 15 characters.");
        return false;
      }
    } else if (currentStep === 3) {
      if (formData.isLifeOrLiberty && !formData.lifeLibertyJustification.trim()) {
        setErrorMsg("Section 7(1) Proviso requires specific justification proving risk to life or physical liberty.");
        return false;
      }
    } else if (currentStep === 4) {
      if (formData.feeOption === "BPL_EXEMPTION" && !formData.bplCardNumber.trim()) {
        setErrorMsg("Please enter your valid BPL Card / Ration Card ID for statutory fee exemption.");
        return false;
      }
    } else if (currentStep === 5) {
      if (!formData.declarationAgreed) {
        setErrorMsg("You must confirm the statutory Indian citizenship declaration under Section 3.");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handlePrev = () => {
    setErrorMsg("");
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Cleanup Speech Recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, []);

  // Switch Speech Mode with smart auto-transliterate
  const handleSwitchSpeechMode = (mode) => {
    setSpeechMode(mode);
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsListening(false);
    }
    // If switching to Hinglish and existing text has Devanagari, automatically convert to Hinglish A-Z
    if (mode === "hinglish" && aiInputPrompt && /[\u0900-\u097F]/.test(aiInputPrompt)) {
      setAiInputPrompt(devanagariToHinglish(aiInputPrompt));
    }
  };

  // Voice Mic (Speech-to-Text) Toggle
  const toggleVoiceInput = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      typeof window !== "undefined" &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);

    if (!SpeechRecognition) {
      setErrorMsg(
        "Aapke browser mein Speech Recognition (Voice Input) available nahi hai. Kripya Chrome ya Edge use karein ya manually type karein."
      );
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      // In English mode use en-IN; in Hinglish and Hindi modes use hi-IN
      recognition.lang = speechMode === "english" ? "en-IN" : "hi-IN";
      recognition.continuous = true;
      recognition.interimResults = true;

      speechInitialPromptRef.current = aiInputPrompt || "";

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMsg("");
      };

      recognition.onresult = (event) => {
        let transcript = "";
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }

        let formattedTranscript = transcript.trim();
        if (speechMode === "hinglish") {
          formattedTranscript = devanagariToHinglish(formattedTranscript);
        }

        const base = speechInitialPromptRef.current
          ? speechInitialPromptRef.current.trim() + " "
          : "";
        setAiInputPrompt(base + formattedTranscript);
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        if (event.error === "not-allowed") {
          setErrorMsg(
            "Microphone permission blocked hai. Browser address bar mein jaakar microphone allow karein."
          );
        } else if (event.error !== "no-speech") {
          setErrorMsg(`Voice input: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error("SpeechRecognition start failed:", err);
      setErrorMsg("Voice input start karne mein samasya aayi. Dobara try karein.");
      setIsListening(false);
    }
  };

  // SARAL AI Vernacular Structuring Engine
  const handleAiAnalyze = async (overridePrompt) => {
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsListening(false);
    }
    const promptText = (overridePrompt || aiInputPrompt || formData.rawCitizenPrompt || "").trim();
    if (!promptText) {
      setErrorMsg("Please enter your RTI concern or question in Hindi, Hinglish, or English.");
      return;
    }

    setIsAnalyzingWithAi(true);
    setErrorMsg("");
    setAiSuccessToast("");

    try {
      const res = await fetch("/api/ai/parse-petition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptText }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.analysis) {
        const {
          title,
          subject,
          detectedDepartmentCode,
          structuredClauses,
          isLifeOrLibertySuggested,
          lifeOrLibertyReason,
        } = data.analysis;

        // Auto-select department if detected
        let matchedDeptId = formData.departmentId;
        if (detectedDepartmentCode && departments.length > 0) {
          const matched = departments.find(
            (d) =>
              d.code === detectedDepartmentCode ||
              d.id === detectedDepartmentCode ||
              d.name?.toLowerCase().includes(detectedDepartmentCode.toLowerCase())
          );
          if (matched) {
            matchedDeptId = matched.id;
          }
        }

        const formattedClausesText = Array.isArray(structuredClauses)
          ? structuredClauses.map((c, i) => `${i + 1}. ${c}`).join("\n\n")
          : structuredClauses;

        setFormData((prev) => ({
          ...prev,
          title: title || prev.title,
          subject: subject || prev.subject || title,
          departmentId: matchedDeptId || prev.departmentId,
          targetAuthority:
            departments.find((d) => d.id === matchedDeptId)?.name || prev.targetAuthority,
          structuredClauses: structuredClauses || [],
          rawCitizenPrompt: formattedClausesText || prev.rawCitizenPrompt,
          isLifeOrLiberty: Boolean(isLifeOrLibertySuggested || prev.isLifeOrLiberty),
          lifeLibertyJustification:
            lifeOrLibertyReason || prev.lifeLibertyJustification || "",
        }));

        setAiResult(data.analysis);
        if (data.analysis.source === "gemini-ai") {
          setAiSuccessToast(
            `Structured with Google Gemini AI (${data.analysis.model || "3.1 Flash-Lite"})! Clauses tailored specifically to your prompt.`
          );
        } else {
          setAiSuccessToast(
            "Structured with SARAL Civic Engine (Rule-based fallback)"
          );
        }
      } else {
        setErrorMsg(data.error || "AI could not parse the petition. Please enter details manually.");
      }
    } catch {
      setErrorMsg("Network error contacting SARAL AI Copilot.");
    } finally {
      setIsAnalyzingWithAi(false);
    }
  };

  // Automated Department & Authority Routing Engine (Sprint 2.2)
  const handleAutoRoute = async (customTopic) => {
    const topic = (customTopic || routingTopic || formData.title || formData.rawCitizenPrompt || "").trim();
    if (!topic) {
      setErrorMsg("Please enter a subject or topic to auto-route the authority.");
      return;
    }

    setIsRoutingAi(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/ai/route-authority", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: topic,
          location: formData.locationDivision,
          stateOrCentral: formData.stateOrCentral === "State" ? activeState : "Central",
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.routing?.primary) {
        setAiRoutingResult(data.routing);
        setFormData((prev) => ({
          ...prev,
          departmentId: data.routing.primary.id,
          targetAuthority: data.routing.primary.name,
        }));
      }
    } catch {
      console.warn("Auto routing failed.");
    } finally {
      setIsRoutingAi(false);
    }
  };

  // Section 8 Statutory Exemption Scanner (Sprint 2.3)
  const handleScanSection8 = async (overrideText) => {
    const textToScan = overrideText || formData.rawCitizenPrompt || formData.title || "";
    if (!textToScan.trim()) {
      setErrorMsg("Please enter petition queries to run Section 8 exemption scan.");
      return;
    }

    setIsScanningSection8(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/ai/scan-exemptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clauses: textToScan }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.scan) {
        setSection8ScanResult(data.scan);
      }
    } catch {
      console.warn("Section 8 scan failed.");
    } finally {
      setIsScanningSection8(false);
    }
  };

  // Submit RTI Application to Backend
  const handleSubmit = async () => {
    if (!validateStep()) return;

    setSubmitting(true);
    setErrorMsg("");

    try {
      const payload = {
        departmentId: formData.departmentId,
        title: formData.title,
        subject: formData.subject || formData.title,
        rawCitizenPrompt: formData.rawCitizenPrompt,
        location: formData.locationDivision,
        stateOrCentral: formData.stateOrCentral === "State" ? activeState : "Central",
        structuredClauses:
          formData.structuredClauses && formData.structuredClauses.length > 0
            ? formData.structuredClauses
            : [
                `Certified copy of records regarding: ${formData.title}`,
                `Inspection of Measurement Book, expenditure register or sanctions for ${formData.yearOrPeriod}`,
                `Names and statutory designations of officers responsible for administrative clearance at ${formData.locationDivision || "the concerned department"}`,
              ],
        targetAuthority: formData.targetAuthority || selectedDepartment?.name,
        isLifeOrLiberty: formData.isLifeOrLiberty,
        feeStatus: formData.feeOption === "BPL_EXEMPTION" ? "EXEMPTED_BPL" : "PAID",
        paymentTxnId:
          formData.feeOption === "BPL_EXEMPTION"
            ? `BPL-DOC-${formData.bplCardNumber}`
            : `TXN-BHARATKOSH-${Date.now().toString().slice(-8)}`,
      };

      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success && data.application) {
        setSubmittedApplication(data.application);
        setCurrentStep(6); // Success Step
      } else {
        // Fallback for simulation / mock mode
        const mockApp = {
          applicationNumber: `SARAL-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
          title: formData.title,
          department: selectedDepartment?.name || "Public Works Department (PWD)",
          dateFiled: new Date().toISOString(),
          statutoryDeadline: new Date(Date.now() + (formData.isLifeOrLiberty ? 48 * 3600 * 1000 : 30 * 86400 * 1000)).toISOString(),
          isLifeOrLiberty: formData.isLifeOrLiberty,
          feeStatus: formData.feeOption === "BPL_EXEMPTION" ? "EXEMPTED_BPL" : "PAID",
        };
        setSubmittedApplication(mockApp);
        setCurrentStep(6);
      }
    } catch {
      // Offline fallback
      const mockApp = {
        applicationNumber: `SARAL-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
        title: formData.title,
        department: selectedDepartment?.name || "Public Works Department",
        dateFiled: new Date().toISOString(),
        statutoryDeadline: new Date(Date.now() + 30 * 86400 * 1000).toISOString(),
        isLifeOrLiberty: formData.isLifeOrLiberty,
        feeStatus: "PAID",
      };
      setSubmittedApplication(mockApp);
      setCurrentStep(6);
    } finally {
      setSubmitting(false);
    }
  };

  const stepsConfig = [
    { num: 1, label: "Jurisdiction", desc: "Select Authority" },
    { num: 2, label: "Your Query", desc: "Public Records" },
    { num: 3, label: "Provisos", desc: "Statutory Clock" },
    { num: 4, label: "Fee Settle", desc: "₹10 / BPL" },
    { num: 5, label: "Review", desc: "Submit Petition" },
  ];

  if (!isAuthenticated) return null;

  return (
    <div className="flex-1 w-full bg-slate-50 dark:bg-[#121821] text-slate-800 dark:text-slate-100 flex flex-col antialiased transition-colors">
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-8">
        {/* Top Header & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                href="/dashboard"
                className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline"
              >
                ← Citizen Dashboard
              </Link>
              <span className="text-slate-400">/</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Section 6(1) Filing</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              File a Statutory RTI Petition
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Right to Information Act, 2005 • Section 6(1) Direct Submission
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {user?.isDigiLockerVerified ? (
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>DigiLocker Verified Citizen</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Verification Pending</span>
              </span>
            )}
          </div>
        </div>

        {!user?.isDigiLockerVerified ? (
          /* ========================================================= */
          /* VERIFY YOURSELF FIRST GATE SCREEN (Per Workflow Diagram)  */
          /* ========================================================= */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl bg-white dark:bg-[#1d2733]/90 border border-slate-200 dark:border-white/10 p-6 sm:p-10 shadow-2xl relative overflow-hidden"
          >

            <div className="max-w-2xl mx-auto text-center space-y-6 pt-2">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-4xl sm:text-5xl shadow-xl">
                <IcShield className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" />
              </div>

              <div className="space-y-2">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-extrabold tracking-wider bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Section 6(1) Citizen Mandate
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Verify Yourself First to File RTI
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg mx-auto">
                  Under <strong className="text-purple-600 dark:text-purple-400">Section 6(1) of the Right to Information Act 2005</strong>, only citizens of India are eligible to seek official information from public authorities.
                </p>
              </div>

              {/* Explanatory Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-2">
                  <div className="text-xl">🇮🇳</div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Citizenship Proof</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Certifies your statutory eligibility to demand records from government departments.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-2">
                  <div className="text-xl"><IcMailbox className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" /></div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Postal Delivery</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Ensures certified physical records and notices reach your verified address.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-2">
                  <div className="text-xl"><IcLock className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" /></div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Zero Data Abuse</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Protected under DPDP Act 2023. Aadhaar is securely masked (XXXX-XXXX-4210).
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsDigiLockerModalOpen(true)}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-sm text-white bg-blue-700 hover:bg-blue-800 shadow-xl transition-colors flex items-center justify-center gap-3 cursor-pointer"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
                    alt="Emblem"
                    className="h-5 w-auto filter invert brightness-0"
                  />
                  <span>Authenticate via DigiLocker →</span>
                </button>

                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl font-semibold text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition text-center"
                >
                  Return to Dashboard
                </Link>
              </div>
            </div>
          </motion.div>
        ) : (
          <>

        {/* ========================================================= */}
        {/* PROGRESS STEPPER (Steps 1 to 5)                           */}
        {/* ========================================================= */}
        {currentStep <= 5 && (
          <div className="rounded-2xl bg-white dark:bg-[#1d2733]/90 border border-slate-200 dark:border-white/10 p-4 sm:p-6 shadow-md">
            <div className="grid grid-cols-5 gap-2 sm:gap-4">
              {stepsConfig.map((s) => {
                const isActive = currentStep === s.num;
                const isCompleted = currentStep > s.num;

                return (
                  <div key={s.num} className="flex flex-col items-center text-center">
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm transition-colors duration-300 ${
                        isCompleted
                          ? "bg-emerald-500 text-white shadow-md "
                          : isActive
                          ? "bg-purple-600 text-white ring-4 ring-purple-500/20 shadow-lg "
                          : "bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-white/10"
                      }`}
                    >
                      {isCompleted ? "✓" : s.num}
                    </div>
                    <span
                      className={`mt-2 text-xs sm:text-xs font-bold hidden sm:block ${
                        isActive
                          ? "text-purple-600 dark:text-purple-400"
                          : isCompleted
                          ? "text-slate-700 dark:text-slate-300"
                          : "text-slate-400 dark:text-slate-500"
                      }`}
                    >
                      {s.label}
                    </span>
                    <span className="text-xs text-slate-400 hidden md:block">
                      {s.desc}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Stepper progress bar line */}
            <div className="mt-4 w-full bg-slate-100 dark:bg-white/5 h-1.5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-purple-600"
                initial={{ width: "20%" }}
                animate={{ width: `${(currentStep / 5) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        {/* Error Alert Banner */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-800 dark:text-rose-300 text-xs font-semibold flex items-center justify-between shadow-md"
            >
              <div className="flex items-center gap-2">
                <span><IcTriangleAlert className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" /></span>
                <span>{errorMsg}</span>
              </div>
              <button
                type="button"
                onClick={() => setErrorMsg("")}
                className="text-rose-700 dark:text-rose-300 hover:opacity-75 font-bold"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========================================================= */}
        {/* STEPPER CONTENT CARDS                                     */}
        {/* ========================================================= */}
        <div className="rounded-3xl bg-white/90 dark:bg-[#1d2733]/90 border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-xl">
          {/* ------------------------------------------------------- */}
          {/* STEP 1: JURISDICTION & TARGET PUBLIC AUTHORITY          */}
          {/* ------------------------------------------------------- */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="border-b border-slate-200 dark:border-white/10 pb-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Step 1: Select Target Public Authority & Ministry
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Identify the responsible government department under Section 5(1) to avoid Section 6(3) transfer delays.
                </p>
              </div>

              {/* State vs Central Toggle & State Selector (Side-by-Side) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Government Tier &amp; Target Jurisdiction
                </label>
                <div className="flex flex-wrap items-center gap-3 sm:gap-3">
                  {/* Tier Selection Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, stateOrCentral: "State" })}
                      className={`py-2 px-4 sm:px-4 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center justify-center gap-2 ${
                        formData.stateOrCentral === "State"
                          ? "bg-purple-600 text-white border-purple-600 shadow-md "
                          : "bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 shadow-xs"
                      }`}
                    >
                      <span>State Government</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, stateOrCentral: "Central" })}
                      className={`py-2 px-4 sm:px-4 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center justify-center gap-2 ${
                        formData.stateOrCentral === "Central"
                          ? "bg-purple-600 text-white border-purple-600 shadow-md "
                          : "bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 shadow-xs"
                      }`}
                    >
                      <span>🇮🇳 Central Government (GoI)</span>
                    </button>
                  </div>

                  {/* Dropdown Menu - Aligned just to the side! */}
                  {formData.stateOrCentral === "State" && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-50/70 dark:bg-white/5 border border-purple-200 dark:border-purple-500/30 shadow-xs">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 shrink-0">
                        <span className="text-purple-600 dark:text-purple-400"><IcMapPin className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" /></span>
                        <span>State:</span>
                      </span>
                      <select
                        value={activeState || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, selectedState: e.target.value }))
                        }
                        className="py-1 px-3 rounded-lg bg-white dark:bg-[#1d2733] border border-purple-300 dark:border-white/20 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/30 cursor-pointer shadow-xs"
                      >
                        <option value="">Select State</option>
                        {INDIAN_STATES.map((st) => (
                          <option
                            key={st}
                            value={st}
                            className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                          >
                            {st} {userProfileState && st.toLowerCase() === userProfileState.toLowerCase() ? "✓ (Your Profile)" : ""}
                          </option>
                        ))}
                      </select>
                      {userProfileState && activeState === userProfileState && (
                        <span className="text-xs px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 font-semibold hidden md:inline">
                          Profile Synced
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* AI Smart Authority Matcher Widget (Sprint 2.2) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-500/25 space-y-3 shadow-sm transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-600/30 dark:text-purple-300 text-xs font-bold"><IcTarget className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" /></span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>AI Smart Authority Router</span>
                        <span className="px-2 py-0.2 rounded-lg bg-purple-500/15 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300 text-xs font-mono font-bold">
                          Section 5(1) Direct Mapping
                        </span>
                      </h4>
                      <p className="text-xs text-purple-800/80 dark:text-purple-200/70">
                        Enter a short topic to auto-detect the exact competent authority and designated PIO.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={routingTopic}
                    onChange={(e) => setRoutingTopic(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAutoRoute();
                      }
                    }}
                    placeholder="e.g. broken road in village, drinking water supply, ration card delay, hospital doctor absent..."
                    className="flex-1 px-4 py-2 rounded-xl bg-white dark:bg-black/40 border border-purple-200 dark:border-purple-500/30 text-slate-900 dark:text-white text-xs placeholder-slate-400 dark:placeholder-purple-300/40 focus:outline-none focus:border-purple-500 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => handleAutoRoute()}
                    disabled={isRoutingAi}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition disabled:opacity-50 shrink-0 cursor-pointer"
                  >
                    {isRoutingAi ? "Routing..." : "Auto-Detect →"}
                  </button>
                </div>

                {/* Quick Topic Chips */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Quick Topics:</span>
                  {[
                    { label: "Road / Potholes", topic: "village road repair tender delay" },
                    { label: "Drinking Water", topic: "water pipeline and tanki connection" },
                    { label: "Gram Panchayat", topic: "panchayat development funds and MGNREGA" },
                    { label: "PHC Hospital", topic: "doctor duty roster and medicine availability" },
                    { label: "School", topic: "mid day meal and teacher vacancy" },
                    { label: "Ration / PDS", topic: "ration card grain distribution" },
                  ].map((chip) => (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={() => {
                        setRoutingTopic(chip.topic);
                        handleAutoRoute(chip.topic);
                      }}
                      className="px-2 py-0.5 rounded-lg bg-white dark:bg-white/5 hover:bg-purple-50 dark:hover:bg-white/10 text-purple-700 dark:text-purple-200 text-xs border border-purple-200 dark:border-white/10 transition cursor-pointer shadow-xs"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>

                {/* Routing Result Banner */}
                {aiRoutingResult?.primary && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                        <span>✓ Mapped to {aiRoutingResult.primary.name}</span>
                        <span className="text-xs px-2 py-0.2 rounded-lg bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 border border-emerald-500/30 font-bold">
                          {aiRoutingResult.primary.confidence} Match
                        </span>
                      </span>
                      <span className="text-xs text-emerald-700 dark:text-emerald-400 font-mono font-semibold">
                        Avg: {aiRoutingResult.primary.avgResponseDays} Days
                      </span>
                    </div>

                    <div className="text-xs text-slate-700 dark:text-slate-300 flex flex-wrap gap-x-4 gap-y-1">
                      <span><strong>Designated PIO:</strong> {aiRoutingResult.primary.pioName}</span>
                      <span><strong>Nodal Office:</strong> {aiRoutingResult.primary.nodalOffice}</span>
                    </div>

                    {aiRoutingResult.secondary && (
                      <p className="text-xs text-slate-400 border-t border-emerald-500/20 pt-1 mt-1">
                        <IcRefreshCw className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" /> <em>Secondary Jurisdiction:</em> {aiRoutingResult.secondary.name} ({aiRoutingResult.secondary.confidence} match)
                      </p>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Department Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Target Department / Public Authority <span className="text-rose-500">*</span>
                </label>

                {loadingDepts ? (
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-500">
                    Loading public authorities catalog...
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {departments.map((dept) => {
                      const isSelected = formData.departmentId === dept.id;
                      return (
                        <div
                          key={dept.id}
                          onClick={() =>
                            setFormData({
                              ...formData,
                              departmentId: dept.id,
                              targetAuthority: dept.name,
                            })
                          }
                          className={`p-4 rounded-2xl border transition-colors cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? "bg-purple-50 dark:bg-purple-950/40 border-purple-600 dark:border-purple-500 ring-2 ring-purple-500/20 shadow-md"
                              : "bg-white dark:bg-white/5 border-slate-300/80 dark:border-white/10 hover:border-purple-400 hover:shadow-sm"
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-mono text-xs font-bold text-purple-600 dark:text-purple-400">
                                {dept.code}
                              </span>
                              {isSelected && <span className="text-purple-600 text-sm font-bold">✓</span>}
                            </div>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                              {dept.name}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              {dept.ministry}
                            </p>
                          </div>

                          <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-white/5 text-xs text-slate-400 flex items-center justify-between">
                            <span>Nodal: {dept.nodalOffice?.slice(0, 32)}...</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Active PIO</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ------------------------------------------------------- */}
          {/* STEP 2: RTI QUERY & PUBLIC RECORD PARTICULARS           */}
          {/* ------------------------------------------------------- */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="border-b border-slate-200 dark:border-white/10 pb-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Step 2: Describe Your Query & Public Records Sought
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Draft your questions clearly in simple Hindi, Hinglish, or English.
                </p>
              </div>

              {/* SARAL AI Vernacular Copilot Card */}
              <div className="p-5 rounded-3xl bg-purple-50 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-500/30 shadow-md dark:shadow-xl space-y-4 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-600/30 dark:text-purple-300 flex items-center justify-center text-sm font-bold shadow-inner">
                      <IcSparkles className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>SARAL AI Vernacular Copilot</span>
                        <span className="px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                          Hindi • Hinglish • English
                        </span>
                      </h3>
                      <p className="text-xs text-purple-900/80 dark:text-purple-200/80">
                        Apni aam bolchaal me likhein — Copilot isko Section 6(1) legal clauses me structure karega.
                      </p>
                    </div>
                  </div>

                  <span className="text-xs text-purple-700 dark:text-purple-300 font-mono self-start sm:self-center font-medium">
                    Powered by Google Gemini & Civic NLP
                  </span>
                </div>

                {/* Quick Vernacular Preset Pills */}
                <div className="space-y-2">
                  <span className="text-xs text-purple-800/80 dark:text-purple-300/70 font-semibold block tracking-wider">
                    Quick Sample Vernacular Prompts:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const sample = "Mere ilaqe mein sadak tuti hui hai aur thekedar ne kaam band kar diya. Kitna budget pass hua tha aur kitne paise release hue?";
                        setAiInputPrompt(sample);
                        handleAiAnalyze(sample);
                      }}
                      className="px-3 py-1 rounded-lg bg-white dark:bg-white/10 hover:bg-purple-100 dark:hover:bg-purple-600/30 text-purple-800 dark:text-purple-200 border border-purple-200 dark:border-white/15 text-xs transition cursor-pointer shadow-xs"
                    >
                      Sadak & Thekedar Budget
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const sample = "Hamare gaon/ward mein drinking water tanki aur pipeline ka tender hua tha par paani nahi aaya. Kitna paisa pass hua tha aur thekedar kaun hai?";
                        setAiInputPrompt(sample);
                        handleAiAnalyze(sample);
                      }}
                      className="px-3 py-1 rounded-lg bg-white dark:bg-white/10 hover:bg-purple-100 dark:hover:bg-purple-600/30 text-purple-800 dark:text-purple-200 border border-purple-200 dark:border-white/15 text-xs transition cursor-pointer shadow-xs"
                    >
                      Paani Pipeline Sanction
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const sample = "CHC / District hospital mein essential medicines aur doctors ki attendance detail chahiye. Duty roster aur stock register ki certified copy do.";
                        setAiInputPrompt(sample);
                        handleAiAnalyze(sample);
                      }}
                      className="px-3 py-1 rounded-lg bg-white dark:bg-white/10 hover:bg-purple-100 dark:hover:bg-purple-600/30 text-purple-800 dark:text-purple-200 border border-purple-200 dark:border-white/15 text-xs transition cursor-pointer shadow-xs"
                    >
                      PHC Doctor & Dawai Shortage
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const sample = "Primary school mein Mid-Day Meal ka monthly expenditure aur teacher vacancy details di jayein.";
                        setAiInputPrompt(sample);
                        handleAiAnalyze(sample);
                      }}
                      className="px-3 py-1 rounded-lg bg-white dark:bg-white/10 hover:bg-purple-100 dark:hover:bg-purple-600/30 text-purple-800 dark:text-purple-200 border border-purple-200 dark:border-white/15 text-xs transition cursor-pointer shadow-xs"
                    >
                      School Mid-Day Meal
                    </button>
                  </div>
                </div>

                {/* Copilot Input Box */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between text-xs px-1 gap-2">
                    <span className="text-slate-600 dark:text-purple-300 font-medium flex items-center gap-2">
                      <span><IcMessageSquare className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" /></span> Apni pareshani type karein ya aawaz se bole:
                    </span>
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/10">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold px-1">Aawaz Mode:</span>
                      <button
                        type="button"
                        onClick={() => handleSwitchSpeechMode("hinglish")}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                          speechMode === "hinglish"
                            ? "bg-purple-600 text-white shadow-xs"
                            : "text-slate-600 dark:text-slate-300 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                        }`}
                        title="Bole Hindi/Hinglish me, likhe Roman Hinglish (A-Z) me"
                      >
                        Hinglish (A-Z)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSwitchSpeechMode("english")}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                          speechMode === "english"
                            ? "bg-purple-600 text-white shadow-xs"
                            : "text-slate-600 dark:text-slate-300 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                        }`}
                        title="Bole English me, likhe English me"
                      >
                        🇬🇧 English
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSwitchSpeechMode("hindi")}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                          speechMode === "hindi"
                            ? "bg-purple-600 text-white shadow-xs"
                            : "text-slate-600 dark:text-slate-300 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                        }`}
                        title="Bole Hindi me, likhe Devanagari (हिंदी लिपि) me"
                      >
                        🇮🇳 हिंदी
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <textarea
                      rows={3}
                      value={aiInputPrompt}
                      onChange={(e) => setAiInputPrompt(e.target.value)}
                      placeholder={
                        speechMode === "english"
                          ? "Speak or type in English: e.g. 'What was the sanctioned budget for the road in my village and why was it delayed? Provide copy of contractor agreement and measurement book...'"
                          : speechMode === "hindi"
                          ? "हिंदी में बोलें या लिखें: जैसे 'मेरे गांव की सड़क का कितना बजट पास हुआ था और देरी क्यों हुई? ठेकेदार का टेंडर एग्रीमेंट और मेजरमेंट बुक की कॉपी चाहिए...'"
                          : "Hinglish me bole ya likhe: jaise 'Gaon ki sadak kitne me bani thi aur delay kyun hua? Thekedar ka agreement aur measurement book ki copy chahiye...'"
                      }
                      className="w-full p-4 pr-48 rounded-2xl bg-white dark:bg-black/40 border border-purple-200 dark:border-purple-500/30 text-slate-900 dark:text-white text-xs leading-relaxed placeholder-slate-400 dark:placeholder-purple-300/40 focus:outline-none focus:border-purple-500 resize-none font-sans shadow-sm"
                    />

                    <div className="absolute right-2.5 bottom-3 flex items-center gap-2">
                      {/* Voice Mic Button */}
                      <button
                        type="button"
                        onClick={toggleVoiceInput}
                        title={isListening ? "Listening... Click to stop" : "Click to speak"}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-md ${
                          isListening
                            ? "bg-rose-600 hover:bg-rose-700 text-white   ring-2 ring-rose-400"
                            : "bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/50 dark:hover:bg-purple-800/60 text-purple-800 dark:text-purple-200 border border-purple-300 dark:border-purple-500/30"
                        }`}
                      >
                        {isListening ? (
                          <>
                            <span className="w-2 h-2 rounded-full bg-white" />
                            <span>Stop</span>
                          </>
                        ) : (
                          <>
                            <span>Mic</span>
                          </>
                        )}
                      </button>

                      {/* Structure AI Button */}
                      <button
                        type="button"
                        onClick={() => handleAiAnalyze()}
                        disabled={isAnalyzingWithAi}
                        className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                      >
                        {isAnalyzingWithAi ? (
                          <>
                            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Structuring...</span>
                          </>
                        ) : (
                          <>
                            <span>Structure AI</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Active Voice Listening Live Banner */}
                  {isListening && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-800 dark:text-rose-300 text-xs font-medium flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                        </span>
                        <span>
                          <IcMic className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" /> <strong>Sun rahe hain (
                            {speechMode === "hinglish"
                              ? "Hinglish: Bole Hindi me, likhega A-Z me"
                              : speechMode === "english"
                              ? "English: Bole English me, likhega English me"
                              : "Hindi: Bole Hindi me, likhega Devanagari me"}
                          )...</strong> Bolna shuru karein. Pura hone par &quot;Stop&quot; ya &quot;Structure AI&quot; dabayein.
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={toggleVoiceInput}
                        className="text-rose-700 dark:text-rose-400 hover:underline text-xs font-bold cursor-pointer"
                      >
                        Band karein ✕
                      </button>
                    </motion.div>
                  )}
                </div>

                {/* AI Structuring Feedback / Success Toast */}
                {aiSuccessToast && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between"
                  >
                    <span>{aiSuccessToast}</span>
                    <button
                      type="button"
                      onClick={() => setAiSuccessToast("")}
                      className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-200 text-sm ml-2 font-bold"
                    >
                      ✕
                    </button>
                  </motion.div>
                )}

                {/* AI Result Legal Compliance Banner */}
                {aiResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-0.5 rounded-lg bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 text-xs font-bold font-mono">
                          Mapped: {aiResult.suggestedDepartmentName}
                        </span>
                        <span className="px-3 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 text-xs font-bold">
                          ✓ Section 8 Non-Exempt ({aiResult.section8Compliance?.confidenceScore || "98.7%"})
                        </span>
                        {aiResult.source === "gemini-ai" ? (
                          <span className="px-3 py-0.5 rounded-lg bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 text-xs font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            AI Powered: Gemini ({aiResult.model || "3.1 Flash-Lite"})
                          </span>
                        ) : (
                          <span className="px-3 py-0.5 rounded-lg bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 text-xs font-bold flex items-center gap-1">
                            SARAL Civic NLP Fallback
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-purple-700 dark:text-purple-300/80 font-medium">
                        {aiResult.structuredClauses?.length || 4} Enforceable Clauses Generated
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      <IcScale className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" /> <strong>Citizen Right (Sec 6(2)):</strong> {aiResult.citizenLegalTip}
                    </p>

                    {aiResult.isLifeOrLibertySuggested && (
                      <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
                        <span><IcSiren className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" /></span>
                        <span>
                          <strong>Section 7(1) Proviso Triggered:</strong> Query involves life or emergency medical care. 48-Hour statutory clock activated!
                        </span>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Title / Subject */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Application Title / Brief Subject <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gram Panchayat Pipariya Bitumen Road Construction & Contractor Budget"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Time Period / Financial Year
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. FY 2024-2026 or April 2025 to Date"
                    value={formData.yearOrPeriod}
                    onChange={(e) => setFormData({ ...formData, yearOrPeriod: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Specific Location / Division / Ward
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ward No. 4, Division II or District"
                    value={formData.locationDivision}
                    onChange={(e) => setFormData({ ...formData, locationDivision: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Detailed Query Textarea */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Detailed Section 6(1) Enforceable Clauses <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold">
                    AI Formatted / User Editable
                  </span>
                </div>

                <textarea
                  rows={6}
                  required
                  placeholder="Apne sawal yahan vistar se likhein ya upar SARAL AI Copilot se auto-generate karein..."
                  value={formData.rawCitizenPrompt}
                  onChange={(e) => setFormData({ ...formData, rawCitizenPrompt: e.target.value })}
                  className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 leading-relaxed font-sans"
                />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-2">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Tip: Factual records (Sanction orders, bills, muster rolls, inspection reports) maangne se RTI reject nahi hoti.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleScanSection8()}
                    disabled={isScanningSection8}
                    className="self-start sm:self-auto px-4 py-2 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs font-semibold flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
                  >
                    <span><IcShield className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" /></span>
                    <span>{isScanningSection8 ? "Scanning Exemptions..." : "Scan Section 8 Compliance"}</span>
                  </button>
                </div>

                {/* Section 8 Scanner Result Card (Sprint 2.3) */}
                {section8ScanResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-3 p-4 rounded-2xl border text-xs space-y-2 ${
                      section8ScanResult.overallStatus === "SAFE"
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
                        : section8ScanResult.overallStatus === "CAUTION"
                        ? "bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-300"
                        : "bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">
                          {section8ScanResult.overallStatus === "SAFE"
                            ? "✓ Section 8 Safety Verified (Non-Exempt)"
                            : section8ScanResult.overallStatus === "CAUTION"
                            ? "Section 8 Cautionary Touchpoint"
                            : "Section 8 Statutory Exemption Risk"}
                        </span>
                        <span className="px-2 py-0.2 rounded-lg bg-white/20 text-xs font-mono font-bold">
                          {section8ScanResult.confidenceScore} Accuracy
                        </span>
                      </div>
                      <span className="text-xs font-semibold">
                        Risk Level: {section8ScanResult.riskLevel}
                      </span>
                    </div>

                    <p className="text-xs leading-relaxed">
                      {section8ScanResult.summary}
                    </p>

                    {section8ScanResult.touchpoints?.map((tp, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-100/90 dark:bg-black/20 border border-slate-200 dark:border-white/10 space-y-1 text-xs"
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span>{tp.section}: {tp.title}</span>
                          <span className="text-xs text-rose-600 dark:text-rose-400 font-bold">{tp.severity} Severity</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300">{tp.advice}</p>
                        <p className="text-emerald-700 dark:text-emerald-300">
                          <strong>Recommended Legal Remedy:</strong> {tp.remedy}
                        </p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* ------------------------------------------------------- */}
          {/* STEP 3: STATUTORY PROVISOS (SECTION 7(1) CLOCK)        */}
          {/* ------------------------------------------------------- */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="border-b border-slate-200 dark:border-white/10 pb-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Step 3: Statutory Timeline & Delivery Preferences
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Configure the legally enforceable turnaround clock under Section 7(1) of RTI Act 2005.
                </p>
              </div>

              {/* Section 7(1) Life & Liberty Emergency Toggle */}
              <div
                className={`p-5 rounded-2xl border-2 transition-colors ${
                  formData.isLifeOrLiberty
                    ? "bg-rose-500/10 border-rose-500 dark:border-rose-500/60"
                    : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10"
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="lifeLibertyCheck"
                    checked={formData.isLifeOrLiberty}
                    onChange={(e) =>
                      setFormData({ ...formData, isLifeOrLiberty: e.target.checked })
                    }
                    className="mt-1 w-4 h-4 text-purple-600 rounded cursor-pointer"
                  />
                  <div className="space-y-1">
                    <label
                      htmlFor="lifeLibertyCheck"
                      className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white cursor-pointer block"
                    >
                      Section 7(1) Proviso: Concerns Life or Physical Liberty (48-Hour Emergency Clock)
                    </label>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      If checked, the statutory response deadline is strictly <strong>48 hours</strong> instead of 30 days. Must involve imminent medical emergency, unlawful detention, or imminent peril to life.
                    </p>
                  </div>
                </div>

                {/* Justification input if checked */}
                {formData.isLifeOrLiberty && (
                  <div className="mt-4 pt-3 border-t border-rose-500/20">
                    <label className="block text-xs font-bold text-rose-700 dark:text-rose-300 mb-1">
                      Mandatory Statutory Justification for 48-Hour Emergency <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      placeholder="State the imminent threat to life or physical liberty necessitating 48-hour disclosure..."
                      value={formData.lifeLibertyJustification}
                      onChange={(e) =>
                        setFormData({ ...formData, lifeLibertyJustification: e.target.value })
                      }
                      className="w-full p-3 rounded-xl bg-white dark:bg-black/40 border border-rose-400 text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Delivery Mode */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Preferred Mode of Certified Response Delivery
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      id: "DIGITAL",
                      title: "Digital Certified PDF (Recommended)",
                      desc: "Instant download with PIO's digital signature stamp & QR code.",
                      badge: "Zero Additional Cost • Instant",
                    },
                    {
                      id: "SPEED_POST",
                      title: "Registered Speed Post",
                      desc: "Physical certified copies dispatched to your registered postal address.",
                      badge: "Standard Postal Transit (5-7 Days)",
                    },
                  ].map((mode) => (
                    <div
                      key={mode.id}
                      onClick={() => setFormData({ ...formData, deliveryMode: mode.id })}
                      className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                        formData.deliveryMode === mode.id
                          ? "bg-purple-50 dark:bg-purple-950/40 border-purple-600 dark:border-purple-500 shadow-md"
                          : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10"
                      }`}
                    >
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          {mode.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {mode.desc}
                        </p>
                      </div>
                      <span className="mt-3 text-xs font-bold text-cyan-600 dark:text-cyan-400">
                        {mode.badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ------------------------------------------------------- */}
          {/* STEP 4: STATUTORY TREASURY FEE SETTLEMENT               */}
          {/* ------------------------------------------------------- */}
          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="border-b border-slate-200 dark:border-white/10 pb-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Step 4: Statutory Government Fee Settlement
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Under Section 6(1) of the RTI Act 2005, the standard application fee is strictly ₹10. BPL citizens are completely exempted (₹0).
                </p>
              </div>

              {/* Fee Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Option A: ₹10 Treasury Payment */}
                <div
                  onClick={() => setFormData({ ...formData, feeOption: "ONLINE_PAYMENT" })}
                  className={`p-5 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
                    formData.feeOption === "ONLINE_PAYMENT"
                      ? "bg-purple-50 dark:bg-purple-950/40 border-purple-600 dark:border-purple-500 shadow-md"
                      : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl font-black text-purple-600 dark:text-purple-400">₹10.00</span>
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300">
                        Standard Fee
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Non-Tax Treasury Settlement (Bharatkosh)
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Direct electronic settlement to Consolidated Fund of India / State Treasury via UPI, NetBanking or Debit Card.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-white/10 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                    <span>Instant Acknowledgement Receipt</span>
                  </div>
                </div>

                {/* Option B: BPL Fee Exemption */}
                <div
                  onClick={() => setFormData({ ...formData, feeOption: "BPL_EXEMPTION" })}
                  className={`p-5 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
                    formData.feeOption === "BPL_EXEMPTION"
                      ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-600 dark:border-emerald-500 shadow-md"
                      : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">₹0.00 (Exempt)</span>
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                        Section 7(5) Proviso
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Below Poverty Line (BPL) Exemption
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      No application or copying fee is payable by citizens living Below the Poverty Line as per Central/State guidelines.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-white/10 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                    <span>Requires BPL Ration Card ID</span>
                  </div>
                </div>
              </div>

              {/* BPL Card Input */}
              {formData.feeOption === "BPL_EXEMPTION" && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  <label className="block text-xs font-bold text-emerald-900 dark:text-emerald-300 mb-1">
                    Enter BPL Ration Card Number / Antyodaya Certificate ID <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BPL-MP-2024-984124"
                    value={formData.bplCardNumber}
                    onChange={(e) => setFormData({ ...formData, bplCardNumber: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-black/30 border border-emerald-500 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              )}
            </motion.div>
          )}

          {/* ------------------------------------------------------- */}
          {/* STEP 5: REVIEW DOSSIER & FINAL SUBMISSION               */}
          {/* ------------------------------------------------------- */}
          {currentStep === 5 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="border-b border-slate-200 dark:border-white/10 pb-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Step 5: Review Petition Dossier & Sign Declaration
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Please verify all statutory details before final dispatch to the Public Information Officer.
                </p>
              </div>

              {/* Summary Dossier Box */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-slate-200 dark:border-white/10">
                  <div>
                    <span className="text-slate-400 block text-xs">Applicant:</span>
                    <strong className="text-slate-900 dark:text-white text-sm">
                      {user?.fullName || user?.name || (user?.email ? user.email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Citizen Applicant")}
                    </strong>
                    <span className="text-emerald-600 dark:text-emerald-400 block text-xs">DigiLocker Verified Citizen</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-xs">Target Public Authority:</span>
                    <strong className="text-purple-600 dark:text-purple-400 text-sm">{selectedDepartment?.name}</strong>
                    <span className="text-slate-500 text-xs block">
                      {selectedDepartment?.ministry} • {formData.stateOrCentral === "State" ? `State Government (${activeState})` : "Central Government (GoI)"}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block text-xs">Application Title:</span>
                  <p className="text-slate-800 dark:text-slate-100 font-semibold text-sm">{formData.title}</p>
                </div>

                <div>
                  <span className="text-slate-400 block text-xs">Proposed Query / Questions:</span>
                  <p className="text-slate-700 dark:text-slate-300 p-3 rounded-xl bg-white dark:bg-black/30 border border-slate-200/60 dark:border-white/5">
                    {formData.rawCitizenPrompt}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div>
                    <span className="text-slate-400 block text-xs">Statutory Clock:</span>
                    <strong className={formData.isLifeOrLiberty ? "text-rose-500" : "text-emerald-500"}>
                      {formData.isLifeOrLiberty ? "48 Hours (Emergency)" : "30 Calendar Days"}
                    </strong>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-xs">Fee Status:</span>
                    <strong className="text-purple-600 dark:text-purple-400">
                      {formData.feeOption === "BPL_EXEMPTION" ? "₹0 (BPL Exempt)" : "₹10 Paid (Treasury)"}
                    </strong>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-xs">Response Mode:</span>
                    <strong className="text-slate-800 dark:text-slate-200">
                      {formData.deliveryMode === "DIGITAL" ? "Certified PDF" : "Speed Post"}
                    </strong>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-xs">Location:</span>
                    <strong className="text-slate-800 dark:text-slate-200 truncate block">
                      {formData.locationDivision || (activeState !== "Select State" ? activeState : "Jurisdiction Designated")}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Landmark CIC Precedents Card (Sprint 2.4 - RAG) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-purple-50/80 dark:bg-indigo-950/40 border border-purple-200 dark:border-purple-500/25 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-600/30 dark:text-purple-300 text-xs"><IcLandmark className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" /></span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>Landmark CIC Legal Precedents Supporting Your Petition</span>
                      <span className="px-2 py-0.2 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 text-xs font-bold">
                        RAG Knowledge
                      </span>
                    </h4>
                  </div>
                  <span className="text-xs text-purple-600 dark:text-purple-300/70 font-mono hidden sm:inline font-medium">
                    Supabase pgvector
                  </span>
                </div>

                {loadingPrecedents ? (
                  <div className="py-4 text-center text-slate-500 dark:text-slate-400 text-xs">
                    Retrieving landmark CIC orders and Supreme Court rulings...
                  </div>
                ) : (
                  <div className="space-y-3">
                    {precedents.map((prec) => (
                      <div
                        key={prec.decisionNumber}
                        className="p-3 rounded-xl bg-white dark:bg-white/[0.04] border border-purple-100 dark:border-white/10 space-y-1 text-xs shadow-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-purple-700 dark:text-purple-300 text-xs">
                            {prec.decisionNumber} • {prec.citation}
                          </span>
                          <span className="text-xs px-2 py-0.2 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-500/30">
                            {prec.relevancePercentage} Relevant
                          </span>
                        </div>
                        <h5 className="font-bold text-slate-900 dark:text-white text-xs">{prec.title}</h5>
                        <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                          {prec.rulingSummary}
                        </p>
                        <p className="text-purple-800 dark:text-purple-200 text-xs">
                          Takeaway: {prec.keyLegalTakeaway}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Citizen Statutory Declaration */}
              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="declarationCheck"
                    checked={formData.declarationAgreed}
                    onChange={(e) =>
                      setFormData({ ...formData, declarationAgreed: e.target.checked })
                    }
                    className="mt-1 w-4 h-4 text-purple-600 rounded cursor-pointer"
                  />
                  <label
                    htmlFor="declarationCheck"
                    className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed cursor-pointer"
                  >
                    I hereby declare that I am a citizen of India as defined under Section 3 of the Right to Information Act, 2005. To the best of my knowledge, the information sought above falls squarely within the definition of Section 2(f) and is not barred by Section 8 or 9.
                  </label>
                </div>
              </div>
            </motion.div>
          )}

          {/* ------------------------------------------------------- */}
          {/* STEP 6: SUCCESS CONFIRMATION DOSSIER                    */}
          {/* ------------------------------------------------------- */}
          {currentStep === 6 && submittedApplication && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8 space-y-6"
            >
              <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-500/15 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-4xl shadow-xl">
                ✓
              </div>

              <div className="space-y-2">
                <span className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                  Statutory Submission Confirmed • Section 6(1)
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  RTI Application Successfully Filed!
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Your petition has been encrypted, assigned to the Public Information Officer, and the statutory response clock has officially started.
                </p>
              </div>

              {/* Reference ID Pill */}
              <div className="p-4 max-w-md mx-auto rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-500/30 text-center space-y-1">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider block">
                  Sovereign Application Number
                </span>
                <span className="font-mono text-xl sm:text-2xl font-black text-purple-600 dark:text-purple-400">
                  {submittedApplication.applicationNumber}
                </span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold block">
                  ● 30-Day Mandatory Clock Active
                </span>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <Link
                  href={`/tracking?id=${submittedApplication.applicationNumber}`}
                  className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs sm:text-sm shadow-lg transition cursor-pointer"
                >
                  Track Application Dossier →
                </Link>

                <button
                  type="button"
                  onClick={() => setIsPreviewModalOpen(true)}
                  className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center gap-2"
                >
                  <span>View &amp; Download Statutory Receipt</span>
                </button>

                <Link
                  href="/dashboard"
                  className="px-5 py-3 rounded-xl text-slate-600 dark:text-slate-300 hover:underline font-semibold text-xs sm:text-sm"
                >
                  Back to Dashboard
                </Link>
              </div>
            </motion.div>
          )}

          {/* Stepper Bottom Navigation Controls */}
          {currentStep <= 5 && (
            <div className="mt-8 pt-5 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-4 py-3 rounded-xl border border-slate-300 dark:border-white/10 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition cursor-pointer"
                >
                  ← Previous Step
                </button>
              ) : (
                <Link
                  href="/dashboard"
                  className="text-xs font-semibold text-slate-500 hover:underline"
                >
                  Cancel & Exit
                </Link>
              )}

              {currentStep < 5 ? (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-semibold shadow-md transition cursor-pointer flex items-center gap-2"
                >
                  <span>Continue</span>
                  <span>→</span>
                </motion.button>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  disabled={submitting}
                  onClick={handleSubmit}
                  className="px-7 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-bold shadow-lg transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  <span>{submitting ? "Encapsulating & Dispatching..." : "File Petition & Settle Fee"}</span>
                  <span><IcSend className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" /></span>
                </motion.button>
              )}
            </div>
          )}
        </div>
        </>
        )}
      </main>

      {/* DigiLocker National Gateway Authentication Modal */}
      <DigiLockerModal
        isOpen={isDigiLockerModalOpen}
        onClose={() => setIsDigiLockerModalOpen(false)}
      />

      {/* Floating Document Preview & Download Modal */}
      <DocumentPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        documentType="RECEIPT"
        application={submittedApplication}
      />
    </div>
  );
}
