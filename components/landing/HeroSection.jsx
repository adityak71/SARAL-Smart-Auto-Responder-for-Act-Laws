"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { heroContent } from "@/data/heroContent";

export default function HeroSection() {
  const [selectedPrompt, setSelectedPrompt] = useState(heroContent.promptExamples[0]);

  return (
    <section className="relative w-full pt-8 pb-16 lg:pt-12 lg:pb-24 overflow-hidden">
      {/* Ambient Radial Lights */}
      <div className="absolute -top-32 right-[-5%] w-[800px] h-[800px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(147,51,234,0.18),transparent_65%)] blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -left-48 w-[600px] h-[600px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.14),transparent_65%)] blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12 lg:gap-16">
        {/* 2-Column Split Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-center">
          {/* LEFT COLUMN: Authority Proposition & Actions (6 Cols Desktop) */}
          <div className="lg:col-span-6 flex flex-col items-start gap-6">
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/40 text-purple-200 shadow-[0_0_20px_rgba(168,85,247,0.2)] backdrop-blur-md"
            >
              <svg className="w-4 h-4 text-purple-300 animate-pulse fill-current" viewBox="0 0 24 24">
                <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
              </svg>
              <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase">
                {heroContent.badge}
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="space-y-1"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-white tracking-tight leading-[1.12]">
                {heroContent.titlePart1}
                <span className="block bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
                  {heroContent.titlePart2}
                </span>
              </h1>
              <p className="text-xs sm:text-sm font-medium text-purple-200/80 pt-1">
                {heroContent.hindiSubhead}
              </p>
            </motion.div>

            {/* Supporting Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed"
            >
              {heroContent.description}
            </motion.p>

            {/* CTA Button Group */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.22 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto pt-1"
            >
              <Link
                href={heroContent.ctas.primary.href}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white font-semibold text-sm shadow-[0_8px_25px_-4px_rgba(99,102,241,0.5)] active:scale-[0.98] transition-all group"
              >
                <span>{heroContent.ctas.primary.label}</span>
                <svg
                  className="w-4 h-4 stroke-[2.2] transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>

              <Link
                href={heroContent.ctas.secondary.href}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white border border-white/15 font-semibold text-sm shadow-sm active:scale-[0.98] transition-all"
              >
                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{heroContent.ctas.secondary.label}</span>
              </Link>
            </motion.div>

            {/* Compliance Badges & Encrypted Note */}
            <div className="w-full flex flex-col gap-2 pt-1 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                {heroContent.complianceTags.map((tag) => (
                  <span
                    key={tag.label}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 font-medium"
                  >
                    <svg className="w-3.5 h-3.5 text-emerald-400 fill-current" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {tag.label}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>{heroContent.securityNote}</span>
              </p>
            </div>

            {/* Interactive Prompt Chips Picker */}
            <div className="w-full p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                  <span className="text-purple-400">⚡</span>
                  {heroContent.promptPromptsHeader}
                </span>
                <span className="text-[11px] text-purple-300 font-medium">
                  {heroContent.promptPromptsSub}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {heroContent.promptExamples.map((item) => {
                  const isSelected = selectedPrompt.id === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedPrompt(item)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? "bg-purple-600 text-white shadow-md border border-purple-400"
                          : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
                      }`}
                    >
                      <span>{item.emoji} {item.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Realistic Live SARAL Workspace Mockup (6 Cols Desktop) */}
          <div className="lg:col-span-6 relative mt-4 lg:mt-0">
            {/* Soft Ambient Glow */}
            <div className="absolute -inset-2.5 rounded-3xl bg-gradient-to-tr from-purple-600/30 via-indigo-600/20 to-cyan-500/20 blur-2xl opacity-75 pointer-events-none" />

            {/* Main Glass Workspace Card */}
            <div className="relative rounded-3xl bg-[#0e0728]/90 backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(147,51,234,0.15)] p-5 sm:p-7 flex flex-col gap-4 text-slate-100">
              {/* Top Window Bar */}
              <div className="flex items-center justify-between pb-3 bg-white/[0.04] border border-white/10 px-4 py-2.5 rounded-2xl">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <div className="ml-2 flex items-center gap-2">
                    <span className="text-xs font-bold text-white">SARAL Workspace</span>
                    <span className="text-slate-500 text-[10px]">•</span>
                    <span className="text-[11px] text-purple-300 bg-purple-500/20 border border-purple-500/30 px-2 py-0.5 rounded-full font-medium">
                      Citizen Portal
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400 text-xs">
                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>SARAL-2026-00124</span>
                </div>
              </div>

              {/* Application Header Card */}
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                        Application Reference
                      </div>
                      <div className="text-sm font-bold text-white font-mono">
                        SARAL-2026-00124
                      </div>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    <span>In Review • Day 18 of 30</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-slate-400 text-[10px] block">Subject</span>
                    <strong className="text-white truncate block">
                      {selectedPrompt.title}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-slate-400 text-[10px] block">Target Department</span>
                    <strong className="text-purple-300 truncate block">
                      {selectedPrompt.department}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Progress Timeline Stepper */}
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">Statutory Lifecycle Progress</span>
                  <span className="text-purple-300 font-medium">Stage 4 of 5 (Standard Turnaround)</span>
                </div>

                <div className="relative pt-2 pb-1">
                  {/* Background Bar */}
                  <div className="absolute top-5 left-4 right-4 h-1 bg-white/10 -translate-y-1/2 rounded-full" />
                  {/* Filled Progress Bar */}
                  <div className="absolute top-5 left-4 w-3/4 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 -translate-y-1/2 rounded-full" />

                  {/* 5 Stages */}
                  <div className="relative flex justify-between items-center text-center text-[11px]">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-[10px]">
                        ✓
                      </div>
                      <span className="text-slate-300 font-medium hidden sm:block">Drafted</span>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-[10px]">
                        ✓
                      </div>
                      <span className="text-slate-300 font-medium hidden sm:block">Submitted</span>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">
                        ✓
                      </div>
                      <span className="text-slate-300 font-medium hidden sm:block">Assigned</span>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <div className="w-6 h-6 rounded-full bg-cyan-500 text-slate-900 flex items-center justify-center font-extrabold text-[10px] ring-4 ring-cyan-500/20 animate-pulse">
                        ●
                      </div>
                      <span className="text-cyan-300 font-bold hidden sm:block">In Review</span>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <div className="w-6 h-6 rounded-full bg-white/10 text-slate-500 flex items-center justify-center text-[10px]">
                        5
                      </div>
                      <span className="text-slate-500 font-medium hidden sm:block">Response</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic AI Copilot Live Generation Card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedPrompt.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/40 via-indigo-950/30 to-slate-900/50 border border-purple-500/30 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center text-xs">
                        ✦
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">SARAL AI Copilot</span>
                        <span className="text-[10px] text-purple-300">Natural vernacular speech to legal petition</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-purple-200 bg-purple-500/20 border border-purple-500/30 px-2 py-0.5 rounded-full font-semibold">
                      Section 6(1) Parsed
                    </span>
                  </div>

                  {/* Citizen Raw Voice / Text Quote */}
                  <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5 text-xs">
                    <span className="text-[10px] text-slate-400 block mb-0.5">Citizen Prompt (Hindi / Hinglish):</span>
                    <p className="italic text-slate-200 leading-relaxed">
                      “{selectedPrompt.rawText}”
                    </p>
                  </div>

                  {/* AI Structured Legal Clauses */}
                  <div className="p-3 rounded-xl bg-purple-900/20 border border-purple-500/25 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between pb-1 border-b border-purple-500/20">
                      <span className="font-bold text-purple-200 text-[11px]">
                        Statutory Clauses under RTI Act 2005:
                      </span>
                      <span className="text-[10px] text-emerald-400 font-semibold">
                        100% Public Record
                      </span>
                    </div>

                    {selectedPrompt.clauses.map((clause, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-slate-300 text-[11px] leading-snug">
                        <span className="text-purple-400 font-bold">{idx + 1}.</span>
                        <span>{clause}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Mini Quick Stats Counter */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-base font-extrabold text-white block">12</span>
                  <span className="text-[10px] text-slate-400">Total Filings</span>
                </div>
                <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                  <span className="text-base font-extrabold text-cyan-300 block">3</span>
                  <span className="text-[10px] text-cyan-200">Active In-Review</span>
                </div>
                <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <span className="text-base font-extrabold text-purple-300 block">9</span>
                  <span className="text-[10px] text-purple-200">Responses Recv.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM HERO TRUST STRIP */}
        <div className="w-full pt-4">
          <div className="rounded-3xl bg-white/[0.03] border border-white/10 p-6 sm:p-7 shadow-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 items-center">
              {heroContent.trustStrip.map((item) => (
                <div key={item.title} className="flex items-center gap-3.5 group">
                  <div className="w-11 h-11 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-300 flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-bold text-white leading-tight">
                      {item.title}
                    </span>
                    <span className="text-xs text-slate-400">
                      {item.subtitle}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
