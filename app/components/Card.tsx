"use client";
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Image,
  CardFooter,
  Avatar,
  card,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import PostOption from "./PostOption";
import { HeartIcon } from "../icons/HeartIcon";
import { CommentIcon } from "../icons/CommentIcon";
import { ShareIcon } from "../icons/ShareIcon";

export default function PostCard({ cardDetails, fullView, isClickable = true }: { cardDetails: any; fullView?: boolean; isClickable?: boolean }) {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [isActive, setIsActive]: any = useState(null);

  const handleClick = () => {
    onOpen();
    setIsActive(<PostCard fullView={true} cardDetails={cardDetails} isClickable={false} />);
  };
  
  return (
    <div onClick={isClickable ? () => {handleClick()} : () => {}} className="hover:cursor-pointer">
      <Card className="py-1 w-[300px]">
        {/* <CardHeader className="pt-0 pb-1">
            <div className="flex gap-5">
              <Avatar
                isBordered
                radius="full"
                size="md"
                src="https://nextui.org/avatars/avatar-1.png"
              />
              <div className="flex flex-col gap-1 items-start justify-center">
                <h4 className="text-small font-semibold leading-none text-default-600">
                  Zoey Lang
                </h4>
                <h5 className="text-small tracking-tight text-default-400">
                  @zoeylang
                </h5>
              </div>
            </div>
          </CardHeader> */}
        <CardBody className="overflow-visible py-2">
          <Image
            alt="Card background"
            className="object-cover rounded-xl"
            src={cardDetails.image}
            width={300}
            height={200}
          />
        </CardBody>
        <CardFooter className="flex flex-col items-start pt-0">
          <div className="flex">
            <PostOption icon={<HeartIcon />} count={cardDetails.likes || 0} />
            <PostOption icon={<CommentIcon />} count={cardDetails.comments || 0} />
            <PostOption icon={<ShareIcon />} count={cardDetails.shares || 0} />
          </div>
          <small className={`text-default-800 webkit-box ${!fullView ? 'webkit-line-clamp-2' : ''} webkit-box-orient-vertical overflow-hidden`}>
            {cardDetails.caption}
          </small>
        </CardFooter>
      </Card>
      <Modal backdrop={"blur"} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent className="text-default-800">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                View post
              </ModalHeader>
              <ModalBody>
                <div className="flex justify-center items-center">
                  {isActive}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button className="text-default-800 post-pro bg-primary-100" variant="light" onPress={onClose}>
                  Close
                </Button>
                {/* <Button className="post-pro bg-primary-500 text-default-50" onPress={onClose}>
                  Edit
                </Button> */}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
