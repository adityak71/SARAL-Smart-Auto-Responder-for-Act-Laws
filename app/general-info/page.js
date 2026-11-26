"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import WikipediaArticleModal from "@/components/common/WikipediaArticleModal";
import { Globe as IcGlobe, Landmark as IcLandmark, Scale as IcScale, Timer as IcTimer } from "lucide-react";

const POPULAR_TOPICS = [
  { label: "RTI Act 2005", query: "Right to Information Act" },
  { label: "Public Information Officer", query: "Public Information Officer" },
  { label: "Gram Panchayat Road Funds", query: "Gram Panchayat road budget" },
  { label: "Central Information Commission", query: "Central Information Commission" },
  { label: "Section 8 Exemptions", query: "Section 8 exemptions RTI" },
  { label: "First Appeal (Section 19)", query: "First appeal RTI procedure" },
  { label: "MGNREGA Muster Rolls", query: "MGNREGA public records" },
];

export default function GeneralInfoPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLang, setSelectedLang] = useState("en"); // "en" | "hi"
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState({
    wikipediaArticles: [],
    statutoryRules: [],
    matchingDepartments: [],
  });
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);

  // Initial fetch on mount
  useEffect(() => {
    fetchInfo("", selectedLang);
  }, [selectedLang]);

  const fetchInfo = async (query, lang) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/general-info?q=${encodeURIComponent(query)}&lang=${lang}`);
      const data = await res.json();
      if (data.success) {
        setResults({
          wikipediaArticles: data.wikipediaArticles || [],
          statutoryRules: data.statutoryRules || [],
          matchingDepartments: data.matchingDepartments || [],
        });
      }
    } catch (err) {
      console.error("Failed to fetch general info:", err);
    } finally {
      setIsLoading(false);
      setHasSearched(Boolean(query));
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchInfo(searchQuery, selectedLang);
  };

  const handleTopicClick = (topicQuery) => {
    setSearchQuery(topicQuery);
    fetchInfo(topicQuery, selectedLang);
  };

  return (
    <div className="flex-1 w-full bg-slate-50 dark:bg-[#121821] text-slate-800 dark:text-slate-100 min-h-screen py-8 sm:py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white"
          >
            Know Your <span className="text-purple-600 dark:text-purple-400">Rights & Laws</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300"
          >
            Plain summaries of the RTI Act, what each section means for you, and contact details for each department&apos;s Public Information Officer.
          </motion.p>
        </div>

        {/* Search Bar & Language Switcher */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="max-w-3xl mx-auto mb-8"
        >
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  selectedLang === "hi"
                    ? "खोजें: आरटीआई नियम, सड़क टेंडर, ग्राम पंचायत बजट, अधिकारी..."
                    : "Search any topic: RTI Act, Road tenders, Gram Panchayat budget, PIO..."
                }
                className="w-full pl-12 pr-32 py-4 rounded-2xl bg-white dark:bg-[#1a2330] border-2 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-600 dark:focus:border-purple-400 transition-colors text-sm sm:text-base"
              />
              <svg
                className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Language & Search Controls */}
            <div className="absolute right-2.5 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedLang(selectedLang === "en" ? "hi" : "en")}
                className="px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-white/15 bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:border-purple-400 transition cursor-pointer"
                title="Switch Language"
              >
                {selectedLang === "en" ? "EN ⇄ हिंदी" : "हिंदी ⇄ EN"}
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs sm:text-sm shadow-md transition disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? "Searching..." : "Search"}
              </button>
            </div>
          </form>

          {/* Quick Filter Topic Chips */}
          <div className="flex flex-wrap items-center gap-2 mt-4 justify-center">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Popular:</span>
            {POPULAR_TOPICS.map((topic) => (
              <button
                key={topic.label}
                type="button"
                onClick={() => handleTopicClick(topic.query)}
                className="text-xs px-3 py-1 rounded-lg bg-slate-200/70 hover:bg-purple-100 hover:text-purple-700 dark:bg-white/5 dark:hover:bg-purple-900/40 dark:hover:text-purple-300 text-slate-700 dark:text-slate-300 border border-slate-300/60 dark:border-white/10 transition cursor-pointer"
              >
                {topic.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results Container */}
        <div className="space-y-10">
          {/* Section 1: Statutory RTI Act Knowledge */}
          {results.statutoryRules.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-500/30">
                  <IcScale className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    Statutory Legal Clauses & RTI Act Rules
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Official procedures, turnarounds, and fee structures under Right to Information Act 2005
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {results.statutoryRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="p-5 rounded-2xl bg-white dark:bg-[#1a2330] border border-slate-200 dark:border-white/10 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                          {rule.section}
                        </span>
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          <IcTimer className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" /> {rule.timeLimit}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white mb-2">
                        {rule.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                        {rule.summary}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-500 dark:text-slate-400">
                        Fee: <strong className="text-slate-700 dark:text-slate-200">{rule.statutoryFee}</strong>
                      </span>
                      <Link
                        href="/login"
                        className="text-purple-600 dark:text-purple-400 font-bold hover:underline"
                      >
                        File Petition →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Section 2: Wikipedia Verified Encyclopedia Knowledge */}
          {results.wikipediaArticles.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm border border-blue-500/30">
                  <IcGlobe className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    Verified Public Encyclopedia (Wikipedia Integration)
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Live background, neutral legal definitions, and institutional scope
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {results.wikipediaArticles.map((article, idx) => (
                  <article
                    key={idx}
                    className="p-5 rounded-2xl bg-white dark:bg-[#1a2330] border border-slate-200 dark:border-white/10 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
                  >
                    <div>
                      {article.thumbnail && (
                        <div className="w-full h-32 mb-3 rounded-xl overflow-hidden bg-slate-100 dark:bg-white/5 relative">
                          <img
                            src={article.thumbnail}
                            alt={article.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          {article.source}
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                        {article.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-4">
                        {article.extract}
                      </p>
                    </div>

                    <div className="pt-4 mt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedArticle(article);
                          setIsArticleModalOpen(true);
                        }}
                        className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline flex items-center gap-2 cursor-pointer py-1 px-2 -ml-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                      >
                        <span>Read Full Article</span>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>

                      <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                        In-App Preview
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </motion.section>
          )}

          {/* Section 3: Responsible Departments & PIO Contacts */}
          {results.matchingDepartments.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm border border-amber-500/30">
                  <IcLandmark className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    Responsible Public Authorities & PIO Directory
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Official departments mapped to RTI requests with nodal officer details
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {results.matchingDepartments.map((dept) => (
                  <div
                    key={dept.id}
                    className="p-5 rounded-2xl bg-white dark:bg-[#1a2330] border border-slate-200 dark:border-white/10 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                          {dept.code}
                        </span>
                        <span className="text-xs font-semibold text-purple-600 dark:text-purple-300">
                          Avg: {dept.avgResponseDays} Days
                        </span>
                      </div>
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white mb-1">
                        {dept.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                        {dept.ministry} ({dept.stateOrCentral})
                      </p>
                      <div className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-white/[0.03] p-3 rounded-xl border border-slate-200/60 dark:border-white/5 space-y-1">
                        <div>
                          <strong>Nodal Office:</strong> {dept.nodalOffice}
                        </div>
                        <div>
                          <strong>Email:</strong> {dept.contactEmail}
                        </div>
                        {dept.contactPhone && (
                          <div>
                            <strong>Phone:</strong> {dept.contactPhone}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5">
                      <Link
                        href="/login"
                        className="w-full py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:hover:bg-purple-900/50 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-bold text-center block transition"
                      >
                        Draft RTI to this Department →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </div>

      {/* Floating In-App Wikipedia Article Preview Modal */}
      <WikipediaArticleModal
        isOpen={isArticleModalOpen}
        onClose={() => setIsArticleModalOpen(false)}
        article={selectedArticle}
      />
    </div>
  );
}
