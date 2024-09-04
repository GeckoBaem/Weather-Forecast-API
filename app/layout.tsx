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
