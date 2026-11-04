import type { Metadata } from "next";
import Footer from "@/components/Footer";
import "./globals.css";
import Header from "@/components/Layout/Header";
import { Poppins, Lato } from "next/font/google";
import FloatingIcon from "@/components/FloatingIcon";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
});

export const metadata: Metadata = {
  title: "Biotech International Limited | Bio-Pesticides, Bio-Fertilizers & Public Health",
  description:
    "Biotech International Ltd. is an ISO 9001:2008, 14001:2004, cGMP, GLP & IMO Certified company manufacturing bio-pesticides, bio-fertilizers, and public health biolarvicides.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${lato.variable}`}>
      <body className="overflow-x-hidden max-w-full">
        <Header />
        {children}
        <Footer />
        <FloatingIcon />
      </body>
    </html>
  );
}
