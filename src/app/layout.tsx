import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import { Header } from "@/components/Header";
import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-sans-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RP Quick — Australian distressed & undervalue radar",
  description:
    "Rank Australian listings by recent price cuts and how far they sit below similar local homes.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sourceSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col text-ink">
        <Header />
        <div className="flex-1">{children}</div>
        <footer className="border-t border-line px-6 py-8 text-sm text-muted">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>
              RP Quick ranks public asking prices and local comps as a research
              signal only.
            </p>
            <p>Always verify on the original listing and in person before you buy.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
