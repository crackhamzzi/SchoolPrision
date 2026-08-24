import type { Metadata } from "next";
import "./globals.css";

const title = "학교라는 이름의 감옥 | 완전판";
const description =
  "침묵이 질서가 된 교실에서 선택과 관계, 권력과 증거의 대가를 따라가는 학교폭력 심리 서스펜스.";
const siteUrl = "https://crackhamzzi.github.io/SchoolPrision/";
const socialImageUrl = `${siteUrl}og.png`;

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    url: siteUrl,
    locale: "ko_KR",
    siteName: "학교라는 이름의 감옥",
    images: [
      {
        url: socialImageUrl,
        width: 1745,
        height: 909,
        alt: "학교라는 이름의 감옥 — 침묵이 질서가 된 교실",
      },
    ],
  },
  twitter: { card: "summary_large_image", title, description, images: [socialImageUrl] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
