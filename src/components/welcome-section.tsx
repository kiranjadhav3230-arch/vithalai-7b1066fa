import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, Lightbulb, Code2, BookOpen, PenLine, ArrowUpRight } from 'lucide-react';

interface WelcomeSectionProps {
  language: string;
  onSuggestionClick: (suggestion: string) => void;
  userName?: string;
}

const suggestionSets = {
  en: [
    { icon: BookOpen, text: 'Help me study for my exams', category: 'Study' },
    { icon: Lightbulb, text: 'Give me career guidance', category: 'Career' },
    { icon: Code2, text: 'Teach me programming basics', category: 'Code' },
    { icon: PenLine, text: 'Help me write an essay', category: 'Writing' },
  ],
  hi: [
    { icon: BookOpen, text: 'परीक्षा की तैयारी में मदद करो', category: 'अध्ययन' },
    { icon: Lightbulb, text: 'करियर गाइडेंस दो', category: 'करियर' },
    { icon: Code2, text: 'प्रोग्रामिंग सिखाओ', category: 'कोड' },
    { icon: PenLine, text: 'निबंध लिखने में मदद करो', category: 'लेखन' },
  ],
  mr: [
    { icon: BookOpen, text: 'परीक्षेची तयारी करायला मदत करा', category: 'अभ्यास' },
    { icon: Lightbulb, text: 'करिअर मार्गदर्शन द्या', category: 'करिअर' },
    { icon: Code2, text: 'प्रोग्रामिंग शिकवा', category: 'कोड' },
    { icon: PenLine, text: 'निबंध लिहायला मदत करा', category: 'लेखन' },
  ],
};

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({ language, onSuggestionClick, userName }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 60);
    return () => clearTimeout(timer);
  }, []);

  const t = useMemo(() => {
    const name = userName?.split(' ')[0] || '';
    if (language === 'hi') return {
      badge: 'विठ्ठल AI',
      greeting: name ? `नमस्ते, ${name}` : 'नमस्ते',
      subtitle: 'मैं आज आपकी कैसे मदद कर सकता हूँ?',
      promptsLabel: 'सुझाव',
    };
    if (language === 'mr') return {
      badge: 'विठ्ठल AI',
      greeting: name ? `नमस्कार, ${name}` : 'नमस्कार',
      subtitle: 'मी आज तुम्हाला कशी मदत करू शकतो?',
      promptsLabel: 'सूचना',
    };
    return {
      badge: 'Vithal AI',
      greeting: name ? `Hello, ${name}` : 'Hello there',
      subtitle: 'How can I help you today?',
      promptsLabel: 'Suggestions',
    };
  }, [language, userName]);

  const suggestions = suggestionSets[language as keyof typeof suggestionSets] || suggestionSets.en;

  return (
    <section className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Badge */}
      <div
        className={`flex justify-center mb-6 sm:mb-8 transition-all duration-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}
      >
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
          <Sparkles className="h-3 w-3" />
          {t.badge}
        </span>
      </div>

      {/* Hero greeting — Gemini style */}
      <div className="text-center mb-10 sm:mb-14 space-y-3">
        <h1
          className={`text-[clamp(2rem,7vw,3.75rem)] font-semibold tracking-tight leading-[1.1] transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
          style={{ transitionDelay: '120ms' }}
        >
          <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
            {t.greeting}
          </span>
        </h1>
        <p
          className={`text-[clamp(1.1rem,3.2vw,1.5rem)] text-muted-foreground font-light transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
          style={{ transitionDelay: '220ms' }}
        >
          {t.subtitle}
        </p>
      </div>

      {/* Suggestion cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
        {suggestions.map((s, i) => {
          const Icon = s.icon;
          return (
            <button
              key={i}
              onClick={() => onSuggestionClick(s.text)}
              className={`group relative flex items-start gap-3 rounded-2xl border border-border/60 bg-card/40 hover:bg-card hover:border-primary/40 backdrop-blur-sm p-4 text-left transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 active:scale-[0.98] ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              }`}
              style={{ transitionDelay: `${300 + i * 70}ms` }}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </span>
              <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-medium mb-1">
                  {s.category}
                </p>
                <p className="text-sm font-medium text-foreground leading-snug">
                  {s.text}
                </p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-1" />
            </button>
          );
        })}
      </div>

      {/* Footer credits */}
      <div
        className={`mt-10 pt-6 border-t border-border/40 text-center space-y-1 transition-all duration-700 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionDelay: '700ms' }}
      >
        <p className="text-[11px] text-muted-foreground">
          Powered by <span className="text-primary font-medium">Gemini AI</span> · Developed by{' '}
          <span className="text-primary font-medium">Kapil Kiran Jadhav</span>
        </p>
        <p className="text-[11px] text-muted-foreground">
          Sponsored by{' '}
          <a
            href="https://www.instagram.com/shreealankar2112?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-accent font-medium transition-colors hover:underline"
          >
            Shree Alankar
          </a>
        </p>
      </div>
    </section>
  );
};
