"use client";
import React from "react";
import AppShell from "../components/AppShell";
import ProjectsTable from "./components/ProjectsTable";
import NewProjectAction from "../components/HeaderDashBoard";

const Projects: React.FC = () => {
  return (
    <AppShell title="Projects" subtitle="Manage all of your projects here." actions={<NewProjectAction />}>
      <div className="pt-6 w-full overflow-auto">
        <ProjectsTable />
      </div>
    </AppShell>
  );
};

export default Projects;
