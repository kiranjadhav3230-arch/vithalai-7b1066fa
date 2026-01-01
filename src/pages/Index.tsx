import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ModernHeader } from '@/components/modern-header';
import { ModernHero } from '@/components/modern-hero';
import { ModernHowItWorks } from '@/components/modern-how-it-works';
import { ComprehensiveFeatures } from '@/components/comprehensive-features';
import { HaqJaanoFeatureSection } from '@/components/haq-jaano-feature-section';
import { CodeGeneratorSection } from '@/components/code-generator-section';
import { FeatureShowcaseCarousel } from '@/components/feature-showcase-carousel';
import { FaqSection } from '@/components/faq-section';
import { AuthModal } from '@/components/auth-modal';
import { ChatInterface } from '@/components/chat-interface';
import { LoadingScreen } from '@/components/loading-screen';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import type { User, Session } from '@supabase/supabase-js';

const Index = () => {
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [initialView, setInitialView] = useState<'chat' | 'code' | 'studyRooms' | 'crop' | 'haq-jaano'>('chat');
  const {
    t
  } = useLanguage();

  // Handle navigation from other pages
  useEffect(() => {
    const state = location.state as { openFeature?: 'chat' | 'room' | 'haq-jaano' } | null;
    if (state?.openFeature) {
      if (state.openFeature === 'room') {
        setInitialView('studyRooms');
      } else if (state.openFeature === 'haq-jaano') {
        setInitialView('haq-jaano');
      } else {
        setInitialView('chat');
      }
      // Clear the state so it doesn't persist on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  useEffect(() => {
    // Show initial loading briefly
    const minLoadingTime = setTimeout(() => {
      setInitialLoading(false);
    }, 500);

    // Set up auth state listener
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      // Check for ban status when user signs in
      if (session?.user) {
        setTimeout(() => {
          supabase.from('user_bans').select('*').eq('user_id', session.user.id).single().then(({
            data: banData
          }) => {
            if (banData) {
              // User is banned, logout immediately
              supabase.auth.signOut();
              const unbanMessage = banData.unban_date ? ` This account will be unblocked on ${new Date(banData.unban_date).toLocaleDateString()}.` : ' Please contact support for more information.';
              alert(`You are blocked by Vithal AI Team due to: ${banData.ban_reason}.${unbanMessage}`);
            }
          });
        }, 0);
      }
      if (!initialLoading) {
        setLoading(false);
      }
    });

    // Check for existing session
    supabase.auth.getSession().then(({
      data: {
        session
      }
    }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!initialLoading) {
        setLoading(false);
      }
    });

    // Clean up
    return () => {
      clearTimeout(minLoadingTime);
      subscription.unsubscribe();
    };
  }, [initialLoading]);
  useEffect(() => {
    if (!initialLoading) {
      setLoading(false);
    }
  }, [initialLoading]);
  const handleGetStarted = () => {
    if (user) {
      setShowChat(true);
    } else {
      setShowAuth(true);
    }
  };
  const handleAuthSuccess = () => {
    setShowAuth(false);
    setShowChat(true);
  };
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowChat(false);
  };

  // Show loading screen during initial load
  if (loading || initialLoading) {
    return <LoadingScreen />;
  }

  // Show chat interface if user is logged in
  if (user && showChat) {
    return <ChatInterface user={user} onLogout={handleLogout} initialView={initialView} />;
  }

  // Show chat interface by default for logged in users
  if (user) {
    return <ChatInterface user={user} onLogout={handleLogout} initialView={initialView} />;
  }

  // Show landing page
  return <div className="min-h-screen bg-black relative overflow-hidden">
      <ModernHeader onAuthClick={() => setShowAuth(true)} />
      
      <main className="relative">
        <ModernHero onGetStarted={handleGetStarted} />
        <ModernHowItWorks />
        <HaqJaanoFeatureSection />
        <ComprehensiveFeatures />
        <FaqSection />
          
        {/* CTA Section */}
        <section id="contact" className="py-16 md:py-24 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-orange-950/10 to-black"></div>
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-orange-500/40 to-transparent blur-[120px] animate-pulse-glow"></div>
          </div>
          
          <div className="container mx-auto text-center relative z-10">
            <div className="max-w-2xl mx-auto space-y-6 md:space-y-8">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-display font-bold bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent animate-scaleIn">
                {t('readyToStart')}
              </h2>
              <p className="text-muted-foreground text-sm md:text-lg max-w-xl mx-auto font-sans">
                {t('joinThousands')}
              </p>
              <Button 
                onClick={handleGetStarted} 
                size="lg" 
                className="w-full sm:w-auto px-8 md:px-12 py-5 md:py-6 text-base md:text-lg rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-display font-semibold shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 transition-all duration-300"
              >
                {t('startNow')}
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-orange-500/10 py-8 md:py-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black to-orange-950/5"></div>
        <div className="container mx-auto px-4 text-center relative z-10 space-y-4 md:space-y-6">
          <p className="text-sm md:text-base font-display text-foreground/80">&copy; 2025 {t('appName')}</p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <span className="text-xs md:text-sm font-display font-semibold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">Powered by Gemini AI</span>
            </div>
            <span className="hidden sm:inline text-orange-500/30">•</span>
            <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <span className="text-xs md:text-sm font-display font-semibold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">Developed by Kapil Kiran Jadhav</span>
            </div>
          </div>
          
          {/* Contact Links */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button 
              onClick={() => window.open('mailto:vithalai2112@gmail.com', '_blank')}
              className="p-2 rounded-full bg-white/5 border border-white/10 hover:border-orange-500/30 hover:bg-orange-500/10 transition-all duration-300"
              aria-label="Email"
            >
              <svg className="h-4 w-4 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </button>
            <button 
              onClick={() => window.open('https://www.instagram.com/vithal.ai', '_blank')}
              className="p-2 rounded-full bg-white/5 border border-white/10 hover:border-orange-500/30 hover:bg-orange-500/10 transition-all duration-300"
              aria-label="Instagram"
            >
              <svg className="h-4 w-4 text-muted-foreground" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </button>
          </div>
        </div>
      </footer>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} onSuccess={handleAuthSuccess} />
    </div>;
};
export default Index;