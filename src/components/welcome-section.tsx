import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, ArrowUpRight } from 'lucide-react';

interface WelcomeSectionProps {
  language: string;
  onSuggestionClick: (suggestion: string) => void;
}

const allSuggestions = {
  en: [
    { icon: '📚', text: 'Help me study for my exams', category: 'Study' },
    { icon: '🎯', text: 'Give me career guidance', category: 'Career' },
    { icon: '💻', text: 'Teach me programming', category: 'Code' },
    { icon: '📝', text: 'Help me write an essay', category: 'Writing' },
    { icon: '🧮', text: 'Solve a math problem', category: 'Math' },
    { icon: '🔬', text: 'Explain a science concept', category: 'Science' },
    { icon: '🎨', text: 'Give me creative ideas', category: 'Creative' },
    { icon: '💼', text: 'Prepare me for an interview', category: 'Career' },
  ],
  hi: [
    { icon: '📚', text: 'परीक्षा की तैयारी में मदद करो', category: 'अध्ययन' },
    { icon: '🎯', text: 'करियर गाइडेंस दो', category: 'करियर' },
    { icon: '💻', text: 'प्रोग्रामिंग सिखाओ', category: 'कोड' },
    { icon: '📝', text: 'निबंध लिखने में मदद करो', category: 'लेखन' },
    { icon: '🧮', text: 'गणित का सवाल हल करो', category: 'गणित' },
    { icon: '🔬', text: 'विज्ञान समझाओ', category: 'विज्ञान' },
    { icon: '🎨', text: 'क्रिएटिव आइडियाज दो', category: 'क्रिएटिव' },
    { icon: '💼', text: 'इंटरव्यू की तैयारी कराओ', category: 'करियर' },
  ],
  mr: [
    { icon: '📚', text: 'परीक्षेची तयारी करायला मदत करा', category: 'अभ्यास' },
    { icon: '🎯', text: 'करिअर मार्गदर्शन द्या', category: 'करिअर' },
    { icon: '💻', text: 'प्रोग्रामिंग शिकवा', category: 'कोड' },
    { icon: '📝', text: 'निबंध लिहायला मदत करा', category: 'लेखन' },
    { icon: '🧮', text: 'गणिताचा प्रश्न सोडवा', category: 'गणित' },
    { icon: '🔬', text: 'विज्ञान समजावून सांगा', category: 'विज्ञान' },
    { icon: '🎨', text: 'क्रिएटिव्ह आयडियाज द्या', category: 'क्रिएटिव्ह' },
    { icon: '💼', text: 'मुलाखतीची तयारी करा', category: 'करिअर' },
  ],
};

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({ language, onSuggestionClick }) => {
  const [isVisible, setIsVisible] = useState(false);

  const t = useMemo(() => {
    if (language === 'hi') return {
      badge: 'AI सहायक',
      greeting: 'नमस्ते 🙏',
      title: 'मैं विठ्ठल AI हूँ',
      subtitle: 'आपका त्रिभाषी सीखने वाला साथी। नीचे टाइप करें या एक सुझाव चुनें।',
      promptsLabel: 'सुझाव',
    };
    if (language === 'mr') return {
      badge: 'AI सहाय्यक',
      greeting: 'नमस्कार 🙏',
      title: 'मी विठ्ठल AI आहे',
      subtitle: 'तुमचा त्रिभाषी शिकण्याचा सोबती. खाली टाइप करा किंवा सूचना निवडा.',
      promptsLabel: 'सूचना',
    };
    return {
      badge: 'AI Assistant',
      greeting: 'Hello 👋',
      title: "I'm Vithal AI",
      subtitle: 'Your trilingual learning companion. Type below or pick a suggestion to begin.',
      promptsLabel: 'Try asking',
    };
  }, [language]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 80);
    return () => clearTimeout(timer);
  }, []);

  const suggestions = useMemo(() => {
    const list = allSuggestions[language as keyof typeof allSuggestions] || allSuggestions.en;
    return [...list].sort(() => Math.random() - 0.5).slice(0, 4);
  }, [language]);

  return (
    <section className="w-full max-w-3xl mx-auto px-4 py-8 sm:py-10">
      {/* Badge */}
      <div
        className={`flex justify-center mb-6 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}
      >
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
          <Sparkles className="h-3 w-3" />
          {t.badge}
        </span>
      </div>

      {/* Logo */}
      <div
        className={`relative mx-auto w-20 h-20 sm:w-24 sm:h-24 mb-6 transition-all duration-700 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        }`}
        style={{ transitionDelay: '100ms' }}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-accent/20 blur-2xl" />
        <div className="relative w-full h-full rounded-full ring-1 ring-primary/30 bg-background/60 backdrop-blur-sm p-2">
          <img
            src="/lovable-uploads/41c38d97508445bab63b1cf32b4c255d-removebg-preview.png"
            alt="Vithal AI"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Heading */}
      <div className="text-center mb-8 space-y-2">
        <p
          className={`text-sm sm:text-base text-muted-foreground transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          {t.greeting}
        </p>
        <h1
          className={`text-[clamp(1.75rem,4vw,2.75rem)] font-bold tracking-tight gradient-text-orange transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
          style={{ transitionDelay: '280ms' }}
        >
          {t.title}
        </h1>
        <p
          className={`text-sm sm:text-base text-muted-foreground max-w-md mx-auto leading-relaxed transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
          style={{ transitionDelay: '360ms' }}
        >
          {t.subtitle}
        </p>
      </div>

      {/* Suggestions label */}
      <div
        className={`flex items-center gap-3 mb-3 transition-all duration-700 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionDelay: '440ms' }}
      >
        <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground/70 font-semibold">
          {t.promptsLabel}
        </span>
        <div className="flex-1 h-px bg-border/60" />
      </div>

      {/* Suggestion cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onSuggestionClick(s.text)}
            className={`group relative flex items-center gap-3 rounded-2xl border border-border/60 bg-card/40 hover:bg-card hover:border-primary/40 backdrop-blur-sm px-4 py-3 text-left transition-all duration-300 hover:shadow-md hover:shadow-primary/5 hover:-translate-y-0.5 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            }`}
            style={{ transitionDelay: `${500 + i * 70}ms` }}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-base">
              {s.icon}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-medium mb-0.5">
                {s.category}
              </p>
              <p className="text-sm font-medium text-foreground truncate">
                {s.text}
              </p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </button>
        ))}
      </div>

      {/* Footer credits */}
      <div
        className={`mt-8 pt-6 border-t border-border/40 text-center space-y-1 transition-all duration-700 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionDelay: '900ms' }}
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
