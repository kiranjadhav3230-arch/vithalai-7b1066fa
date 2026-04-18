import React from 'react';
import { Mail, Instagram } from 'lucide-react';
import vithalLogo from '@/assets/vithal-pin-logo.png';

export const GlassFooter: React.FC = () => {
  return (
    <footer className="relative border-t border-white/[0.06] py-12 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />

      <div className="container mx-auto relative max-w-4xl">
        <div className="glass-card p-8 md:p-10 text-center space-y-6">
          {/* Logo */}
          <div className="inline-flex items-center gap-2">
            <div className="h-12 w-12 rounded-xl overflow-hidden ring-2 ring-orange-500/40 shadow-lg shadow-orange-500/30">
              <img src={vithalLogo} alt="Vithal AI" className="h-full w-full object-cover" />
            </div>
            <span className="text-2xl font-display font-bold text-foreground">Vithal AI</span>
          </div>

          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Built for everyone. Powered by Gemini AI. Made with care in India.
          </p>

          {/* Social */}
          <div className="flex items-center justify-center gap-2">
            <a
              href="mailto:vithalai2112@gmail.com"
              className="h-10 w-10 rounded-full glass-surface flex items-center justify-center hover:border-orange-500/30 transition-colors"
              aria-label="Email"
            >
              <Mail className="h-4 w-4 text-foreground/70" />
            </a>
            <a
              href="https://www.instagram.com/vithal.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 w-10 rounded-full glass-surface flex items-center justify-center hover:border-orange-500/30 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-4 w-4 text-foreground/70" />
            </a>
          </div>

          {/* Credits */}
          <div className="pt-6 border-t border-white/[0.06] space-y-2">
            <p className="text-xs text-muted-foreground">
              © 2025 Vithal AI · Powered by{' '}
              <span className="gradient-text-orange font-semibold">Gemini AI</span>
              {' '}· Developed by{' '}
              <span className="gradient-text-orange font-semibold">Kapil Kiran Jadhav</span>
            </p>
            <p className="text-xs text-foreground/40">
              Sponsored by{' '}
              <a
                href="https://www.instagram.com/shreealankar2112"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Shree Alankar
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
