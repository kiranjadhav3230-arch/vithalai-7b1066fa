export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      chat_history: {
        Row: {
          created_at: string
          id: string
          language: string | null
          message: string
          response: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          language?: string | null
          message: string
          response: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          language?: string | null
          message?: string
          response?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          created_at: string
          id: string
          image_data: string | null
          message: string
          message_type: string | null
          response: string | null
          session_id: string
          user_id: string
          youtube_courses: Json | null
        }
        Insert: {
          created_at?: string
          id?: string
          image_data?: string | null
          message: string
          message_type?: string | null
          response?: string | null
          session_id: string
          user_id: string
          youtube_courses?: Json | null
        }
        Update: {
          created_at?: string
          id?: string
          image_data?: string | null
          message?: string
          message_type?: string | null
          response?: string | null
          session_id?: string
          user_id?: string
          youtube_courses?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          created_at: string
          id: string
          is_archived: boolean | null
          session_type: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_archived?: boolean | null
          session_type?: string | null
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_archived?: boolean | null
          session_type?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      code_snippets: {
        Row: {
          created_at: string
          description: string | null
          generated_code: string
          gist_url: string | null
          id: string
          is_favorite: boolean | null
          language: string
          prompt: string | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          generated_code: string
          gist_url?: string | null
          id?: string
          is_favorite?: boolean | null
          language?: string
          prompt?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          generated_code?: string
          gist_url?: string | null
          id?: string
          is_favorite?: boolean | null
          language?: string
          prompt?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          analysis_result: Json | null
          analysis_status: string | null
          created_at: string
          document_text: string | null
          file_size: number | null
          file_url: string
          id: string
          title: string
          updated_at: string
          upload_date: string
          user_id: string
        }
        Insert: {
          analysis_result?: Json | null
          analysis_status?: string | null
          created_at?: string
          document_text?: string | null
          file_size?: number | null
          file_url: string
          id?: string
          title: string
          updated_at?: string
          upload_date?: string
          user_id: string
        }
        Update: {
          analysis_result?: Json | null
          analysis_status?: string | null
          created_at?: string
          document_text?: string | null
          file_size?: number | null
          file_url?: string
          id?: string
          title?: string
          updated_at?: string
          upload_date?: string
          user_id?: string
        }
        Relationships: []
      }
      enquiries: {
        Row: {
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string | null
          id: string
          message: string | null
          product_id: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          id?: string
          message?: string | null
          product_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          id?: string
          message?: string | null
          product_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "enquiries_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      family_members: {
        Row: {
          avatar_url: string | null
          created_at: string
          emergency_contact: boolean | null
          id: string
          name: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          emergency_contact?: boolean | null
          id?: string
          name: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          emergency_contact?: boolean | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      generated_images: {
        Row: {
          created_at: string
          id: string
          image_url: string
          language: string | null
          prompt: string
          session_id: string | null
          style: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          language?: string | null
          prompt: string
          session_id?: string | null
          style?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          language?: string | null
          prompt?: string
          session_id?: string | null
          style?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "generated_images_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_profiles: {
        Row: {
          created_at: string | null
          explanation_depth: string | null
          id: string
          learning_style: string | null
          preferred_examples: Json | null
          style_scores: Json | null
          subjects_strength: Json | null
          total_interactions: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          explanation_depth?: string | null
          id?: string
          learning_style?: string | null
          preferred_examples?: Json | null
          style_scores?: Json | null
          subjects_strength?: Json | null
          total_interactions?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          explanation_depth?: string | null
          id?: string
          learning_style?: string | null
          preferred_examples?: Json | null
          style_scores?: Json | null
          subjects_strength?: Json | null
          total_interactions?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      location_history: {
        Row: {
          address: string | null
          arrived_at: string
          family_member_id: string
          id: string
          latitude: number
          left_at: string | null
          longitude: number
        }
        Insert: {
          address?: string | null
          arrived_at?: string
          family_member_id: string
          id?: string
          latitude: number
          left_at?: string | null
          longitude: number
        }
        Update: {
          address?: string | null
          arrived_at?: string
          family_member_id?: string
          id?: string
          latitude?: number
          left_at?: string | null
          longitude?: number
        }
        Relationships: [
          {
            foreignKeyName: "location_history_family_member_id_fkey"
            columns: ["family_member_id"]
            isOneToOne: false
            referencedRelation: "family_members"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          accuracy: number | null
          address: string | null
          created_at: string
          family_member_id: string
          id: string
          latitude: number
          longitude: number
          timestamp: string
        }
        Insert: {
          accuracy?: number | null
          address?: string | null
          created_at?: string
          family_member_id: string
          id?: string
          latitude: number
          longitude: number
          timestamp?: string
        }
        Update: {
          accuracy?: number | null
          address?: string | null
          created_at?: string
          family_member_id?: string
          id?: string
          latitude?: number
          longitude?: number
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "locations_family_member_id_fkey"
            columns: ["family_member_id"]
            isOneToOne: false
            referencedRelation: "family_members"
            referencedColumns: ["id"]
          },
        ]
      }
      metal_rates: {
        Row: {
          created_at: string
          date: string
          id: string
          metal_type: string
          rate_per_gram: number
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          metal_type: string
          rate_per_gram: number
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          metal_type?: string
          rate_per_gram?: number
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          image_urls: string[] | null
          is_active: boolean | null
          is_featured: boolean | null
          metal_type: string
          name: string
          price: number | null
          purity: string | null
          updated_at: string
          weight: number | null
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          image_urls?: string[] | null
          is_active?: boolean | null
          is_featured?: boolean | null
          metal_type?: string
          name: string
          price?: number | null
          purity?: string | null
          updated_at?: string
          weight?: number | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_urls?: string[] | null
          is_active?: boolean | null
          is_featured?: boolean | null
          metal_type?: string
          name?: string
          price?: number | null
          purity?: string | null
          updated_at?: string
          weight?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          education: string | null
          experience: string | null
          id: string
          interests: string[] | null
          phone: string | null
          skills: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          education?: string | null
          experience?: string | null
          id?: string
          interests?: string[] | null
          phone?: string | null
          skills?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          education?: string | null
          experience?: string | null
          id?: string
          interests?: string[] | null
          phone?: string | null
          skills?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      published_websites: {
        Row: {
          code_snippet_id: string | null
          created_at: string
          css_content: string | null
          custom_domain: string | null
          html_content: string
          id: string
          is_published: boolean | null
          js_content: string | null
          language: string | null
          subdomain: string
          title: string
          updated_at: string
          user_id: string
          view_count: number | null
        }
        Insert: {
          code_snippet_id?: string | null
          created_at?: string
          css_content?: string | null
          custom_domain?: string | null
          html_content: string
          id?: string
          is_published?: boolean | null
          js_content?: string | null
          language?: string | null
          subdomain: string
          title: string
          updated_at?: string
          user_id: string
          view_count?: number | null
        }
        Update: {
          code_snippet_id?: string | null
          created_at?: string
          css_content?: string | null
          custom_domain?: string | null
          html_content?: string
          id?: string
          is_published?: boolean | null
          js_content?: string | null
          language?: string | null
          subdomain?: string
          title?: string
          updated_at?: string
          user_id?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "published_websites_code_snippet_id_fkey"
            columns: ["code_snippet_id"]
            isOneToOne: false
            referencedRelation: "code_snippets"
            referencedColumns: ["id"]
          },
        ]
      }
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string
          endpoint: string
          id: string
          p256dh: string
          updated_at: string
          user_id: string
        }
        Insert: {
          auth: string
          created_at?: string
          endpoint: string
          id?: string
          p256dh: string
          updated_at?: string
          user_id: string
        }
        Update: {
          auth?: string
          created_at?: string
          endpoint?: string
          id?: string
          p256dh?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      quiz_sessions: {
        Row: {
          completed_at: string | null
          created_at: string
          difficulty_level: string | null
          id: string
          questions: Json
          score: number | null
          started_at: string
          status: string | null
          topic: string
          total_questions: number
          user_answers: Json | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          difficulty_level?: string | null
          id?: string
          questions: Json
          score?: number | null
          started_at?: string
          status?: string | null
          topic: string
          total_questions: number
          user_answers?: Json | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          difficulty_level?: string | null
          id?: string
          questions?: Json
          score?: number | null
          started_at?: string
          status?: string | null
          topic?: string
          total_questions?: number
          user_answers?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      room_members: {
        Row: {
          id: string
          joined_at: string
          last_seen_message_id: string | null
          role: string
          room_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          last_seen_message_id?: string | null
          role?: string
          room_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          last_seen_message_id?: string | null
          role?: string
          room_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_members_last_seen_message_id_fkey"
            columns: ["last_seen_message_id"]
            isOneToOne: false
            referencedRelation: "room_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_members_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "study_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      room_message_reactions: {
        Row: {
          created_at: string
          id: string
          message_id: string
          reaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message_id: string
          reaction_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message_id?: string
          reaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_message_reactions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "room_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      room_messages: {
        Row: {
          created_at: string
          id: string
          image_data: string | null
          is_ai_response: boolean
          message: string
          reactions: Json | null
          reply_to: string | null
          room_id: string
          sender_name: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          image_data?: string | null
          is_ai_response?: boolean
          message: string
          reactions?: Json | null
          reply_to?: string | null
          room_id: string
          sender_name?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          image_data?: string | null
          is_ai_response?: boolean
          message?: string
          reactions?: Json | null
          reply_to?: string | null
          room_id?: string
          sender_name?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "room_messages_reply_to_fkey"
            columns: ["reply_to"]
            isOneToOne: false
            referencedRelation: "room_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "study_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      room_notes: {
        Row: {
          content: string
          created_at: string
          id: string
          room_id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          room_id: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          room_id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_notes_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "study_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      study_plans: {
        Row: {
          completed_hours: number | null
          created_at: string
          description: string | null
          end_date: string
          id: string
          schedule: Json
          start_date: string
          status: string | null
          subjects: Json
          title: string
          total_hours: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_hours?: number | null
          created_at?: string
          description?: string | null
          end_date: string
          id?: string
          schedule: Json
          start_date: string
          status?: string | null
          subjects: Json
          title: string
          total_hours?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_hours?: number | null
          created_at?: string
          description?: string | null
          end_date?: string
          id?: string
          schedule?: Json
          start_date?: string
          status?: string | null
          subjects?: Json
          title?: string
          total_hours?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      study_rooms: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          invite_code: string | null
          is_public: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          invite_code?: string | null
          is_public?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          invite_code?: string | null
          is_public?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      study_sessions: {
        Row: {
          completed: boolean | null
          created_at: string
          duration_minutes: number
          id: string
          notes: string | null
          rating: number | null
          session_date: string
          study_plan_id: string | null
          topic: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          duration_minutes: number
          id?: string
          notes?: string | null
          rating?: number | null
          session_date: string
          study_plan_id?: string | null
          topic: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          duration_minutes?: number
          id?: string
          notes?: string | null
          rating?: number | null
          session_date?: string
          study_plan_id?: string | null
          topic?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_sessions_study_plan_id_fkey"
            columns: ["study_plan_id"]
            isOneToOne: false
            referencedRelation: "study_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      topic_interactions: {
        Row: {
          avg_response_time_seconds: number | null
          created_at: string | null
          id: string
          last_interaction: string | null
          subject: string | null
          successful_attempts: number | null
          topic: string
          total_attempts: number | null
          understanding_score: number | null
          user_id: string
        }
        Insert: {
          avg_response_time_seconds?: number | null
          created_at?: string | null
          id?: string
          last_interaction?: string | null
          subject?: string | null
          successful_attempts?: number | null
          topic: string
          total_attempts?: number | null
          understanding_score?: number | null
          user_id: string
        }
        Update: {
          avg_response_time_seconds?: number | null
          created_at?: string | null
          id?: string
          last_interaction?: string | null
          subject?: string | null
          successful_attempts?: number | null
          topic?: string
          total_attempts?: number | null
          understanding_score?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_name: string
          achievement_type: string
          description: string | null
          earned_at: string
          icon_url: string | null
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          achievement_name: string
          achievement_type: string
          description?: string | null
          earned_at?: string
          icon_url?: string | null
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          achievement_name?: string
          achievement_type?: string
          description?: string | null
          earned_at?: string
          icon_url?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      user_bans: {
        Row: {
          ban_reason: string
          banned_at: string
          banned_by: string | null
          created_at: string
          id: string
          unban_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ban_reason?: string
          banned_at?: string
          banned_by?: string | null
          created_at?: string
          id?: string
          unban_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ban_reason?: string
          banned_at?: string
          banned_by?: string | null
          created_at?: string
          id?: string
          unban_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      weak_topics: {
        Row: {
          created_at: string | null
          difficulty_level: string | null
          id: string
          mastery_achieved: boolean | null
          next_review_date: string | null
          reason: string | null
          subject: string | null
          times_revisited: number | null
          topic: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          difficulty_level?: string | null
          id?: string
          mastery_achieved?: boolean | null
          next_review_date?: string | null
          reason?: string | null
          subject?: string | null
          times_revisited?: number | null
          topic: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          difficulty_level?: string | null
          id?: string
          mastery_achieved?: boolean | null
          next_review_date?: string | null
          reason?: string | null
          subject?: string | null
          times_revisited?: number | null
          topic?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_room_membership: {
        Args: { _room_id: string; _user_id: string }
        Returns: boolean
      }
      get_room_by_invite_code: {
        Args: { _invite_code: string }
        Returns: string
      }
      get_unread_message_count: {
        Args: { _room_id: string; _user_id: string }
        Returns: number
      }
      is_public_room: { Args: { _room_id: string }; Returns: boolean }
      is_room_creator: {
        Args: { _room_id: string; _user_id: string }
        Returns: boolean
      }
      is_room_member: {
        Args: { _room_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
