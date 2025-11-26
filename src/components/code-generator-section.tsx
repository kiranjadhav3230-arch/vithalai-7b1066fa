import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Code2, Zap, Sparkles, FileCode, Braces, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CodeGeneratorSectionProps {
  onGetStarted: () => void;
}

export const CodeGeneratorSection: React.FC<CodeGeneratorSectionProps> = ({ onGetStarted }) => {
  const features = [
    {
      icon: Code2,
      title: 'Multi-Language Support',
      description: 'Generate code in Python, JavaScript, Java, C++, and more',
      gradient: 'from-orange-500 to-orange-600'
    },
    {
      icon: Zap,
      title: 'Instant Generation',
      description: 'Get production-ready code in seconds with AI power',
      gradient: 'from-orange-600 to-red-500'
    },
    {
      icon: FileCode,
      title: 'Professional Code Editor',
      description: 'Monaco editor with syntax highlighting, auto-complete, and advanced editing features',
      gradient: 'from-orange-400 to-orange-500'
    },
    {
      icon: Terminal,
      title: 'Code Library & Management',
      description: 'Save, organize, edit, and download code snippets with version control',
      gradient: 'from-orange-500 to-orange-700'
    }
  ];

  return (
    <section id="code-generator" className="relative py-20 md:py-32 px-4 overflow-hidden" style={{ perspective: '2000px' }}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-950/20 via-black to-black"></div>
      
      {/* Glowing Orbs */}
      <div className="absolute inset-0 overflow-hidden opacity-30" style={{ transformStyle: 'preserve-3d' }}>
        <div className="absolute top-[20%] left-[5%] md:left-[10%] w-[500px] md:w-[700px] h-[500px] md:h-[700px] rounded-full bg-gradient-to-br from-orange-500/35 to-transparent blur-[100px] md:blur-[140px] animate-float-slow"></div>
        <div className="absolute bottom-[10%] right-[5%] md:right-[10%] w-[600px] md:w-[800px] h-[600px] md:h-[800px] rounded-full bg-gradient-to-tl from-orange-600/30 to-transparent blur-[120px] md:blur-[160px] animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-20 animate-scaleIn px-4">
          <div className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-full liquid-glass-intense border border-primary/30 mb-4 md:mb-6 morph-shape">
            <FileCode className="h-4 md:h-5 w-4 md:w-5 text-primary animate-pulse" />
            <span className="text-xs md:text-sm font-display font-semibold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              AI Code Generator
            </span>
          </div>
          
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold mb-4 md:mb-6 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent px-4">
            Vithal.AI Code Generator
          </h2>
          <p className="text-muted-foreground text-base md:text-xl max-w-3xl mx-auto font-sans leading-relaxed px-4">
            Write code faster with AI-powered code generation, professional code editor, and library management. Support for 15+ programming languages with instant results.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16 px-4" style={{ transformStyle: 'preserve-3d' }}>
          {features.map((feature, index) => (
            <Card
              key={index}
              variant="glass"
              className="group morph-shape cursor-pointer"
              style={{ 
                animationDelay: `${index * 0.1}s`,
                transformStyle: 'preserve-3d'
              }}
            >
              <CardContent className="p-6 md:p-8 relative z-10">
                {/* Icon with Gradient */}
                <div className={`mb-4 md:mb-6 w-12 md:w-16 h-12 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-xl shadow-orange-500/30 group-hover:shadow-orange-500/60 transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 float-3d`}>
                  <feature.icon className="h-6 md:h-8 w-6 md:w-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="font-display font-bold mb-2 md:mb-3 text-lg md:text-xl transition-colors duration-300 group-hover:text-primary">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm md:text-base font-sans transition-colors duration-300 group-hover:text-foreground/90 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/0 to-orange-600/0 group-hover:from-orange-500/5 group-hover:to-orange-600/5 transition-all duration-500 pointer-events-none"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-6 md:space-y-8 px-4">
          <div className="liquid-glass-intense p-8 md:p-12 rounded-2xl md:rounded-3xl max-w-4xl mx-auto morph-shape">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 mb-6 md:mb-8">
              <div className="w-16 md:w-20 h-16 md:h-20 rounded-2xl md:rounded-3xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-2xl shadow-orange-500/50 morph-shape">
                <Sparkles className="h-8 md:h-10 w-8 md:w-10 text-white" />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold mb-2 md:mb-3 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                  Ready to Code Smarter?
                </h3>
                <p className="text-muted-foreground text-base md:text-lg font-sans">
                  Join thousands using Vithal.AI Code Generator
                </p>
              </div>
            </div>
            
            <Button
              onClick={onGetStarted}
              size="lg"
              className="w-full md:w-auto text-base md:text-lg px-8 md:px-12 py-5 md:py-7 rounded-xl md:rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-display font-semibold shadow-2xl shadow-orange-500/40 hover:shadow-orange-500/60 hover:scale-105 transition-all duration-500 border border-orange-400/20"
            >
              <Code2 className="mr-2 h-5 w-5" />
              Start Generating Code
            </Button>
          </div>

          {/* Languages Support */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 max-w-4xl mx-auto">
            {['Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift'].map((lang, index) => (
              <div
                key={index}
                className="liquid-glass-subtle px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl border border-orange-500/20 morph-shape hover:scale-110 transition-all duration-300"
              >
                <span className="text-xs md:text-sm font-display font-medium text-orange-400">{lang}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};