"use client";
import { SessionProvider } from "next-auth/react";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider } from "next-themes";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <NextUIProvider>
        <ThemeProvider attribute="class" defaultTheme="light" value={{ light: "post-pro", dark: "post-pro-dark" }}>
          {children}
        </ThemeProvider>
      </NextUIProvider>
    </SessionProvider>
  );
}
