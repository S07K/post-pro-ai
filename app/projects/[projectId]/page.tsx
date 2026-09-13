"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { APP_ID, CONFIG_ID } from "@/app/lib/utils";
import toast from "react-hot-toast";
import PostCard from "@/app/components/Card";
import HeaderProject from "./components/HeaderProject";
import AppShell from "@/app/components/AppShell";
import { Button, Spinner } from "@nextui-org/react";
import { FacebookIcon } from "@/app/icons/FacebookIcon";
import Script from "next/script";
import { getProject, getProjectPosts, setProjectFacebookAccess, updateProject } from "@/lib/api/client";
import { StaggerGrid, StaggerCell, staggerContainer, staggerItem } from "@/app/components/StaggerReveal";
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

  const facebookAction = project ? (
    project.connections.facebook ? (
      <Button className="post-pro bg-[#1a77f2] text-white font-mono" onPress={removeConnection}>
        <FacebookIcon /> Disconnect
      </Button>
    ) : (
      <Button
        className="post-pro bg-[#1a77f2] text-white font-mono hover:cursor-pointer"
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
    )
  ) : null;

  return (
    <>
      <AppShell
        title={project?.title ?? "Project"}
        subtitle={project?.description}
        actions={
          project ? (
            <>
              {facebookAction}
              <HeaderProject projectId={projectId} project={project} onPostCreated={fetchPosts} />
            </>
          ) : null
        }
      >
        {!project ? (
          <div className="flex justify-center pt-20">
            <Spinner />
          </div>
        ) : (
          <div>
            <h2 className="font-display text-2xl text-default-900 pt-4">Posts</h2>
            {posts.length > 0 ? (
              <StaggerGrid
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="flex flex-wrap justify-center sm:justify-start gap-4 pt-6"
              >
                {posts.map((post) => (
                  <StaggerCell key={post.id} variants={staggerItem}>
                    <PostCard post={post} />
                  </StaggerCell>
                ))}
              </StaggerGrid>
            ) : (
              <div className="h-[240px] flex flex-col flex-wrap justify-center items-center gap-4 mt-6 border hairline rounded-large">
                <p className="text-default-500">No post in the project yet</p>
              </div>
            )}
          </div>
        )}
      </AppShell>
      <Script async defer crossOrigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js" />
    </>
  );
};

export default NewProject;
