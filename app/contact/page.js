"use client";

import ContactForm from "@/components/contact/ContactForm";
import HelpdeskInfo from "@/components/contact/HelpdeskInfo";
import FaqAccordion from "@/components/contact/FaqAccordion";

export default function ContactPage() {
  return (
    <div className="flex-1 w-full bg-slate-50 dark:bg-[#0f1a1f] text-slate-800 dark:text-slate-100 flex flex-col antialiased transition-colors">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-10">
        {/* Main Grid: Form & Support Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
          <div className="lg:col-span-5 sticky top-24">
            <HelpdeskInfo />
          </div>
        </div>

        {/* Legal Knowledge Base & FAQs */}
        <FaqAccordion />
      </main>
    </div>
  );
}
