import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "LoksewaHub - Nepal Government Exam Preparation",
    template: "%s | LoksewaHub",
  },
  description:
    "Nepal's most comprehensive platform for Loksewa, TSC, Banking, and all government exam preparation with AI-powered tools, notes, mock tests, and current affairs.",
  keywords: [
    "Loksewa",
    "PSC Nepal",
    "TSC Nepal",
    "Government exam Nepal",
    "Loksewa preparation",
    "Nepal exam platform",
  ],
  openGraph: {
    title: "LoksewaHub - Nepal Government Exam Preparation",
    description:
      "Nepal's most comprehensive platform for Loksewa, TSC, Banking, and all government exam preparation.",
    type: "website",
    locale: "en_US",
    siteName: "LoksewaHub",
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.webmanifest",
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "LoksewaHub",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased">
        <Providers>
          <Navbar />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
        </Providers>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
