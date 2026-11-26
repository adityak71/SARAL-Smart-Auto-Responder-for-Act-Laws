"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Globe as IcGlobe, Landmark as IcLandmark } from "lucide-react";

export default function WikipediaArticleModal({ isOpen, onClose, article }) {
  const [copied, setCopied] = useState(false);
  const [extendedArticle, setExtendedArticle] = useState(null);
  const [loadingExtended, setLoadingExtended] = useState(false);

  // Sync state when article opens
  useEffect(() => {
    if (!isOpen || !article) {
      setExtendedArticle(null);
      setLoadingExtended(false);
      return;
    }

    setExtendedArticle(article);

    // Lock body scroll
    document.body.style.overflow = "hidden";

    // Attempt to fetch extended text from API
    let isMounted = true;
    const fetchExtended = async () => {
      try {
        setLoadingExtended(true);
        const res = await fetch(
          `/api/general-info/article?title=${encodeURIComponent(article.title)}&lang=${article.lang || "en"}`
        );
        const data = await res.json();
        if (isMounted && data.success && data.article) {
          setExtendedArticle((prev) => ({
            ...prev,
            ...data.article,
            // Keep existing thumbnail if API didn't return one
            thumbnail: data.article.thumbnail || prev?.thumbnail,
          }));
        }
      } catch (err) {
        // Fallback to initial summary gracefully
      } finally {
        if (isMounted) setLoadingExtended(false);
      }
    };

    fetchExtended();

    return () => {
      isMounted = false;
      document.body.style.overflow = "unset";
    };
  }, [isOpen, article]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !article) return null;

  const currentArticle = extendedArticle || article;
  const paragraphs = (currentArticle.extract || "")
    .split("\n")
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  const handleCopyLink = () => {
    if (currentArticle.pageUrl) {
      navigator.clipboard.writeText(currentArticle.pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl bg-white dark:bg-[#16262d] border border-slate-200 dark:border-purple-500/30 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh] text-slate-800 dark:text-slate-100"
        >
          {/* Top Control Bar (Modal Header) */}
          <div className="p-4 sm:px-6 bg-slate-50 dark:bg-purple-950/50 border-b border-slate-200 dark:border-white/10 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm border border-blue-500/30 shrink-0">
                <IcGlobe className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" />
              </div>
              <div className="truncate">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-700/50">
                    Wikipedia In-App Reader
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono hidden sm:inline">
                    {currentArticle.lang === "hi" ? "हिंदी (hi)" : "English (en)"}
                  </span>
                </div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate mt-0.5">
                  {currentArticle.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {currentArticle.pageUrl && (
                <a
                  href={currentArticle.pageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-700 dark:text-white text-xs font-semibold transition cursor-pointer"
                  title="Open on Wikipedia in new tab"
                >
                  <span>Open in Tab</span>
                  <svg className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition cursor-pointer"
                title="Close Modal"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Scrollable Article Body */}
          <div className="p-5 sm:p-8 overflow-y-auto flex-1 space-y-6">
            {/* Hero Banner with Thumbnail if Available */}
            {currentArticle.thumbnail && (
              <div className="w-full h-48 sm:h-64 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 relative shadow-inner">
                <img
                  src={currentArticle.thumbnail}
                  alt={currentArticle.title}
                  className="w-full h-full object-contain sm:object-cover"
                />
                <div className="absolute inset-0 flex items-end p-4 sm:p-6 pointer-events-none">
                  <div className="bg-black/70 rounded-lg px-3 py-2">
                    <span className="text-xs font-bold tracking-wider text-white/80 bg-black/40 px-2 py-0.5 rounded">
                      Public Encyclopedia Record
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-white">
                      {currentArticle.title}
                    </h2>
                  </div>
                </div>
              </div>
            )}

            {/* Title & Description Heading (if thumbnail not present or for clear typography) */}
            {!currentArticle.thumbnail && (
              <div className="border-b border-slate-200 dark:border-white/10 pb-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {currentArticle.title}
                </h2>
                {currentArticle.description && (
                  <p className="text-sm text-purple-700 dark:text-purple-300 font-medium mt-1">
                    {currentArticle.description}
                  </p>
                )}
              </div>
            )}

            {/* Description Subtitle if Thumbnail was shown */}
            {currentArticle.thumbnail && currentArticle.description && (
              <p className="text-sm text-purple-700 dark:text-purple-300 font-medium -mt-2">
                {currentArticle.description}
              </p>
            )}

            {/* Article Text Content */}
            <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-sans">
              {paragraphs.length > 0 ? (
                paragraphs.map((para, i) => (
                  <p key={i} className="text-justify sm:text-left">
                    {para}
                  </p>
                ))
              ) : (
                <p className="text-slate-400">
                  {loadingExtended
                    ? "Retrieving full article text from Wikipedia..."
                    : "No introductory summary available for this topic."}
                </p>
              )}
            </div>

            {/* Loading Indicator for Extended Data */}
            {loadingExtended && (
              <div className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-300 pt-1">
                <span className="w-3.5 h-3.5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                <span>Syncing extended encyclopedic data...</span>
              </div>
            )}

            {/* Civic & RTI Context Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200/90 dark:border-purple-500/30 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg"><IcLandmark className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" /></span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  Right to Information (RTI) Relevance
                </h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Under <strong>Section 6(1) of the RTI Act, 2005</strong>, citizens can seek certified copies of official file notings, government circulars, sanction orders, and audit reports pertaining to public institutions, statutory schemes, or regulatory oversight. Verified encyclopedic entries help you precisely frame questions and target the right Public Authority.
              </p>
              <div className="pt-1">
                <Link
                  href="/file-rti"
                  onClick={onClose}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md transition cursor-pointer"
                >
                  <span>+ File RTI on this Topic</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* Attribution & Legal Notice */}
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400 space-y-1">
              <p>
                <strong>Source:</strong> Wikipedia (The Free Encyclopedia). Text is licensed under{" "}
                <a
                  href="https://creativecommons.org/licenses/by-sa/4.0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-slate-800 dark:hover:text-white"
                >
                  CC BY-SA 4.0
                </a>
                .
              </p>
              <p>
                Integrated non-partisan reference provided for civic awareness, educational context, and statutory RTI jurisdiction identification.
              </p>
            </div>
          </div>

          {/* Modal Footer Controls */}
          <div className="p-4 sm:px-6 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-white/10 flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-4 py-2 rounded-xl bg-white dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/15 border border-slate-200 dark:border-white/15 text-slate-700 dark:text-white text-xs font-semibold transition cursor-pointer flex items-center gap-2"
            >
              <span>{copied ? "✓ Copied" : "Copy Link"}</span>
            </button>

            <div className="flex items-center gap-2">
              {currentArticle.pageUrl && (
                <a
                  href={currentArticle.pageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sm:hidden px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1"
                >
                  <span>Open ↗</span>
                </a>
              )}
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
