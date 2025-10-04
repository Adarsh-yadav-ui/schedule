import { motion } from "motion/react";
import { Type, Zap, Eye, Cloud, Palette, Lock } from "lucide-react";

const features = [
  {
    icon: Type,
    title: "Rich Text Formatting",
    description: "Beautiful typography with all the formatting options you need—headers, lists, quotes, and more.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Instant response time. No lag, no delay. Your thoughts flow directly onto the page.",
  },
  {
    icon: Eye,
    title: "Focus Mode",
    description: "Eliminate all distractions. Just you, your words, and a clean white canvas.",
  },
  {
    icon: Cloud,
    title: "Auto-Save",
    description: "Never lose your work. Everything is automatically saved as you write.",
  },
  {
    icon: Palette,
    title: "Minimal Design",
    description: "A pure white interface that puts your content first. Clean, simple, elegant.",
  },
  {
    icon: Lock,
    title: "Privacy First",
    description: "Your words are yours alone. Private by default, secure by design.",
  },
];

export function Features() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-24 lg:px-8">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-4xl mb-4"
          style={{ fontWeight: 600 }}
        >
          Everything you need, nothing you don't
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-lg text-muted-foreground max-w-2xl mx-auto"
        >
          Powerful features wrapped in a minimalist interface
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group p-6 rounded-xl border border-border bg-card hover:shadow-lg hover:border-primary/20 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
              <feature.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="mb-2" style={{ fontWeight: 600 }}>
              {feature.title}
            </h3>
            <p className="text-muted-foreground">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Final CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="mt-24 text-center"
      >
        <div className="inline-flex flex-col items-center gap-6 p-12 rounded-2xl bg-gradient-to-b from-muted/50 to-background border border-border">
          <h3 className="text-3xl" style={{ fontWeight: 600 }}>
            Ready to start writing?
          </h3>
          <p className="text-muted-foreground max-w-md">
            Join thousands of writers who have rediscovered the joy of distraction-free writing.
          </p>
          <button className="px-8 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            Get Started Free
          </button>
        </div>
      </motion.div>
    </div>
  );
}