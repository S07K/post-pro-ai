"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@nextui-org/react";
import { SunIcon } from "../icons/SunIcon";
import { MoonIcon } from "../icons/MoonIcon";

export default function ThemeToggle({ className = "text-default-500" }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  // Avoid rendering theme-dependent UI before the client has hydrated (next-themes
  // can't know the persisted theme during SSR).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="w-10 h-10" />;
  }

  const isDark = theme === "dark";

  return (
    <Button
      isIconOnly
      variant="light"
      size="sm"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onPress={() => setTheme(isDark ? "light" : "dark")}
      className={className}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
}
