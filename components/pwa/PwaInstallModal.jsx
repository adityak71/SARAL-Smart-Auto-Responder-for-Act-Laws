"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Smartphone,
  Monitor,
  Apple,
  Download,
  Share2,
  PlusSquare,
  MoreVertical,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function PwaInstallModal({
  isOpen,
  onClose,
  deferredPrompt,
  onPromptTrigger,
  isInstalled = false,
}) {
  const [activeTab, setActiveTab] = useState("windows");

  // Detect user OS on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const ua = window.navigator.userAgent || "";
    if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) {
      setActiveTab("ios");
    } else if (/android/i.test(ua)) {
      setActiveTab("android");
    } else if (/Macintosh|MacIntel|MacPPC|Mac68K/.test(ua)) {
      setActiveTab("macos");
    } else {
      setActiveTab("windows");
    }
  }, []);

  // Keyboard accessibility (Escape key to close)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const tabs = [
    {
      id: "windows",
      name: "Windows PC",
      icon: <Monitor className="w-4 h-4" />,
      badge: "Chrome / Edge",
    },
    {
      id: "android",
      name: "Android",
      icon: <Smartphone className="w-4 h-4" />,
      badge: "Mobile App",
    },
    {
      id: "ios",
      name: "iOS (iPhone/iPad)",
      icon: <Apple className="w-4 h-4" />,
      badge: "Safari PWA",
    },
    {
      id: "macos",
      name: "macOS",
      icon: <Apple className="w-4 h-4" />,
      badge: "Dock / Desktop",
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-2xl bg-white dark:bg-[#1a2330] rounded-3xl border border-slate-200 dark:border-white/15 overflow-hidden text-slate-800 dark:text-slate-100 z-10"
        >
          {/* Header */}
          <div className="relative px-6 pt-6 pb-4 border-b border-slate-200/80 dark:border-white/10 flex items-start justify-between gap-4 bg-purple-500/5">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-purple-600 p-0.5 shadow-md flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-[#1a2330] rounded-[14px] flex items-center justify-center text-white">
                  <Download className="w-5 h-5 text-purple-300" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                    Install SARAL Web App
                  </h3>
                  <span className="px-2 py-0.5 rounded-lg text-xs font-bold tracking-wider bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/20">
                    PWA v1.0
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Fast standalone experience, zero app store downloads, offline access
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Direct Prompt Trigger (if browser fired beforeinstallprompt) */}
          {deferredPrompt && !isInstalled && (
            <div className="mx-6 mt-4 p-4 rounded-2xl bg-purple-600 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3 text-left">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Browser Ready for One-Click Install</h4>
                  <p className="text-xs text-purple-100">
                    Your browser supports direct installation. Click to install immediately.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  onPromptTrigger();
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white text-purple-900 font-bold text-xs sm:text-sm hover:bg-purple-50 shadow active:scale-95 transition-all shrink-0 cursor-pointer"
              >
                Install Now
              </button>
            </div>
          )}

          {isInstalled && (
            <div className="mx-6 mt-4 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-300 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <p className="text-xs font-semibold">
                SARAL Web App is already installed and ready on this device!
              </p>
            </div>
          )}

          {/* OS Platform Switcher Tabs */}
          <div className="px-6 pt-4">
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 overflow-x-auto scrollbar-none">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isActive
                        ? "bg-white dark:bg-[#2a3542] text-purple-700 dark:text-purple-300 shadow-sm border border-slate-200/80 dark:border-white/15"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content Panels */}
          <div className="p-6 pt-5">
            {/* 1. WINDOWS PC INSTRUCTIONS */}
            {activeTab === "windows" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200/60 dark:border-white/10 pb-2">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    Windows 10 / 11 Desktop & Laptop Guide
                  </span>
                  <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-md font-mono text-xs">
                    Chrome & Edge
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 flex flex-col justify-between">
                    <div>
                      <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center mb-2">
                        1
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                        Look at Address Bar
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        In Chrome or Edge, look at the right end of the URL bar for the{" "}
                        <strong>Install icon (⊕)</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 flex flex-col justify-between">
                    <div>
                      <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center mb-2">
                        2
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                        Or Open Browser Menu
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        Click the 3 dots <strong>(⋮)</strong> in Chrome / Edge ➔ Select{" "}
                        <strong>"Install SARAL"</strong> or <strong>"Apps ➔ Install"</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 flex flex-col justify-between">
                    <div>
                      <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center mb-2">
                        3
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                        Pin to Taskbar
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        Click <strong>"Install"</strong>. SARAL opens in its own window and can be
                        pinned to your Taskbar and Start Menu.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center gap-2.5 text-xs text-purple-700 dark:text-purple-300">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-purple-600 dark:text-purple-400" />
                  <span>
                    No EXE installer required. Runs securely in Chromium sandbox with instant
                    updates.
                  </span>
                </div>
              </motion.div>
            )}

            {/* 2. ANDROID MOBILE INSTRUCTIONS */}
            {activeTab === "android" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200/60 dark:border-white/10 pb-2">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    Android Smartphone & Tablet Guide
                  </span>
                  <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md font-mono text-xs">
                    Chrome / Samsung Internet
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center mb-2">
                      1
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
                      <span>Tap Menu</span>
                      <MoreVertical className="w-3.5 h-3.5 text-emerald-600" />
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Open SARAL in Chrome on your Android phone. Tap the <strong>3-dots (⋮)</strong>{" "}
                      at the top-right corner.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center mb-2">
                      2
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                      Tap "Install App"
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Scroll down and tap <strong>"Install app"</strong> or{" "}
                      <strong>"Add to Home screen"</strong>.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center mb-2">
                      3
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                      Confirm & Launch
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Tap <strong>"Install"</strong> in the dialog. The app icon will appear on your
                      Home Screen and App Drawer!
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2.5 text-xs text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>
                    Launches full-screen like a native Google Play app with zero browser URL bar!
                  </span>
                </div>
              </motion.div>
            )}

            {/* 3. APPLE iOS (IPHONE & IPAD) INSTRUCTIONS */}
            {activeTab === "ios" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200/60 dark:border-white/10 pb-2">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    Apple iPhone & iPad Safari Guide
                  </span>
                  <span className="bg-purple-500/10 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-md font-mono text-xs">
                    iOS Safari Required
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center mb-2">
                      1
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
                      <span>Tap Share Button</span>
                      <Share2 className="w-3.5 h-3.5 text-indigo-500" />
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Open SARAL in <strong>Safari</strong> on your iPhone or iPad. Tap the{" "}
                      <strong>Share icon (⎋)</strong> at the bottom bar.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center mb-2">
                      2
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
                      <span>Add to Home Screen</span>
                      <PlusSquare className="w-3.5 h-3.5 text-indigo-500" />
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Scroll down the action sheet and tap{" "}
                      <strong>"Add to Home Screen"</strong> with the square plus icon.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center mb-2">
                      3
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                      Tap "Add"
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Tap <strong>"Add"</strong> in the top-right corner. The SARAL icon will now
                      appear on your iOS Home Screen!
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2.5 text-xs text-amber-700 dark:text-amber-300">
                  <Apple className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span>
                    Note: Apple requires Safari for PWA installation on iOS (Chrome on iOS redirects
                    to Safari).
                  </span>
                </div>
              </motion.div>
            )}

            {/* 4. APPLE macOS INSTRUCTIONS */}
            {activeTab === "macos" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200/60 dark:border-white/10 pb-2">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    Apple Mac (MacBook, iMac, Mac Mini) Guide
                  </span>
                  <span className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-md font-mono text-xs">
                    Safari Sonoma+ & Chrome
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
                        A
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        Using Safari (macOS Sonoma+)
                      </h4>
                    </div>
                    <ol className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-decimal list-inside leading-relaxed">
                      <li>Open SARAL in Safari.</li>
                      <li>
                        Click <strong>File</strong> in the macOS top menu bar.
                      </li>
                      <li>
                        Select <strong>"Add to Dock..."</strong> and click <strong>Add</strong>.
                      </li>
                      <li>SARAL is now an independent Mac app in your Dock and Launchpad!</li>
                    </ol>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                        B
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        Using Google Chrome or Edge on Mac
                      </h4>
                    </div>
                    <ol className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-decimal list-inside leading-relaxed">
                      <li>
                        Click the <strong>Install icon (⊕)</strong> on the right side of the address
                        bar.
                      </li>
                      <li>
                        Or click <strong>Menu (⋮) ➔ Cast, save and share ➔ Install SARAL</strong>.
                      </li>
                      <li>Click <strong>"Install"</strong> to launch in standalone Mac window.</li>
                    </ol>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center gap-2.5 text-xs text-purple-700 dark:text-purple-300">
                  <Apple className="w-4 h-4 shrink-0 text-purple-600 dark:text-purple-400" />
                  <span>
                    Opens from the Dock, Spotlight and Launchpad like any Mac app
                    Search.
                  </span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-slate-50 dark:bg-white/[0.02] border-t border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Offline Ready • Instant Updates • 0 MB Storage</span>
            </div>
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2 rounded-xl bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-300 dark:hover:bg-white/15 transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}