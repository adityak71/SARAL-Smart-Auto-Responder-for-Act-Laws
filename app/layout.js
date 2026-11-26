import "./globals.css";
import { ReduxProvider } from "@/redux/provider";
import Navbar from "@/components/common/Navbar";
import PwaRegistrar from "@/components/pwa/PwaRegistrar";

const appBaseUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

export const metadata = {
  ...(appBaseUrl ? { metadataBase: new URL(appBaseUrl) } : {}),
  title: "SARAL - File and Track RTI Applications Online",
  description: "Simplifying Right to Information with AI assistance for Indian citizens.",
  manifest: "/manifest.json?v=5",
  icons: {
    icon: [
      { url: "/icons/icon-512.png?v=5", sizes: "512x512", type: "image/png" },
      { url: "/icons/icon-192.png?v=5", sizes: "192x192", type: "image/png" },
      { url: "/favicon.ico?v=5" },
      { url: "/icons/icon.svg?v=5", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico?v=5",
    apple: [
      { url: "/icons/apple-touch-icon.png?v=5", sizes: "180x180", type: "image/png" },
      { url: "/icons/icon-512.png?v=5", sizes: "512x512", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SARAL RTI",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased">
      <head>
        <link rel="icon" type="image/png" sizes="512x512" href="/icons/icon-512.png?v=5" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192.png?v=5" />
        <link rel="icon" type="image/svg+xml" href="/icons/icon.svg?v=5" />
        <link rel="alternate icon" href="/favicon.ico?v=5" />
        <link rel="manifest" href="/manifest.json?v=5" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png?v=5" />
        <meta name="theme-color" content="#1e3a42" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const savedTheme = localStorage.getItem('saral-theme');
                if (savedTheme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}

              // Capture PWA install prompt globally as early as possible
              window.__saralInstallPrompt = null;
              window.addEventListener('beforeinstallprompt', function(e) {
                e.preventDefault();
                window.__saralInstallPrompt = e;
                window.dispatchEvent(new CustomEvent('saral:prompt-captured'));
              });
              window.addEventListener('appinstalled', function() {
                window.__saralInstallPrompt = null;
                window.dispatchEvent(new CustomEvent('saral:app-installed'));
              });
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400;1,8..60,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-slate-50 dark:bg-[#0f1a1f] text-slate-800 dark:text-slate-100 transition-colors"
      >
        <ReduxProvider>
          <PwaRegistrar />
          <Navbar />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
