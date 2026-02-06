import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Providers } from "@/components/layout/providers";
import { LivePreviewProvider } from "@/components/layout/live-preview-provider";
import { LyticsPersonalizeProvider } from "@/components/personalize/lytics-personalize-provider";
import { getLayoutData } from "@/lib/contentstack/services";

const dmSans = DM_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "RecipeHub - Discover & Share Delicious Recipes",
    template: "%s | RecipeHub",
  },
  description:
    "Discover and share delicious recipes from home cooks around the world. Join our community of food enthusiasts and find your next favorite dish.",
  keywords: ["recipes", "cooking", "food", "home cooking", "recipe sharing"],
  authors: [{ name: "RecipeHub" }],
  creator: "RecipeHub",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://recipehub.com",
    siteName: "RecipeHub",
    title: "RecipeHub - Discover & Share Delicious Recipes",
    description:
      "Discover and share delicious recipes from home cooks around the world.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "RecipeHub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RecipeHub - Discover & Share Delicious Recipes",
    description:
      "Discover and share delicious recipes from home cooks around the world.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Disable static page caching for live preview support
export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch header and footer data from Contentstack
  const { header, footer } = await getLayoutData();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${jetbrainsMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Providers>
          <LyticsPersonalizeProvider>
            <LivePreviewProvider>
              <Navbar header={header} />
              <main className="flex-1">{children}</main>
              <Footer footer={footer} />
            </LivePreviewProvider>
          </LyticsPersonalizeProvider>
        </Providers>
      </body>
    </html>
  );
}
