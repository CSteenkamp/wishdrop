import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "WishDrop - The Free Gift Registry for Every Occasion",
    template: "%s | WishDrop",
  },
  description: "Free online gift registry for birthdays, weddings, baby showers, and every occasion. Create wishlists, share with friends, and claim items to avoid duplicate gifts. No registration required!",
  keywords: "free gift registry, online wishlist, birthday gift registry, wedding registry free, baby shower registry, gift list, wishlist maker, gift claiming, no duplicate gifts",
  authors: [{ name: "WishDrop" }],
  creator: "WishDrop",
  metadataBase: new URL("https://wishdrop.wagnerway.co.za"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://wishdrop.wagnerway.co.za",
    siteName: "WishDrop",
    title: "WishDrop - The Free Gift Registry for Every Occasion",
    description: "Create gift registries for any occasion. Share your wishlist, friends claim items — no duplicate gifts, ever. Free and no registration required!",
    images: [{
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "WishDrop - The Free Gift Registry for Every Occasion",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "WishDrop - The Free Gift Registry for Every Occasion",
    description: "Create gift registries for any occasion. Share your wishlist, friends claim items — no duplicate gifts!",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://wishdrop.wagnerway.co.za",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎁</text></svg>" />
        <meta name="theme-color" content="#C9A96E" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="WishDrop" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className={`${inter.className} antialiased bg-white`}>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator && window.location.hostname !== 'localhost') {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
