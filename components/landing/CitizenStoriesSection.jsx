"use client";

import { motion } from "framer-motion";
import { citizenStories } from "@/data/citizenStoriesData";

export default function CitizenStoriesSection() {
  return (
    <section className="w-full py-16 lg:py-24 bg-white/[0.01] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>REAL CITIZEN IMPACT • ज़मीनी बदलाव</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Democracy Works When Citizens Ask
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            SARAL is not just an algorithm. It is an instrument of citizen sovereignty. Here is how real citizens across India used transparent RTI inquiries to demand accountability and solve grassroots problems.
          </p>
        </div>

        {/* 4 Citizen Story Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {citizenStories.map((story, idx) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.1 }}
              className="p-6 rounded-3xl bg-[#0f072d]/80 border border-purple-500/20 hover:border-purple-400/50 shadow-xl flex flex-col justify-between gap-5 transition-all duration-300 hover:-translate-y-1 group"
            >
              {/* Top Citizen Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <img
                    src={story.avatar}
                    alt={story.name}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-purple-500/40 shadow-md shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-base text-white">
                        {story.name}
                      </h3>
                      {story.verified && (
                        <span title="DigiLocker Verified Citizen" className="text-emerald-400 text-xs">
                          ✓
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-purple-300 font-medium">
                      {story.role}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      📍 {story.location}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] font-mono text-purple-300/80 font-bold block">
                    {story.appId}
                  </span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                    {story.statutoryDays}
                  </span>
                </div>
              </div>

              {/* Citizen Quote */}
              <blockquote className="text-xs sm:text-sm text-slate-200 italic leading-relaxed bg-white/[0.03] p-4 rounded-2xl border border-white/5">
                {story.quote}
              </blockquote>

              {/* Concrete Outcome Strip */}
              <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/20 space-y-1 text-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                  <span>Verified Outcome:</span>
                  <span className="text-purple-300">{story.department}</span>
                </div>
                <p className="font-semibold text-emerald-300 text-xs leading-snug">
                  ✓ {story.outcome}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
