import type { Metadata } from "next";
import { Chakra_Petch, Space_Mono, Fira_Code } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const chakraPetch = Chakra_Petch({
  weight: ["400", "500", "600", "700"],
  variable: "--font-press-start",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  variable: "--font-vt323",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NFT Mint",
  description: "Mint your NFT on Polygon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${chakraPetch.variable} ${spaceMono.variable} ${firaCode.variable} antialiased min-h-screen`}
        style={{ background: "#2BABA5" }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
