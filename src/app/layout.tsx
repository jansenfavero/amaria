import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import { isIndexable, site } from "@/lib/site";
import { ADSENSE_CLIENT } from "@/lib/adsense";
import { AuthReturnBridge } from "@/components/auth/auth-return-bridge";
import { MembershipInvite } from "@/components/membership-invite";
import { AnalyticsTracker } from "@/components/analytics-tracker";
import { AccountProvider } from "@/components/auth/account-context";
import { getAccount } from "@/lib/auth/server";

const manrope = localFont({
  src: [
    {
      path: "../../node_modules/@fontsource/manrope/files/manrope-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource/manrope/files/manrope-latin-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource/manrope/files/manrope-latin-600-normal.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource/manrope/files/manrope-latin-700-normal.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-manrope",
  display: "swap",
  fallback: ["Arial"],
});

const cormorant = localFont({
  src: [
    {
      path: "../../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-italic.woff2",
      weight: "500",
      style: "italic",
    },
  ],
  variable: "--font-cormorant",
  display: "swap",
  fallback: ["Georgia"],
  adjustFontFallback: "Times New Roman",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: "%s | AMARIA" },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    title: site.title,
    description: site.description,
    url: "/",
    siteName: site.name,
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: site.title,
    description: site.description,
  },
  robots: { index: isIndexable, follow: isIndexable },
  other: { "google-adsense-account": ADSENSE_CLIENT },
  icons: {
    icon: [{ url: "/icon.png", sizes: "192x192", type: "image/png" }],
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fff7fb" },
    { media: "(prefers-color-scheme: dark)", color: "#1b0d22" },
  ],
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  let account = null;
  try {
    const current = await getAccount();
    account = current
      ? {
          email: current.email,
          displayName: current.displayName,
          role: current.role,
          active: current.active,
        }
      : null;
  } catch {
    // Public reading remains available if identity is momentarily unavailable.
  }

  return (
    <html
      lang="pt-BR"
      className={`${manrope.variable} ${cormorant.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('amaria:theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){}})()",
          }}
        />
      </head>
      <body>
        <a href="#conteudo-principal" className="skip-link">
          Pular para o conteúdo
        </a>
        <AccountProvider account={account}>
          {children}
          <AnalyticsTracker />
          <MembershipInvite />
        </AccountProvider>
        <Script
          id="google-adsense"
          async
          strategy="beforeInteractive"
          crossOrigin="anonymous"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
        />
        <AuthReturnBridge />
      </body>
    </html>
  );
}
