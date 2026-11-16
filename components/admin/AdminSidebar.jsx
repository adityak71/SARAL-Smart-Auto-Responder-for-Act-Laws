"use client";

import { motion } from "framer-motion";

export const ADMIN_SECTIONS = [
  {
    category: null,
    items: [
      { id: "dashboard", label: "Dashboard", icon: "📊" },
    ],
  },
  {
    category: "USER MANAGEMENT",
    items: [
      { id: "users", label: "Users", icon: "👥" },
      { id: "identity-verification", label: "Identity Verification", icon: "🛡️" },
    ],
  },
  {
    category: "OFFICER MANAGEMENT",
    items: [
      { id: "all-officers", label: "All Officers", icon: "👔" },
      { id: "create-officer", label: "Create Officer", icon: "➕" },
    ],
  },
  {
    category: "RTI MANAGEMENT",
    items: [
      { id: "all-rtis", label: "All RTI Applications", icon: "📄" },
      { id: "departments", label: "Departments", icon: "🏛️" },
    ],
  },
  {
    category: "SUPPORT MANAGEMENT",
    items: [
      { id: "complaints", label: "Complaints & Support", icon: "💬" },
      { id: "notifications", label: "Notifications", icon: "🔔" },
      { id: "content-faqs", label: "Content & FAQs", icon: "📖" },
    ],
  },
  {
    category: "SYSTEM MANAGEMENT",
    items: [
      { id: "analytics", label: "Analytics & Reports", icon: "📈" },
      { id: "audit-logs", label: "Audit Logs", icon: "📜" },
      { id: "settings", label: "Settings", icon: "⚙️" },
    ],
  },
];

export default function AdminSidebar({ activeTab, onSelectTab, onLogout }) {
  return (
    <aside className="w-full lg:w-72 bg-black/90 dark:bg-[#070217] border border-white/10 rounded-3xl p-5 text-white flex flex-col justify-between shadow-2xl shrink-0">
      <div className="space-y-6">
        {/* Brand Header matching Screenshot 3 & 7 */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-lg">
              🏛️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white">SARAL</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Admin
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Administration Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation Categories */}
        <nav className="space-y-5 text-xs">
          {ADMIN_SECTIONS.map((section, idx) => (
            <div key={idx} className="space-y-1.5">
              {section.category && (
                <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400/80">
                  {section.category}
                </div>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onSelectTab(item.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition cursor-pointer text-left ${
                        isActive
                          ? "bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30"
                          : "text-slate-300 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span className="text-sm">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Logout Link matching Screenshot 3 */}
      <div className="pt-4 border-t border-white/10 mt-6">
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition cursor-pointer text-left"
        >
          <span className="text-sm">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
