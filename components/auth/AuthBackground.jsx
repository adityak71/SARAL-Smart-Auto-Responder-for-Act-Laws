export default function AuthBackground({ children }) {
  return (
    <main
      className="min-h-[calc(100vh-5rem)] flex-1 w-full flex flex-col lg:flex-row items-center lg:items-stretch justify-start lg:justify-between relative bg-slate-50 dark:bg-[#0b0521] text-slate-800 dark:text-slate-100 antialiased overflow-x-hidden selection:bg-purple-500 selection:text-white transition-colors"
    >
      {/* Light mode ambient aura */}
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-100/60 via-indigo-50/40 to-slate-50 pointer-events-none dark:hidden" />

      {/* Dark mode atmospheric background image & overlay */}
      <div
        className="absolute inset-0 hidden dark:block pointer-events-none"
        style={{
          backgroundImage: 'url("/images/auth-bg.png")',
          backgroundPosition: "center top",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#0d062e",
        }}
      />
      <div
        className="absolute inset-0 hidden dark:block bg-gradient-to-tr from-[#0a0426]/90 via-[#100938]/40 to-transparent pointer-events-none"
        aria-hidden="true"
      />
      {children}
    </main>
  );
}
