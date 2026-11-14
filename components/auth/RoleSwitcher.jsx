"use client";

import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedRole } from "@/redux/slices/authSlice";

export default function RoleSwitcher() {
  const dispatch = useDispatch();
  const selectedRole = useSelector((state) => state.auth.selectedRole);

  const roles = [
    { id: "citizen", label: "Citizen" },
    { id: "officer", label: "Officer" },
    { id: "admin", label: "Admin" },
  ];

  return (
    <div
      aria-label="User Category Switcher"
      className="p-1 rounded-full flex items-center justify-between mb-4 sm:mb-6 shadow-sm w-72 sm:w-80 bg-white/80 dark:bg-white/[0.08] border border-purple-200/80 dark:border-white/20 backdrop-blur-md relative"
      role="tablist"
    >
      {roles.map((role) => {
        const isActive = selectedRole === role.id;
        return (
          <button
            key={role.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => dispatch(setSelectedRole(role.id))}
            className={`relative flex-1 py-1.5 sm:py-2 px-3 sm:px-4 text-xs sm:text-[13px] rounded-full text-center transition-colors duration-200 focus:outline-none cursor-pointer select-none ${
              isActive
                ? "font-bold text-white"
                : "font-medium text-slate-600 dark:text-slate-300 hover:text-purple-700 dark:hover:text-white"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeRolePill"
                className="absolute inset-0 bg-purple-600 rounded-full shadow-md shadow-purple-600/30 -z-10"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <motion.span whileTap={{ scale: 0.95 }} className="block">
              {role.label}
            </motion.span>
          </button>
        );
      })}
    </div>
  );
}
