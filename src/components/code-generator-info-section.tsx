import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Code, Zap, Download, Sparkles, Terminal, FileCode } from 'lucide-react';

interface CodeGeneratorInfoSectionProps {
  onGetStarted: () => void;
}

export const CodeGeneratorInfoSection: React.FC<CodeGeneratorInfoSectionProps> = ({ onGetStarted }) => {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Modern gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 -z-10"></div>
      <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl -z-10"></div>
      
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            <span>Free AI-Powered Tool</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Vithal AI Code Generator
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Generate production-ready code in seconds with our intelligent AI code generator. 
            Perfect for students, developers, and coding enthusiasts!
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 bg-gradient-to-br from-card to-card/50 border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,165,0,0.2)]">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4">
              <Code className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2">Multi-Language Support</h3>
            <p className="text-sm text-muted-foreground">
              Generate code in Python, JavaScript, Java, C++, HTML/CSS, React, and more languages instantly
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-card to-card/50 border border-accent/20 hover:border-accent/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,165,0,0.2)]">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-accent" />
            </div>
            <h3 className="font-bold text-lg mb-2">Instant Generation</h3>
            <p className="text-sm text-muted-foreground">
              Get clean, optimized code in seconds. No waiting, no hassle - just describe what you need
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-card to-card/50 border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,165,0,0.2)]">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4">
              <Terminal className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2">Offline Mode Available</h3>
            <p className="text-sm text-muted-foreground">
              Generate code even without internet using our powerful offline AI models
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-card to-card/50 border border-accent/20 hover:border-accent/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,165,0,0.2)]">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center mb-4">
              <FileCode className="h-6 w-6 text-accent" />
            </div>
            <h3 className="font-bold text-lg mb-2">Smart Code Snippets</h3>
            <p className="text-sm text-muted-foreground">
              Save your generated code snippets for later use. Build your personal code library
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-card to-card/50 border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,165,0,0.2)]">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4">
              <Download className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2">Download & Copy</h3>
            <p className="text-sm text-muted-foreground">
              Easily download generated code as files or copy to clipboard with one click
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-card to-card/50 border border-accent/20 hover:border-accent/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,165,0,0.2)]">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-accent" />
            </div>
            <h3 className="font-bold text-lg mb-2">AI-Powered Intelligence</h3>
            <p className="text-sm text-muted-foreground">
              Powered by advanced AI models trained on millions of code examples
            </p>
          </Card>
        </div>

        {/* How it Works */}
        <div className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border border-border/50 rounded-2xl p-8 mb-12">
          <h3 className="text-2xl font-bold mb-8 text-center">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary-foreground">
                1
              </div>
              <h4 className="font-semibold mb-2">Choose Language</h4>
              <p className="text-sm text-muted-foreground">
                Select your preferred programming language from our extensive list
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary-foreground">
                2
              </div>
              <h4 className="font-semibold mb-2">Describe Your Need</h4>
              <p className="text-sm text-muted-foreground">
                Tell the AI what code you want to generate in simple words
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary-foreground">
                3
              </div>
              <h4 className="font-semibold mb-2">Get Your Code</h4>
              <p className="text-sm text-muted-foreground">
                Receive clean, working code with syntax highlighting instantly
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button
            onClick={onGetStarted}
            size="lg"
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground px-12 py-6 text-lg font-semibold shadow-[0_0_30px_rgba(255,165,0,0.3)] hover:shadow-[0_0_40px_rgba(255,165,0,0.5)] transition-all duration-300"
          >
            <Code className="mr-2 h-5 w-5" />
            Try Code Generator Now - It's Free!
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required • Instant access • Free forever
          </p>
        </div>
      </div>
    </section>
  );
};
