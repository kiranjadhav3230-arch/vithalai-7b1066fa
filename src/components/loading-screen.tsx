
import React from 'react';
import vithalLogo from '/lovable-uploads/86deae4c-83c0-473f-9e54-1500aa44cd3c.png';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center animate-pulse">
            <img 
              src={vithalLogo} 
              alt="Vithal AI Logo" 
              className="h-16 w-16 animate-bounce"
            />
          </div>
          
          {/* Rotating ring around logo */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
        </div>
        
        {/* App Name with gradient animation */}
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse">
          Vithal AI
        </h1>
        
        {/* Tagline */}
        <p className="text-lg text-muted-foreground mb-6 animate-fade-in">
          Your AI-powered study companion
        </p>
        
        {/* Loading dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        
        {/* Loading text */}
        <p className="text-sm text-muted-foreground mt-4 animate-pulse">
          Loading your personalized experience...
        </p>
      </div>
    </div>
  );
};
