import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User as UserIcon, Mail, GraduationCap, Brain, Heart } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, user }) => {
  const userMetadata = user.user_metadata || {};
  const skills = userMetadata.skills ? userMetadata.skills.split(',').map((s: string) => s.trim()) : [];
  const interests = userMetadata.interests ? userMetadata.interests.split(',').map((i: string) => i.trim()) : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Profile</DialogTitle>
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
          <div className="pt-4 border-t">
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Account created: {new Date(user.created_at).toLocaleDateString()}</p>
              <p>Last sign in: {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};