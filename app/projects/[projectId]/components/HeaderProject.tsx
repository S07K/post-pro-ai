import Header from "@/app/components/Header";
import { AddIcon } from "@/app/icons/AddIcon";
import axios from "axios";
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
} from "@nextui-org/react";
import React from "react";
import Image from "next/image";
import PostOption from "@/app/components/PostOption";
import { HeartIcon } from "@/app/icons/HeartIcon";
import { CommentIcon } from "@/app/icons/CommentIcon";
import { ShareIcon } from "@/app/icons/ShareIcon";

const HeaderProject: React.FC<any> = ({ project }: any) => {
  const initialPostValues = {
    prompt: "",
    caption: "",
  };
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [post, setPost] = React.useState<any>(initialPostValues);
  const [isImageCreated, setImageCreated] = React.useState(false);
  const [generatingImage, setGeneratingImage] = React.useState(false);
  const [imageURL, setImageURL] = React.useState("");
  const [isLoading, setLoading] = React.useState(false);
  const [onCaptionView, setOnCaptionView] = React.useState(false);
  const handleChange = (event: any) => {
    setPost({
      ...post,
      [event.target.name]: event.target.value,
    });
  };

  const saveImage = async (url: string) => {
    // const a = document.createElement("a");
    // document.body.appendChild(a);
    // a.href = url;
    // a.download = "image.png";
    // a.target = "_blank";
    // a.click();
    // document.body.removeChild(a);
  };

  const onSubmit = async () => {
    setLoading(true);
    setImageCreated(true);

    if (!post.prompt || !project?.openAIKey) {
      setLoading(false);
      setImageCreated(false);

      // toast.error("Please fill all the required fields");
      return;
    }
    await axios
      .post("/api/openai/post", { ...post, openAIKey: project?.openAIKey })
      .then((response) => {
        if (response?.data?.status === "success") {
          // onClose();
          // console.log("Post created successfully: ", response?.data);
          // setPost(initialPostValues);
          setImageURL(response?.data?.data?.url);
          saveImage(response?.data?.data?.url);
          setLoading(false);
          toast.success("Post created successfully");
          // setTimeout(() => {
          //   const projectId = response?.data?.project?._id;
          //   if (projectId) {
          //     window.location.href = `/projects/${projectId}`;
          //   }
          // }, 2000);
        } else {
          console.error("Error in creating project: ", response?.data?.message);
          setLoading(false);
          setImageCreated(false);

          toast.error("Error in creating project");
        }
      })
      .catch((error) => {
        console.error("Error in creating project: ", error);
        setLoading(false);
        setImageCreated(false);
        toast.error("Error in creating project");
      });
  };
  return (
    <Header>
      <Button
        onPress={onOpen}
        className="post-pro bg-default-50 text-md"
        endContent={<AddIcon />}
      >
        New post
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={() => {
          setPost(initialPostValues);
          setImageCreated(false);
          setGeneratingImage(false);
          setImageURL("");
        }}
        size="lg"
      >
        <ModalContent className="text-default-800">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create New Post
              </ModalHeader>
              <ModalBody>
                {isImageCreated ? (
                  <div className="flex flex-col gap-10 justify-center items-center">
                    <Card className="py-1 w-[300px]">
                      <CardBody className="overflow-visible py-2">
                        <Skeleton
                          isLoaded={
                            (imageURL ? true : false) && generatingImage
                          }
                          className="rounded-lg"
                        >
                          <Image
                            alt="Card background"
                            className="object-cover rounded-xl"
                            src={imageURL ? imageURL : MaskImage}
                            onLoad={() => setGeneratingImage(true)}
                            width={300}
                            height={200}
                          />
                        </Skeleton>
                      </CardBody>
                      <CardFooter className="flex flex-col items-start pt-0">
                        <div className="flex">
                          <PostOption icon={<HeartIcon />} count={0} />
                          <PostOption icon={<CommentIcon />} count={0} />
                          <PostOption icon={<ShareIcon />} count={0} />
                        </div>
                        {
                          onCaptionView ? 
                          <small
                            className={`text-default-500 webkit-box webkit-box-orient-vertical overflow-hidden`}
                          >
                            {post.caption}
                          </small> : <></>
                        }
                      </CardFooter>
                    </Card>
                    {
                      onCaptionView ? 
                      <Textarea
                        // validate={() => {
                        //   if (post.caption.length > 250) {
                        //     return "Caption should be less than 250 characters";
                        //   }
                        //   return 'Maximum characters allowed is 250';
                        // }}
                        max={250}
                        maxLength={250}
                        name="caption"
                        value={post.caption}
                        onChange={handleChange}
                        variant={"underlined"}
                        // label="Description"
                        description="Enter caption for your post."
                        labelPlacement="outside"
                        placeholder="Enter post caption"
                      /> : <></>
                    }
                  </div>
                ) : (
                  <Textarea
                    name="prompt"
                    value={post.prompt}
                    onChange={handleChange}
                    variant={"underlined"}
                    // label="Description"
                    description="Enter a promt for your post image."
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
                      setPost({
                        ...initialPostValues,
                        prompt: post.prompt,
                        caption: post.caption,
                      })
                      setImageCreated(false)
                      setImageURL('')
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
                      setPost(initialPostValues);
                      setImageCreated(false);
                      setGeneratingImage(false);
                      setImageURL("");
                      onClose();
                    }}
                  >
                    Cancel
                  </Button>
                )}
                {isImageCreated ? (
                  onCaptionView ?
                  <Button
                    className="post-pro bg-primary-500 text-default-50"
                    onPress={() => {
                      // Submitpost(false)
                    }}
                  >
                    Post
                  </Button> :
                  <Button
                    className="post-pro bg-primary-500 text-default-50"
                    onPress={() => {
                      setOnCaptionView(true)
                    }}
                  >
                    Write Caption
                  </Button>
                ) : (
                  <Button
                    className="post-pro bg-primary-500 text-default-50"
                    onPress={onSubmit}
                    isLoading={isLoading}
                    isDisabled={
                      post.prompt && post.prompt.length > 10 ? false : true
                    }
                    disabled={
                      post.prompt && post.prompt.length > 10 ? false : true
                    }
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
