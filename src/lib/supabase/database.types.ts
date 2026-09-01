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
    };
    Views: { [_ in never]: never };
    Functions: {
      current_session_is_active: { Args: never; Returns: boolean };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
