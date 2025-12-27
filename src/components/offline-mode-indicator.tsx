import React, { useState } from 'react';
import { Wifi, WifiOff, Download, Loader2, Check, Zap, Cloud } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface OfflineModeIndicatorProps {
  isOnline: boolean;
  isOfflineMode: boolean;
  forceOffline: boolean;
  toggleOfflineMode: () => void;
  modelStatus: 'not-downloaded' | 'downloading' | 'ready' | 'error';
  downloadProgress: number;
  downloadModel: () => Promise<void>;
}

export const OfflineModeIndicator: React.FC<OfflineModeIndicatorProps> = ({
  isOnline,
  isOfflineMode,
  forceOffline,
  toggleOfflineMode,
  modelStatus,
  downloadProgress,
  downloadModel,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getStatusIcon = () => {
    if (modelStatus === 'downloading') {
      return <Loader2 className="w-3 h-3 animate-spin" />;
    }
    if (isOfflineMode) {
      return <Zap className="w-3 h-3" />;
    }
    return <Cloud className="w-3 h-3" />;
  };

  const getStatusColor = () => {
    if (!isOnline) return 'bg-destructive/20 text-destructive border-destructive/30';
    if (forceOffline) return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline';
    if (forceOffline) return 'Local AI';
    return 'Online';
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium",
            "border transition-all duration-200 hover:scale-105",
            getStatusColor()
          )}
        >
          <span className={cn(
            "w-1.5 h-1.5 rounded-full",
            !isOnline ? "bg-destructive" : forceOffline ? "bg-amber-400" : "bg-emerald-400"
          )} />
          {getStatusIcon()}
          <span className="hidden sm:inline">{getStatusText()}</span>
        </button>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-72 p-3 bg-card/95 backdrop-blur-xl border-border/50"
        align="end"
      >
        <div className="space-y-3">
          {/* Connection Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isOnline ? (
                <Wifi className="w-4 h-4 text-emerald-400" />
              ) : (
                <WifiOff className="w-4 h-4 text-destructive" />
              )}
              <span className="text-sm font-medium">
                {isOnline ? 'Connected' : 'No Internet'}
              </span>
            </div>
            <span className={cn(
              "text-xs px-2 py-0.5 rounded-full",
              isOnline ? "bg-emerald-500/20 text-emerald-400" : "bg-destructive/20 text-destructive"
            )}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>

          {/* Manual Toggle - Only show when online */}
          {isOnline && (
            <div className="flex items-center justify-between py-2 border-t border-border/50">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Use Local AI</p>
                <p className="text-xs text-muted-foreground">
                  Faster, private, works offline
                </p>
              </div>
              <Switch
                checked={forceOffline}
                onCheckedChange={toggleOfflineMode}
                disabled={modelStatus !== 'ready' && modelStatus !== 'not-downloaded'}
              />
            </div>
          )}

          {/* Model Status */}
          <div className="pt-2 border-t border-border/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Local AI Model</span>
              {modelStatus === 'ready' && (
                <span className="flex items-center gap-1 text-xs text-emerald-400">
                  <Check className="w-3 h-3" />
                  Ready
                </span>
              )}
              {modelStatus === 'error' && (
                <span className="text-xs text-destructive">Error</span>
              )}
            </div>

            {modelStatus === 'not-downloaded' && (
              <Button
                size="sm"
                variant="outline"
                className="w-full text-xs h-8 border-primary/30 hover:bg-primary/10"
                onClick={() => downloadModel()}
              >
                <Download className="w-3 h-3 mr-1.5" />
                Download AI Model (~45MB)
              </Button>
            )}

            {modelStatus === 'downloading' && (
              <div className="space-y-2">
                <Progress value={downloadProgress} className="h-1.5" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Downloading...
                  </span>
                  <span>{downloadProgress}%</span>
                </div>
              </div>
            )}

            {modelStatus === 'ready' && (
              <p className="text-xs text-muted-foreground">
                {isOfflineMode ? '⚡ Using local AI for instant responses' : 'Ready for offline use'}
              </p>
            )}

            {modelStatus === 'error' && (
              <Button
                size="sm"
                variant="outline"
                className="w-full text-xs h-8 border-destructive/30 hover:bg-destructive/10"
                onClick={() => downloadModel()}
              >
                <Download className="w-3 h-3 mr-1.5" />
                Retry Download
              </Button>
            )}
          </div>

          {/* Info Text */}
          {!isOnline && modelStatus !== 'ready' && (
            <p className="text-xs text-amber-400/80 pt-1">
              Download the AI model while online to use chat offline.
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
