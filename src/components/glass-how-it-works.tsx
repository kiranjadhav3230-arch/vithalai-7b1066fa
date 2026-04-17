import React from 'react';
import { UserPlus, Wand2, Rocket } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: 'Sign Up',
    description: 'Create your free account in seconds with email or Google. No credit card needed.',
    step: '01',
  },
  {
    icon: Wand2,
    title: 'Pick a Tool',
    description: 'Chat with AI, know your rights, join a study room, or build with code—your choice.',
    step: '02',
  },
  {
    icon: Rocket,
    title: 'Get Results',
    description: 'Instant answers, smart suggestions, real collaboration. Powered by Gemini AI.',
    step: '03',
  },
];

export const GlassHowItWorks: React.FC = () => {
  return (
    <section className="relative py-24 md:py-32 px-4 overflow-hidden">
      <div className="absolute left-0 top-1/3 w-[400px] h-[400px] rounded-full bg-amber-500/10 blur-[120px]" />

      <div className="container mx-auto relative">
        <div className="max-w-2xl mx-auto text-center mb-16 md:mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-surface text-xs font-medium text-primary">
            HOW IT WORKS
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tight">
            Get going in
            <br />
            <span className="gradient-text-orange">three steps.</span>
          </h2>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connecting gradient line */}
          <div className="hidden md:block absolute top-20 left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {steps.map(({ icon: Icon, title, description, step }) => (
              <div key={step} className="glass-card p-8 text-center relative">
                <div className="text-7xl font-display font-bold text-white/[0.04] absolute top-2 right-4 select-none">
                  {step}
                </div>
                <div className="relative">
                  <div className="h-16 w-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-display font-bold mb-3 text-foreground">
                    {title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
