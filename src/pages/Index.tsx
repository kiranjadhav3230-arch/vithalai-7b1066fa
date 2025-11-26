import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ModernHeader } from '@/components/modern-header';
import { ModernHero } from '@/components/modern-hero';
import { ModernHowItWorks } from '@/components/modern-how-it-works';
import { ComprehensiveFeatures } from '@/components/comprehensive-features';
import { CodeGeneratorSection } from '@/components/code-generator-section';
import { AuthModal } from '@/components/auth-modal';
import { ChatInterface } from '@/components/chat-interface';
import { LoadingScreen } from '@/components/loading-screen';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import type { User, Session } from '@supabase/supabase-js';
const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const {
    t
  } = useLanguage();
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
    return <ChatInterface user={user} onLogout={handleLogout} />;
  }

  // Show chat interface by default for logged in users
  if (user) {
    return <ChatInterface user={user} onLogout={handleLogout} />;
  }

  // Show landing page
  return <div className="min-h-screen bg-black relative overflow-hidden">
      <ModernHeader onAuthClick={() => setShowAuth(true)} />
      
      <main className="relative">
        <ModernHero onGetStarted={handleGetStarted} />
        <ModernHowItWorks />
        <ComprehensiveFeatures />
        <CodeGeneratorSection onGetStarted={handleGetStarted} />
          
          {/* Help Section */}
          <section id="help" className="py-20 md:py-32 px-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-black via-orange-950/10 to-black"></div>
            <div className="absolute inset-0 overflow-hidden opacity-30">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-orange-500/30 to-transparent blur-[140px] animate-pulse-glow"></div>
            </div>
            
            <div className="container mx-auto max-w-5xl relative z-10">
              <div className="text-center mb-12 md:mb-16 animate-scaleIn px-4">
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold mb-4 md:mb-6 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                  {t('needHelp') || 'Need Help?'}
                </h2>
                <p className="text-muted-foreground text-base md:text-xl max-w-2xl mx-auto font-sans">
                  We're here to support your career journey
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 stagger-animation px-4">
                <Card variant="glass" className="p-6 md:p-10 morph-shape glass-reflection hover:scale-105 transition-all duration-500 group">
                  <h3 className="text-xl md:text-2xl font-display font-bold mb-4 md:mb-6 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">Get Support</h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6 font-sans leading-relaxed">
                    Have questions or need assistance? Our support team is here to help you.
                  </p>
                  <div className="space-y-3 md:space-y-4">
                    <Button onClick={() => window.open('mailto:vithalai2112@gmail.com', '_blank')} className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-display font-semibold py-5 md:py-6 text-sm md:text-base rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 transition-all duration-300">
                      <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      Email Support
                    </Button>
                    <Button onClick={() => window.open('https://www.instagram.com/vithal.ai?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==', '_blank')} className="w-full bg-gradient-to-r from-orange-600 to-red-500 hover:from-orange-700 hover:to-red-600 text-white font-display font-semibold py-5 md:py-6 text-sm md:text-base rounded-xl shadow-lg shadow-orange-600/30 hover:shadow-orange-600/50 hover:scale-105 transition-all duration-300">
                      <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                      Instagram
                    </Button>
                  </div>
                </Card>
                
                <Card variant="glass" className="p-6 md:p-10 morph-shape glass-reflection hover:scale-105 transition-all duration-500 group">
                  <h3 className="text-xl md:text-2xl font-display font-bold mb-4 md:mb-6 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">Quick Tips</h3>
                  <ul className="space-y-3 md:space-y-4 text-sm md:text-base text-muted-foreground font-sans">
                    <li className="flex items-start gap-3">
                      <span className="text-primary text-xl">✓</span>
                      <span>Use voice input for natural conversations</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary text-xl">✓</span>
                      <span>Upload images for problem solving</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary text-xl">✓</span>
                      <span>Upload PDFs for document analysis</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary text-xl">✓</span>
                      <span>Take photos directly with camera</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary text-xl">✓</span>
                      <span>Ask in Marathi, Hindi, or English</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary text-xl">✓</span>
                      <span>Get personalized career guidance</span>
                    </li>
                  </ul>
                </Card>
              </div>
            </div>
          </section>
        
        {/* Contact Section */}
        <section id="contact" className="py-20 md:py-32 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-orange-950/20 to-black"></div>
          <div className="absolute inset-0 overflow-hidden opacity-30">
            <div className="absolute top-[20%] left-[10%] w-[700px] h-[700px] rounded-full bg-gradient-to-br from-orange-500/40 to-transparent blur-[150px] animate-float-slow"></div>
            <div className="absolute bottom-[20%] right-[10%] w-[800px] h-[800px] rounded-full bg-gradient-to-tl from-orange-600/35 to-transparent blur-[160px] animate-float" style={{
            animationDelay: '2s'
          }}></div>
          </div>
          
          <div className="container mx-auto text-center relative z-10">
            <div className="max-w-4xl mx-auto space-y-8 md:space-y-12 px-4">
              <h2 className="text-3xl md:text-5xl lg:text-7xl font-display font-bold mb-4 md:mb-6 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent animate-scaleIn">
                {t('readyToStart')}
              </h2>
              <p className="text-muted-foreground text-base md:text-xl lg:text-2xl mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed font-sans animate-fadeInUp" style={{
              animationDelay: '0.2s'
            }}>
                {t('joinThousands')}
              </p>
              <div className="animate-scaleIn" style={{
              animationDelay: '0.4s'
            }}>
                <Button onClick={handleGetStarted} size="lg" className="w-full sm:w-auto px-10 md:px-14 py-6 md:py-8 text-lg md:text-xl lg:text-2xl rounded-xl md:rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-display font-bold shadow-2xl shadow-orange-500/50 hover:shadow-orange-500/70 hover:scale-110 transition-all duration-500 morph-shape">
                  {t('startNow')}
                </Button>
              </div>
            </div>
          </div>
        </section>
        </main>

        <footer className="relative border-t border-orange-500/20 py-12 md:py-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black to-orange-950/10"></div>
          <div className="container mx-auto px-4 text-center relative z-10 space-y-6 md:space-y-8">
            <p className="text-base md:text-xl font-display text-foreground/90">&copy; 2024 {t('appName')}. {t('professionalDescription')}</p>
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6">
              <div className="liquid-glass-intense px-4 md:px-6 py-2 md:py-3 rounded-xl border border-orange-500/20 morph-shape">
                <span className="text-sm md:text-base font-display font-semibold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">Powered by Gemini AI</span>
              </div>
              <span className="text-orange-500/50 hidden md:inline">•</span>
              
              
              <div className="liquid-glass-intense px-4 md:px-6 py-2 md:py-3 rounded-xl border border-orange-500/20 morph-shape">
                <span className="text-sm md:text-base font-display font-semibold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">Developed by Kapil Kiran Jadhav</span>
              </div>
            </div>
          </div>
        </footer>

        <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} onSuccess={handleAuthSuccess} />
    </div>;
};
export default Index;