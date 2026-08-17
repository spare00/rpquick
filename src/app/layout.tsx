import type { Metadata } from "next";
import { Fraunces, Noto_Sans_KR } from "next/font/google";
import { Header } from "@/components/Header";
import "./globals.css";

const noto = Noto_Sans_KR({
  variable: "--font-noto",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Best Property — 호주 급매·저평가 레이더",
  description:
    "호주 매물의 가격 하락과 지역·스펙 평균 대비 저평가를 추적해 급매 가능성이 높은 순으로 보여줍니다.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${noto.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col text-ink">
        <Header />
        <div className="flex-1">{children}</div>
        <footer className="border-t border-line px-6 py-8 text-sm text-muted">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>Best Property · 급매 레이더는 공개 매물 가격과 비교군을 바탕으로 한 참고 지표입니다.</p>
            <p>실매매 결정은 반드시 원문 매물 페이지와 현장 확인을 거치세요.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
