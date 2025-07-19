import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/header';
import { HeroSection } from '@/components/hero-section';
import { HowItWorksSection } from '@/components/how-it-works-section';
import { FeaturesSection } from '@/components/features-section';
import { AuthModal } from '@/components/auth-modal';
import { ChatInterface } from '@/components/chat-interface';
import type { User, Session } from '@supabase/supabase-js';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen bg-background">
      <Header onAuthClick={() => setShowAuth(true)} />
      
      <main>
        <HeroSection onGetStarted={handleGetStarted} />
        <HowItWorksSection />
        <FeaturesSection />
        
        {/* Contact Section */}
        <section id="contact" className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Career Journey?</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of Indian youth who have discovered their perfect career path with Vithal AI
            </p>
            <button 
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-lg font-semibold text-lg hover:shadow-lg transition-shadow"
            >
              Start Your Assessment Now
            </button>
          </div>
        </section>
      </main>

      <footer className="bg-card border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 Vithal AI Assistance. Empowering Indian Youth with AI-Powered Career Guidance.</p>
        </div>
      </footer>

      <AuthModal 
        isOpen={showAuth} 
        onClose={() => setShowAuth(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default Index;
