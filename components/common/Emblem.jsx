export default function Emblem({ className = "w-12 h-14" }) {
  return (
    <div className={`flex items-center justify-center shrink-0 ${className}`}>
      <svg
        aria-label="National Emblem of India"
        className="w-full h-full text-white/95"
        fill="currentColor"
        viewBox="0 0 120 140"
      >
        <path
          d="M60 4C56 4 48 10 44 14C40 18 42 24 38 27C34 30 28 32 28 38C28 44 34 47 36 53C38 59 34 65 37 70C40 75 48 76 52 82C56 88 56 94 60 94C64 94 64 88 68 82C72 76 80 75 83 70C86 65 82 59 84 53C86 47 92 44 92 38C92 32 86 30 82 27C78 24 80 18 76 14C72 10 64 4 60 4Z"
          opacity="0.9"
        />
        <path d="M46 32H74V48H46z" opacity="0.6" />
        <circle cx="60" cy="62" opacity="0.8" r="9" />
        <rect height="9" opacity="0.95" rx="2" width="70" x="25" y="98" />
        <circle cx="60" cy="115" fill="none" r="7" stroke="currentColor" strokeWidth="2" />
        <rect height="6" opacity="0.95" rx="2" width="84" x="18" y="125" />
      </svg>
    </div>
  );
}
