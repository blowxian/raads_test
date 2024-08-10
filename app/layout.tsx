import type {Metadata} from "next";
import "@/app/globals.css";
import Script from "next/script";
import {Suspense} from 'react'

export const metadata: Metadata = {
    title: "RAADs-R TEST",
    description: "The Ritvo Autism Asperger Diagnostic Scale-Revised (RAADS-R) is a tool used to assist the diagnosis of autism spectrum disorders in adults.",
    icons: {
        icon: '/raads_report/favicon-32x32.png',
        shortcut: '/raads_report/favicon.ico',
        apple: '/raads_report/apple-touch-icon.png',
    },
    manifest: '/raads_report/site.webmanifest',
};

export default async function LocaleLayout({
                                               children,
                                               params: {locale}
                                           }: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    return (
        <html lang={locale}>
        <body>
        <Suspense>
            {children}
        </Suspense>
        <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
            {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
        `}
        </Script>
        </body>
        </html>
    );
}
