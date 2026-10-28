export default function AuthBackground({ children }) {
  return (
    <main
      className="min-h-screen w-full flex flex-col lg:flex-row items-center lg:items-stretch justify-start lg:justify-between relative bg-[#0b0521] text-slate-100 antialiased overflow-x-hidden selection:bg-purple-500 selection:text-white"
      style={{
        backgroundImage: 'url("/images/auth-bg.png")',
        backgroundPosition: "center top",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#0d062e",
      }}
    >
      {/* Dynamic atmospheric radial gradient overlay for depth */}
      <div
        className="absolute inset-0 bg-linear-to-tr from-[#0a0426]/90 via-[#100938]/40 to-transparent pointer-events-none"
        aria-hidden="true"
      />
      {children}
    </main>
  );
}
