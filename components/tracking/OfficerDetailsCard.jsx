"use client";

export default function OfficerDetailsCard({ application }) {
  if (!application?.pioDetails) return null;

  const { pioDetails, department, targetAuthority } = application;

  return (
    <div className="w-full bg-white dark:bg-[#16262d] border border-slate-300/40 dark:border-white/10 rounded-xl p-6 sm:p-8 shadow-sm flex flex-col gap-4 text-slate-800 dark:text-slate-100 transition-colors">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
        <div>
          <span className="label-caps text-slate-500 dark:text-slate-400 block">
            Competent Public Authority
          </span>
          <h3 className="font-display text-lg leading-7 font-semibold text-purple-900 dark:text-white">
            Designated Public Information Officer (PIO)
          </h3>
        </div>
        <span className="text-xs px-3 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold">
          Section 5(1) Gazetted
        </span>
      </div>

      {/* Officer Bio Row */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center text-white text-lg font-bold shadow-md shrink-0">
          {pioDetails.name.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
            {pioDetails.name}
          </h4>
          <p className="text-xs text-purple-700 dark:text-purple-300 font-medium truncate">
            {pioDetails.designation}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
            {pioDetails.office}
          </p>
        </div>
      </div>

      {/* Department & Contact Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/5">
          <span className="text-slate-500 dark:text-slate-400 text-xs block">Nodal Department</span>
          <strong className="text-slate-900 dark:text-white truncate block">{department}</strong>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/5">
          <span className="text-slate-500 dark:text-slate-400 text-xs block">Target Public Authority</span>
          <strong className="text-purple-700 dark:text-purple-300 truncate block">{targetAuthority}</strong>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/5">
          <span className="text-slate-500 dark:text-slate-400 text-xs block">Official Email</span>
          <a href={`mailto:${pioDetails.email}`} className="text-purple-700 dark:text-purple-300 hover:underline truncate block">
            {pioDetails.email}
          </a>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/5">
          <span className="text-slate-500 dark:text-slate-400 text-xs block">Desk Phone</span>
          <span className="text-slate-800 dark:text-slate-200 font-mono block">{pioDetails.phone}</span>
        </div>
      </div>
    </div>
  );
}
