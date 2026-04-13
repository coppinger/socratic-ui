import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { DitheredBackground } from "@/components/dithered-background";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://socraticui.com"),
  title: {
    default: "Socratic UI",
    template: "%s — Socratic UI",
  },
  description:
    "Structured input components for AI chat interfaces — low-friction elicitation patterns built on shadcn/ui.",
  openGraph: {
    url: "https://socraticui.com",
    siteName: "Socratic UI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@thecoppinger",
    creator: "@thecoppinger",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased overscroll-none`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          enableColorScheme
          disableTransitionOnChange
        >
          <DitheredBackground />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
