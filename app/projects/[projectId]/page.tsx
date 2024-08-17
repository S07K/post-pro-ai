"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import PostCard from "@/app/components/Card";
import HeaderProject from "./components/HeaderProject";
import { Button, Link } from "@nextui-org/react";
import { PlusIcon } from "@/app/icons/PlusIcon";
import { ArrowLeftIcon } from "@/app/icons/ArrowLeftIcon";

interface NewProjectProps {
  params: any;
}

const NewProject: React.FC<NewProjectProps> = ({ params }) => {
  const [projectId, setProjectId] = useState(params.projectId);
  const [project, setProject] = useState<any>({});
  const [posts, setPosts] = useState<any>([]);

  async function fetchProject(projectId: string) {
    await axios
      .get(`/api/projects/${projectId}`)
      .then((response) => {
        // console.log(response.data);
        if (response.data) {
          setProject(response.data);
          // toast.success("Project added successfully");
        } else {
          toast.error("No project found");
          window.location.href = "/projects";
        }
      })
      .catch(() => {
        toast.error("Error in fetching project");
      });
  }

  async function fetchPosts(projectId: string) {
    await axios
      .get(`/api/post/${projectId}`)
      .then((response) => {
        // console.log(response.data);
        if (response.data) {
          setPosts(response.data);
          // toast.success("Project added successfully");
        }
      })
      .catch(() => {
        toast.error("Error in fetching project");
      });
  }

  useEffect(() => {
    fetchProject(projectId);
    fetchPosts(projectId);
  }, []);

  return (
    <div>
      <Toaster />
      <HeaderProject projectId={projectId} project={project} />
      <section
        className={`flex flex-col items-center justify-center gap-4 pb-10 text-default-800`}
      >
        <div className="flex flex-col max-w-[1440px] w-full px-6">
          <div className="pt-10">
            <div className="flex gap-5">
              <Link href="/projects" className="text-default-500"><ArrowLeftIcon className="text-default-800" /></Link>
              <h1 className="text-4xl">{project.title}</h1>
            </div>
            {/* <p>Project ID: {projectId}</p> */}
            <p className="text-default-500 pt-2">{project.description}</p>
          </div>
          <div>
            <h2 className="text-2xl pt-10">Posts</h2>
            {posts.length > 0 ? (
              <div className="flex flex-wrap justify-center sm:justify-start gap-4 pt-10">
                {posts?.map((post: any) => {
                  return <PostCard key={post._id} cardDetails={post} />;
                })}
              </div>
            ) : (
              <div className="h-[300px] flex flex-col flex-wrap justify-center items-center gap-4 pt-10 border-1 rounded-md mt-5">
                <p>No post in the project yet</p>
                {/* <Button
                  className="bg-foreground text-background"
                  endContent={<PlusIcon />}
                  size="md"
                >
                  Create first post
                </Button> */}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewProject;
