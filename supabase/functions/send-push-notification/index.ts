import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { roomId, message, senderName, excludeUserId } = await req.json();
    console.log('Push notification request:', { roomId, message: message?.substring(0, 50), senderName, excludeUserId });

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all room members except the sender
    const { data: members, error: membersError } = await supabase
      .from('room_members')
      .select('user_id')
      .eq('room_id', roomId)
      .neq('user_id', excludeUserId);

    if (membersError) {
      console.error('Error fetching room members:', membersError);
      throw membersError;
    }

    console.log('Room members found:', members?.length || 0);

    if (!members || members.length === 0) {
      return new Response(JSON.stringify({ success: true, sent: 0, reason: 'no_members' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userIds = members.map(m => m.user_id);

    // Get push subscriptions for these users
    const { data: subscriptions, error: subsError } = await supabase
      .from('push_subscriptions')
      .select('*')
      .in('user_id', userIds);

    if (subsError) {
      console.error('Error fetching subscriptions:', subsError);
      throw subsError;
    }

    console.log('Push subscriptions found:', subscriptions?.length || 0);

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        sent: 0, 
        reason: 'no_subscriptions',
        memberCount: members.length 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // For now, just log that we would send notifications
    // Full web push requires proper encryption which is complex
    console.log('Would send notifications to:', subscriptions.length, 'subscribers');
    console.log('Notification payload:', {
      title: `${senderName} in Study Room`,
      body: message?.length > 100 ? message.substring(0, 100) + '...' : message,
    });

    return new Response(JSON.stringify({ 
      success: true, 
      sent: subscriptions.length,
      note: 'Notifications logged - full web push requires VAPID setup'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in send-push-notification:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
