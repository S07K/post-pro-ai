import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
} from "@nextui-org/react";
import axios from "axios";
import toast from "react-hot-toast";
import { EyeIcon } from "@/app/icons/EyeIcon";
import { EditIcon } from "@/app/icons/EditIcon";
import { DeleteIcon } from "@/app/icons/DeleteIcon";

export default function ProjectsTable() {
  const [projects, setProjects] = React.useState([]);
  const [isLoading, setLoading] = React.useState(false);
  React.useEffect(() => {
    setLoading(true);
    axios
      .get("/api/projects")
      .then((response) => {
        // console.log("response.data: ", response.data);
        setProjects(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error calling get all project api: ", error);
        toast.error("Error calling get all project api");
      });
  }, []);

  return (
    <Table isStriped removeWrapper aria-label="Example static collection table">
      <TableHeader>
        <TableColumn>TITLE</TableColumn>
        <TableColumn>DESCRIPTION</TableColumn>
        <TableColumn>CAPTION LIMIT</TableColumn>
        <TableColumn>NO. OF POSTS</TableColumn>
        <TableColumn>HASHTAGS</TableColumn>
        <TableColumn align="center">ACTIONS</TableColumn>
      </TableHeader>
      <TableBody emptyContent={"No rows to display."} isLoading={isLoading}>
        {projects.map((project: any, index: number) => (
          <TableRow key={project._id} className="hover:cursor-pointer" href={`/projects/${project._id}`}>
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
                <Tooltip className="text-background bg-foreground" content="Details">
                  <span onClick={() => {window.location.href = `/projects/${project._id}`}} className="text-lg text-default-400 cursor-pointer active:opacity-50">
                    <EyeIcon />
                  </span>
                </Tooltip>
                <Tooltip className="text-background bg-foreground" content="Edit user">
                  <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                    <EditIcon />
                  </span>
                </Tooltip>
                <Tooltip color="danger" content="Delete user">
                  <span className="text-lg post-pro text-danger-500 cursor-pointer active:opacity-50">
                    <DeleteIcon />
                  </span>
                </Tooltip>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
