"use client";
import React, { useState } from "react";
import {
  Card,
  CardBody,
  Image,
  CardFooter,
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

  return (
    <div>
      <Card
        className="py-1 w-[300px]"
        isPressable={isClickable}
        onPress={isClickable ? onOpen : undefined}
      >
        <CardBody className="overflow-visible py-2 max-h-[300px]">
          <Image
            alt={post.caption || "Generated post image"}
            className="object-cover rounded-xl"
            src={post.image}
            width={!fullView ? 300 : "100%"}
            height={!fullView ? 200 : "auto"}
          />
        </CardBody>
        <CardFooter className="flex flex-col items-start gap-2 pt-0">
          <Chip size="sm" color={STATUS_COLOR[post.status]} variant="flat">
            {STATUS_LABEL[post.status]}
          </Chip>
          {post.caption ? (
            <small
              className={`text-default-800 webkit-box ${!fullView ? "webkit-line-clamp-2" : ""} webkit-box-orient-vertical overflow-hidden`}
            >
              {post.caption}
            </small>
          ) : null}
          {post.status === "failed" && post.failureReason ? (
            <small className="text-danger-500">{post.failureReason}</small>
          ) : null}
        </CardFooter>
      </Card>
      {isClickable ? (
        <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent className="text-default-800">
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">View post</ModalHeader>
                <ModalBody>
                  <div className="flex justify-center items-center">
                    <PostCard post={post} fullView isClickable={false} />
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button className="text-default-800 post-pro bg-primary-100" variant="light" onPress={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      ) : null}
    </div>
  );
}
