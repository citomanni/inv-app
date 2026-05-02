import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { Montserrat, Roboto, Roboto_Slab, Vidaloka } from "next/font/google";
import { Inter } from "next/font/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});


// Font definitions
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-roboto-slab",
  display: "swap",
});

const vidaloka = Vidaloka({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-vidaloka",
  display: "swap",
});

// Export font variables for layout use
export const metadata: Metadata = {
  title: {
    default: "Cardone Capital",
    template: "%s - Cardone Capital",
  },
  description:
    "Cardone Capital offers accredited and non-accredited investors access to institutional-grade real estate opportunities. Over $5.3B in assets under management and $438M+ paid to investors.",
  metadataBase: new URL("https://саrdоnecapitаl.com"),
  openGraph: {
    title: "Cardone Capital",
    description:
      "Invest alongside Grant Cardone in cash-flowing multifamily real estate. $5.3B AUM and 19,000+ investors strong.",
    url: "https://саrdоnecapitаl.com",
    siteName: "Cardone Capital",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Cardone Capital",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cardone Capital",
    description:
      "Grant Cardone's real estate platform for cash-flowing investments. Earn passive income, preserve wealth, build your legacy.",
    images: ["/opengraph-image.png"],
  },
  keywords: [
    "Cardone Capital",
    "Grant Cardone",
    "Real Estate Investment",
    "Passive Income",
    "Multifamily Real Estate",
    "Institutional Real Estate",
    "Cash Flow",
    "Bitcoin Real Estate",
    "401k IRA Real Estate",
    "Non-Accredited Investment",
    "Grant Cardone Real Estate",
    "Cardone Fund",
    "AUM Real Estate Portfolio",
    "10X Investing",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${roboto.variable} ${robotoSlab.variable} ${vidaloka.variable}`}>
      <head>
        <link
          href="https://cdn.materialdesignicons.com/7.2.96/css/materialdesignicons.min.css"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} antialiased bg-background`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
