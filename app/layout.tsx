import type { Metadata } from "next";
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
