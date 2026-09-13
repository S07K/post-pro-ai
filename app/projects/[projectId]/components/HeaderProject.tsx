"use client";
import toast from "react-hot-toast";
import MaskImage from "@/app/assets/images/Mask_IMG.svg";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Textarea,
  Skeleton,
  Tabs,
  Tab,
} from "@nextui-org/react";
import React from "react";
import Image from "next/image";
import { PlusGlyph } from "@/app/components/HeaderDashBoard";
import { generatePostImage, createPost } from "@/lib/api/client";
import type { ProjectDTO } from "@/types";

const initialPostValues = { prompt: "", caption: "" };

const HeaderProject: React.FC<{ projectId: string; project: ProjectDTO | null; onPostCreated: () => void }> = ({
  projectId,
  project,
  onPostCreated,
}) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [post, setPost] = React.useState(initialPostValues);
  const [isImageCreated, setImageCreated] = React.useState(false);
  const [imageURL, setImageURL] = React.useState("");
  const [isLoading, setLoading] = React.useState(false);
  const [isPosting, setPosting] = React.useState(false);
  const [onCaptionView, setOnCaptionView] = React.useState(false);
  const [publishMode, setPublishMode] = React.useState<"now" | "schedule">("now");
  const [scheduledAt, setScheduledAt] = React.useState("");

  const resetForm = () => {
    setPost(initialPostValues);
    setImageCreated(false);
    setImageURL("");
    setOnCaptionView(false);
    setPublishMode("now");
    setScheduledAt("");
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPost({ ...post, [event.target.name]: event.target.value });
  };

  const submitPost = async () => {
    setPosting(true);
    try {
      const created = await createPost({
        projectId,
        image: imageURL,
        caption: post.caption,
        hashtags: "",
        scheduledAt: publishMode === "schedule" && scheduledAt ? new Date(scheduledAt).toISOString() : undefined,
      });
      onClose();
      resetForm();
      onPostCreated();
      if (created.status === "failed") {
        toast.error(created.failureReason || "Post saved but could not be published");
      } else if (created.status === "scheduled") {
        toast.success("Post scheduled successfully");
      } else {
        toast.success("Post uploaded successfully");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error in posting");
    } finally {
      setPosting(false);
    }
  };

  const onSubmit = async () => {
    if (!post.prompt || post.prompt.length <= 10) return;
    setLoading(true);
    setImageCreated(true);
    try {
      const url = await generatePostImage(post.prompt, projectId);
      setImageURL(url);
      toast.success("Image generated successfully");
    } catch (error) {
      setImageCreated(false);
      toast.error(error instanceof Error ? error.message : "Error generating image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onPress={onOpen} color="primary" className="font-semibold" startContent={<PlusGlyph />}>
        Create post
      </Button>
      <Modal backdrop="opaque" isOpen={isOpen} onOpenChange={onOpenChange} onClose={resetForm} size="lg" scrollBehavior="inside">
        <ModalContent className="text-default-800">
          {(onModalClose) => (
            <>
              <ModalHeader className="border-b border-divider text-[17px]">Create post</ModalHeader>
              <ModalBody className="gap-5 py-5">
                {isImageCreated ? (
                  <div className="flex flex-col gap-5">
                    <div className="mx-auto w-full max-w-[320px] overflow-hidden rounded-lg border border-divider bg-content1">
                      <Skeleton isLoaded={Boolean(imageURL)}>
                        <Image
                          alt="Generated post"
                          className="h-[220px] w-full object-cover"
                          src={imageURL || MaskImage}
                          width={320}
                          height={220}
                        />
                      </Skeleton>
                      {onCaptionView && post.caption ? (
                        <p className="whitespace-pre-line p-3 text-sm text-default-800">{post.caption}</p>
                      ) : null}
                    </div>
                    {onCaptionView ? (
                      <>
                        <Textarea
                          maxLength={project?.captionLimit || 2200}
                          name="caption"
                          value={post.caption}
                          onChange={handleChange}
                          variant="bordered"
                          label="Caption"
                          labelPlacement="outside"
                          placeholder="Write a caption for your post"
                          description={`Up to ${project?.captionLimit || 2200} characters.`}
                        />
                        <Tabs
                          selectedKey={publishMode}
                          onSelectionChange={(key) => setPublishMode(key as "now" | "schedule")}
                          fullWidth
                          color="primary"
                          aria-label="Publish options"
                        >
                          <Tab key="now" title="Publish now" />
                          <Tab key="schedule" title="Schedule for later" />
                        </Tabs>
                        {publishMode === "schedule" ? (
                          <label className="flex flex-col gap-1.5 text-sm font-medium text-default-800">
                            Date and time
                            <input
                              type="datetime-local"
                              className="w-full rounded-md border border-default-300 bg-transparent px-3 py-2 text-sm text-default-800 outline-none focus:border-primary-500"
                              min={new Date(Date.now() + 60_000).toISOString().slice(0, 16)}
                              value={scheduledAt}
                              onChange={(event) => setScheduledAt(event.target.value)}
                            />
                            <span className="text-xs font-normal text-default-500">
                              Scheduled posts are published once a day at 09:00 UTC, at the first run after this time.
                            </span>
                          </label>
                        ) : null}
                      </>
                    ) : null}
                  </div>
                ) : (
                  <Textarea
                    name="prompt"
                    value={post.prompt}
                    onChange={handleChange}
                    variant="bordered"
                    label="Image prompt"
                    labelPlacement="outside"
                    placeholder="Describe the image you want to generate"
                    description="Use at least 11 characters."
                  />
                )}
              </ModalBody>
              <ModalFooter className="border-t border-divider">
                {isImageCreated ? (
                  <Button
                    className="bg-default-200 font-semibold text-default-800"
                    onPress={() => {
                      setPost({ ...initialPostValues, prompt: post.prompt, caption: post.caption });
                      setImageCreated(false);
                      setImageURL("");
                    }}
                    isLoading={isLoading}
                  >
                    Regenerate
                  </Button>
                ) : (
                  <Button
                    className="bg-default-200 font-semibold text-default-800"
                    onPress={() => {
                      resetForm();
                      onModalClose();
                    }}
                  >
                    Cancel
                  </Button>
                )}
                {isImageCreated ? (
                  onCaptionView ? (
                    <Button
                      color="primary"
                      className="font-semibold"
                      onPress={submitPost}
                      isLoading={isPosting}
                      isDisabled={publishMode === "schedule" && !scheduledAt}
                    >
                      {publishMode === "schedule" ? "Schedule" : "Publish"}
                    </Button>
                  ) : (
                    <Button color="primary" className="font-semibold" onPress={() => setOnCaptionView(true)} isDisabled={!imageURL}>
                      Write caption
                    </Button>
                  )
                ) : (
                  <Button
                    color="primary"
                    className="font-semibold"
                    onPress={onSubmit}
                    isLoading={isLoading}
                    isDisabled={!post.prompt || post.prompt.length <= 10}
                  >
                    Generate
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default HeaderProject;
