import type { Metadata, Viewport } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  display: "swap",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Marlowe — Optical Atelier",
  description:
    "Prescription eyewear, hand-finished in London. Five house frames, an interactive 3D atelier, a lens laboratory and a personal fitting guide.",
  keywords: [
    "eyewear",
    "prescription glasses",
    "frame selector",
    "optical atelier",
    "London optician",
  ],
  openGraph: {
    title: "Marlowe — Optical Atelier",
    description:
      "Five house frames, hand-finished in London. Explore them in three dimensions.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f3ede2",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${instrument.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
