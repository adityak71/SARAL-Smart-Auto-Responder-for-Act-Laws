export default function AuthBackground({ children }) {
  return (
    <main
      className="min-h-[calc(100vh-5rem)] flex-1 w-full flex flex-col lg:flex-row items-center lg:items-stretch justify-start lg:justify-between relative bg-[#1c3a50] text-white antialiased overflow-x-hidden selection:bg-purple-500 selection:text-white"
    >
      {/* Always-dark auth panel on a flat ink ground */}
      {children}
    </main>
  );
}
