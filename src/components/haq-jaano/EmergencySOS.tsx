import React, { useState, useRef, useEffect } from 'react';
import { AlertTriangle, Phone, MapPin, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export const EmergencySOS: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const HOLD_DURATION = 3000; // 3 seconds
  const PROGRESS_INTERVAL = 50;

  const getSOSText = () => {
    switch (language) {
      case 'hi': return 'आपातकालीन SOS';
      case 'mr': return 'आपत्कालीन SOS';
      default: return 'Emergency SOS';
    }
  };

  const getHoldText = () => {
    switch (language) {
      case 'hi': return '3 सेकंड दबाए रखें';
      case 'mr': return '3 सेकंद दाबून ठेवा';
      default: return 'Hold for 3 seconds';
    }
  };

  const handleSOSActivate = () => {
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // Call emergency number
          window.location.href = 'tel:112';
          
          toast({
            title: language === 'hi' ? 'SOS सक्रिय' : 
                   language === 'mr' ? 'SOS सक्रिय' : 'SOS Activated',
            description: language === 'hi' 
              ? `स्थान साझा किया गया: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
              : language === 'mr'
              ? `स्थान शेअर केले: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
              : `Location shared: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          });
        },
        () => {
          window.location.href = 'tel:112';
        }
      );
    } else {
      window.location.href = 'tel:112';
    }
  };

  const startHold = () => {
    setIsHolding(true);
    setHoldProgress(0);

    progressIntervalRef.current = setInterval(() => {
      setHoldProgress((prev) => {
        const next = prev + (PROGRESS_INTERVAL / HOLD_DURATION) * 100;
        return Math.min(next, 100);
      });
    }, PROGRESS_INTERVAL);

    holdTimeoutRef.current = setTimeout(() => {
      handleSOSActivate();
      endHold();
    }, HOLD_DURATION);
  };

  const endHold = () => {
    setIsHolding(false);
    setHoldProgress(0);
    
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  return (
    <div className="flex justify-center">
      <button
        onMouseDown={startHold}
        onMouseUp={endHold}
        onMouseLeave={endHold}
        onTouchStart={startHold}
        onTouchEnd={endHold}
        className={cn(
          'relative flex h-28 w-28 flex-col items-center justify-center rounded-full',
          'bg-gradient-to-br from-destructive to-destructive/80',
          'shadow-[0_0_30px_rgba(239,68,68,0.4)]',
          'transition-all duration-300',
          isHolding && 'scale-95 shadow-[0_0_50px_rgba(239,68,68,0.6)]'
        )}
      >
        {/* Progress Ring */}
        <svg
          className="absolute inset-0 -rotate-90"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="4"
          />
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${holdProgress * 2.89} 289`}
            className="transition-all duration-100"
          />
        </svg>

        <AlertTriangle className="h-8 w-8 text-white" />
        <span className="mt-1 text-xs font-bold text-white">SOS</span>
        <span className="text-[10px] text-white/80">{getHoldText()}</span>
      </button>
    </div>
  );
};
