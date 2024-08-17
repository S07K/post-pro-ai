import React from "react";
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
  Input,
  Textarea,
  Checkbox,
  useDisclosure,
} from "@nextui-org/react";
import axios from "axios";
import toast from "react-hot-toast";
import { EyeIcon } from "@/app/icons/EyeIcon";
import { EditIcon } from "@/app/icons/EditIcon";
import { DeleteIcon } from "@/app/icons/DeleteIcon";

export default function ProjectsTable() {
  const [projects, setProjects] = React.useState([]);
  const [isTableLoading, setTableLoading] = React.useState(false);
  React.useEffect(() => {
    setTableLoading(true);
    axios
      .get("/api/projects")
      .then((response) => {
        // console.log("response.data: ", response.data);
        setProjects(response.data);
        setTableLoading(false);
      })
      .catch((error) => {
        setTableLoading(false);
        console.error("Error calling get all project api: ", error);
        toast.error("Error calling get all project api");
      });
  }, []);

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onOpenChange: onDeleteModalOpenChange, onClose: onDeleteModalClose } = useDisclosure();
  const [editProject, setEditProject]: any = React.useState({
    title: "",
    description: "",
    captionLimit: 0,
    postLimit: 0,
    openAIKey: "",
    hashtags: false,
  });
  const [isLoading, setLoading] = React.useState(false);
  const [deleteProject, setDeleteProject]: any = React.useState({});

  async function fetchProject(projectId: string) {
    await axios
      .get(`/api/projects/${projectId}`)
      .then((response) => {
        // console.log(response.data);
        if (response.data) {
          setEditProject(response.data);
          // toast.success("Project fetched successfully");
        } else {
          toast.error("No project found");
          window.location.href = "/projects";
        }
      })
      .catch(() => {
        toast.error("Error in fetching project");
      });
  }

  async function onDelete() {
    await axios
      .delete(`/api/projects/${deleteProject}`)
      .then((response) => {
        // console.log(response.data);
        if (response?.data?.status === "success") {
          onDeleteModalClose();
          setLoading(false);
          toast.success("Project deleted successfully");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          console.error("Error in deleting project: ", response?.data?.message);
          setLoading(false);
          toast.error("Error in deleting project");
        }
      })
      .catch(() => {
        toast.error("Error in fetching project");
      });
  }

  const handleChange = (event: any) => {
    setEditProject({
      ...editProject,
      [event.target.name]:
        event.target.type != "checkbox"
          ? event.target.value
          : event.target.checked,
    });
  };

  const onSubmit = async () => {
    setLoading(true);
    if (
      Number(editProject.captionLimit) < 0 ||
      Number(editProject.postLimit) < 1
    ) {
      setLoading(false);
      toast.error("Please enter valid values for caption limit and post limit");
      return;
    }
    if (!editProject.title || !editProject.openAIKey) {
      setLoading(false);
      toast.error("Please fill all the required fields");
      return;
    }
    await axios
      .put(`/api/projects/${editProject._id}`, editProject)
      .then((response) => {
        if (response?.data?.status === "success") {
          onClose();
          setLoading(false);
          toast.success("Project updated successfully");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          console.error("Error in updating project: ", response?.data?.message);
          setLoading(false);
          toast.error("Error in updating project");
        }
      })
      .catch((error) => {
        console.error("Error in updating project: ", error);
        setLoading(false);
        toast.error("Error in updating project");
      });
  };

  return (
    <>
      <Table
        isStriped
        removeWrapper
        aria-label="Example static collection table"
      >
        <TableHeader>
          <TableColumn>TITLE</TableColumn>
          <TableColumn>DESCRIPTION</TableColumn>
          <TableColumn>CAPTION LIMIT</TableColumn>
          <TableColumn>NO. OF POSTS</TableColumn>
          <TableColumn>HASHTAGS</TableColumn>
          <TableColumn align="center">ACTIONS</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={"No rows to display."}
          isLoading={isTableLoading}
        >
          {projects.map((project: any, index: number) => (
            <TableRow
              key={project._id}
              className="hover:cursor-pointer"
              // href={`/projects/${project._id}`}
            >
              <TableCell>{project.title}</TableCell>
              <TableCell>{project.description}</TableCell>
              <TableCell>{project.captionLimit}</TableCell>
              <TableCell>{project.postLimit}</TableCell>
              <TableCell>
                <Chip
                  className={`capitalize post-pro ${
                    project.hashtags
                      ? "text-success-700 bg-success-100"
                      : "text-danger-500 bg-danger-100"
                  }`}
                  color={project.hashtags ? "success" : "danger"}
                  size="sm"
                  variant="flat"
                >
                  {project.hashtags ? "enabled" : "disabled"}
                </Chip>
              </TableCell>
              <TableCell align="center">
                <div className="relative flex justify-center items-center gap-2">
                  <Tooltip
                    className="text-background bg-foreground"
                    content="View project"
                  >
                    <span
                      onClick={() => {
                        window.location.href = `/projects/${project._id}`;
                      }}
                      className="text-lg text-default-400 cursor-pointer active:opacity-50"
                    >
                      <EyeIcon />
                    </span>
                  </Tooltip>
                  <Tooltip
                    className="text-background bg-foreground"
                    content="Edit project"
                  >
                    <span
                      onClick={(e) => {
                        onOpen();
                        fetchProject(project._id);
                      }}
                      className="text-lg text-default-400 cursor-pointer active:opacity-50"
                    >
                      <EditIcon />
                    </span>
                  </Tooltip>
                  <Tooltip color="danger" className="post-pro bg-danger-500" content="Delete project">
                    <span
                      onClick={(e) => {
                        onDeleteModalOpen();
                        setDeleteProject(project._id);
                      }}
                      className="text-lg post-pro text-danger-500 cursor-pointer active:opacity-50"
                    >
                      <DeleteIcon />
                    </span>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Modal backdrop={"blur"} isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
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
                  value={editProject.title}
                  onChange={handleChange}
                  type="text"
                  variant={"underlined"}
                  label="Choose a topic"
                  description="Enter a topic you want to post on."
                />
                <Textarea
                  name="description"
                  value={editProject.description}
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
                    value={editProject.captionLimit}
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
                    value={editProject.postLimit}
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
                  value={editProject.openAIKey}
                  onChange={handleChange}
                  type="text"
                  variant={"underlined"}
                  label="Openai api key"
                  description="Add your openai api key"
                />
                <Checkbox
                  checked={editProject.hashtags}
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
                    setEditProject({});
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
      <Modal backdrop={"blur"} isOpen={isDeleteModalOpen} onOpenChange={onDeleteModalOpenChange} size="lg">
        <ModalContent className="text-default-800">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Delete Project
              </ModalHeader>
              <ModalBody>Are you sure?</ModalBody>
              <ModalFooter>
                <Button
                  className="text-default-800 post-pro bg-primary-100"
                  variant="light"
                  onPress={() => {
                    setDeleteProject({});
                    onClose();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="post-pro bg-danger-500 text-default-50"
                  onPress={onDelete}
                  isLoading={isLoading}
                >
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
