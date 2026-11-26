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
          className="relative inline-flex items-center justify-center gap-2 px-2 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-slate-900/5 dark:hover:bg-white/5 font-medium text-sm transition-colors cursor-pointer"
          title="Install SARAL as a Web App on your device"
        >

          {isInstalled ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" strokeWidth={1.5} />
              <span>App Installed</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" strokeWidth={1.5} />
              <span>Install the app</span>
            </>
          )}
        </motion.button>

        {/* Small OS Guide trigger icon */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-slate-900/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          title="View installation guide for iOS, Android, Mac & Windows"
          aria-label="Installation Guide for all platforms"
        >
          <HelpCircle className="w-4 h-4" strokeWidth={1.5} />
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