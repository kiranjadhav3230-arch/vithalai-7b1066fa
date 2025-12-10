import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, Sparkles } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const faqs = [
    {
      question: 'What is Vithal AI?',
      answer: 'Vithal AI is an comprehensive AI-powered learning platform designed specifically for Indian students. It offers features like AI chat assistance, code generation, study rooms, career guidance, and more - all powered by Google Gemini AI.'
    },
    {
      question: 'Is Vithal AI free to use?',
      answer: 'Yes! Vithal AI is completely free to use. You can access all features including AI chat, code generation, study rooms, and career guidance without any subscription or payment.'
    },
    {
      question: 'What languages does Vithal AI support?',
      answer: 'Vithal AI supports three languages: English, Hindi, and Marathi. You can switch between languages anytime from the language selector. For code generation, we support 15+ programming languages including Python, JavaScript, Java, C++, and more.'
    },
    {
      question: 'How does the Code Generator work?',
      answer: 'The Code Generator uses AI to help you write, debug, optimize, and translate code. Simply describe what you want to create, and it will generate production-ready code with syntax highlighting. You can also save code snippets to your library for later use.'
    },
    {
      question: 'What are Study Rooms?',
      answer: 'Study Rooms are collaborative spaces where you can study with friends or classmates. They feature real-time chat, AI assistance, message reactions, typing indicators, and member management - similar to WhatsApp groups but with built-in AI help.'
    },
    {
      question: 'Can I upload images and documents?',
      answer: 'Yes! You can upload images for AI analysis and problem-solving. You can also use your camera to take photos directly. The AI can help solve math problems, analyze diagrams, explain concepts from images, and more.'
    },
    {
      question: 'How does Voice Input work?',
      answer: 'Vithal AI supports voice input in English, Hindi, and Marathi. Simply click the microphone button and speak naturally. The AI will transcribe your speech and respond accordingly, making it perfect for hands-free learning.'
    },
    {
      question: 'What kind of career guidance does Vithal AI provide?',
      answer: 'Vithal AI offers personalized career guidance tailored to the Indian job market. It includes career assessments, skill recommendations, educational path suggestions, and advice based on your interests, strengths, and goals.'
    },
    {
      question: 'Is my data safe and private?',
      answer: 'Yes, we take data security seriously. All your conversations and data are encrypted and stored securely. We follow industry-standard security practices to protect your privacy and never share your personal information without consent.'
    },
    {
      question: 'How can I get help or report issues?',
      answer: 'You can reach out to our support team via email at vithalai2112@gmail.com or connect with us on Instagram @vithal.ai. We\'re always happy to help with any questions or issues you might have.'
    }
  ];

  return (
    <section id="faq" className="relative py-20 md:py-32 px-4 overflow-hidden bg-black">
      {/* Solid opaque background to block animations from other sections */}
      <div className="absolute inset-0 bg-black"></div>

      <div className="container mx-auto max-w-4xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16 animate-scaleIn">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-background/50 backdrop-blur-sm border border-primary/30 mb-6">
            <HelpCircle className="h-5 w-5 text-primary animate-pulse" />
            <span className="text-sm font-display font-semibold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Frequently Asked Questions
            </span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
            Got Questions?
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto font-sans leading-relaxed">
            Find answers to common questions about Vithal AI features and usage
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-background/50 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-8 border border-orange-500/20">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-orange-500/10 rounded-xl px-6 py-2 bg-background/30 hover:border-orange-500/30 transition-all duration-300"
              >
                <AccordionTrigger className="text-left hover:no-underline group">
                  <div className="flex items-start gap-3 pr-4">
                    <Sparkles className="h-5 w-5 text-primary mt-1 flex-shrink-0 group-hover:animate-pulse" />
                    <span className="font-display font-semibold text-foreground text-base md:text-lg group-hover:text-primary transition-colors">
                      {faq.question}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground font-sans text-sm md:text-base leading-relaxed pl-8 pr-4 pt-2 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Additional Help */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground font-sans text-base md:text-lg mb-4">
            Still have questions? We're here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:vithalai2112@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-display font-semibold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 transition-all duration-300"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Email Support
            </a>
            <a 
              href="https://www.instagram.com/vithal.ai?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-red-500 hover:from-orange-700 hover:to-red-600 text-white font-display font-semibold shadow-lg shadow-orange-600/30 hover:shadow-orange-600/50 hover:scale-105 transition-all duration-300"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              Instagram
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};