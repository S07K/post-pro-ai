"use client";
import React from "react";
import { motion } from "framer-motion";
import { Logo } from "./Sidebar";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

export { item as authCardItem };

export default function AuthCard({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section className="w-full min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full max-w-[420px] bg-content1 border hairline rounded-large p-8 shadow-lg"
      >
        <motion.div variants={item} className="mb-6">
          <Logo />
        </motion.div>
        <motion.p variants={item} className="font-mono text-xs tracking-[0.2em] uppercase text-primary-500 mb-2">
          {eyebrow}
        </motion.p>
        <motion.h1 variants={item} className="font-display text-2xl text-default-900 mb-6">
          {title}
        </motion.h1>
        {children}
      </motion.div>
    </section>
  );
}
