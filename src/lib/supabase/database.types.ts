export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type ArticleStatus =
  | "draft"
  | "in_review"
  | "ready"
  | "scheduled"
  | "published"
  | "archived";

type CategoryStatus = "draft" | "active" | "archived";

export type Database = {
  __InternalSupabase: { PostgrestVersion: "14.5" };
  public: {
    Tables: {
      account_access: {
        Row: {
          active: boolean;
          created_at: string;
          role: string;
          user_id: string;
        };
        Insert: {
          active?: boolean;
          created_at?: string;
          role: string;
          user_id: string;
        };
        Update: {
          active?: boolean;
          created_at?: string;
          role?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      privacy_acknowledgements: {
        Row: {
          accepted_at: string;
          notice_version: string;
          user_id: string;
        };
        Insert: {
          accepted_at?: string;
          notice_version: string;
          user_id: string;
        };
        Update: {
          accepted_at?: string;
          notice_version?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      member_profiles: {
        Row: {
          avatar_url: string;
          created_at: string;
          display_name: string;
          email: string;
          founder_number: number | null;
          id: string;
          marketing_opt_in: boolean;
          privacy_accepted_at: string;
          privacy_notice_version: string;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string;
          created_at?: string;
          display_name?: string;
          email: string;
          founder_number?: number | null;
          id: string;
          marketing_opt_in?: boolean;
          privacy_accepted_at?: string;
          privacy_notice_version: string;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string;
          created_at?: string;
          display_name?: string;
          email?: string;
          founder_number?: number | null;
          id?: string;
          marketing_opt_in?: boolean;
          privacy_accepted_at?: string;
          privacy_notice_version?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      article_categories: {
        Row: {
          created_at: string;
          description: string;
          id: string;
          name: string;
          slug: string;
          sort_order: number;
          status: CategoryStatus;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string;
          id?: string;
          name: string;
          slug: string;
          sort_order?: number;
          status?: CategoryStatus;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string;
          id?: string;
          name?: string;
          slug?: string;
          sort_order?: number;
          status?: CategoryStatus;
          updated_at?: string;
        };
        Relationships: [];
      };
      articles: {
        Row: {
          audio_duration_seconds: number | null;
          audio_url: string;
          author: string;
          canonical_path: string;
          category_id: string;
          content: Json;
          created_at: string;
          curators: string[];
          excerpt: string;
          featured: boolean;
          hero_alt: string;
          hero_image_path: string;
          id: string;
          keywords: string[];
          preview_content: Json;
          published_at: string | null;
          reading_minutes: number | null;
          seo_description: string;
          seo_title: string;
          slug: string;
          status: ArticleStatus;
          subtitle: string;
          title: string;
          updated_at: string;
          updated_by: string | null;
          version: number;
          video_url: string;
          word_count: number | null;
        };
        Insert: {
          audio_duration_seconds?: number | null;
          audio_url?: string;
          author?: string;
          canonical_path?: string;
          category_id: string;
          content?: Json;
          created_at?: string;
          curators?: string[];
          excerpt?: string;
          featured?: boolean;
          hero_alt?: string;
          hero_image_path?: string;
          id?: string;
          keywords?: string[];
          preview_content?: Json;
          published_at?: string | null;
          reading_minutes?: number | null;
          seo_description?: string;
          seo_title?: string;
          slug: string;
          status?: ArticleStatus;
          subtitle?: string;
          title: string;
          updated_at?: string;
          updated_by?: string | null;
          version?: number;
          video_url?: string;
          word_count?: number | null;
        };
        Update: {
          audio_duration_seconds?: number | null;
          audio_url?: string;
          author?: string;
          canonical_path?: string;
          category_id?: string;
          content?: Json;
          created_at?: string;
          curators?: string[];
          excerpt?: string;
          featured?: boolean;
          hero_alt?: string;
          hero_image_path?: string;
          id?: string;
          keywords?: string[];
          preview_content?: Json;
          published_at?: string | null;
          reading_minutes?: number | null;
          seo_description?: string;
          seo_title?: string;
          slug?: string;
          status?: ArticleStatus;
          subtitle?: string;
          title?: string;
          updated_at?: string;
          updated_by?: string | null;
          version?: number;
          video_url?: string;
          word_count?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "articles_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "article_categories";
            referencedColumns: ["id"];
          },
        ];
      };
      article_comments: {
        Row: {
          article_slug: string;
          author_name: string;
          body: string;
          created_at: string;
          id: string;
          parent_id: string | null;
          status: "published" | "hidden" | "pending";
          updated_at: string;
          user_id: string;
        };
        Insert: {
          article_slug: string;
          author_name?: string;
          body: string;
          created_at?: string;
          id?: string;
          parent_id?: string | null;
          status?: "published" | "hidden" | "pending";
          updated_at?: string;
          user_id: string;
        };
        Update: {
          article_slug?: string;
          author_name?: string;
          body?: string;
          created_at?: string;
          id?: string;
          parent_id?: string | null;
          status?: "published" | "hidden" | "pending";
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "article_comments_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "article_comments";
            referencedColumns: ["id"];
          },
        ];
      };
      content_events: {
        Row: {
          article_slug: string | null;
          created_at: string;
          event_day: string;
          event_name: string;
          event_path: string;
          id: string;
          user_id: string | null;
          visitor_id: string;
        };
        Insert: {
          article_slug?: string | null;
          created_at?: string;
          event_day?: string;
          event_name: string;
          event_path: string;
          id?: string;
          user_id?: string | null;
          visitor_id: string;
        };
        Update: {
          article_slug?: string | null;
          created_at?: string;
          event_day?: string;
          event_name?: string;
          event_path?: string;
          id?: string;
          user_id?: string | null;
          visitor_id?: string;
        };
        Relationships: [];
      };
      article_reactions: {
        Row: {
          article_slug: string;
          created_at: string;
          user_id: string | null;
          visitor_id: string;
        };
        Insert: {
          article_slug: string;
          created_at?: string;
          user_id?: string | null;
          visitor_id: string;
        };
        Update: {
          article_slug?: string;
          created_at?: string;
          user_id?: string | null;
          visitor_id?: string;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      admin_dashboard_metrics: { Args: never; Returns: Json };
      admin_moderate_comment: {
        Args: { p_comment_id: string; p_status: string };
        Returns: undefined;
      };
      current_session_is_active: { Args: never; Returns: boolean };
      claim_member_founder_number: { Args: never; Returns: number | null };
      delete_my_account: {
        Args: { p_confirmation: string };
        Returns: undefined;
      };
      get_article_like_state: {
        Args: { p_article_slug: string; p_visitor_id: string };
        Returns: Json;
      };
      record_content_event: {
        Args: {
          p_article_slug?: string | null;
          p_event_name: string;
          p_event_path: string;
          p_visitor_id: string;
        };
        Returns: undefined;
      };
      toggle_article_like: {
        Args: { p_article_slug: string; p_visitor_id: string };
        Returns: Json;
      };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
