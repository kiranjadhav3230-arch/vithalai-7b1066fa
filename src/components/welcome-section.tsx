import React, { useState, useEffect, useMemo } from 'react';
import { Lightbulb, Code2, BookOpen, PenLine, ArrowUpRight } from 'lucide-react';

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
      greeting: name ? `नमस्ते, ${name}` : 'नमस्ते',
      subtitle: 'मैं आज आपकी कैसे मदद कर सकता हूँ?',
    };
    if (language === 'mr') return {
      greeting: name ? `नमस्कार, ${name}` : 'नमस्कार',
      subtitle: 'मी आज तुम्हाला कशी मदत करू शकतो?',
    };
    return {
      greeting: name ? `Hello, ${name}` : 'Hello there',
      subtitle: 'How can I help you today?',
    };
  }, [language, userName]);

  const suggestions = suggestionSets[language as keyof typeof suggestionSets] || suggestionSets.en;

  return (
    <section className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
      {/* Hero greeting — compact Gemini style */}
      <div className="text-center mb-6 sm:mb-8 space-y-1.5">
        <h1
          className={`text-[clamp(1.75rem,5.5vw,2.75rem)] font-semibold tracking-tight leading-[1.1] transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
            {t.greeting}
          </span>
        </h1>
        <p
          className={`text-sm sm:text-base text-muted-foreground transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
          style={{ transitionDelay: '120ms' }}
        >
          {t.subtitle}
        </p>
      </div>

      {/* Suggestion cards — compact 2x2 grid */}
      <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
        {suggestions.map((s, i) => {
          const Icon = s.icon;
          return (
            <button
              key={i}
              onClick={() => onSuggestionClick(s.text)}
              className={`group relative flex flex-col gap-2 rounded-2xl border border-border/60 bg-card/40 hover:bg-card hover:border-primary/40 backdrop-blur-sm p-3 sm:p-3.5 text-left transition-all duration-300 hover:shadow-md hover:shadow-primary/5 active:scale-[0.98] ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
              style={{ transitionDelay: `${200 + i * 60}ms` }}
            >
              <div className="flex items-center justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
              </div>
              <p className="text-xs sm:text-sm font-medium text-foreground leading-snug line-clamp-2">
                {s.text}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
};
