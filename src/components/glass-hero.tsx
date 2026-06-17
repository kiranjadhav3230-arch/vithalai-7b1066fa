import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageSquare, Scale, Users, Code2 } from 'lucide-react';
import vithalLogo from '@/assets/vithal-pin-logo.png';

interface GlassHeroProps {
  onGetStarted: () => void;
}

export const GlassHero: React.FC<GlassHeroProps> = ({ onGetStarted }) => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 px-4 overflow-hidden">
      {/* Subtle radial backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(25_100%_55%/0.08),transparent_60%)] pointer-events-none" />

      <div className="container mx-auto relative">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="h-14 w-14 md:h-16 md:w-16 rounded-2xl overflow-hidden ring-1 ring-border bg-card">
              <img
                src={vithalLogo}
                alt="Vithal AI"
                width={64}
                height={64}
                fetchPriority="high"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card/50 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            AI-Powered Platform · Built for India
          </div>

          {/* Headline */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold leading-[1.1] tracking-tight">
            Your AI Companion <br className="hidden sm:block" />
            for <span className="gradient-text-orange">Everything</span>.
          </h1>

          <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Chat, learn, know your rights, and build — powered by Gemini AI.
            One platform. Four powerful tools.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
            <Button
              onClick={onGetStarted}
              size="lg"
              className="px-6 h-11 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              size="lg"
              variant="outline"
              className="px-6 h-11 rounded-xl border-border bg-transparent hover:bg-muted/50 text-foreground"
            >
              Explore Features
            </Button>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-2 pt-6">
            {[
              { icon: MessageSquare, label: 'AI Chat' },
              { icon: Scale, label: 'Haq Jaano' },
              { icon: Users, label: 'Study Rooms' },
              { icon: Code2, label: 'Code Builder' },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card/40 text-xs text-foreground/80"
              >
                <Icon className="h-3 w-3 text-primary" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
