"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { APP_ID, CONFIG_ID, FACEBOOK_GRAPH_VERSION } from "@/app/lib/utils";
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
  const [isSdkReady, setSdkReady] = useState(false);
  const [isConnecting, setConnecting] = useState(false);

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
      toast.success("Instagram connected");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error in connecting");
    } finally {
      setConnecting(false);
    }
  };

  const initFacebookSdk = useCallback(() => {
    if (!window.FB) return;
    window.FB.init({
      appId: APP_ID,
      xfbml: false,
      version: FACEBOOK_GRAPH_VERSION,
    });
    setSdkReady(true);
  }, []);

  const startFacebookLogin = () => {
    if (!APP_ID || !CONFIG_ID) {
      toast.error("Facebook Login isn't configured for this app yet");
      return;
    }
    if (!window.FB) {
      toast.error("Facebook is still loading. Try again in a moment.");
      return;
    }
    setConnecting(true);
    window.FB.login(
      (response: any) => {
        if (response.authResponse?.accessToken) {
          connectFacebook(response.authResponse.accessToken);
        } else {
          setConnecting(false);
          toast.error("Facebook login was cancelled or not completed");
        }
      },
      { config_id: CONFIG_ID }
    );
  };

  useEffect(() => {
    fetchProject();
    fetchPosts();
  }, [fetchProject, fetchPosts]);

  // The SDK script only fires onLoad once; when it's already on the page (e.g. after
  // navigating between projects) initialise it directly.
  useEffect(() => {
    if (window.FB) {
      initFacebookSdk();
    }
  }, [initFacebookSdk]);

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
            <Container title="Connections" subtitle="Link an Instagram professional account to publish posts from this project.">
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
                    startContent={isConnecting ? null : <FacebookIcon />}
                    isLoading={isConnecting}
                    isDisabled={!isSdkReady}
                    onPress={startFacebookLogin}
                  >
                    {isSdkReady ? "Connect Instagram" : "Loading Facebook…"}
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
      <Script
        crossOrigin="anonymous"
        src="https://connect.facebook.net/en_US/sdk.js"
        strategy="afterInteractive"
        onLoad={initFacebookSdk}
      />
    </>
  );
};

export default NewProject;
