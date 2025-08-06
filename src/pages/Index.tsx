import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/header';
import { HeroSection } from '@/components/hero-section';
import { HowItWorksSection } from '@/components/how-it-works-section';
import { FeaturesSection } from '@/components/features-section';
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
  const { t } = useLanguage();

  useEffect(() => {
    // Show initial loading for at least 2 seconds for better UX
    const minLoadingTime = setTimeout(() => {
      setInitialLoading(false);
    }, 2000);

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (!initialLoading) {
          setLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
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
    return (
      <ChatInterface user={user} onLogout={handleLogout} />
    );
  }

  // Show chat interface by default for logged in users
  if (user) {
    return (
      <ChatInterface user={user} onLogout={handleLogout} />
    );
  }

  // Show landing page
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Tech Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10">
        <Header onAuthClick={() => setShowAuth(true)} />
        
        <main>
          <HeroSection onGetStarted={handleGetStarted} />
          <HowItWorksSection />
          <FeaturesSection />
          
          {/* Help Section */}
          <section id="help" className="py-20 px-4">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {t('needHelp') || 'Need Help?'}
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-6 glass-morphism border border-primary/20">
                  <h3 className="text-xl font-semibold mb-4 text-primary">Get Support</h3>
                  <p className="text-muted-foreground mb-4">
                    Have questions or need assistance? Our support team is here to help you.
                  </p>
                  <div className="space-y-3">
                    <Button 
                      onClick={() => window.open('mailto:vithalai2112@gmail.com', '_blank')}
                      className="w-full"
                      variant="outline"
                    >
                      <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                      </svg>
                      Email Support
                    </Button>
                    <Button 
                      onClick={() => window.open('https://instagram.com/vithalai2112', '_blank')}
                      className="w-full"
                      variant="outline"
                    >
                      <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                      Instagram
                    </Button>
                  </div>
                </Card>
                
                <Card className="p-6 glass-morphism border border-accent/20">
                  <h3 className="text-xl font-semibold mb-4 text-accent">Quick Tips</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Use voice input for natural conversations</li>
                    <li>• Upload images for problem solving</li>
                    <li>• Upload PDFs for document analysis</li>
                    <li>• Take photos directly with camera</li>
                    <li>• Ask in Marathi, Hindi, or English</li>
                    <li>• Get personalized career guidance</li>
                  </ul>
                </Card>
              </div>
            </div>
          </section>
        
        {/* Contact Section */}
        <section id="contact" className="py-20 px-4 tech-card">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t('readyToStart')}
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-3xl mx-auto leading-relaxed">
              {t('joinThousands')}
            </p>
            <button 
              onClick={handleGetStarted}
              className="neon-border bg-gradient-to-r from-primary to-accent text-primary-foreground px-10 py-4 rounded-xl font-semibold text-lg hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] transition-all duration-300 transform hover:scale-105"
            >
              {t('startNow')}
            </button>
          </div>
        </section>
        </main>

        <footer className="glass-morphism border-t py-12">
          <div className="container mx-auto px-4 text-center text-muted-foreground space-y-4">
            <p className="text-lg">&copy; 2024 {t('appName')}. {t('professionalDescription')}</p>
            <div className="flex justify-center items-center gap-4 text-sm">
              <span className="neon-border px-4 py-2 rounded-full">
                <span className="font-semibold text-primary">{t('madeBy')}</span>
              </span>
              <span className="text-muted-foreground">|</span>
              <span className="neon-border px-4 py-2 rounded-full">
                <span className="font-semibold text-accent">{t('poweredBy')}</span>
              </span>
            </div>
          </div>
        </footer>

        <AuthModal 
          isOpen={showAuth} 
          onClose={() => setShowAuth(false)}
          onSuccess={handleAuthSuccess}
        />
      </div>
    </div>
  );
};

export default Index;
