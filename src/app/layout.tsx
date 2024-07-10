import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@styles/globals.css";
import { AuthProvider } from "@providers/auth";
import { LoadingProvider } from "@providers/loading";
import ApolloCustomProvider from "@providers/apollo";
import "react-toastify/dist/ReactToastify.css";

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
