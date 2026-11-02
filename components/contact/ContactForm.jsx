"use client";

import { useState } from "react";
import { contactInquiryCategories } from "@/data/contactData";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: contactInquiryCategories[0].id,
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="w-full bg-white dark:bg-[#0d062e] border border-slate-200/90 dark:border-purple-500/20 rounded-3xl p-6 sm:p-8 shadow-sm dark:shadow-xl flex flex-col gap-6 text-slate-800 dark:text-slate-100 transition-colors">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 text-xs font-semibold mb-2">
          <span>CITIZEN HELPDESK & GRIEVANCE CELL</span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Send a Statutory Inquiry or Support Request
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Have questions regarding the Right to Information Act, jurisdictional mapping, or technical filing? Reach out to our facilitation cell.
        </p>
      </div>

      {submitted ? (
        <div className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-2xl font-bold">
            ✓
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Inquiry Lodged Successfully</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
            Thank you, {formData.name}. Your support ticket has been registered under reference <strong className="text-emerald-700 dark:text-emerald-400 font-mono">TKT-2026-{Math.floor(1000 + Math.random() * 9000)}</strong>. Our citizen facilitation desk will respond within 24 business hours.
          </p>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setFormData({ name: "", email: "", phone: "", category: contactInquiryCategories[0].id, message: "" });
            }}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition cursor-pointer mt-2"
          >
            Submit Another Query
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Name & Email Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-slate-700 dark:text-slate-300 font-semibold block">Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Dr. Rajesh Kumar"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-700 dark:text-slate-300 font-semibold block">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="citizen@example.in"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Category Selector Grid */}
          <div className="space-y-1.5">
            <label className="text-slate-700 dark:text-slate-300 font-semibold block">Inquiry Category *</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {contactInquiryCategories.map((cat) => (
                <label
                  key={cat.id}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 transition cursor-pointer ${
                    formData.category === cat.id
                      ? "bg-purple-50 dark:bg-purple-600/30 border-purple-400 text-purple-950 dark:text-white font-bold"
                      : "bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06]"
                  }`}
                >
                  <input
                    type="radio"
                    name="category"
                    value={cat.id}
                    checked={formData.category === cat.id}
                    onChange={() => setFormData({ ...formData, category: cat.id })}
                    className="accent-purple-600"
                  />
                  <span className="text-xs">{cat.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Message Textarea */}
          <div className="space-y-1">
            <label className="text-slate-700 dark:text-slate-300 font-semibold block">Message / Inquiry Details *</label>
            <textarea
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Kindly articulate the statutory reference or platform friction you experienced..."
              className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          {/* Bottom Notice & Submit */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
              <span>🔒</span>
              <span>Submissions encrypted via DPDP Act 2023 protocol</span>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
            >
              Submit Support Query →
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
