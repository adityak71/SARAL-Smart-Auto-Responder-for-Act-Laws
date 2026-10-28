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
  ];

  return (
    <div
      aria-label="User Category Switcher"
      className="glass-chip p-1 rounded-full flex items-center justify-between mb-6 shadow-inner w-60 border border-white/20 backdrop-blur-md relative"
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
            className={`relative flex-1 py-1.5 px-4 text-[13px] rounded-full text-center transition-colors duration-200 focus:outline-none cursor-pointer select-none ${
              isActive ? "font-semibold text-slate-900" : "font-medium text-slate-300 hover:text-white"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeRolePill"
                className="absolute inset-0 bg-white rounded-full shadow-sm -z-10"
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
