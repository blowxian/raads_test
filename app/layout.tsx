import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "@/app/globals.css";
import Script from "next/script";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "RAADS-R Assessment Report | Autism Evaluation Results",
    description: "Detailed RAADS-R assessment report providing insights into autism spectrum traits and recommendations for further steps. Ensure data privacy and get professional advice.",
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
        <body className="bg-gray-100">
        {children}
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
