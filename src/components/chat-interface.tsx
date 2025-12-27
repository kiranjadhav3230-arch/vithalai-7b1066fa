import React from 'react';
import { GeminiChatInterface } from './gemini-chat-interface';

interface ChatInterfaceProps {
  onLogout: () => void;
  user: any;
  initialView?: 'chat' | 'code' | 'studyRooms' | 'crop';
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ onLogout, user, initialView }) => {
  // Use Gemini AI style interface with sidebar and session management
  return <GeminiChatInterface onLogout={onLogout} user={user} initialView={initialView} />;
};