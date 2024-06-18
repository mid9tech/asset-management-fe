import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@styles/globals.css";
import AppHeader from "@components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Asset Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppHeader/>
        {children}
        </body>
    </html>
  );
}
