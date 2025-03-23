import type { Metadata } from "next";
import { Bebas_Neue, Montserrat } from "next/font/google";
import "./globals.css";
import { MorphicBackground, Navbar, GoogleReCaptchaProvider } from "./components";
import { Toaster } from "react-hot-toast";

import { Analytics } from "@vercel/analytics/react"

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas-neue",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Free Online Image Converter - JPG, PNG, GIF, BMP, TIFF, WEBP, HEIC",
  description: "Quickly convert images online for free with complete privacy. Supports JPG, PNG, GIF, BMP, TIFF, WEBP, and HEIC formats.",
  keywords: "image converter, JPG to PNG, HEIC to JPG, online image converter, free image conversion, privacy-focused",
  openGraph: {
    title: "Free Online Image Converter - JPG, PNG, GIF, BMP, TIFF, WEBP, HEIC",
    description: "Instantly convert images directly in your browser without uploading. Completely free and secure.",
    url: "https://www.anyfile.tech",
    images: [{ url: "https://www.anyfile.tech/og-image.jpg", width: 1200, height: 630 }],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Anyfile Image Converter",
              "description": "Free and secure client-side image converter for JPG, PNG, GIF, BMP, TIFF, WEBP, HEIC formats.",
              "applicationCategory": "MultimediaApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": ["USD", "EUR", "GBP", "INR"],
                "itemCondition": "https://schema.org/NewCondition",
                "availability": "https://schema.org/InStock",
                "url": "https://www.anyfile.tech",
              }
            }),
          }}
        />
        <link
          rel="preload"
          href="/magick.wasm"
          as="fetch"
          crossOrigin="anonymous"
        />
      </head>
      <html lang="en">
        <body
          suppressHydrationWarning={true}
          className={`${bebasNeue.variable} ${montserrat.variable} antialiased`}
        >
          <GoogleReCaptchaProvider>
            <Navbar />
            <MorphicBackground />
            <main className="pt-[110px]">
              {children}
            </main>
            <Toaster position="bottom-left" />
            <Analytics />
          </GoogleReCaptchaProvider>
        </body>
      </html>
    </>
  );
}
