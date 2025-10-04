import { motion } from "motion/react";

export function EditorPreview() {
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
        <div className="relative bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
          {/* Toolbar */}
          <div className="border-b border-border px-6 py-4 flex items-center gap-4 bg-muted/30">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
            <div className="flex-1 flex items-center gap-3 ml-4">
              {['B', 'I', 'U', 'H1', 'H2', 'Quote'].map((tool) => (
                <div
                  key={tool}
                  className="px-3 py-1.5 text-sm rounded-md bg-background border border-border hover:bg-accent transition-colors"
                >
                  {tool}
                </div>
              ))}
            </div>
          </div>

          {/* Editor content */}
          <div className="p-12 min-h-[400px] bg-background">
            <div className="max-w-3xl mx-auto space-y-6">
              <h1 className="text-4xl" style={{ fontWeight: 600 }}>
                Chapter One
              </h1>
              
              <div className="space-y-4 text-foreground/60">
                <p>
                  The blank page is not your enemy—it's your canvas. Every great story, 
                  every groundbreaking idea, every moment of clarity begins here, in this 
                  pristine space where thoughts transform into words.
                </p>
                
                <p>
                  With nothing but your words and the gentle cursor awaiting your next thought, 
                  you'll discover what it truly means to write without distractions. No clutter. 
                  No notifications. Just you and your ideas.
                </p>

                <blockquote className="border-l-4 border-primary pl-6 italic">
                  "Simplicity is the ultimate sophistication."
                </blockquote>

                <p>
                  Every formatting tool is there when you need it, invisible when you don't. 
                  This is writing, reimagined.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}