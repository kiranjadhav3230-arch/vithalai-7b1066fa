import React, { useEffect, useState } from 'react';
import vithalLogo from '@/assets/vithal-ai-logo-new.png';

export const StudyRoomWelcomeAnimation: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onComplete(), 300); // Wait for fade out
    }, 5000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-secondary/20 backdrop-blur-sm animate-fade-in">
      {/* Floating book icons in background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-primary/10 animate-float">
          <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/>
          </svg>
        </div>
        <div className="absolute top-40 right-20 text-primary/10 animate-float" style={{ animationDelay: '1s' }}>
          <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
          </svg>
        </div>
        <div className="absolute bottom-32 left-1/4 text-primary/10 animate-float" style={{ animationDelay: '2s' }}>
          <svg className="w-14 h-14" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
          </svg>
        </div>
        <div className="absolute bottom-20 right-1/3 text-primary/10 animate-float" style={{ animationDelay: '0.5s' }}>
          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center animate-scale-in">
        {/* Logo with pulse effect */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
          <img 
            src={vithalLogo} 
            alt="Vithal AI" 
            className="w-32 h-32 mx-auto relative animate-bounce-slow"
            style={{ 
              animation: 'bounce 2s ease-in-out infinite',
              filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.2))'
            }}
          />
        </div>

        {/* Welcome text with typing effect */}
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent animate-fade-in">
          Welcome to
        </h1>
        <h2 className="text-6xl font-extrabold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-fade-in" style={{ animationDelay: '0.3s' }}>
          Vithal AI Study Room
        </h2>
        
        {/* Animated subtitle */}
        <p className="text-xl text-muted-foreground animate-fade-in" style={{ animationDelay: '0.6s' }}>
          Let's learn together! 📚
        </p>

        {/* Progress bar */}
        <div className="mt-8 w-64 mx-auto">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-secondary animate-progress"
              style={{
                animation: 'progress 5s linear forwards'
              }}
            ></div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        
        .animate-progress {
          animation: progress 5s linear forwards;
        }
      `}</style>
    </div>
  );
};
