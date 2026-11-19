"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Check, HelpCircle } from "lucide-react";
import PwaInstallModal from "./PwaInstallModal";

export default function PwaInstallButton({ className = "" }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // 1. Check if already running in standalone PWA mode
    if (typeof window !== "undefined") {
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true;
      if (isStandalone) {
        setIsInstalled(true);
      }

      // 2. Capture Chrome/Edge/Android beforeinstallprompt event
      const handleBeforeInstallPrompt = (e) => {
        // Prevent default mini-infobar
        e.preventDefault();
        setDeferredPrompt(e);
        setIsInstallable(true);
      };

      const handleAppInstalled = () => {
        setIsInstalled(true);
        setIsInstallable(false);
        setDeferredPrompt(null);
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.addEventListener("appinstalled", handleAppInstalled);

      return () => {
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        window.removeEventListener("appinstalled", handleAppInstalled);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    // If browser supports direct popup prompt, trigger it directly
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult?.outcome === "accepted") {
          setIsInstalled(true);
          setDeferredPrompt(null);
        }
      } catch (err) {
        console.warn("PWA prompt error:", err);
        setIsModalOpen(true);
      }
    } else {
      // If iOS, macOS Safari, or beforeinstallprompt hasn't fired, show platform guide
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <motion.button
          type="button"
          onClick={handleInstallClick}
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="relative inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white/90 hover:bg-white dark:bg-[#120836]/90 dark:hover:bg-[#190d45] text-slate-800 dark:text-purple-200 border border-purple-400/40 dark:border-purple-500/30 font-semibold text-sm sm:text-base shadow-[0_4px_18px_rgba(147,51,234,0.18)] hover:shadow-[0_6px_24px_rgba(147,51,234,0.28)] active:scale-[0.98] transition-all cursor-pointer group"
          title="Install SARAL as a Web App on your device"
        >
          {/* Animated glow border effect */}
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
          </span>

          {isInstalled ? (
            <>
              <Check className="w-4.5 h-4.5 text-emerald-500 stroke-[2.4]" />
              <span>App Installed</span>
            </>
          ) : (
            <>
              <Download className="w-4.5 h-4.5 text-purple-600 dark:text-purple-300 stroke-[2.2] transition-transform group-hover:-translate-y-0.5" />
              <span>Install Now</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/20">
                App
              </span>
            </>
          )}
        </motion.button>

        {/* Small OS Guide trigger icon */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-white/5 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 border border-slate-300/80 dark:border-white/10 transition cursor-pointer"
          title="View installation guide for iOS, Android, Mac & Windows"
          aria-label="Installation Guide for all platforms"
        >
          <HelpCircle className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* Interactive Platform Instructions Modal */}
      <PwaInstallModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        deferredPrompt={deferredPrompt}
        onPromptTrigger={async () => {
          if (deferredPrompt) {
            try {
              await deferredPrompt.prompt();
              const choiceResult = await deferredPrompt.userChoice;
              if (choiceResult?.outcome === "accepted") {
                setIsInstalled(true);
                setDeferredPrompt(null);
                setIsModalOpen(false);
              }
            } catch (e) {
              console.warn(e);
            }
          }
        }}
        isInstalled={isInstalled}
      />
    </>
  );
}