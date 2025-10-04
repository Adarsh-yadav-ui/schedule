import { motion } from "motion/react";
import Image from "next/image";

export function CanvasPreview() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative"
      >
        {/* Shadow effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent blur-3xl" />

        {/* Editor mockup */}
        <div className="pt-10">
          <div className="flex gap-2 mb-5 ml-3">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-emerald-400" />
          </div>
          <Image
            src="/Canvas.png"
            alt="Canvas"
            height={900}
            width={1600}
            className="relative bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
          />
        </div>
      </motion.div>
    </div>
  );
}
