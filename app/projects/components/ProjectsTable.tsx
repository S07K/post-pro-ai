"use client";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
  Skeleton,
  useDisclosure,
} from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { EyeIcon } from "@/app/icons/EyeIcon";
import { EditIcon } from "@/app/icons/EditIcon";
import { DeleteIcon } from "@/app/icons/DeleteIcon";
import ProjectFormModal from "@/app/components/ProjectFormModal";
import { getProjects, updateProject, deleteProject as deleteProjectRequest } from "@/lib/api/client";
import type { ProjectDTO } from "@/types";

export default function ProjectsTable() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectDTO[]>([]);
  const [isTableLoading, setTableLoading] = useState(true);

  const loadProjects = () => {
    setTableLoading(true);
    getProjects()
      .then(setProjects)
      .catch(() => toast.error("Failed to load projects"))
      .finally(() => setTableLoading(false));
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteOpenChange, onClose: onDeleteClose } = useDisclosure();
  const [editingProject, setEditingProject] = useState<ProjectDTO | null>(null);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deletingProjectId) return;
    setIsDeleting(true);
    try {
      await deleteProjectRequest(deletingProjectId);
      toast.success("Project deleted successfully");
      onDeleteClose();
      loadProjects();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete project");
    } finally {
      setIsDeleting(false);
      setDeletingProjectId(null);
    }
  };

  const openEdit = (project: ProjectDTO) => {
    setEditingProject(project);
    onEditOpen();
  };

  const openDelete = (projectId: string) => {
    setDeletingProjectId(projectId);
    onDeleteOpen();
  };

  const actions = (project: ProjectDTO) => (
    <div className="relative flex items-center justify-center gap-1">
      <Tooltip className="bg-foreground text-background" content="View project">
        <Button
          isIconOnly
          variant="light"
          size="sm"
          aria-label="View project"
          onPress={() => router.push(`/projects/${project.id}`)}
          className="text-lg text-default-600"
        >
          <EyeIcon />
        </Button>
      </Tooltip>
      <Tooltip className="bg-foreground text-background" content="Edit project">
        <Button isIconOnly variant="light" size="sm" aria-label="Edit project" onPress={() => openEdit(project)} className="text-lg text-default-600">
          <EditIcon />
        </Button>
      </Tooltip>
      <Tooltip className="bg-foreground text-background" content="Delete project">
        <Button
          isIconOnly
          variant="light"
          color="danger"
          size="sm"
          aria-label="Delete project"
          onPress={() => openDelete(project.id)}
          className="text-lg"
        >
          <DeleteIcon />
        </Button>
      </Tooltip>
    </div>
  );

  const hashtagsChip = (project: ProjectDTO) => (
    <Chip color={project.hashtags ? "success" : "default"} size="sm" radius="sm" variant="flat" classNames={{ content: "font-semibold" }}>
      {project.hashtags ? "Enabled" : "Disabled"}
    </Chip>
  );

  const emptyState = (
    <div className="px-6 py-10 text-center">
      <p className="text-[15px] font-semibold text-default-900">No projects yet</p>
      <p className="mt-1 text-sm text-default-600">Use Create project to add your first one.</p>
    </div>
  );

  if (isTableLoading) {
    return (
      <div className="flex flex-col gap-3 rounded-lg border border-divider bg-content1 p-4 shadow-card">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-md" />
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Card list on small screens */}
      <div className="flex flex-col gap-3 md:hidden">
        {projects.length === 0 ? (
          <div className="rounded-lg border border-divider bg-content1">{emptyState}</div>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="flex flex-col gap-3 rounded-lg border border-divider bg-content1 p-4 shadow-card">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <Link href={`/projects/${project.id}`} className="font-semibold text-primary-600 hover:underline">
                    {project.title}
                  </Link>
                  {project.description ? <p className="mt-0.5 text-sm text-default-600">{project.description}</p> : null}
                </div>
                {hashtagsChip(project)}
              </div>
              <div className="flex items-center justify-between border-t border-divider pt-2 text-[13px] text-default-600">
                <span>Caption limit: {project.captionLimit}</span>
                <span>Posts: {project.postLimit}</span>
                {actions(project)}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Table on md+ */}
      <div className="hidden overflow-x-auto rounded-lg border border-divider bg-content1 p-4 shadow-card md:block">
        <Table
          removeWrapper
          aria-label="Your projects"
          classNames={{
            th: "bg-default-100 text-xs font-semibold uppercase tracking-wide text-default-600",
            td: "border-b border-divider py-3 text-sm text-default-800",
            tr: "transition-colors hover:bg-default-100",
          }}
        >
          <TableHeader>
            <TableColumn>Title</TableColumn>
            <TableColumn>Description</TableColumn>
            <TableColumn>Caption limit</TableColumn>
            <TableColumn>No. of posts</TableColumn>
            <TableColumn>Hashtags</TableColumn>
            <TableColumn align="center">Actions</TableColumn>
          </TableHeader>
          <TableBody emptyContent={emptyState}>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>
                  <Link href={`/projects/${project.id}`} className="font-semibold text-primary-600 hover:underline">
                    {project.title}
                  </Link>
                </TableCell>
                <TableCell>
                  <p className="max-w-[320px] truncate text-default-600">{project.description || "—"}</p>
                </TableCell>
                <TableCell>{project.captionLimit}</TableCell>
                <TableCell>{project.postLimit}</TableCell>
                <TableCell>{hashtagsChip(project)}</TableCell>
                <TableCell align="center">{actions(project)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ProjectFormModal
        isOpen={isEditOpen}
        onOpenChange={onEditOpenChange}
        project={editingProject}
        onSubmit={(values) => updateProject(editingProject!.id, values)}
        onSaved={loadProjects}
      />

      <Modal backdrop="opaque" isOpen={isDeleteOpen} onOpenChange={onDeleteOpenChange} size="md">
        <ModalContent className="text-default-800">
          {(onClose) => (
            <>
              <ModalHeader className="border-b border-divider text-[17px]">Delete project?</ModalHeader>
              <ModalBody className="py-4 text-[15px] text-default-700">
                This will permanently delete the project and all of its posts. This can&apos;t be undone.
              </ModalBody>
              <ModalFooter className="border-t border-divider">
                <Button className="bg-default-200 font-semibold text-default-800" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="danger" className="font-semibold" onPress={handleDelete} isLoading={isDeleting}>
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
