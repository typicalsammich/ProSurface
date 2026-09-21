import type { Metadata } from "next";
import { business, siteUrl, structuredData } from "@/lib/site-config";
import "./globals.css";
export const metadata: Metadata = {
  title: business.title, description: business.description,
  applicationName: business.name,
  ...(siteUrl ? { metadataBase: new URL(siteUrl), alternates: { canonical: "/" } } : {}),
  robots: { index: !!siteUrl, follow: true, googleBot: { index: !!siteUrl, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  openGraph: { title: business.title, description: business.description, siteName: business.name, locale: "en_US", type: "website", ...(siteUrl ? { url: siteUrl, images: [{ url: `${siteUrl}/images/blue-court.jpg`, width: 590, height: 332, alt: "ProSurface basketball and pickleball court" }] } : {}) },
  twitter: { card: "summary_large_image", title: business.title, description: business.description, ...(siteUrl ? { images: [`${siteUrl}/images/blue-court.jpg`] } : {}) },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en-US"><body><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData).replace(/</g,"\\u003c")}}/>{children}</body></html>}
