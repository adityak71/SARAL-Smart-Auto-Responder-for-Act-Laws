"use client";

import { useEffect } from "react";

export default function PwaRegistrar() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      // Service Workers require a secure origin (HTTPS, localhost, 127.0.0.1, or private network if flagged)
      const isSecure =
        window.isSecureContext ||
        window.location.protocol === "https:" ||
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";

      if (!isSecure) {
        console.warn("PWA: Service Workers require HTTPS or localhost (secure origin). Registration skipped.");
        return;
      }
      const registerSW = () => {
        navigator.serviceWorker
          .register("/sw.js", { scope: "/" })
          .then((registration) => {
            // Check for service worker updates immediately
            registration.update().catch(() => {});
          })
          .catch((error) => {
            console.warn("PWA Service Worker registration error:", error?.message);
          });
      };

      // If document is already loaded, register immediately; otherwise wait for load
      if (document.readyState === "complete") {
        registerSW();
      } else {
        window.addEventListener("load", registerSW);
        return () => window.removeEventListener("load", registerSW);
      }
    }
  }, []);

  return null;
}
