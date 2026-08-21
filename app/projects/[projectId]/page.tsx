"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { APP_ID, CONFIG_ID } from "@/app/lib/utils";
import toast from "react-hot-toast";
import PostCard from "@/app/components/Card";
import HeaderProject from "./components/HeaderProject";
import { Button, Link, Spinner } from "@nextui-org/react";
import { ArrowLeftIcon } from "@/app/icons/ArrowLeftIcon";
import { FacebookIcon } from "@/app/icons/FacebookIcon";
import Script from "next/script";
import { getProject, getProjectPosts, setProjectFacebookAccess, updateProject } from "@/lib/api/client";
import type { ProjectDTO, PostDTO } from "@/types";

interface NewProjectProps {
  params: { projectId: string };
}

const NewProject: React.FC<NewProjectProps> = ({ params }) => {
  const router = useRouter();
  const projectId = params.projectId;
  const [project, setProject] = useState<ProjectDTO | null>(null);
  const [posts, setPosts] = useState<PostDTO[]>([]);

  const fetchProject = useCallback(async () => {
    try {
      const data = await getProject(projectId);
      setProject(data);
    } catch {
      toast.error("No project found");
      router.push("/projects");
    }
  }, [projectId, router]);

  const fetchPosts = useCallback(async () => {
    try {
      const data = await getProjectPosts(projectId);
      setPosts(data);
    } catch {
      toast.error("Error in fetching posts");
    }
  }, [projectId]);

  const removeConnection = async () => {
    try {
      const updated = await updateProject(projectId, { connections: { facebook: false } });
      setProject(updated);
      toast.success("Disconnected successfully");
    } catch {
      toast.error("Error in disconnecting");
    }
  };

  const connectFacebook = async (token: string) => {
    try {
      await setProjectFacebookAccess(projectId, token);
      await fetchProject();
      toast.success("Connected successfully");
    } catch {
      toast.error("Error in connecting");
    }
  };

  useEffect(() => {
    fetchProject();
    fetchPosts();

    window.fbAsyncInit = function () {
      window.FB.init({
        appId: APP_ID,
        xfbml: true,
        version: "v20.0",
      });
    };
  }, [fetchProject, fetchPosts]);

  return (
    <>
      <div>
        <HeaderProject projectId={projectId} project={project} onPostCreated={fetchPosts} />
        <section className="flex flex-col items-center justify-center gap-4 pb-10 text-default-800">
          <div className="flex flex-col max-w-[1440px] w-full px-3 md:px-6">
            {!project ? (
              <div className="flex justify-center pt-20">
                <Spinner />
              </div>
            ) : (
              <>
                <div className="pt-10">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2 md:gap-5 flex-wrap">
                      <Link href="/projects" className="text-default-500">
                        <ArrowLeftIcon className="text-default-800" />
                      </Link>
                      <h1 className="text-lg md:text-2xl">{project.title}</h1>
                    </div>
                    <div>
                      {project.connections.facebook ? (
                        <div id="status" className="text-default-900">
                          <Button className="post-pro bg-[#1a77f2] text-default-50" onPress={removeConnection}>
                            <FacebookIcon /> Disconnect
                          </Button>
                        </div>
                      ) : (
                        <Button
                          className="post-pro bg-[#1a77f2] text-default-50 hover:cursor-pointer"
                          onPress={() => {
                            window.FB.login(
                              (response: any) => {
                                if (response.authResponse && response.status === "connected") {
                                  connectFacebook(response.authResponse.accessToken);
                                }
                              },
                              { config_id: CONFIG_ID }
                            );
                          }}
                        >
                          <FacebookIcon /> Connect Instagram
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-default-500 pt-2 text-sm md:text-medium">{project.description}</p>
                </div>
                <div>
                  <h2 className="text-2xl pt-10">Posts</h2>
                  {posts.length > 0 ? (
                    <div className="flex flex-wrap justify-center sm:justify-start gap-4 pt-10">
                      {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                      ))}
                    </div>
                  ) : (
                    <div className="h-[300px] flex flex-col flex-wrap justify-center items-center gap-4 pt-10 border-1 rounded-md mt-5">
                      <p>No post in the project yet</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </section>
      </div>
      <Script async defer crossOrigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js" />
    </>
  );
};

export default NewProject;
