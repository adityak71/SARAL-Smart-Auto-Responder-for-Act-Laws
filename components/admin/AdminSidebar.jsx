"use client";

import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Briefcase,
  UserPlus,
  FileText,
  Landmark,
  MessageSquare,
  Bell,
  BookOpen,
  BarChart3,
  History,
  Settings,
  LogOut,
} from "lucide-react";

export const ADMIN_SECTIONS = [
  {
    category: null,
    items: [
      { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
    ],
  },
  {
    category: "USER MANAGEMENT",
    items: [
      { id: "users", label: "Users", Icon: Users },
      { id: "identity-verification", label: "Identity Verification", Icon: ShieldCheck },
    ],
  },
  {
    category: "OFFICER MANAGEMENT",
    items: [
      { id: "all-officers", label: "All Officers", Icon: Briefcase },
      { id: "create-officer", label: "Create Officer", Icon: UserPlus },
    ],
  },
  {
    category: "RTI MANAGEMENT",
    items: [
      { id: "all-rtis", label: "All RTI Applications", Icon: FileText },
      { id: "departments", label: "Departments", Icon: Landmark },
    ],
  },
  {
    category: "SUPPORT MANAGEMENT",
    items: [
      { id: "complaints", label: "Complaints", Icon: MessageSquare },
      { id: "notifications", label: "Notifications", Icon: Bell },
      { id: "content-faqs", label: "Content & FAQs", Icon: BookOpen },
    ],
  },
  {
    category: "SYSTEM MANAGEMENT",
    items: [
      { id: "analytics", label: "Analytics", Icon: BarChart3 },
      { id: "audit-logs", label: "Audit Logs", Icon: History },
      { id: "settings", label: "Settings", Icon: Settings },
    ],
  },
];

export default function AdminSidebar({ activeTab, onSelectTab, onLogout }) {
  return (
    <aside className="w-full lg:w-72 bg-white dark:bg-[#070217] border border-slate-200 dark:border-white/10 rounded-3xl p-5 text-slate-800 dark:text-white flex flex-col justify-between shadow-sm dark:shadow-2xl shrink-0">
      <div className="space-y-6">
        {/* Brand Header matching Screenshot 3 & 7 */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 dark:bg-purple-600/30 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-300">
              <Landmark className="w-5 h-5 text-purple-600 dark:text-purple-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">SARAL</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30">
                  Admin
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Administration Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation Categories matching Screenshot 7 */}
        <nav className="space-y-4 text-xs">
          {ADMIN_SECTIONS.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {section.category && (
                <div className="px-3 pt-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {section.category}
                </div>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = activeTab === item.id;
                  const Icon = item.Icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onSelectTab(item.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition cursor-pointer text-left ${
                        isActive
                          ? "bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30"
                          : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400 dark:text-slate-400"}`} />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Logout Link matching Screenshot 3 & 7 */}
      <div className="pt-4 border-t border-slate-200 dark:border-white/10 mt-6">
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition cursor-pointer text-left"
        >
          <LogOut className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
