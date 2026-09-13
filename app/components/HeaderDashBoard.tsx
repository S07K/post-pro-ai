"use client";
import React from "react";
import { useDisclosure, Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import ProjectFormModal from "./ProjectFormModal";
import { createProject } from "@/lib/api/client";

export function PlusGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export default function HeaderDashBoard() {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button onPress={onOpen} color="primary" className="font-semibold" startContent={<PlusGlyph />}>
        Create project
      </Button>
      <ProjectFormModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onSubmit={createProject}
        onSaved={(project) => router.push(`/projects/${project.id}`)}
      />
    </>
  );
}
