export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      api_keys: {
        Row: {
          created_at: string
          id: string
          key: string
          service: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          service: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          service?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      batch_analyses: {
        Row: {
          completed_at: string | null
          created_at: string
          file_name: string | null
          id: string
          status: string
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          file_name?: string | null
          id?: string
          status?: string
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          file_name?: string | null
          id?: string
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      batch_analysis_items: {
        Row: {
          analysis_type: string
          batch_id: string
          character_count: number | null
          created_at: string
          id: string
          post_content: string
          result: string | null
          status: string
          word_count: number | null
        }
        Insert: {
          analysis_type: string
          batch_id: string
          character_count?: number | null
          created_at?: string
          id?: string
          post_content: string
          result?: string | null
          status?: string
          word_count?: number | null
        }
        Update: {
          analysis_type?: string
          batch_id?: string
          character_count?: number | null
          created_at?: string
          id?: string
          post_content?: string
          result?: string | null
          status?: string
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "batch_analysis_items_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batch_analyses"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          created_at: string
          id: string
          message: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          user_id?: string
        }
        Relationships: []
      }
      keywords: {
        Row: {
          category: string
          id: string
          platform: string | null
          score: number
          source: string
          term: string
          timestamp: string
        }
        Insert: {
          category: string
          id?: string
          platform?: string | null
          score: number
          source: string
          term: string
          timestamp?: string
        }
        Update: {
          category?: string
          id?: string
          platform?: string | null
          score?: number
          source?: string
          term?: string
          timestamp?: string
        }
        Relationships: []
      }
      post_analyses: {
        Row: {
          ai_score: number | null
          analysis_type: string
          character_count: number
          created_at: string
          grammar_score: number | null
          id: string
          personalization_score: number | null
          post_content: string
          readability_score: number | null
          result: string
          title: string | null
          user_id: string | null
          word_count: number
        }
        Insert: {
          ai_score?: number | null
          analysis_type: string
          character_count: number
          created_at?: string
          grammar_score?: number | null
          id?: string
          personalization_score?: number | null
          post_content: string
          readability_score?: number | null
          result: string
          title?: string | null
          user_id?: string | null
          word_count: number
        }
        Update: {
          ai_score?: number | null
          analysis_type?: string
          character_count?: number
          created_at?: string
          grammar_score?: number | null
          id?: string
          personalization_score?: number | null
          post_content?: string
          readability_score?: number | null
          result?: string
          title?: string | null
          user_id?: string | null
          word_count?: number
        }
        Relationships: []
      }
      product_keywords: {
        Row: {
          id: string
          keyword_id: string
          product_id: string
        }
        Insert: {
          id?: string
          keyword_id: string
          product_id: string
        }
        Update: {
          id?: string
          keyword_id?: string
          product_id?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          competition_score: number | null
          created_at: string
          description: string | null
          external_id: string | null
          id: string
          mockup_url: string | null
          monthly_sales_estimate: number | null
          platform: string | null
          published_at: string | null
          scheduled: boolean | null
          status: string
          tags: string[] | null
          title: string
          trend_score: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          competition_score?: number | null
          created_at?: string
          description?: string | null
          external_id?: string | null
          id?: string
          mockup_url?: string | null
          monthly_sales_estimate?: number | null
          platform?: string | null
          published_at?: string | null
          scheduled?: boolean | null
          status?: string
          tags?: string[] | null
          title: string
          trend_score?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          competition_score?: number | null
          created_at?: string
          description?: string | null
          external_id?: string | null
          id?: string
          mockup_url?: string | null
          monthly_sales_estimate?: number | null
          platform?: string | null
          published_at?: string | null
          scheduled?: boolean | null
          status?: string
          tags?: string[] | null
          title?: string
          trend_score?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          createdat: string
          description: string | null
          githuburl: string | null
          id: string
          ismonetized: boolean
          lastupdated: string
          name: string
          nextaction: string | null
          progress: number
          status: string
          tags: string[]
          type: string
          usefulness: number
          user_id: string | null
          websiteurl: string | null
        }
        Insert: {
          createdat?: string
          description?: string | null
          githuburl?: string | null
          id?: string
          ismonetized?: boolean
          lastupdated?: string
          name: string
          nextaction?: string | null
          progress?: number
          status: string
          tags?: string[]
          type: string
          usefulness: number
          user_id?: string | null
          websiteurl?: string | null
        }
        Update: {
          createdat?: string
          description?: string | null
          githuburl?: string | null
          id?: string
          ismonetized?: boolean
          lastupdated?: string
          name?: string
          nextaction?: string | null
          progress?: number
          status?: string
          tags?: string[]
          type?: string
          usefulness?: number
          user_id?: string | null
          websiteurl?: string | null
        }
        Relationships: []
      }
      repurpose_sessions: {
        Row: {
          content: string
          created_at: string
          id: string
          outputs: Json
          platforms: string[] | null
          source_url: string | null
          tone: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          outputs: Json
          platforms?: string[] | null
          source_url?: string | null
          tone: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          outputs?: Json
          platforms?: string[] | null
          source_url?: string | null
          tone?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sales_metrics: {
        Row: {
          amount: number
          created_at: string
          customer_region: string | null
          external_order_id: string | null
          id: string
          order_date: string
          platform: string
          product_category: string | null
          product_id: string | null
          status: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          customer_region?: string | null
          external_order_id?: string | null
          id?: string
          order_date: string
          platform: string
          product_category?: string | null
          product_id?: string | null
          status?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          customer_region?: string | null
          external_order_id?: string | null
          id?: string
          order_date?: string
          platform?: string
          product_category?: string | null
          product_id?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_metrics_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      upload_logs: {
        Row: {
          created_at: string
          details: Json | null
          external_id: string | null
          id: string
          platform: string
          product_id: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          details?: Json | null
          external_id?: string | null
          id?: string
          platform: string
          product_id: string
          status: string
          user_id: string
        }
        Update: {
          created_at?: string
          details?: Json | null
          external_id?: string | null
          id?: string
          platform?: string
          product_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "upload_logs_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_logs: {
        Row: {
          action_type: string
          created_at: string
          details: Json | null
          id: string
          user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string
          details?: Json | null
          id?: string
          user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string
          details?: Json | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string
          id: string
          key_name: string
          updated_at: string
          user_id: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          key_name: string
          updated_at?: string
          user_id: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          key_name?: string
          updated_at?: string
          user_id?: string
          value?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          plan_id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          plan_id?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          plan_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      upsert_user_setting: {
        Args: { p_key_name: string; p_value: string }
        Returns: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
