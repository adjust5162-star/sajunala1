import type { Metadata } from "next";
import { APP_CONFIG } from "../lib/app/config";
import { getSiteUrl } from "../lib/app/siteUrl";
import "./globals.css";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${APP_CONFIG.name} | ${APP_CONFIG.tagline}`,
    template: `%s | ${APP_CONFIG.shortName}`,
  },
  description: APP_CONFIG.description,
  keywords: ["사주", "사주풀이", "명리학", "오행", "십신", "12신살", "대운", "세운"],
  openGraph: {
    title: APP_CONFIG.name,
    description: APP_CONFIG.description,
    url: siteUrl,
    siteName: APP_CONFIG.name,
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: APP_CONFIG.name,
    description: APP_CONFIG.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
