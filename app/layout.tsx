import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-playfair",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Dr. Asir Mosaddeque Sakib | Boutique Dental Care",
  description: "Dental Clinic Appointment Management System & Boutique Dental Care",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Dr. Sakib Dental",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="bn"
      className={`${playfairDisplay.variable} ${plusJakartaSans.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans bg-[#F7F5F0] text-[#2C2A29] antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}