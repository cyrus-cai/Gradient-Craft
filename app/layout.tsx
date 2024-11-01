import "./globals.css";

import { AdScript } from "./components/adScript";
import { Analytics } from '@vercel/analytics/react';
import { GoogleAnalytics } from '@next/third-parties/google'
import Head from 'next/head';
import type { Metadata } from "next";
import Script from "next/script";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import localFont from "next/font/local";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: 'swap', // 优化字体加载
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.gcraft.site/'),
  title: {
    default: "Gradient Craft - Frontend Gradients Library - Tailwind css",
    template: "%s | Gradient Craft"
  },
  description: "Gradient Craft is a comprehensive gradients library for Frontend developers, offering beautiful and customizable gradient designs for modern web applications.",
  keywords: ["gradients", "gradient tailwind", "frontend", "tailwind", "tailwind css", "css", "design", "web development", "frontend", "UI design"],
  authors: [{ name: "Gradient Craft" }],
  creator: "Gradient Craft",
  publisher: "Gradient Craft",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.gcraft.site/',
    title: 'Gradient Craft the Frontend Gradients Library',
    description: 'Gradient Craft is an open-source and free gradient color library. It contains over 800 colors derived from classic designs and supports one-click property copying.',
    siteName: 'Gradient Craft',
    images: [
      {
        url: '/i1.png',
        width: 1200,
        height: 630,
        alt: 'Gradient Craft Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gradient Craft - Frontend Gradients Library',
    description: 'Open-source and free gradient library with 800+ colors & one-click use.',
    images: ['/i1.png'],
    creator: '@gradientcraft',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // verification: {
  //   google: '你的Google验证码',
  //   yandex: '你的Yandex验证码',
  //   yahoo: '你的Yahoo验证码',
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Toaster />
        <SpeedInsights />
        <Analytics />
        <GoogleAnalytics gaId="G-6NJG1481VQ" />
        {/* <Script
          src="https://vaugroar.com/act/files/tag.min.js?z=8416776"
          strategy="afterInteractive"
          data-cfasync="false"
        /> */}
        {/* <Script
          id="external-tracker"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
      (function(){
        const lastLoaded = localStorage.getItem('adScriptLastLoaded');
        const now = Date.now();

        // 检查是否在24小时内已经加载过
        if (lastLoaded && (now - parseInt(lastLoaded)) < 24 * 60 * 60 * 1000) {
          return;
        }

        // 更新最后加载时间
        localStorage.setItem('adScriptLastLoaded', now.toString());

        (function(d,z,s){
          s.src='https://'+d+'/400/'+z;
          try{
            (document.body||document.documentElement).appendChild(s)
          }catch(e){}
        })('vemtoutcheeg.com',8432530,document.createElement('script'));
      })();
    `
          }}
        /> */}
        {/* <AdScript /> */}
        {/* <Script
          id="external-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(d,z,s,c){
                s.src='//'+d+'/400/'+z;
                s.onerror=s.onload=E;
                function E(){c&&c();c=null}
                try{
                  (document.body||document.documentElement).appendChild(s)
                }catch(e){E()}
              })('rouwhapt.com',8420218,document.createElement('script'),_qietv)
            `
          }}
        /> */}
      </body>
    </html>
  );
}