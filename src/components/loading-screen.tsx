import React from 'react';
import vithalLogo from '/lovable-uploads/86deae4c-83c0-473f-9e54-1500aa44cd3c.png';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="text-center relative z-10">
        {/* Logo */}
        <div className="relative mb-8 animate-[scaleIn_0.6s_ease-out]">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center border border-primary/20">
            <img 
              src={vithalLogo} 
              alt="Vithal AI Logo" 
              className="h-12 w-12 object-contain"
            />
          </div>
        </div>
        
        {/* App Name */}
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-[fadeInUp_0.8s_ease-out]">
          Vithal AI
        </h1>
        
        {/* Loading bar */}
        <div className="w-48 h-0.5 bg-muted mx-auto rounded-full overflow-hidden mt-6 animate-[fadeInUp_1s_ease-out]">
          <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full animate-[loading_1.5s_ease-in-out_infinite]"></div>
        </div>
      </div>
    </div>
  );
};
