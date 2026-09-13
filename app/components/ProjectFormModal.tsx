"use client";
import React, { useEffect, useState } from "react";
import {
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Checkbox,
  Textarea,
} from "@nextui-org/react";
import toast from "react-hot-toast";
import type { ProjectDTO, CreateProjectInput } from "@/types";

interface ProjectFormValues {
  title: string;
  description: string;
  captionLimit: number;
  postLimit: number;
  hashtags: boolean;
}

const emptyValues: ProjectFormValues = {
  title: "",
  description: "",
  captionLimit: 100,
  postLimit: 10,
  hashtags: true,
};

interface ProjectFormModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  project?: ProjectDTO | null;
  onSaved: (project: ProjectDTO) => void;
  onSubmit: (values: CreateProjectInput) => Promise<ProjectDTO>;
}

export default function ProjectFormModal({ isOpen, onOpenChange, project, onSaved, onSubmit }: ProjectFormModalProps) {
  const isEdit = Boolean(project);
  const [values, setValues] = useState<ProjectFormValues>(emptyValues);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setValues(
        project
          ? {
              title: project.title,
              description: project.description,
              captionLimit: project.captionLimit,
              postLimit: project.postLimit,
              hashtags: project.hashtags,
            }
          : emptyValues
      );
    }
  }, [isOpen, project]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = event.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (event.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async () => {
    if (!values.title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    if (Number(values.captionLimit) < 1 || Number(values.postLimit) < 1) {
      toast.error("Please enter valid values for caption limit and post limit");
      return;
    }

    setIsSaving(true);
    try {
      const saved = await onSubmit({
        ...values,
        captionLimit: Number(values.captionLimit),
        postLimit: Number(values.postLimit),
      });
      toast.success(isEdit ? "Project updated successfully" : "Project created successfully");
      onSaved(saved);
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
      <ModalContent className="text-default-800">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{isEdit ? "Edit Project" : "Create New Project"}</ModalHeader>
            <ModalBody>
              <Input
                isRequired
                name="title"
                value={values.title}
                onChange={handleChange}
                type="text"
                variant="underlined"
                label="Choose a topic"
                description="Enter a topic you want to post on."
              />
              <Textarea
                name="description"
                value={values.description}
                onChange={handleChange}
                variant="underlined"
                description="Enter a description for your project."
                labelPlacement="outside"
                placeholder="Enter project description"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  name="captionLimit"
                  value={String(values.captionLimit)}
                  min={1}
                  max={2200}
                  onChange={handleChange}
                  type="number"
                  variant="underlined"
                  label="Caption Limit"
                  description="Enter a limit for your post caption."
                />
                <Input
                  name="postLimit"
                  value={String(values.postLimit)}
                  min={1}
                  max={1000}
                  onChange={handleChange}
                  type="number"
                  variant="underlined"
                  label="No. of post"
                  description="Enter how many post you want to generate."
                />
              </div>
              <Checkbox isSelected={values.hashtags} name="hashtags" onValueChange={(checked) => setValues((prev) => ({ ...prev, hashtags: checked }))}>
                Add hashtags?
              </Checkbox>
            </ModalBody>
            <ModalFooter>
              <Button className="text-default-800 post-pro bg-primary-100" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button className="post-pro bg-primary-500 text-default-50" onPress={handleSubmit} isLoading={isSaving}>
                Save
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
