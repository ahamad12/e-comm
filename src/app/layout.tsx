import type { Metadata } from "next";
import { Lora } from "next/font/google";
import "./globals.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
const lora = Lora({
    subsets: ["latin"],
    variable: "--font-lora",
    weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title:{
    template: "%s | Flow Shop",
    absolute: "Flow Shop",
  },
  description: "Fullstack e-commerce app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${lora.className} antialiased`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
