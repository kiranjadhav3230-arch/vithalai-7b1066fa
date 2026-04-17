import React from 'react';
import { Sparkles } from 'lucide-react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center aurora-bg relative overflow-hidden">
      <div className="text-center relative z-10 space-y-6">
        <div className="relative mx-auto w-20 h-20 animate-[scaleIn_0.6s_ease-out]">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 blur-xl opacity-50" />
          <div className="relative h-20 w-20 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-2xl shadow-orange-500/40">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-display font-bold gradient-text-orange animate-[fadeInUp_0.8s_ease-out]">
          Vithal AI
        </h1>

        <div className="w-56 h-1 bg-white/[0.06] mx-auto rounded-full overflow-hidden animate-[fadeInUp_1s_ease-out]">
          <div className="h-full w-1/3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full animate-[loading_1.5s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
};
