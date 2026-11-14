export default function AuthBackground({ children }) {
  return (
    <main
      className="min-h-[calc(100vh-5rem)] flex-1 w-full flex flex-col lg:flex-row items-center lg:items-stretch justify-start lg:justify-between relative bg-gradient-to-br from-slate-100 via-purple-50/60 to-indigo-100/70 dark:bg-[#0b0521] text-slate-800 dark:text-slate-100 antialiased overflow-x-hidden selection:bg-purple-500 selection:text-white transition-colors"
    >
      {/* Light Mode: Atmospheric ambient colored glows */}
      <div className="absolute -top-24 right-[-5%] w-[650px] h-[650px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(147,51,234,0.18),transparent_65%)] blur-3xl pointer-events-none dark:hidden" />
      <div className="absolute top-1/3 -left-32 w-[550px] h-[550px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.15),transparent_65%)] blur-3xl pointer-events-none dark:hidden" />
      <div className="absolute -bottom-20 right-1/3 w-[500px] h-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.14),transparent_65%)] blur-3xl pointer-events-none dark:hidden" />

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
