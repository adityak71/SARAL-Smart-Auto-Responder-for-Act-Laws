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
      className="relative flex items-center rounded-xl border border-slate-200/90 bg-slate-50/80 hover:bg-white hover:border-purple-400/90 hover:shadow-[0_4px_18px_-2px_rgba(124,58,237,0.16)] focus-within:bg-white focus-within:border-[#6d28d9] focus-within:ring-3 focus-within:ring-[#6d28d9]/15 focus-within:shadow-[0_4px_22px_-2px_rgba(109,40,217,0.22)] transition-all duration-200 group"
    >
      {icon && (
        <div className="pl-3.5 pr-2.5 flex items-center pointer-events-none text-slate-400 group-hover:text-purple-600 group-focus-within:text-[#6d28d9] transition-colors duration-150">
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
        className={`w-full min-h-[46px] sm:min-h-[48px] py-3 sm:py-3.5 bg-transparent border-0 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-0 ${
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
