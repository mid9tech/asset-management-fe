import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@styles/globals.css";
import { AuthProvider } from "@providers/auth";
import { LoadingProvider } from "@providers/loading";
import ApolloCustomProvider from "@providers/apollo";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AssetMaster",
  icons: {
    icon: [
      {
        url: "https://www.nashtechglobal.com/wp-content/uploads/2023/03/nashTech-logo-red.svg",
        sizes: "32x32"
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <LoadingProvider>
          <ApolloCustomProvider>
            <AuthProvider>{children}</AuthProvider>
          </ApolloCustomProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
