"use client";
import Header from "@/app/components/Header";
import { AddIcon } from "@/app/icons/AddIcon";
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
  Card,
  CardBody,
  CardFooter,
  Skeleton,
  Tabs,
  Tab,
} from "@nextui-org/react";
import React from "react";
import Image from "next/image";
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
    <Header>
      <Button onPress={onOpen} className="post-pro bg-default-50 text-md" endContent={<AddIcon />}>
        New post
      </Button>
      <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange} onClose={resetForm} size="lg">
        <ModalContent className="text-default-800">
          {(onModalClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Create New Post</ModalHeader>
              <ModalBody>
                {isImageCreated ? (
                  <div className="flex flex-col gap-10 justify-center items-center">
                    <Card className="py-1 w-[300px]">
                      <CardBody className="overflow-visible py-2">
                        <Skeleton isLoaded={Boolean(imageURL)} className="rounded-lg">
                          <Image
                            alt="Generated post"
                            className="object-cover rounded-xl"
                            src={imageURL || MaskImage}
                            width={300}
                            height={200}
                          />
                        </Skeleton>
                      </CardBody>
                      {onCaptionView ? (
                        <CardFooter className="flex flex-col items-start pt-0">
                          <small className="text-default-500 webkit-box webkit-box-orient-vertical overflow-hidden">{post.caption}</small>
                        </CardFooter>
                      ) : null}
                    </Card>
                    {onCaptionView ? (
                      <>
                        <Textarea
                          maxLength={project?.captionLimit || 2200}
                          name="caption"
                          value={post.caption}
                          onChange={handleChange}
                          variant="underlined"
                          description="Enter caption for your post."
                          labelPlacement="outside"
                          placeholder="Enter post caption"
                        />
                        <Tabs selectedKey={publishMode} onSelectionChange={(key) => setPublishMode(key as "now" | "schedule")} fullWidth>
                          <Tab key="now" title="Publish now" />
                          <Tab key="schedule" title="Schedule for later" />
                        </Tabs>
                        {publishMode === "schedule" ? (
                          <input
                            type="datetime-local"
                            className="w-full border-b border-default-300 bg-transparent py-2 text-default-800 outline-none"
                            min={new Date(Date.now() + 60_000).toISOString().slice(0, 16)}
                            value={scheduledAt}
                            onChange={(event) => setScheduledAt(event.target.value)}
                          />
                        ) : null}
                      </>
                    ) : null}
                  </div>
                ) : (
                  <Textarea
                    name="prompt"
                    value={post.prompt}
                    onChange={handleChange}
                    variant="underlined"
                    description="Enter a prompt for your post image."
                    labelPlacement="outside"
                    placeholder="Enter post prompt"
                  />
                )}
              </ModalBody>
              <ModalFooter>
                {isImageCreated ? (
                  <Button
                    className="text-default-800 post-pro bg-primary-100"
                    variant="light"
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
                    className="text-default-800 post-pro bg-primary-100"
                    variant="light"
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
                      className="post-pro bg-primary-500 text-default-50"
                      onPress={submitPost}
                      isLoading={isPosting}
                      isDisabled={publishMode === "schedule" && !scheduledAt}
                    >
                      {publishMode === "schedule" ? "Schedule" : "Post"}
                    </Button>
                  ) : (
                    <Button className="post-pro bg-primary-500 text-default-50" onPress={() => setOnCaptionView(true)} isDisabled={!imageURL}>
                      Write Caption
                    </Button>
                  )
                ) : (
                  <Button
                    className="post-pro bg-primary-500 text-default-50"
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
    </Header>
  );
};

export default HeaderProject;
