import React from 'react';
import { Sparkles, Code2 } from 'lucide-react';

export const GlassShowcase: React.FC = () => {
  return (
    <section className="relative py-24 md:py-32 px-4 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-orange-500/15 blur-[140px]" />

      <div className="container mx-auto relative">
        <div className="max-w-2xl mx-auto text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-surface text-xs font-medium text-primary">
            LIVE PREVIEW
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tight">
            See it <span className="gradient-text-orange">in action.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Chat preview */}
          <div className="glass-card p-1.5">
            <div className="rounded-2xl bg-black/70 p-6 space-y-4 min-h-[420px]">
              <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground/80">AI Chat</span>
              </div>
              <div className="space-y-4">
                <div className="flex gap-3 justify-end">
                  <div className="max-w-[80%] px-4 py-2.5 rounded-2xl rounded-tr-md bg-gradient-to-br from-orange-500/30 to-amber-500/20 border border-orange-500/20 text-sm">
                    Explain quantum entanglement simply
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 shrink-0 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-tl-md bg-white/[0.04] border border-white/[0.06] text-sm leading-relaxed text-foreground/85">
                    Imagine two coins flipped at opposite ends of the universe.
                    If they're entangled, the moment one lands heads, the other
                    instantly lands tails—no signal needed. That's quantum entanglement: a
                    deep, instant connection between particles.
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 shrink-0" />
                  <div className="flex gap-1 items-center px-4 py-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Code preview */}
          <div className="glass-card p-1.5">
            <div className="rounded-2xl bg-black/70 p-6 space-y-4 min-h-[420px]">
              <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
                <Code2 className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground/80">Code Generator</span>
                <span className="ml-auto text-xs font-mono text-muted-foreground">react.tsx</span>
              </div>
              <pre className="text-xs md:text-sm font-mono leading-relaxed text-foreground/80 overflow-x-auto">
{`import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button
      onClick={() => setCount(c => c + 1)}
      className="px-4 py-2 rounded-xl
        bg-gradient-to-r from-orange-500
        to-amber-500 text-white"
    >
      Clicked {count} times
    </button>
  );
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
