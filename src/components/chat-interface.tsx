import React from 'react';
import { GeminiChatInterface } from './gemini-chat-interface';

interface ChatInterfaceProps {
  onLogout: () => void;
  user: any;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ onLogout, user }) => {
  // Use Gemini AI style interface with sidebar and session management
  return <GeminiChatInterface onLogout={onLogout} user={user} />;
};