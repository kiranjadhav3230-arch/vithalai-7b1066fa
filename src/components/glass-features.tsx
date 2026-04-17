import React from 'react';
import { MessageSquare, Scale, Users, Code2, ArrowUpRight } from 'lucide-react';

const features = [
  {
    icon: MessageSquare,
    title: 'AI Chat Assistant',
    description: 'Conversational AI powered by Gemini. Ask anything, get expert answers in your language—instantly.',
    accent: 'from-orange-500 to-amber-500',
    tags: ['Gemini', 'Multilingual', 'Voice'],
  },
  {
    icon: Scale,
    title: 'Haq Jaano',
    description: "India's first AI legal rights assistant. Know your rights in any situation, instantly and clearly.",
    accent: 'from-amber-500 to-orange-600',
    tags: ['Legal', 'Trilingual', 'SOS'],
  },
  {
    icon: Users,
    title: 'Study Rooms',
    description: 'Collaborative spaces with real-time chat, AI helpers, and shared notes. Study together, smarter.',
    accent: 'from-orange-600 to-red-500',
    tags: ['Real-time', 'Collaborative'],
  },
  {
    icon: Code2,
    title: 'Code Generator + Library',
    description: 'Generate, save, and run code snippets. Full IDE experience with multi-file projects.',
    accent: 'from-amber-400 to-orange-500',
    tags: ['IDE', 'Multi-file', 'Run'],
  },
];

export const GlassFeatures: React.FC = () => {
  return (
    <section id="features" className="relative py-24 md:py-32 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-950/5 to-transparent" />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full bg-orange-500/10 blur-[120px]" />

      <div className="container mx-auto relative">
        <div className="max-w-2xl mx-auto text-center mb-16 md:mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-surface text-xs font-medium text-primary">
            FEATURES
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tight">
            Four tools.
            <br />
            <span className="gradient-text-orange">One platform.</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Everything you need to learn, build, and protect yourself—all in one beautiful place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 max-w-6xl mx-auto">
          {features.map(({ icon: Icon, title, description, accent, tags }, i) => (
            <div
              key={title}
              className="group glass-card p-6 md:p-8 cursor-pointer"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-start justify-between mb-6">
                <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${accent} flex items-center justify-center shadow-lg shadow-orange-500/20`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:rotate-45 transition-all duration-300" />
              </div>

              <h3 className="text-2xl md:text-3xl font-display font-bold mb-3 text-foreground">
                {title}
              </h3>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6">
                {description}
              </p>

              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 text-xs rounded-full bg-white/[0.04] border border-white/[0.06] text-foreground/70 font-mono"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
