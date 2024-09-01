import * as React from "react";
import { NextUIProvider } from "@nextui-org/react";
import Dashboard from "./dashboard/page";

export default function App() {
  return (
    <>
      <NextUIProvider>
        <Dashboard />
      </NextUIProvider>
    </>
  );
}
