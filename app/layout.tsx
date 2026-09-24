import type { Metadata } from "next";
import "./globals.css";
import Terminal from "@/components/Terminal";

export const metadata: Metadata = {
  title: "Chaitanya Aggarwal — Full-Stack Developer & Creative Technologist",
  description:
    "Portfolio of Chaitanya Aggarwal, a Full-Stack Developer & Creative Technologist based in Jaipur, India. Engineering fast, immersive, and motion-driven digital products.",
  keywords: [
    "Chaitanya Aggarwal",
    "Full-Stack Developer",
    "Creative Technologist",
    "React",
    "Next.js",
    "Jaipur",
    "India",
    "Web Developer",
    "Portfolio",
  ],
  authors: [{ name: "Chaitanya Aggarwal" }],
  creator: "Chaitanya Aggarwal",
  openGraph: {
    title: "Chaitanya Aggarwal — Full-Stack Developer & Creative Technologist",
    description:
      "Engineering fast, immersive, and motion-driven digital products.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chaitanya Aggarwal — Full-Stack Developer",
    description: "Engineering fast, immersive, and motion-driven digital products.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wdth,wght@8..144,25..151,100..1000&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}<Terminal /></body>
    </html>
  );
}
