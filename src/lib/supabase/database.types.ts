export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: { PostgrestVersion: "14.5" };
  public: {
    Tables: {
      article_categories: {
        Row: {
          created_at: string;
          description: string;
          id: string;
          name: string;
          slug: string;
          sort_order: number;
          status: "draft" | "active" | "archived";
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string;
          id?: string;
          name: string;
          slug: string;
          sort_order?: number;
          status?: "draft" | "active" | "archived";
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string;
          id?: string;
          name?: string;
          slug?: string;
          sort_order?: number;
          status?: "draft" | "active" | "archived";
          updated_at?: string;
        };
        Relationships: [];
      };
      articles: {
        Row: {
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
          published_at: string | null;
          reading_minutes: number | null;
          seo_description: string;
          seo_title: string;
          slug: string;
          status:
            | "draft"
            | "in_review"
            | "ready"
            | "scheduled"
            | "published"
            | "archived";
          subtitle: string;
          title: string;
          updated_at: string;
          version: number;
          word_count: number | null;
        };
        Insert: {
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
          published_at?: string | null;
          reading_minutes?: number | null;
          seo_description?: string;
          seo_title?: string;
          slug: string;
          status?:
            | "draft"
            | "in_review"
            | "ready"
            | "scheduled"
            | "published"
            | "archived";
          subtitle?: string;
          title: string;
          updated_at?: string;
          version?: number;
          word_count?: number | null;
        };
        Update: {
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
          published_at?: string | null;
          reading_minutes?: number | null;
          seo_description?: string;
          seo_title?: string;
          slug?: string;
          status?:
            | "draft"
            | "in_review"
            | "ready"
            | "scheduled"
            | "published"
            | "archived";
          subtitle?: string;
          title?: string;
          updated_at?: string;
          version?: number;
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
          user_id: string;
          display_name: string;
          bio: string;
          avatar_path: string;
          is_founding_member: boolean;
          founding_number: number | null;
          registered_at: string;
          last_active_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          display_name?: string;
          bio?: string;
          avatar_path?: string;
          is_founding_member?: boolean;
          founding_number?: number | null;
          registered_at?: string;
          last_active_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          display_name?: string;
          bio?: string;
          avatar_path?: string;
          is_founding_member?: boolean;
          founding_number?: number | null;
          registered_at?: string;
          last_active_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      article_access: {
        Row: {
          id: string;
          user_id: string | null;
          article_slug: string;
          accessed_at: string;
          percentage_read: number;
          completed: boolean;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          article_slug: string;
          accessed_at?: string;
          percentage_read?: number;
          completed?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          article_slug?: string;
          accessed_at?: string;
          percentage_read?: number;
          completed?: boolean;
        };
        Relationships: [];
      };
      article_comments: {
        Row: {
          id: string;
          article_id: string;
          user_id: string;
          parent_comment_id: string | null;
          content: string;
          is_edited: boolean;
          likes_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          article_id: string;
          user_id: string;
          parent_comment_id?: string | null;
          content: string;
          is_edited?: boolean;
          likes_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          article_id?: string;
          user_id?: string;
          parent_comment_id?: string | null;
          content?: string;
          is_edited?: boolean;
          likes_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "article_comments_article_id_fkey";
            columns: ["article_id"];
            isOneToOne: false;
            referencedRelation: "articles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "article_comments_parent_comment_id_fkey";
            columns: ["parent_comment_id"];
            isOneToOne: false;
            referencedRelation: "article_comments";
            referencedColumns: ["id"];
          },
        ];
      };
      comment_likes: {
        Row: {
          id: string;
          comment_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          comment_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          comment_id?: string;
          user_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "comment_likes_comment_id_fkey";
            columns: ["comment_id"];
            isOneToOne: false;
            referencedRelation: "article_comments";
            referencedColumns: ["id"];
          },
        ];
      };
      article_likes: {
        Row: {
          id: string;
          article_id: string;
          user_id: string | null;
          session_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          article_id: string;
          user_id?: string | null;
          session_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          article_id?: string;
          user_id?: string | null;
          session_id?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "article_likes_article_id_fkey";
            columns: ["article_id"];
            isOneToOne: false;
            referencedRelation: "articles";
            referencedColumns: ["id"];
          },
        ];
      };
      page_views: {
        Row: {
          id: string;
          page_path: string;
          article_slug: string | null;
          user_id: string | null;
          session_id: string;
          viewed_at: string;
          duration_seconds: number | null;
          device_type: "desktop" | "mobile" | "tablet" | null;
          referrer: string | null;
        };
        Insert: {
          id?: string;
          page_path: string;
          article_slug?: string | null;
          user_id?: string | null;
          session_id: string;
          viewed_at?: string;
          duration_seconds?: number | null;
          device_type?: "desktop" | "mobile" | "tablet" | null;
          referrer?: string | null;
        };
        Update: {
          id?: string;
          page_path?: string;
          article_slug?: string | null;
          user_id?: string | null;
          session_id?: string;
          viewed_at?: string;
          duration_seconds?: number | null;
          device_type?: "desktop" | "mobile" | "tablet" | null;
          referrer?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      dashboard_metrics: {
        Row: {
          total_members: number;
          founding_members_count: number;
          new_members_this_month: number;
          total_articles: number;
          total_page_views: number;
          page_views_this_month: number;
          total_article_likes: number;
          total_comments: number;
          comments_this_month: number;
          articles_with_full_reads: number;
        };
        Insert: Record<string, never>;
        Update: Record<string, never>;
        Relationships: [];
      };
    };
    Functions: {
      current_session_is_active: { Args: never; Returns: boolean };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
