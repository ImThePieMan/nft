import type { Metadata } from "next";
import { Press_Start_2P, VT323, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const pressStart2P = Press_Start_2P({
  weight: "400",
  variable: "--font-press-start",
  subsets: ["latin"],
});

const vt323 = VT323({
  weight: "400",
  variable: "--font-vt323",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
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
        className={`${pressStart2P.variable} ${vt323.variable} ${ibmPlexMono.variable} antialiased min-h-screen`}
        style={{ background: "#2BABA5" }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
