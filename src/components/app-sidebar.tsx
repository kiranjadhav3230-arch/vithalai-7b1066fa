import { useState } from 'react';
import { Trash2, MessageSquare, Code, AlertCircle, History } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { RecentSessions } from './recent-sessions';

interface AppSidebarProps {
  userId: string;
  onHistoryDeleted?: () => void;
}

export function AppSidebar({ userId, onHistoryDeleted }: AppSidebarProps) {
  const { state } = useSidebar();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const collapsed = state === 'collapsed';

  const handleDeleteChatHistory = async () => {
    setIsDeleting(true);
    try {
      // Delete all chat sessions and messages
      const { error: messagesError } = await supabase
        .from('chat_messages')
        .delete()
        .eq('user_id', userId);

      const { error: sessionsError } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('user_id', userId);

      if (messagesError || sessionsError) throw messagesError || sessionsError;

      toast({
        title: 'Success',
        description: 'Chat history deleted successfully',
      });
      onHistoryDeleted?.();
    } catch (error) {
      console.error('Error deleting chat history:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete chat history',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCodeHistory = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('code_snippets')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Code history deleted successfully',
      });
      onHistoryDeleted?.();
    } catch (error) {
      console.error('Error deleting code history:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete code history',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteBothHistories = async () => {
    setIsDeleting(true);
    try {
      // Delete chat history
      await supabase.from('chat_messages').delete().eq('user_id', userId);
      await supabase.from('chat_sessions').delete().eq('user_id', userId);
      
      // Delete code history
      await supabase.from('code_snippets').delete().eq('user_id', userId);

      toast({
        title: 'Success',
        description: 'All history deleted successfully',
      });
      onHistoryDeleted?.();
    } catch (error) {
      console.error('Error deleting histories:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete histories',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Sidebar className={collapsed ? 'w-14' : 'w-64'} collapsible="icon">
      <SidebarContent>
        {/* Recent Sessions */}
        <SidebarGroup>
          <Collapsible defaultOpen>
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className={collapsed ? 'hidden' : 'cursor-pointer'}>
                <History className="h-4 w-4 mr-2" />
                Recent Sessions
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {!collapsed && (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground px-2 mb-2">Chat History</p>
                    <RecentSessions userId={userId} type="chat" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground px-2 mb-2">Code History</p>
                    <RecentSessions userId={userId} type="code" />
                  </div>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

        {/* Delete Options */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? 'hidden' : ''}>
            Manage History
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {/* Delete Chat History */}
              <SidebarMenuItem>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <SidebarMenuButton disabled={isDeleting}>
                      <MessageSquare className="h-4 w-4" />
                      {!collapsed && <span>Delete Chats</span>}
                    </SidebarMenuButton>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Chat History?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete all your chat conversations and messages. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteChatHistory}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </SidebarMenuItem>

              {/* Delete Code History */}
              <SidebarMenuItem>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <SidebarMenuButton disabled={isDeleting}>
                      <Code className="h-4 w-4" />
                      {!collapsed && <span>Delete Code</span>}
                    </SidebarMenuButton>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Code History?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete all your saved code snippets and generated code. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteCodeHistory}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </SidebarMenuItem>

              {/* Delete Both */}
              <SidebarMenuItem>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <SidebarMenuButton disabled={isDeleting} className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                      {!collapsed && <span>Delete All</span>}
                    </SidebarMenuButton>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-destructive" />
                        Delete All History?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete ALL your chat conversations and code snippets. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDeleteBothHistories}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Delete Everything
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
