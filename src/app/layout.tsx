import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@styles/globals.css";
import { AuthProvider } from "@providers/auth";
import Navbar from "@components/navbar";
import Sidebar from "@components/sidebar";
import { LoadingProvider } from "@providers/loading";
import ApolloCustomProvider from "@providers/apollo";

import { ToastContainer, toast } from "react-toastify";
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
          <AuthProvider>
            <ApolloCustomProvider>
              <Navbar />
              <div className="flex flex-grow justify-evenly items-start gap-10 px-10">
                <div className="w-1/5">
                  <Sidebar />
                </div>
                <div className="w-4/5">
                  <div className="mt-10">{children}</div>
                </div>
              </div>
            </ApolloCustomProvider>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </AuthProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
