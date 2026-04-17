import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, MessageSquare, Scale, Users, Code2 } from 'lucide-react';
interface GlassHeroProps {
  onGetStarted: () => void;
}

export const GlassHero: React.FC<GlassHeroProps> = ({ onGetStarted }) => {
  return (
    <section className="relative min-h-[92vh] flex items-center aurora-bg overflow-hidden">
      <div className="absolute inset-0 grid-noise opacity-40 pointer-events-none" />

      <div className="container mx-auto px-4 py-20 md:py-28 relative">
        <div className="max-w-5xl mx-auto text-center space-y-8 md:space-y-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-surface animate-[fadeInUp_0.6s_ease-out]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="text-xs md:text-sm font-medium text-foreground/90 tracking-wide">
              <Sparkles className="inline h-3 w-3 mr-1 text-primary" />
              AI-Powered Platform · Built for India
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-[1.05] tracking-tight animate-[fadeInUp_0.8s_ease-out]">
            <span className="block text-foreground">Your AI</span>
            <span className="block gradient-text-orange">Companion for</span>
            <span className="block text-foreground">Everything.</span>
          </h1>

          <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-[fadeInUp_1s_ease-out]">
            Chat, learn, know your rights, and build—powered by Gemini AI.
            One platform. Four powerful tools. Zero friction.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4 animate-[fadeInUp_1.1s_ease-out]">
            <Button
              onClick={onGetStarted}
              size="lg"
              className="group relative px-8 py-6 text-base rounded-2xl bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 text-white font-semibold border-0 glow-pulse hover:opacity-95 transition-opacity"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              size="lg"
              variant="ghost"
              className="px-8 py-6 text-base rounded-2xl glass-surface hover:bg-white/[0.06] text-foreground"
            >
              Explore Features
            </Button>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-3 pt-8 animate-[fadeInUp_1.3s_ease-out]">
            {[
              { icon: MessageSquare, label: 'AI Chat' },
              { icon: Scale, label: 'Haq Jaano' },
              { icon: Users, label: 'Study Rooms' },
              { icon: Code2, label: 'Code Builder' },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-4 py-2 rounded-full glass-surface text-sm text-foreground/80"
              >
                <Icon className="h-3.5 w-3.5 text-primary" />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Floating preview mock */}
        <div className="mt-20 max-w-4xl mx-auto animate-[fadeInUp_1.5s_ease-out]">
          <div className="glass-card p-2 md:p-3">
            <div className="rounded-xl bg-black/60 border border-white/[0.06] p-6 md:p-10 space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500/70" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
                <div className="h-3 w-3 rounded-full bg-green-500/70" />
                <div className="ml-auto text-xs text-muted-foreground font-mono">vithal.ai</div>
              </div>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-3/4 rounded-full bg-white/[0.08]" />
                    <div className="h-3 w-1/2 rounded-full bg-white/[0.06]" />
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <div className="flex-1 max-w-md space-y-2">
                    <div className="h-3 w-full rounded-full bg-orange-500/20 ml-auto" />
                    <div className="h-3 w-2/3 rounded-full bg-orange-500/15 ml-auto" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-5/6 rounded-full bg-white/[0.08]" />
                    <div className="h-3 w-2/3 rounded-full bg-white/[0.06]" />
                    <div className="h-3 w-1/2 rounded-full bg-white/[0.06]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
