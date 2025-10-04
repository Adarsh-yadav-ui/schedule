// components/ExcalidrawWrapper.jsx

"use client"; // <-- **CRITICAL: Marks this file as a Client Component**

import dynamic from "next/dynamic";
import "@excalidraw/excalidraw/index.css";

interface ExcalidrawWrapperProps {
  height?: string;
}

// 1. The dynamic import logic must now be inside a Client Component.
const ExcalidrawComponent = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,

  
  {
    ssr: false, // <-- This is now allowed because the parent component is client-side
    loading: () => (
      <div style={{ height: "500px", padding: "20px", textAlign: "center" }}>
        Loading Excalidraw...
      </div>
    ),
  }
);

export function ExcalidrawWrapper({ height }: ExcalidrawWrapperProps) {

  return (
    <div style={{ height: height || "100vh", border: "1px solid #ddd" }}>
      <ExcalidrawComponent />
    </div>
  );
}
