"use client";
import React from "react";
import {
  Image,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import type { PostDTO } from "@/types";

const STATUS_LABEL: Record<PostDTO["status"], string> = {
  draft: "Draft",
  scheduled: "Scheduled",
  processing: "Processing",
  posted: "Posted",
  failed: "Failed",
};

const STATUS_COLOR: Record<PostDTO["status"], "default" | "primary" | "success" | "danger" | "warning"> = {
  draft: "default",
  scheduled: "primary",
  processing: "warning",
  posted: "success",
  failed: "danger",
};

export default function PostCard({ post, fullView, isClickable = true }: { post: PostDTO; fullView?: boolean; isClickable?: boolean }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const clickableProps = isClickable
    ? {
        role: "button",
        tabIndex: 0,
        onClick: onOpen,
        onKeyDown: (event: React.KeyboardEvent) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onOpen();
          }
        },
      }
    : {};

  return (
    <>
      <article
        {...clickableProps}
        className={`flex w-full flex-col overflow-hidden rounded-lg border border-divider bg-content1 text-left ${
          isClickable ? "cursor-pointer transition-shadow hover:shadow-raised focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500" : ""
        }`}
      >
        <Image
          removeWrapper
          radius="none"
          alt={post.caption || "Generated post image"}
          src={post.image}
          className={`w-full bg-default-100 object-cover ${fullView ? "max-h-[60vh]" : "h-[200px]"}`}
        />
        <div className="flex flex-col items-start gap-2 p-3">
          <Chip size="sm" radius="sm" color={STATUS_COLOR[post.status]} variant="flat" classNames={{ content: "font-semibold" }}>
            {STATUS_LABEL[post.status]}
          </Chip>
          {post.caption ? (
            <p className={`whitespace-pre-line text-sm leading-snug text-default-800 ${fullView ? "" : "line-clamp-2"}`}>{post.caption}</p>
          ) : null}
          {post.status === "failed" && post.failureReason ? (
            <p className="text-[13px] text-danger-600">{post.failureReason}</p>
          ) : null}
        </div>
      </article>
      {isClickable ? (
        <Modal backdrop="opaque" isOpen={isOpen} onOpenChange={onOpenChange} size="lg" scrollBehavior="inside">
          <ModalContent className="text-default-800">
            {(onClose) => (
              <>
                <ModalHeader className="border-b border-divider text-[17px]">Post preview</ModalHeader>
                <ModalBody className="py-4">
                  <PostCard post={post} fullView isClickable={false} />
                </ModalBody>
                <ModalFooter className="border-t border-divider">
                  <Button className="bg-default-200 font-semibold text-default-800" onPress={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      ) : null}
    </>
  );
}
