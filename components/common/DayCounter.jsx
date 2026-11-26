// SARAL's signature detail: where an RTI deadline matters, it reads "Day 12 of 30"
// over a thin line with marks every 10 days (every 16 hours for a 48-hour request).
const TONES = {
  normal: { text: "text-slate-900 dark:text-white", bar: "bg-purple-600 dark:bg-purple-400" },
  soon: { text: "text-amber-800 dark:text-amber-300", bar: "bg-amber-500" },
  overdue: { text: "text-rose-700 dark:text-rose-400", bar: "bg-rose-600" },
};

export default function DayCounter({ current, total = 30, unit = "Day", tone = "normal", note, className = "" }) {
  const t = TONES[tone] || TONES.normal;
  const shown = Math.max(1, Math.round(current));
  const pct = Math.min(100, Math.max(0, (shown / total) * 100));

  return (
    <div className={`min-w-[8rem] ${className}`}>
      <div className="flex items-baseline justify-between gap-2">
        <span className={`font-mono text-sm font-medium ${t.text}`}>
          {unit} {shown} of {total}
        </span>
        {note && <span className="text-xs text-slate-500 dark:text-slate-400">{note}</span>}
      </div>
      <div className="relative mt-1 h-1 rounded-sm bg-slate-300/70 dark:bg-white/10" aria-hidden="true">
        <div className={`h-full rounded-sm ${t.bar}`} style={{ width: `${pct}%` }} />
        <span className="absolute top-[-2px] h-2 w-px bg-slate-500/60 left-1/3" />
        <span className="absolute top-[-2px] h-2 w-px bg-slate-500/60 left-2/3" />
      </div>
    </div>
  );
}
