import "./globals.css";
import { ReduxProvider } from "@/redux/provider";

export const metadata = {
  title: "RTI Portal - AI-Powered Right to Information",
  description: "Digital platform for citizens to file RTI applications, track status, and receive responses powered by AI assistance.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Newsreader:ital,opsz,wght@1,6..72,400;1,6..72,500;1,6..72,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#08031d] text-slate-100">
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
