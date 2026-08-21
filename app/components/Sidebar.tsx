"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { HomeIcon } from "../icons/HomeIcon";
import { FolderIcon } from "../icons/FolderIcon";
import { LogoutIcon } from "../icons/LogoutIcon";
import ThemeToggle from "./ThemeToggle";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: HomeIcon },
  { href: "/projects", label: "Projects", icon: FolderIcon },
];

export function Logo() {
  return (
    <Link href="/" className="flex items-baseline gap-1.5">
      <span className="font-display italic text-2xl text-default-900">Post</span>
      <span className="font-display italic text-2xl text-primary-500">Pro</span>
      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 translate-y-[-6px]" aria-hidden />
    </Link>
  );
}

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive = href === "/" ? pathname === "/" || pathname.startsWith("/dashboard") : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={`post-pro flex items-center gap-3 px-3 py-2 rounded-large text-sm font-mono tracking-wide border-l-2 ${
              isActive
                ? "bg-primary-500/10 text-primary-600 border-primary-500"
                : "text-default-600 border-transparent hover:bg-default-100 hover:text-default-900"
            }`}
          >
            <Icon className="shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function SidebarFooter() {
  const { data: session } = useSession();
  const user = session?.user;
  return (
    <div className="flex flex-col gap-3 pt-4 border-t hairline">
      <div className="flex items-center justify-between gap-2">
        {user?.email ? (
          <p className="text-xs font-mono text-default-500 truncate" title={user.email}>
            {user.email}
          </p>
        ) : (
          <span />
        )}
        <ThemeToggle />
      </div>
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="post-pro flex items-center gap-2 px-3 py-2 rounded-large text-sm font-mono text-default-600 hover:bg-danger-500/10 hover:text-danger-600 text-left"
      >
        <LogoutIcon />
        Log out
      </button>
    </div>
  );
}

export default function Sidebar() {
  return (
    <aside className="hidden md:flex md:flex-col md:w-64 md:shrink-0 md:h-screen md:sticky md:top-0 border-r hairline px-4 py-6">
      <div className="mb-8">
        <Logo />
      </div>
      <SidebarNav />
      <div className="flex-1" />
      <SidebarFooter />
    </aside>
  );
}
