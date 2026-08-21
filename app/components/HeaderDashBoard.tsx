"use client";
import React from "react";
import { useDisclosure, Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { AddIcon } from "../icons/AddIcon";
import ProjectFormModal from "./ProjectFormModal";
import { createProject } from "@/lib/api/client";

export default function HeaderDashBoard() {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button onPress={onOpen} className="post-pro bg-primary-500 text-primary-50 font-mono" endContent={<AddIcon />}>
        New project
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
