import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { GlassHeader } from '@/components/glass-header';
import { GlassHero } from '@/components/glass-hero';
import { GlassFeatures } from '@/components/glass-features';
import { GlassHowItWorks } from '@/components/glass-how-it-works';
import { GlassFaq } from '@/components/glass-faq';
import { GlassFooter } from '@/components/glass-footer';
import { AuthModal } from '@/components/auth-modal';
import { ChatInterface } from '@/components/chat-interface';
import { LoadingScreen } from '@/components/loading-screen';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import type { User, Session } from '@supabase/supabase-js';

const Index = () => {
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [, setSession] = useState<Session | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [initialView, setInitialView] = useState<'chat' | 'code' | 'studyRooms' | 'crop' | 'haq-jaano'>('chat');

  useEffect(() => {
    const state = location.state as { openFeature?: 'chat' | 'room' | 'haq-jaano' } | null;
    if (state?.openFeature) {
      if (state.openFeature === 'room') setInitialView('studyRooms');
      else if (state.openFeature === 'haq-jaano') setInitialView('haq-jaano');
      else setInitialView('chat');
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    const minLoadingTime = setTimeout(() => setInitialLoading(false), 500);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setTimeout(() => {
          supabase.from('user_bans').select('*').eq('user_id', session.user.id).single().then(({ data: banData }) => {
            if (banData) {
              supabase.auth.signOut();
              const unbanMessage = banData.unban_date ? ` This account will be unblocked on ${new Date(banData.unban_date).toLocaleDateString()}.` : ' Please contact support for more information.';
              alert(`You are blocked by Vithal AI Team due to: ${banData.ban_reason}.${unbanMessage}`);
            }
          });
        }, 0);
      }
      if (!initialLoading) setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!initialLoading) setLoading(false);
    });

    return () => { clearTimeout(minLoadingTime); subscription.unsubscribe(); };
  }, [initialLoading]);

  useEffect(() => {
    if (!initialLoading) setLoading(false);
  }, [initialLoading]);

  const handleGetStarted = () => {
    if (user) setShowChat(true);
    else setShowAuth(true);
  };

  const handleAuthSuccess = () => { setShowAuth(false); setShowChat(true); };
  const handleLogout = async () => { await supabase.auth.signOut(); setShowChat(false); };

  if (loading || initialLoading) return <LoadingScreen />;
  if (user && showChat) return <ChatInterface user={user} onLogout={handleLogout} initialView={initialView} />;
  if (user) return <ChatInterface user={user} onLogout={handleLogout} initialView={initialView} />;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <GlassHeader onAuthClick={() => setShowAuth(true)} />

      <main className="relative">
        <GlassHero onGetStarted={handleGetStarted} />
        <GlassFeatures />
        <GlassHowItWorks />
        <GlassShowcase />
        <GlassFaq />

        {/* Final CTA */}
        <section className="relative py-20 md:py-28 px-4 overflow-hidden">
          <div className="container mx-auto max-w-3xl">
            <div className="glass-card p-10 md:p-16 text-center space-y-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-amber-500/10 pointer-events-none" />
              <div className="relative space-y-6">
                <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight">
                  Ready to <span className="gradient-text-orange">get started?</span>
                </h2>
                <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
                  Join thousands using Vithal AI every day. Free forever, no card required.
                </p>
                <Button
                  onClick={handleGetStarted}
                  size="lg"
                  className="px-10 py-6 text-base rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold border-0 glow-pulse"
                >
                  Start Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <GlassFooter />

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} onSuccess={handleAuthSuccess} />
    </div>
  );
};

export default Index;
