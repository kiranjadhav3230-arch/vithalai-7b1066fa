import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  {
    q: 'Is Vithal AI free to use?',
    a: 'Yes. All four core tools—AI Chat, Haq Jaano, Study Rooms, and Code Generator—are completely free to use after signing up.',
  },
  {
    q: 'Which AI model powers the chat?',
    a: "We use Google's Gemini AI for fast, accurate, multilingual responses across English, Hindi, and Marathi.",
  },
  {
    q: 'Are my chats private?',
    a: 'Yes. We support end-to-end encryption for chat messages. Your encryption key never leaves your browser, and messages are AES-256 encrypted at rest.',
  },
  {
    q: 'Can I use Haq Jaano without signing up?',
    a: 'Sign-up is required to access personalized rights guidance, save your history, and use SOS features.',
  },
  {
    q: 'Does the Code Generator support multiple files?',
    a: 'Yes. The Code Library is a full VS Code-style IDE with multi-file projects, tabs, terminal output, and live execution.',
  },
];

export const GlassFaq: React.FC = () => {
  return (
    <section className="relative py-24 md:py-32 px-4 overflow-hidden">
      <div className="absolute right-0 bottom-0 w-[400px] h-[400px] rounded-full bg-orange-500/10 blur-[120px]" />

      <div className="container mx-auto relative max-w-3xl">
        <div className="text-center mb-12 md:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-surface text-xs font-medium text-primary">
            FAQ
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tight">
            Questions? <span className="gradient-text-orange">Answered.</span>
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="glass-card border-0 px-6 data-[state=open]:border-orange-500/30"
            >
              <AccordionTrigger className="text-left font-display text-base md:text-lg font-semibold hover:no-underline py-5">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm md:text-base leading-relaxed pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
