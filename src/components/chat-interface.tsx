import React from 'react';
import { EnhancedChatInterface } from './enhanced-chat-interface';

interface ChatInterfaceProps {
  onLogout: () => void;
  user: any;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ onLogout, user }) => {
  // Redirect to enhanced version with all new features
  return <EnhancedChatInterface onLogout={onLogout} user={user} />;
};