"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { APP_ID, CONFIG_ID } from "@/app/lib/utils";
import toast, { Toaster } from "react-hot-toast";
import PostCard from "@/app/components/Card";
import HeaderProject from "./components/HeaderProject";
import { Button, Link } from "@nextui-org/react";
// import { PlusIcon } from "@/app/icons/PlusIcon";
import { ArrowLeftIcon } from "@/app/icons/ArrowLeftIcon";
import { FacebookIcon } from "@/app/icons/FacebookIcon";
import Script from "next/script";

interface NewProjectProps {
  params: any;
}

const NewProject: React.FC<NewProjectProps> = ({ params }) => {
  const [projectId, setProjectId] = useState(params.projectId);
  const [project, setProject] = useState<any>({});
  const [posts, setPosts] = useState<any>([]);
  const [status, setStatus]: any = useState({
    facebook: false,
  });

  async function fetchProject(projectId: string) {
    await axios
      .get(`/api/projects/${projectId}`)
      .then((response) => {
        if (response.data) {
          setProject(response.data);
          setStatus(response.data.connections);
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
        if (response.data) {
          setPosts(response.data);
        }
      })
      .catch(() => {
        toast.error("Error in fetching project");
      });
  }

  async function removeConnection(connection: string) {
    await axios
      .put(`/api/projects/${projectId}`, {
        connections: {
          [connection]: false,
        },
      })
      .then((response) => {
        if (response.data && response.data.status === "success") {
          setStatus({
            ...status,
            [connection]: false,
          });
          toast.success("Disconnected successfully");
        } else {
          setStatus({
            ...status,
            [connection]: true,
          });
          toast.error("Error in disconnecting");
        }
      })
      .catch(() => {
        toast.error("Error in disconnecting");
      });
  }

  async function setUserAccess(response: any) {
    await axios
      .post(`/api/projects/${projectId}/set_access`, response)
      .then((response: any) => {
        if (response.data && response.data.status === "success") {
          setStatus({
            ...status,
            [response.data.connection]: true,
          });
          toast.success("Connected successfully");
        } else {
          setStatus({
            ...status,
            [response.data.connection]: false,
          });
          toast.error("Error in connecting");
        }
      })
      .catch(() => {
        toast.error("Error in connecting");
      });
  }

  useEffect(() => {
    fetchProject(projectId);
    fetchPosts(projectId);
    
    //initate facebook sdk
    window.fbAsyncInit = function() {
      window.FB.init({
        appId            : APP_ID,
        xfbml            : true,
        version          : 'v20.0'
      });
    };
  }, []);

  return (
    <>
      <React.Fragment>
        <div>
          <Toaster />
          <HeaderProject projectId={projectId} project={project} />
          <section
            className={`flex flex-col items-center justify-center gap-4 pb-10 text-default-800`}
          >
            <div className="flex flex-col max-w-[1440px] w-full px-6">
              <div className="pt-10">
                <div className="flex justify-between items-center">
                  <div className="flex gap-5">
                    <Link href="/projects" className="text-default-500">
                      <ArrowLeftIcon className="text-default-800" />
                    </Link>
                    <h1 className="text-4xl">{project.title}</h1>
                  </div>
                  <div>
                    {
                      status.facebook ?
                      <div id="status" className="text-default-900">
                        <Button className="post-pro bg-[#1a77f2] text-default-50" onPress={() => {
                          removeConnection("facebook");
                        }}>
                          <FacebookIcon/> Disconnect
                        </Button>
                      </div> :
                      <Button
                        className="post-pro bg-[#1a77f2] text-default-50 hover:cursor-pointer"
                        onPress={() => {
                          window.FB.login(
                            function (response: any) {
                              if (response.authResponse && response.status === "connected") {
                                setUserAccess({
                                  token: response.authResponse.accessToken,
                                  connection: response.authResponse.graphDomain,
                                });
                                FB.api("/me", function (response: any) {
                                  if(response.error) {
                                    console.log("Error: ", response.error);
                                    return;
                                  } else {
                                    setStatus({
                                      ...status,
                                      facebook: true,
                                    });
                                    console.log("Good to see you, " + response.name + ".");
                                  }
                                });
                              } else {
                                setStatus({
                                  ...status,
                                  facebook: false,
                                });
                                console.log(
                                  "User cancelled login or did not fully authorize."
                                );
                              }
                            },
                            {
                              config_id: CONFIG_ID,
                            }
                          );
                        }}
                      >
                        <FacebookIcon /> Connect to Instagram
                      </Button>
                    }
                  </div>
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
      </React.Fragment>
      <Script async defer crossOrigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js" />
    </>
  );
};

export default NewProject;
