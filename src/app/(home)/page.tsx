"use client";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { EditorPreview } from "@/components/EditorPreview";
import { CanvasPreview } from "@/components/CanvasPreview";
import { Navbar } from "@/components/Navbar";

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <EditorPreview />
      <CanvasPreview />
      <Features />
    </div>
  );
}
