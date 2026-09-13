"use client";
import React from "react";
import Logo from "./BrandMark";
import ThemeToggle from "./ThemeToggle";

export default function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex h-14 items-center justify-between border-b border-divider bg-content1 px-4">
        <Logo href="/login" />
        <ThemeToggle className="text-default-600" />
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-[400px] rounded-lg bg-content1 shadow-raised">
          <div className="border-b border-divider px-6 py-4">
            <h1 className="text-2xl font-bold text-default-900">{title}</h1>
            {subtitle && <p className="mt-0.5 text-[15px] text-default-600">{subtitle}</p>}
          </div>
          <div className="p-6">{children}</div>
        </div>
      </main>
      <footer className="border-t border-divider bg-content1 py-4 text-center text-xs text-default-500">
        PostProAI for Business · Beta · © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
