"use client";
import React from "react";
import ProjectsTable from "./components/ProjectsTable";
import HeaderDashBoard from "../components/HeaderDashBoard";

const Projects: React.FC = () => {
  return (
    <>
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
          <div className="pt-10 w-full overflow-auto">
            <ProjectsTable />
          </div>
        </div>
      </section>
    </>
  );
};

export default Projects;
