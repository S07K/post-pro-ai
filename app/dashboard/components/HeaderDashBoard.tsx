"use client";
import React from "react";
import toast from "react-hot-toast";
import {
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
  Textarea,
} from "@nextui-org/react";
import Header from "../../components/Header"
// import { SearchIcon } from "./SearchIcon";
import { AddIcon } from "../../icons/AddIcon";
import axios from "axios";

export default function HeaderDashBoard() {
  const initialProjectValues = {
    title: "",
    description: "",
    captionLimit: '25',
    postLimit: '5',
    openAIKey: "",
    hashtags: true,
  };
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [project, setProject] = React.useState(initialProjectValues);
  const [isLoading, setLoading] = React.useState(false);

  const handleChange = (event: any) => {
    setProject({
      ...project,
      [event.target.name]: event.target.type != "checkbox" ? event.target.value : event.target.checked,
    });
  };

  const onSubmit = async () => {
    setLoading(true);
    if(Number(project.captionLimit) < 0 || Number(project.postLimit) < 1) {
      setLoading(false);
      toast.error("Please enter valid values for caption limit and post limit");
      return;
    }
    if(!project.title || !project.openAIKey) {
      setLoading(false);
      toast.error("Please fill all the required fields");
      return;
    }
    await axios
      .post("/api/openai/check_key", project)
      .then(async (response) => {
        if (response?.data?.status === "success") {
          await axios
            .post("/api/projects", project)
            .then((response) => {
              if (response?.data?.status === "success") {
                onClose();
                setProject(initialProjectValues);
                setLoading(false);
                toast.success("Project created successfully");
                setTimeout(() => {
                  const projectId = response?.data?.project?._id;
                  if(projectId) {
                    window.location.href = `/projects/${projectId}`;
                  }
                }, 2000);
              } else {
                console.error(
                  "Error in creating project: ",
                  response?.data?.message
                );
                setLoading(false);
                toast.error("Error in creating project");
              }
            })
            .catch((error) => {
              console.error("Error in creating project: ", error);
              setLoading(false);
              toast.error("Error in creating project");
            });
        } else {
          console.error("Error in check_key: ", response?.data?.message);
          setLoading(false);
          toast.error("Error in creating project");
        }
      })
      .catch((error) => {
        console.error("Error in check_key: ", error);
        setLoading(false);
        toast.error("Error in creating project");
      });
  };

  return (
    <>
      <Header>
        <Button
          onPress={onOpen}
          className="post-pro bg-default-50 text-md"
          endContent={<AddIcon />}
        >
          New
        </Button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
          <ModalContent className="text-default-800">
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Create New Project
                </ModalHeader>
                <ModalBody>
                  <Input
                    isRequired
                    name="title"
                    value={project.title}
                    onChange={handleChange}
                    type="text"
                    variant={"underlined"}
                    label="Choose a topic"
                    description="Enter a topic you want to post on."
                  />
                  <Textarea
                    name="description"
                    value={project.description}
                    onChange={handleChange}
                    variant={"underlined"}
                    // label="Description"
                    description="Enter a description for your project."
                    labelPlacement="outside"
                    placeholder="Enter project description"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      name="captionLimit"
                      value={project.captionLimit}
                      min={0}
                      max={250}
                      onChange={handleChange}
                      type="number"
                      variant={"underlined"}
                      label="Caption Limit"
                      description="Enter a limit for your post caption."
                    />
                    <Input
                      name="postLimit"
                      value={project.postLimit}
                      min={1}
                      max={10}
                      onChange={handleChange}
                      type="number"
                      variant={"underlined"}
                      label="No. of post"
                      description="Enter how many post you want to generate."
                    />
                  </div>
                  <Input
                    isRequired
                    name="openAIKey"
                    value={project.openAIKey}
                    onChange={handleChange}
                    type="text"
                    variant={"underlined"}
                    label="Openai api key"
                    description="Add your openai api key"
                  />
                  <Checkbox
                    checked={project.hashtags}
                    name="hashtags"
                    onChange={handleChange}
                    defaultSelected
                  >
                    Add hashtags?
                  </Checkbox>
                </ModalBody>
                <ModalFooter>
                  <Button
                    className="text-default-800 post-pro bg-primary-100"
                    variant="light"
                    onPress={() => {
                      setProject(initialProjectValues);
                      onClose();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="post-pro bg-primary-500 text-default-50"
                    onPress={onSubmit}
                    isLoading={isLoading}
                  >
                    Save
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </Header>
    </>
  );
}
