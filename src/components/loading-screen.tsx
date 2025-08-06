
import React from 'react';
import vithalLogo from '/lovable-uploads/86deae4c-83c0-473f-9e54-1500aa44cd3c.png';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/10 relative overflow-hidden">
      {/* Background animated elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/30 rounded-full animate-ping" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-accent/40 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-primary/20 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-accent/30 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="text-center relative z-10">
        {/* Professional Logo Container */}
        <div className="relative mb-12">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full border-2 border-transparent border-t-primary border-r-primary/50 animate-spin" style={{ animation: 'spin 3s linear infinite' }}></div>
          
          {/* Middle pulse ring */}
          <div className="absolute inset-2 w-28 h-28 mx-auto rounded-full border border-accent/30 animate-pulse"></div>
          
          {/* Logo container with professional glow */}
          <div className="relative w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center shadow-2xl backdrop-blur-sm border border-primary/20">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shadow-inner animate-[pulse_2s_ease-in-out_infinite]">
              <img 
                src={vithalLogo} 
                alt="Vithal AI Logo" 
                className="h-14 w-14 object-contain filter drop-shadow-lg animate-[float_3s_ease-in-out_infinite]"
              />
            </div>
          </div>
        </div>
        
        {/* Professional App Name */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-[fadeInUp_1s_ease-out]">
            Vithal AI
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full animate-[scaleX_1.5s_ease-out]"></div>
        </div>
        
        {/* Professional Tagline */}
        <p className="text-xl text-muted-foreground mb-8 animate-[fadeIn_1.5s_ease-out] font-medium">
          Your AI-powered study companion
        </p>
        
        {/* Enhanced Loading Animation */}
        <div className="mb-6">
          <div className="flex justify-center items-center space-x-1 mb-4">
            <div className="w-2 h-8 bg-gradient-to-t from-primary to-accent rounded-full animate-[wave_1.5s_ease-in-out_infinite]" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-6 bg-gradient-to-t from-primary to-accent rounded-full animate-[wave_1.5s_ease-in-out_infinite]" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-10 bg-gradient-to-t from-primary to-accent rounded-full animate-[wave_1.5s_ease-in-out_infinite]" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-6 bg-gradient-to-t from-primary to-accent rounded-full animate-[wave_1.5s_ease-in-out_infinite]" style={{ animationDelay: '0.3s' }}></div>
            <div className="w-2 h-8 bg-gradient-to-t from-primary to-accent rounded-full animate-[wave_1.5s_ease-in-out_infinite]" style={{ animationDelay: '0.4s' }}></div>
          </div>
          
          {/* Loading progress bar */}
          <div className="w-64 h-1 bg-muted mx-auto rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full animate-[loading_2s_ease-in-out_infinite]"></div>
          </div>
        </div>
        
        {/* Professional Loading Text */}
        <p className="text-sm text-muted-foreground animate-[fadeIn_2s_ease-out] font-medium">
          Initializing your personalized AI experience...
        </p>
      </div>

    </div>
  );
};
