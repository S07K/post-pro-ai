"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@nextui-org/react";
import { Toaster } from "react-hot-toast";
import Sidebar, { Logo, SidebarNav, SidebarFooter } from "./Sidebar";
import { MenuIcon } from "../icons/MenuIcon";
import { CloseIcon } from "../icons/CloseIcon";

interface AppShellProps {
  title?: string;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export default function AppShell({ title, subtitle, actions, children }: AppShellProps) {
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Toaster />
      <Sidebar />

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 flex items-center justify-between px-4 py-3 border-b hairline bg-background/90 backdrop-blur">
        <Logo />
        <Button isIconOnly variant="light" aria-label="Open menu" onPress={() => setMobileNavOpen(true)}>
          <MenuIcon />
        </Button>
      </div>

      {/* Mobile nav overlay */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <>
            <motion.div
              className="md:hidden fixed inset-0 z-50 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileNavOpen(false)}
            />
            <motion.div
              className="md:hidden fixed inset-y-0 left-0 z-50 w-72 bg-content1 px-4 py-6 flex flex-col"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
            >
              <div className="flex items-center justify-between mb-8">
                <Logo />
                <Button isIconOnly variant="light" aria-label="Close menu" onPress={() => setMobileNavOpen(false)}>
                  <CloseIcon />
                </Button>
              </div>
              <SidebarNav onNavigate={() => setMobileNavOpen(false)} />
              <div className="flex-1" />
              <SidebarFooter />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 min-w-0 flex flex-col pt-16 md:pt-0">
        {(title || actions) && (
          <div className="flex items-center justify-between gap-4 flex-wrap px-4 md:px-10 pt-6 md:pt-10 pb-4">
            <div>
              {title ? <h1 className="font-display text-3xl md:text-4xl text-default-900">{title}</h1> : null}
              {subtitle ? <div className="text-default-500 pt-1 text-sm">{subtitle}</div> : null}
            </div>
            {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
          </div>
        )}
        <main className="flex-1 px-4 md:px-10 pb-16">{children}</main>
      </div>
    </div>
  );
}
