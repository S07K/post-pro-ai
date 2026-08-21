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
  useDisclosure,
} from "@nextui-org/react";
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

  return (
    <>
      <Table isStriped removeWrapper aria-label="Your projects">
        <TableHeader>
          <TableColumn>TITLE</TableColumn>
          <TableColumn>DESCRIPTION</TableColumn>
          <TableColumn>CAPTION LIMIT</TableColumn>
          <TableColumn>NO. OF POSTS</TableColumn>
          <TableColumn>HASHTAGS</TableColumn>
          <TableColumn align="center">ACTIONS</TableColumn>
        </TableHeader>
        <TableBody emptyContent="No projects yet." isLoading={isTableLoading}>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell>{project.title}</TableCell>
              <TableCell>{project.description}</TableCell>
              <TableCell>{project.captionLimit}</TableCell>
              <TableCell>{project.postLimit}</TableCell>
              <TableCell>
                <Chip
                  className={`capitalize post-pro ${project.hashtags ? "text-success-700 bg-success-100" : "text-danger-500 bg-danger-100"}`}
                  color={project.hashtags ? "success" : "danger"}
                  size="sm"
                  variant="flat"
                >
                  {project.hashtags ? "enabled" : "disabled"}
                </Chip>
              </TableCell>
              <TableCell align="center">
                <div className="relative flex justify-center items-center gap-2">
                  <Tooltip className="text-background bg-foreground" content="View project">
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      aria-label="View project"
                      onPress={() => router.push(`/projects/${project.id}`)}
                      className="text-lg text-default-400"
                    >
                      <EyeIcon />
                    </Button>
                  </Tooltip>
                  <Tooltip className="text-background bg-foreground" content="Edit project">
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      aria-label="Edit project"
                      onPress={() => {
                        setEditingProject(project);
                        onEditOpen();
                      }}
                      className="text-lg text-default-400"
                    >
                      <EditIcon />
                    </Button>
                  </Tooltip>
                  <Tooltip color="danger" className="post-pro bg-danger-500" content="Delete project">
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      aria-label="Delete project"
                      onPress={() => {
                        setDeletingProjectId(project.id);
                        onDeleteOpen();
                      }}
                      className="text-lg post-pro text-danger-500"
                    >
                      <DeleteIcon />
                    </Button>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ProjectFormModal
        isOpen={isEditOpen}
        onOpenChange={onEditOpenChange}
        project={editingProject}
        onSubmit={(values) => updateProject(editingProject!.id, values)}
        onSaved={loadProjects}
      />

      <Modal backdrop="blur" isOpen={isDeleteOpen} onOpenChange={onDeleteOpenChange} size="lg">
        <ModalContent className="text-default-800">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Delete Project</ModalHeader>
              <ModalBody>Are you sure? This will also delete all posts in this project.</ModalBody>
              <ModalFooter>
                <Button className="text-default-800 post-pro bg-primary-100" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button className="post-pro bg-danger-500 text-default-50" onPress={handleDelete} isLoading={isDeleting}>
                  Yes, delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
