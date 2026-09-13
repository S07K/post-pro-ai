"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import { useSession, signOut } from "next-auth/react";
import {
  Avatar,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@nextui-org/react";
import Sidebar from "./Sidebar";
import Logo from "./BrandMark";
import ThemeToggle from "./ThemeToggle";

interface AppShellProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export default function AppShell({ title, subtitle, breadcrumbs, actions, children }: AppShellProps) {
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const { data: session } = useSession();
  const email = session?.user?.email || "";

  return (
    <div className="min-h-screen bg-background">
      <Toaster toastOptions={{ style: { borderRadius: 8, fontSize: 14 } }} />

      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between gap-3 border-b border-divider bg-content1 px-2 md:px-4">
        <div className="flex min-w-0 items-center gap-1">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open navigation"
            className="grid h-9 w-9 place-items-center rounded-full text-default-600 hover:bg-default-100 md:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden>
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Logo />
          <Chip
            size="sm"
            radius="sm"
            variant="flat"
            color="warning"
            classNames={{ base: "ml-2 hidden h-5 sm:flex", content: "px-1 text-[11px] font-semibold text-warning-800" }}
          >
            BETA
          </Chip>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle className="text-default-600" />
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                as="button"
                size="sm"
                name={email}
                getInitials={(name) => name.charAt(0).toUpperCase()}
                classNames={{ base: "ml-1 cursor-pointer bg-primary-100 text-primary-700", name: "text-sm font-semibold" }}
                aria-label="Account menu"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Account actions" variant="flat">
              <DropdownSection showDivider aria-label="Profile">
                <DropdownItem key="profile" textValue="Signed in as" className="h-14 cursor-default gap-1">
                  <p className="text-xs text-default-500">Signed in as</p>
                  <p className="truncate text-sm font-semibold text-default-900">{email || "Loading..."}</p>
                </DropdownItem>
              </DropdownSection>
              <DropdownSection aria-label="Navigation">
                <DropdownItem key="projects" href="/projects">
                  Projects
                </DropdownItem>
                <DropdownItem key="insights" href="/#analytics">
                  Insights
                </DropdownItem>
                <DropdownItem key="logout" color="danger" className="text-danger" onPress={() => signOut({ callbackUrl: "/login" })}>
                  Log out
                </DropdownItem>
              </DropdownSection>
            </DropdownMenu>
          </Dropdown>
        </div>
      </header>

      <Sidebar isOpen={isMobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="pt-14 md:pl-60">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 py-6 md:px-8 md:py-8">
          {(title || actions) && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                {breadcrumbs && (
                  <nav aria-label="Breadcrumb" className="mb-1 flex items-center gap-1.5 text-[13px] text-default-600">
                    {breadcrumbs.map((crumb, index) => (
                      <React.Fragment key={index}>
                        {index > 0 && <span aria-hidden>/</span>}
                        {crumb.href ? (
                          <Link href={crumb.href} className="hover:text-primary-600 hover:underline">
                            {crumb.label}
                          </Link>
                        ) : (
                          <span className="truncate text-default-800">{crumb.label}</span>
                        )}
                      </React.Fragment>
                    ))}
                  </nav>
                )}
                {title ? <h1 className="truncate text-2xl font-bold text-default-900">{title}</h1> : null}
                {subtitle ? <div className="mt-1 text-[15px] text-default-600">{subtitle}</div> : null}
              </div>
              {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
            </div>
          )}
          <main className="flex flex-col gap-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
