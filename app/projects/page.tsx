"use client";
import React from "react";
import AppShell from "../components/AppShell";
import ProjectsTable from "./components/ProjectsTable";
import NewProjectAction from "../components/HeaderDashBoard";

const Projects: React.FC = () => {
  return (
    <AppShell title="Projects" subtitle="Create and manage the projects you generate posts for." actions={<NewProjectAction />}>
      <ProjectsTable />
    </AppShell>
  );
};

export default Projects;
