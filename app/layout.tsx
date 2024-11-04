import type { Metadata } from "next";
import "@/app/globals.css";
import Script from "next/script";
import { Suspense } from 'react'

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
    params: { locale }
}: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    return (
        <html lang={locale}>
            <body>
                {/* Google Tag Manager (noscript) */}
                <noscript>
                    <iframe
                        src="https://www.googletagmanager.com/ns.html?id=GTM-TC5374Q6"
                        height="0"
                        width="0"
                        style={{ display: 'none', visibility: 'hidden' }}
                    ></iframe>
                </noscript>
                {/* End Google Tag Manager (noscript) */}

                <Suspense>
                    {children}
                </Suspense>

                {/* Google Analytics */}
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

                {/* Google Tag Manager */}
                <Script id="google-tag-manager" strategy="afterInteractive">
                    {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-TC5374Q6');
            `}
                </Script>
            </body>
        </html>
    );
}
