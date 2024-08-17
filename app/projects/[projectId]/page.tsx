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

const Cards = [
  {
    id: 1,
    caption:
      "🌄✨ Just when you think you've seen it all, nature unveils its masterpiece! This breathtaking view captures the grandeur of towering peaks, their snow-capped summits glistening under the golden rays of the sun.",
    image:
      "https://plus.unsplash.com/premium_photo-1676218968741-8179dd7e533f?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    likes: 10,
    comments: 3,
    shares: 4,
  },
  {
    id: 2,
    caption:
      "🌊✨ Dive into the captivating beauty of the sea! This stunning photo captures the shimmering waves as they dance under the sun, creating a mesmerizing palette of blues and greens.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2973&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    likes: 10,
    comments: 3,
    shares: 4,
  },
  // {
  //     id: 3,
  //     caption: "🏔️✨ Standing atop this majestic mountain, I'm greeted by a breathtaking panorama that stretches as far as the eye can see. The crisp mountain air fills my lungs, invigorating my spirit as I take in the stunning landscape below. ",
  //     image: "https://plus.unsplash.com/premium_photo-1676139859069-c67c27d3abb9?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //     likes: 10,
  //     comments: 3,
  //     shares: 4
  // },
  {
    id: 4,
    caption:
      "Times Square, the iconic intersection of Broadway, 7th Avenue, and 42nd Street in New York City, is a must-visit destination for anyone exploring the Big Apple.",
    image:
      "https://images.unsplash.com/photo-1564715474218-1c628825ffc2?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    likes: 10,
    comments: 3,
    shares: 4,
  },
  {
    id: 5,
    caption:
      "🏔️❄️ Imagine a world blanketed in pristine white, where the only sounds are the crunch of snow beneath your feet and the gentle whisper of the wind.",
    image:
      "https://images.unsplash.com/photo-1526991757821-1307bf7800f6?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    likes: 10,
    comments: 3,
    shares: 4,
  },
];

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
                  return <PostCard key={post.id} cardDetails={post} />;
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
