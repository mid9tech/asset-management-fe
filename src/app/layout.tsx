import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@styles/globals.css";
import { AuthProvider } from "@providers/auth";
import Navbar from "@components/navbar";
import Sidebar from "@components/sidebar";
import { LoadingProvider } from "@providers/loading";
import ApolloCustomProvider from "@providers/apollo";

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
      <body>
        <LoadingProvider>
          <ApolloCustomProvider>
            <AuthProvider>
              <Navbar />
              <div className="grid grid-cols-10 gap-4">
                <div className="col-start-2 col-span-8">
                  <div className="grid sm:grid-cols-1 md:grid-cols-5 lg:grid-cols-5 gap-10">
                    <div>
                      <Sidebar />
                    </div>
                    <div className="col-span-4 p-5">
                      <div className="mt-20">{children}</div>
                    </div>
                  </div>
                </div>
              </div>
            </AuthProvider>
          </ApolloCustomProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
