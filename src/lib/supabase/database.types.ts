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
