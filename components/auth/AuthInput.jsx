"use client";

import { motion } from "framer-motion";

export default function AuthInput({
  id,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = true,
  icon,
  rightElement,
  autoComplete,
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.012, y: -1 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="relative flex items-center rounded-xl border border-slate-200/90 dark:border-white/15 bg-slate-50/80 dark:bg-white/[0.06] hover:bg-white dark:hover:bg-white/[0.1] hover:border-purple-400/90 dark:hover:border-purple-400/60 focus-within:bg-white dark:focus-within:bg-white/[0.1] focus-within:border-[#1e3a42] dark:focus-within:border-purple-400 focus-within:ring-3 focus-within:ring-[#1e3a42]/15 dark:focus-within:ring-purple-500/25 transition-colors duration-200 group"
    >
      {icon && (
        <div className="pl-4 pr-3 flex items-center pointer-events-none text-slate-400 dark:text-purple-300/70 group-hover:text-purple-600 dark:group-hover:text-purple-300 group-focus-within:text-[#1e3a42] dark:group-focus-within:text-purple-300 transition-colors duration-150">
          {icon}
        </div>
      )}
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`w-full min-h-[46px] sm:min-h-[48px] py-3 sm:py-4 bg-transparent border-0 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 text-sm focus:outline-none focus:ring-0 ${
          rightElement ? "pr-11" : "pr-4"
        } ${!icon ? "pl-4" : ""}`}
      />
      {rightElement && (
        <div className="absolute right-2.5 flex items-center">
          {rightElement}
        </div>
      )}
    </motion.div>
  );
}
