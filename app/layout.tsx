import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/client/Header";
import Footer from "@/components/client/Footer";

export const metadata: Metadata = {
  title: "Weather Forecast",
  icons: {
    icon: "/static/images/weather-API-project-icon.svg"
  }
};

const now = new Date();

// 기상청 API 호출용, 20240902 형식
export const baseDate = now.toISOString().slice(0, 10).replace(/-/g, "");

// 기상청 API 업데이트 때매 30분 기준으로 베이스 시각 정함
const setBaseTime = `${String(now.getHours()).padStart(2, '0')}30`;
export const baseTime = now.getMinutes() < 30 ? String(Number(setBaseTime) - 100).padStart(4, '0') : setBaseTime;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-[#181818] overflow-x-auto select-none">
        <Header/>
        <section className="p-[4vw]">
          {children}
        </section>
        <Footer />
        </body>
    </html>
  );
}
