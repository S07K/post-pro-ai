"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./BrandMark";

export { default as Logo } from "./BrandMark";

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-5 w-5 shrink-0",
  "aria-hidden": true,
};

const HomeIcon = () => (
  <svg {...iconProps}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V21h5v-6h4v6h5V9.5" />
  </svg>
);

const ProjectsIcon = () => (
  <svg {...iconProps}>
    <path d="M3 6.5A1.5 1.5 0 0 1 4.5 5H9l2 2h8.5A1.5 1.5 0 0 1 21 8.5v10a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5v-12Z" />
  </svg>
);

const InsightsIcon = () => (
  <svg {...iconProps}>
    <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
  </svg>
);

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  isActive: (pathname: string) => boolean;
};

const NAV_GROUPS: { title?: string; items: NavItem[] }[] = [
  {
    items: [
      { label: "Home", href: "/", icon: <HomeIcon />, isActive: (p) => p === "/" || p.startsWith("/dashboard") },
      { label: "Projects", href: "/projects", icon: <ProjectsIcon />, isActive: (p) => p.startsWith("/projects") },
    ],
  },
  {
    title: "Tools",
    items: [{ label: "Insights", href: "/#analytics", icon: <InsightsIcon />, isActive: () => false }],
  },
];

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname() || "/";

  return (
    <nav aria-label="Main" className="flex h-full flex-col justify-between p-2">
      <div className="flex flex-col gap-4">
        {NAV_GROUPS.map((group, index) => (
          <div key={group.title || index} className="flex flex-col gap-0.5">
            {group.title && (
              <p className="px-3 pb-1 pt-2 text-[13px] font-semibold text-default-600">{group.title}</p>
            )}
            {group.items.map((item) => {
              const active = item.isActive(pathname);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={`flex h-10 items-center gap-3 rounded-md px-3 text-[15px] transition-colors ${
                    active ? "bg-primary-50 font-semibold text-primary-600" : "text-default-800 hover:bg-default-100"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </div>
      <div className="m-1 rounded-lg border border-divider bg-default-100 p-3">
        <p className="text-[13px] font-semibold text-default-900">PostProAI is in beta</p>
        <p className="mt-1 text-xs leading-relaxed text-default-600">Some features might not work properly yet.</p>
      </div>
    </nav>
  );
}

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <>
      <aside className="fixed bottom-0 left-0 top-14 z-30 hidden w-60 border-r border-divider bg-content1 md:block">
        <SidebarNav />
      </aside>
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <aside className="absolute bottom-0 left-0 top-0 flex w-72 max-w-[85vw] flex-col bg-content1 shadow-raised">
            <div className="flex h-14 items-center justify-between border-b border-divider px-3">
              <Logo />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close navigation"
                className="grid h-9 w-9 place-items-center rounded-full text-default-600 hover:bg-default-100"
              >
                <svg {...iconProps}>
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
            <div className="flex-1">
              <SidebarNav onNavigate={onClose} />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
