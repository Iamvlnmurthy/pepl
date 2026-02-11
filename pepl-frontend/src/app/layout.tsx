import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastProvider } from "@/components/ui/toast-provider";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PEPL HRMS | Command Center",
  description: "The next-generation AI-powered HR platform for PEPL Group.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <ToastProvider>
        <html lang="en" suppressHydrationWarning>
          <body
            suppressHydrationWarning
            className={`${plusJakartaSans.variable} ${outfit.variable} ${jetbrainsMono.variable} font-sans antialiased`}
          >
            {children}
          </body>
        </html>
      </ToastProvider>
    </ClerkProvider>
  );
}
