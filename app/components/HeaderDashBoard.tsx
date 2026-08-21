"use client";
import React from "react";
import { useDisclosure, Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import Header from "./Header";
import { AddIcon } from "../icons/AddIcon";
import ProjectFormModal from "./ProjectFormModal";
import { createProject } from "@/lib/api/client";

export default function HeaderDashBoard() {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <Header>
      <Button onPress={onOpen} className="post-pro bg-default-50 text-md" endContent={<AddIcon />}>
        New
      </Button>
      <ProjectFormModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onSubmit={createProject}
        onSaved={(project) => router.push(`/projects/${project.id}`)}
      />
    </Header>
  );
}
