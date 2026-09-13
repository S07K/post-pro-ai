"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { APP_ID, CONFIG_ID } from "@/app/lib/utils";
import toast from "react-hot-toast";
import PostCard from "@/app/components/Card";
import HeaderProject from "./components/HeaderProject";
import AppShell from "@/app/components/AppShell";
import Container from "@/app/dashboard/components/Container";
import { Button, Spinner } from "@nextui-org/react";
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

  const isConnected = Boolean(project?.connections.facebook);

  return (
    <>
      <AppShell
        breadcrumbs={[{ label: "Projects", href: "/projects" }, { label: project?.title ?? "Project" }]}
        title={project?.title ?? "Project"}
        subtitle={project?.description}
        actions={project ? <HeaderProject projectId={projectId} project={project} onPostCreated={fetchPosts} /> : null}
      >
        {!project ? (
          <div className="flex justify-center pt-20">
            <Spinner />
          </div>
        ) : (
          <>
            <Container title="Connections" subtitle="Link an Instagram business account to publish posts from this project.">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#1877F2] text-white">
                    <FacebookIcon />
                  </span>
                  <div>
                    <p className="text-[15px] font-semibold text-default-900">Instagram</p>
                    <p className="flex items-center gap-1.5 text-[13px] text-default-600">
                      <span className={`h-2 w-2 rounded-full ${isConnected ? "bg-success-500" : "bg-default-400"}`} />
                      {isConnected ? "Connected via Facebook Login" : "Not connected"}
                    </p>
                  </div>
                </div>
                {isConnected ? (
                  <Button variant="bordered" className="border-default-300 font-semibold text-default-800" onPress={removeConnection}>
                    Disconnect
                  </Button>
                ) : (
                  <Button
                    className="bg-[#1877F2] font-semibold text-white"
                    startContent={<FacebookIcon />}
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
                    Connect Instagram
                  </Button>
                )}
              </div>
            </Container>

            <Container title="Posts" subtitle={`${posts.length} ${posts.length === 1 ? "post" : "posts"} in this project`}>
              {posts.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-default-300 bg-default-100 px-6 py-14 text-center">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-primary-50 text-primary-600">
                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="m21 15-5-5L5 21" />
                    </svg>
                  </span>
                  <p className="text-[15px] font-semibold text-default-900">No posts yet</p>
                  <p className="max-w-sm text-sm text-default-600">
                    Use <span className="font-semibold">Create post</span> to generate your first image and caption.
                  </p>
                </div>
              )}
            </Container>
          </>
        )}
      </AppShell>
      <Script async defer crossOrigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js" />
    </>
  );
};

export default NewProject;
