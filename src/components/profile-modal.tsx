import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User as UserIcon, Mail, GraduationCap, Brain, Heart, Edit2, Download, Smartphone, Check, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { useGlobalLanguage } from '@/contexts/LanguageContext';
import type { User } from '@supabase/supabase-js';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

const languageOptions = [
  { code: 'en' as const, name: 'English', native: 'English' },
  { code: 'hi' as const, name: 'Hindi', native: 'हिंदी' },
  { code: 'mr' as const, name: 'Marathi', native: 'मराठी' }
];

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, user }) => {
  const { toast } = useToast();
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { isInstallable, isInstalled, isIOS, installApp } = usePWAInstall();
  const { language, setLanguage } = useGlobalLanguage();
  
  const userMetadata = user.user_metadata || {};
  const skills = userMetadata.skills ? userMetadata.skills.split(',').map((s: string) => s.trim()) : [];
  const interests = userMetadata.interests ? userMetadata.interests.split(',').map((i: string) => i.trim()) : [];

  const handleChangeEmail = async () => {
    if (!newEmail || !newEmail.includes('@')) {
      toast({
        variant: "destructive",
        title: "Invalid Email",
        description: "Please enter a valid email address."
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message
        });
      } else {
        toast({
          title: "Email Update Initiated",
          description: "Please check both your old and new email addresses to confirm the change."
        });
        setShowChangeEmail(false);
        setNewEmail('');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInstallApp = async () => {
    const result = await installApp();
    if (result.success) {
      toast({
        title: "App Installed!",
        description: "Vithal AI has been installed on your device."
      });
    } else {
      toast({
        variant: "destructive",
        title: "Installation",
        description: result.message
      });
    }
  };

  const handleLanguageChange = (langCode: 'en' | 'hi' | 'mr') => {
    setLanguage(langCode);
    toast({
      title: language === 'en' ? "Language Updated" : language === 'hi' ? "भाषा अपडेट" : "भाषा अपडेट",
      description: langCode === 'en' 
        ? "Language set to English" 
        : langCode === 'hi' 
          ? "भाषा हिंदी में सेट की गई" 
          : "भाषा मराठीमध्ये सेट केली"
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">Profile & Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Avatar and Basic Info */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={userMetadata.avatar_url} />
              <AvatarFallback className="text-lg">
                {userMetadata.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="text-center">
              <h3 className="text-lg font-semibold">
                {userMetadata.full_name || 'User'}
              </h3>
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Mail className="h-3 w-3" />
                {user.email}
              </p>
            </div>
          </div>

          {/* Language Selection Section */}
          <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-full bg-blue-500/20">
                <Globe className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Website Language</h4>
                <p className="text-xs text-muted-foreground">Set language for entire website</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {languageOptions.map((lang) => (
                <Button
                  key={lang.code}
                  variant={language === lang.code ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`flex flex-col items-center py-3 h-auto ${
                    language === lang.code 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0' 
                      : 'hover:bg-blue-500/10 hover:border-blue-500/50'
                  }`}
                >
                  <span className="text-xs font-medium">{lang.native}</span>
                  <span className="text-[10px] opacity-70">{lang.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Download as App Section */}
          <div className="p-4 rounded-lg bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-full bg-orange-500/20">
                <Smartphone className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Download as App</h4>
                <p className="text-xs text-muted-foreground">Install Vithal AI on your device</p>
              </div>
            </div>

            {isInstalled ? (
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <Check className="h-4 w-4" />
                <span>App is already installed!</span>
              </div>
            ) : isIOS ? (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  To install on iOS:
                </p>
                <ol className="text-xs text-muted-foreground list-decimal pl-4 space-y-1">
                  <li>Tap the Share button <span className="inline-block px-1 py-0.5 bg-muted rounded text-[10px]">↑</span> in Safari</li>
                  <li>Scroll down and tap "Add to Home Screen"</li>
                  <li>Tap "Add" to install Vithal AI</li>
                </ol>
              </div>
            ) : isInstallable ? (
              <Button 
                onClick={handleInstallApp}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Install Vithal AI
              </Button>
            ) : (
              <p className="text-xs text-muted-foreground">
                Open this app in a supported browser (Chrome, Edge, or Safari) to install it on your device.
              </p>
            )}
          </div>

          {/* User Details */}
          <div className="space-y-4">
            {userMetadata.education && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <GraduationCap className="h-4 w-4" />
                  Education
                </div>
                <p className="text-sm text-muted-foreground pl-6">
                  {userMetadata.education}
                </p>
              </div>
            )}

            {skills.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Brain className="h-4 w-4" />
                  Skills
                </div>
                <div className="flex flex-wrap gap-1 pl-6">
                  {skills.map((skill: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {interests.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Heart className="h-4 w-4" />
                  Interests
                </div>
                <div className="flex flex-wrap gap-1 pl-6">
                  {interests.map((interest: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Account Info */}
          <div className="pt-4 border-t space-y-4">
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Account created: {new Date(user.created_at).toLocaleDateString()}</p>
              <p>Last sign in: {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'}</p>
            </div>

            {/* Change Email Section */}
            <div className="space-y-2">
              {showChangeEmail ? (
                <div className="space-y-2">
                  <Label htmlFor="new-email" className="text-sm font-medium">
                    New Email Address
                  </Label>
                  <Input
                    id="new-email"
                    type="email"
                    placeholder="Enter new email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleChangeEmail} 
                      disabled={loading || !newEmail}
                      size="sm"
                      className="flex-1"
                    >
                      {loading ? "Updating..." : "Update Email"}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowChangeEmail(false);
                        setNewEmail('');
                      }}
                      size="sm"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => setShowChangeEmail(true)}
                  size="sm"
                  className="w-full"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Change Email
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
