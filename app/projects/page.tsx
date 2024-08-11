"use client";
import React from "react";
import Header from "../components/Header";
import ProjectsTable from "./components/ProjectsTable";
import { Toaster } from "react-hot-toast";
import HeaderDashBoard from "../components/HeaderDashBoard";

const Projects: React.FC = () => {
  return (
    <>
      <Toaster />
      <HeaderDashBoard />
      <section
        className={`flex flex-col items-center justify-center gap-4 pb-10 text-default-800`}
      >
        <div className="flex flex-col max-w-[1440px] w-full px-6">
          <div className="pt-10">
            <h1 className="text-4xl">Projects</h1>
            {/* <p>Project ID: {projectId}</p> */}
            <p className="text-default-500 pt-2">Manage all of your projects here</p>
          </div>
          <div>
            {/* <h2 className="text-2xl pt-10">Posts</h2> */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 pt-10">
              <ProjectsTable />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Projects;
