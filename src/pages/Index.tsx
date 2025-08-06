import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/header';
import { HeroSection } from '@/components/hero-section';
import { HowItWorksSection } from '@/components/how-it-works-section';
import { FeaturesSection } from '@/components/features-section';
import { AuthModal } from '@/components/auth-modal';
import { ChatInterface } from '@/components/chat-interface';
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
  const { t } = useLanguage();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <img 
            src="/lovable-uploads/86deae4c-83c0-473f-9e54-1500aa44cd3c.png" 
            alt="Vithal AI Logo" 
            className="h-16 w-16 mx-auto mb-4 animate-pulse"
          />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
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
                  <Button 
                    onClick={() => window.open('mailto:vithalai2112@gmail.com', '_blank')}
                    className="w-full"
                    variant="outline"
                  >
                    <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                    </svg>
                    vithalai2112@gmail.com
                  </Button>
                </Card>
                
                <Card className="p-6 glass-morphism border border-accent/20">
                  <h3 className="text-xl font-semibold mb-4 text-accent">Quick Tips</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Use voice input for natural conversations</li>
                    <li>• Upload images for problem solving</li>
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
