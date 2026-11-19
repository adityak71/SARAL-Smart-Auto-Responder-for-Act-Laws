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
    if (typeof window !== "undefined") {
      // 1. Check if already running in standalone PWA mode
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true;
      if (isStandalone) {
        setIsInstalled(true);
      }

      // Check if browser already has app installed
      if (typeof navigator !== "undefined" && "getInstalledRelatedApps" in navigator) {
        navigator.getInstalledRelatedApps().then((apps) => {
          if (apps && apps.length > 0) {
            setIsInstalled(true);
          }
        }).catch(() => {});
      }

      // 2. Check if prompt was captured early by RootLayout head script
      if (window.__saralInstallPrompt) {
        setDeferredPrompt(window.__saralInstallPrompt);
        setIsInstallable(true);
      }

      const handleBeforeInstallPrompt = (e) => {
        e.preventDefault();
        window.__saralInstallPrompt = e;
        setDeferredPrompt(e);
        setIsInstallable(true);
      };

      const handlePromptCaptured = () => {
        if (window.__saralInstallPrompt) {
          setDeferredPrompt(window.__saralInstallPrompt);
          setIsInstallable(true);
        }
      };

      const handleAppInstalled = () => {
        setIsInstalled(true);
        setIsInstallable(false);
        setDeferredPrompt(null);
        window.__saralInstallPrompt = null;
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.addEventListener("saral:prompt-captured", handlePromptCaptured);
      window.addEventListener("appinstalled", handleAppInstalled);
      window.addEventListener("saral:app-installed", handleAppInstalled);

      return () => {
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        window.removeEventListener("saral:prompt-captured", handlePromptCaptured);
        window.removeEventListener("appinstalled", handleAppInstalled);
        window.removeEventListener("saral:app-installed", handleAppInstalled);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    const activePrompt =
      deferredPrompt || (typeof window !== "undefined" ? window.__saralInstallPrompt : null);

    // If browser supports direct popup prompt, trigger it directly
    if (activePrompt) {
      try {
        await activePrompt.prompt();
        const choiceResult = await activePrompt.userChoice;
        if (choiceResult?.outcome === "accepted") {
          setIsInstalled(true);
          setDeferredPrompt(null);
          if (typeof window !== "undefined") window.__saralInstallPrompt = null;
        }
      } catch (err) {
        console.warn("PWA prompt error:", err);
        setIsModalOpen(true);
      }
    } else {
      // If prompt not available (already installed, iOS, or browser held back), show guide
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
        deferredPrompt={
          deferredPrompt || (typeof window !== "undefined" ? window.__saralInstallPrompt : null)
        }
        onPromptTrigger={async () => {
          const activePrompt =
            deferredPrompt || (typeof window !== "undefined" ? window.__saralInstallPrompt : null);
          if (activePrompt) {
            try {
              await activePrompt.prompt();
              const choiceResult = await activePrompt.userChoice;
              if (choiceResult?.outcome === "accepted") {
                setIsInstalled(true);
                setDeferredPrompt(null);
                if (typeof window !== "undefined") window.__saralInstallPrompt = null;
                setIsModalOpen(false);
              }
            } catch (e) {
              console.warn("PWA prompt trigger error:", e);
            }
          }
        }}
        isInstalled={isInstalled}
      />
    </>
  );
}