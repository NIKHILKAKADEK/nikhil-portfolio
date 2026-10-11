import type { Metadata, Viewport } from "next";
import { homeTitle, homeDescription } from "@/lib/seo";
import "@/styles/design-system.css";
import "./globals.css";
import "./portfolio.css";

export const metadata: Metadata = { title: homeTitle, description: homeDescription };

export const viewport: Viewport = {
  themeColor: "#F5F5F7",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try { var t = localStorage.getItem('portfolio-theme'); if (t !== 'light' && t !== 'dark') t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; document.documentElement.dataset.theme = t; document.documentElement.style.colorScheme = t; } catch (e) { var t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; document.documentElement.dataset.theme = t; document.documentElement.style.colorScheme = t; }` }} />
      </head>
      <body><a className="skip-link" href="#main-content">Skip to main content</a>{children}</body>
    </html>
  );
}
