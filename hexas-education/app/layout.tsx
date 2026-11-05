import type { Metadata } from "next";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { siteUrl } from "@/lib/content";
import "./globals.css";
import {getSiteContent} from "@/lib/site-content";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "HEXA’S Education Bangladesh | Learning that opens doors",
    template: "%s | HEXA’S Education Bangladesh",
  },
  description:
    "Explore HEXA’S Education Bangladesh: IELTS preparation, English language programs, branch information and documented institutional recognition.",
  openGraph: {
    type: "website",
    locale: "en_BD",
    siteName: "HEXA’S Education Bangladesh",
    images: [
      {
        url: "/media/british-council-award-ceremony.webp",
        width: 1920,
        height: 1280,
        alt: "HEXA’S at a British Council IELTS recognition ceremony",
      },
    ],
  },
  robots: process.env.NEXT_PUBLIC_SITE_URL
    ? { index: true, follow: true }
    : { index: false, follow: false },
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {courses}=await getSiteContent();
  return (
    <html lang="en-BD">
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Navigation courses={courses} />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
