import { ThemeProvider } from "@/components/theme-provider";
import { OpenPanelComponent } from "@openpanel/nextjs";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { karla, nanumMyeongjo } from "../lib/fonts";
import "./globals.css";
import { PHProvider } from "./providers";

const PostHogPageView = dynamic(() => import("./PostHogPageView"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "Dino - Architecting your web.",
  description:
    "Dino is a web agency that specializes in building custom websites and web applications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <PHProvider>
        <body
          className={`${nanumMyeongjo.variable} ${karla.variable}  antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <PostHogPageView />
            <OpenPanelComponent
              clientId="5dd02cb1-8de6-4ec1-9d42-a116d6471fd7"
              trackScreenViews={true}
            />
            {children}
          </ThemeProvider>
        </body>
      </PHProvider>
    </html>
  );
}
