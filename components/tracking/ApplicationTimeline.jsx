"use client";

import { motion } from "framer-motion";

export default function ApplicationTimeline({ application }) {
  if (!application) return null;

  return (
    <div className="w-full bg-white dark:bg-[#0d062e] border border-slate-200/90 dark:border-purple-500/20 rounded-3xl p-6 shadow-sm dark:shadow-xl flex flex-col gap-6 text-slate-800 dark:text-slate-100 transition-colors">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Application Lifecycle Milestones
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Statutory trail under the Right to Information Act, 2005
          </p>
        </div>

        <span className="text-xs font-mono text-purple-700 dark:text-purple-300 font-semibold">
          Stage {application.currentStage} of 5
        </span>
      </div>

      {/* Stepper Vertical Milestones */}
      <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-white/10">
        {application.timeline.map((item, index) => {
          const isCompleted = item.completed;
          const isActive = item.active;

          return (
            <motion.div
              key={item.stage}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.08 }}
              className="relative group"
            >
              {/* Dot Icon Anchor */}
              <div
                className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-md transition-all ${
                  isCompleted && !isActive
                    ? "bg-purple-600 text-white ring-4 ring-purple-100 dark:ring-purple-900/40"
                    : isActive
                    ? "bg-cyan-500 text-slate-900 ring-4 ring-cyan-500/30 animate-pulse"
                    : "bg-slate-100 dark:bg-white/10 text-slate-400 border border-slate-300 dark:border-white/10"
                }`}
              >
                {isCompleted && !isActive ? (
                  "✓"
                ) : isActive ? (
                  "●"
                ) : (
                  item.stage
                )}
              </div>

              {/* Milestone Details */}
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4
                    className={`text-sm font-bold tracking-tight ${
                      isActive
                        ? "text-cyan-600 dark:text-cyan-300"
                        : isCompleted
                        ? "text-slate-900 dark:text-white"
                        : "text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    {item.title}
                  </h4>
                  <span className="text-[11px] font-mono text-purple-700 dark:text-purple-300/80 bg-purple-50 dark:bg-white/5 border border-purple-200 dark:border-transparent px-2 py-0.5 rounded-md">
                    {item.date}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300/90 leading-relaxed max-w-2xl">
                  {item.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
