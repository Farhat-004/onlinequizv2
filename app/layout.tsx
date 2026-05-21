import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "Online Quiz",
  description: "Developed to make your learning experience more enjoyable and effective.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <SessionProvider>
           <NavBar/>
        {children}
        </SessionProvider>
       </body>
    </html>
  );
}
