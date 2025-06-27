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
      ai_settings: {
        Row: {
          api_key_gemini: string | null
          api_key_openai: string | null
          auto_sync_enabled: boolean | null
          created_at: string | null
          export_format: string | null
          google_drive_folder_id: string | null
          google_sheet_url: string | null
          id: string
          preferred_model: string | null
          sync_interval: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          api_key_gemini?: string | null
          api_key_openai?: string | null
          auto_sync_enabled?: boolean | null
          created_at?: string | null
          export_format?: string | null
          google_drive_folder_id?: string | null
          google_sheet_url?: string | null
          id?: string
          preferred_model?: string | null
          sync_interval?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          api_key_gemini?: string | null
          api_key_openai?: string | null
          auto_sync_enabled?: boolean | null
          created_at?: string | null
          export_format?: string | null
          google_drive_folder_id?: string | null
          google_sheet_url?: string | null
          id?: string
          preferred_model?: string | null
          sync_interval?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
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
      assessment_items: {
        Row: {
          action_required: string | null
          category: string
          category_specific_data: Json | null
          condition_notes: string | null
          created_at: string
          dimensions: Json | null
          id: string
          installation_notes: string | null
          is_priority: boolean | null
          mark_for_early_procurement: boolean | null
          notes: string | null
          planned_material: string | null
          quantities: Json | null
          question: string
          status: string
          survey_id: string
          updated_at: string
          zone_id: string
        }
        Insert: {
          action_required?: string | null
          category: string
          category_specific_data?: Json | null
          condition_notes?: string | null
          created_at?: string
          dimensions?: Json | null
          id?: string
          installation_notes?: string | null
          is_priority?: boolean | null
          mark_for_early_procurement?: boolean | null
          notes?: string | null
          planned_material?: string | null
          quantities?: Json | null
          question: string
          status?: string
          survey_id: string
          updated_at?: string
          zone_id: string
        }
        Update: {
          action_required?: string | null
          category?: string
          category_specific_data?: Json | null
          condition_notes?: string | null
          created_at?: string
          dimensions?: Json | null
          id?: string
          installation_notes?: string | null
          is_priority?: boolean | null
          mark_for_early_procurement?: boolean | null
          notes?: string | null
          planned_material?: string | null
          quantities?: Json | null
          question?: string
          status?: string
          survey_id?: string
          updated_at?: string
          zone_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_items_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "survey_analytics"
            referencedColumns: ["survey_id"]
          },
          {
            foreignKeyName: "assessment_items_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_items_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "survey_zones"
            referencedColumns: ["id"]
          },
        ]
      }
      authors: {
        Row: {
          created_at: string
          genre: string
          id: string
          inspiration: string
          name: string
          quote: string
          refinement: string
          signature: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          genre: string
          id?: string
          inspiration: string
          name: string
          quote: string
          refinement: string
          signature: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          genre?: string
          id?: string
          inspiration?: string
          name?: string
          quote?: string
          refinement?: string
          signature?: string
          updated_at?: string
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
      books: {
        Row: {
          ai_guide: string | null
          arcs: string[] | null
          author_id: string
          created_at: string
          emotion_progression: string | null
          emotional_secrets: string | null
          export_format: string | null
          foreshadowing: string[] | null
          genre: string
          google_doc_id: string | null
          id: string
          logline: string | null
          outline_generated_at: string | null
          outline_status: string | null
          plot_secrets: string | null
          pov: string | null
          structure_notes: string | null
          subgenre: string | null
          symbols: string[] | null
          themes: string[] | null
          title: string
          tone_keywords: string[] | null
          updated_at: string
          word_count: number | null
        }
        Insert: {
          ai_guide?: string | null
          arcs?: string[] | null
          author_id: string
          created_at?: string
          emotion_progression?: string | null
          emotional_secrets?: string | null
          export_format?: string | null
          foreshadowing?: string[] | null
          genre: string
          google_doc_id?: string | null
          id?: string
          logline?: string | null
          outline_generated_at?: string | null
          outline_status?: string | null
          plot_secrets?: string | null
          pov?: string | null
          structure_notes?: string | null
          subgenre?: string | null
          symbols?: string[] | null
          themes?: string[] | null
          title: string
          tone_keywords?: string[] | null
          updated_at?: string
          word_count?: number | null
        }
        Update: {
          ai_guide?: string | null
          arcs?: string[] | null
          author_id?: string
          created_at?: string
          emotion_progression?: string | null
          emotional_secrets?: string | null
          export_format?: string | null
          foreshadowing?: string[] | null
          genre?: string
          google_doc_id?: string | null
          id?: string
          logline?: string | null
          outline_generated_at?: string | null
          outline_status?: string | null
          plot_secrets?: string | null
          pov?: string | null
          structure_notes?: string | null
          subgenre?: string | null
          symbols?: string[] | null
          themes?: string[] | null
          title?: string
          tone_keywords?: string[] | null
          updated_at?: string
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "books_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
        ]
      }
      budgets: {
        Row: {
          alert_threshold: number | null
          budget_limit: number
          category_id: string | null
          created_at: string
          end_date: string | null
          id: string
          is_active: boolean | null
          name: string
          period: Database["public"]["Enums"]["budget_period"] | null
          rollover_amount: number | null
          rollover_enabled: boolean | null
          start_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          alert_threshold?: number | null
          budget_limit: number
          category_id?: string | null
          created_at?: string
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          period?: Database["public"]["Enums"]["budget_period"] | null
          rollover_amount?: number | null
          rollover_enabled?: boolean | null
          start_date?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          alert_threshold?: number | null
          budget_limit?: number
          category_id?: string | null
          created_at?: string
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          period?: Database["public"]["Enums"]["budget_period"] | null
          rollover_amount?: number | null
          rollover_enabled?: boolean | null
          start_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "budgets_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_events: {
        Row: {
          all_day: boolean | null
          color: string | null
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          location: string | null
          reminder_minutes: number | null
          start_date: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          all_day?: boolean | null
          color?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          reminder_minutes?: number | null
          start_date: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          all_day?: boolean | null
          color?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          reminder_minutes?: number | null
          start_date?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_default: boolean | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      chapters: {
        Row: {
          ai_generated: boolean | null
          ai_model_used: string | null
          ai_prompt: string | null
          book_id: string
          chapter_number: number
          content: string | null
          created_at: string
          export_timestamp: string | null
          generation_context: Json | null
          google_doc_id: string | null
          id: string
          last_modified: string
          notes: string | null
          phase: string | null
          status: string
          title: string
          word_count: number | null
        }
        Insert: {
          ai_generated?: boolean | null
          ai_model_used?: string | null
          ai_prompt?: string | null
          book_id: string
          chapter_number: number
          content?: string | null
          created_at?: string
          export_timestamp?: string | null
          generation_context?: Json | null
          google_doc_id?: string | null
          id?: string
          last_modified?: string
          notes?: string | null
          phase?: string | null
          status?: string
          title: string
          word_count?: number | null
        }
        Update: {
          ai_generated?: boolean | null
          ai_model_used?: string | null
          ai_prompt?: string | null
          book_id?: string
          chapter_number?: number
          content?: string | null
          created_at?: string
          export_timestamp?: string | null
          generation_context?: Json | null
          google_doc_id?: string | null
          id?: string
          last_modified?: string
          notes?: string | null
          phase?: string | null
          status?: string
          title?: string
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "chapters_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          client_contacts: Json | null
          contact_person: string | null
          country: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          client_contacts?: Json | null
          contact_person?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          client_contacts?: Json | null
          contact_person?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      content_items: {
        Row: {
          created_at: string
          due_date: string | null
          id: string
          notes: string | null
          platform: string
          status: string
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          due_date?: string | null
          id?: string
          notes?: string | null
          platform: string
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          due_date?: string | null
          id?: string
          notes?: string | null
          platform?: string
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      fridge_items: {
        Row: {
          category: string | null
          created_at: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      generation_logs: {
        Row: {
          book_id: string | null
          chapter_id: string | null
          created_at: string | null
          error_message: string | null
          generation_time_ms: number | null
          generation_type: string
          id: string
          model_used: string
          prompt_used: string | null
          response_text: string | null
          success: boolean | null
          tokens_used: number | null
          user_id: string | null
        }
        Insert: {
          book_id?: string | null
          chapter_id?: string | null
          created_at?: string | null
          error_message?: string | null
          generation_time_ms?: number | null
          generation_type: string
          id?: string
          model_used: string
          prompt_used?: string | null
          response_text?: string | null
          success?: boolean | null
          tokens_used?: number | null
          user_id?: string | null
        }
        Update: {
          book_id?: string | null
          chapter_id?: string | null
          created_at?: string | null
          error_message?: string | null
          generation_time_ms?: number | null
          generation_type?: string
          id?: string
          model_used?: string
          prompt_used?: string | null
          response_text?: string | null
          success?: boolean | null
          tokens_used?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "generation_logs_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generation_logs_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      goal_contributions: {
        Row: {
          amount: number
          contribution_date: string
          created_at: string
          goal_id: string
          id: string
          notes: string | null
          source: string | null
          user_id: string
        }
        Insert: {
          amount: number
          contribution_date?: string
          created_at?: string
          goal_id: string
          id?: string
          notes?: string | null
          source?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          contribution_date?: string
          created_at?: string
          goal_id?: string
          id?: string
          notes?: string | null
          source?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "goal_contributions_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "savings_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      ideas: {
        Row: {
          created_at: string
          description: string | null
          id: string
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      income_allocations: {
        Row: {
          allocation_type: Database["public"]["Enums"]["allocation_type"] | null
          amount: number
          budget_id: string | null
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          income_entry_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          allocation_type?:
            | Database["public"]["Enums"]["allocation_type"]
            | null
          amount: number
          budget_id?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          income_entry_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          allocation_type?:
            | Database["public"]["Enums"]["allocation_type"]
            | null
          amount?: number
          budget_id?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          income_entry_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "income_allocations_budget_id_fkey"
            columns: ["budget_id"]
            isOneToOne: false
            referencedRelation: "budgets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "income_allocations_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "income_allocations_income_entry_id_fkey"
            columns: ["income_entry_id"]
            isOneToOne: false
            referencedRelation: "income_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      income_entries: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          date: string
          frequency: Database["public"]["Enums"]["expense_frequency"] | null
          id: string
          is_active: boolean | null
          next_occurrence: string | null
          notes: string | null
          source_name: string
          tags: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          date?: string
          frequency?: Database["public"]["Enums"]["expense_frequency"] | null
          id?: string
          is_active?: boolean | null
          next_occurrence?: string | null
          notes?: string | null
          source_name: string
          tags?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          date?: string
          frequency?: Database["public"]["Enums"]["expense_frequency"] | null
          id?: string
          is_active?: boolean | null
          next_occurrence?: string | null
          notes?: string | null
          source_name?: string
          tags?: string[] | null
          updated_at?: string
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
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          id: string
          message: string
          read: boolean | null
          related_id: string | null
          related_type: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          id?: string
          message: string
          read?: boolean | null
          related_id?: string | null
          related_type?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          id?: string
          message?: string
          read?: boolean | null
          related_id?: string | null
          related_type?: string | null
          title?: string
          type?: string
          user_id?: string
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
          daily_reminders_enabled: boolean | null
          email_notifications_enabled: boolean | null
          full_name: string | null
          id: string
          plan: Database["public"]["Enums"]["app_plan"]
          role: Database["public"]["Enums"]["app_role"]
          task_deadline_notifications: boolean | null
          updated_at: string
          weekly_digest_enabled: boolean | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          daily_reminders_enabled?: boolean | null
          email_notifications_enabled?: boolean | null
          full_name?: string | null
          id: string
          plan?: Database["public"]["Enums"]["app_plan"]
          role?: Database["public"]["Enums"]["app_role"]
          task_deadline_notifications?: boolean | null
          updated_at?: string
          weekly_digest_enabled?: boolean | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          daily_reminders_enabled?: boolean | null
          email_notifications_enabled?: boolean | null
          full_name?: string | null
          id?: string
          plan?: Database["public"]["Enums"]["app_plan"]
          role?: Database["public"]["Enums"]["app_role"]
          task_deadline_notifications?: boolean | null
          updated_at?: string
          weekly_digest_enabled?: boolean | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          account_used: string | null
          activitylogs: Json | null
          analysis_text: string | null
          category: string | null
          chat_links: string[] | null
          createdat: string
          description: string | null
          githuburl: string | null
          id: string
          ismonetized: boolean
          lastupdated: string
          milestones: Json | null
          name: string
          nextaction: string | null
          pinned: boolean | null
          progress: number
          status: string
          tags: string[]
          tasks: Json | null
          type: string
          usefulness: number
          user_id: string | null
          websiteurl: string | null
        }
        Insert: {
          account_used?: string | null
          activitylogs?: Json | null
          analysis_text?: string | null
          category?: string | null
          chat_links?: string[] | null
          createdat?: string
          description?: string | null
          githuburl?: string | null
          id?: string
          ismonetized?: boolean
          lastupdated?: string
          milestones?: Json | null
          name: string
          nextaction?: string | null
          pinned?: boolean | null
          progress?: number
          status: string
          tags?: string[]
          tasks?: Json | null
          type: string
          usefulness: number
          user_id?: string | null
          websiteurl?: string | null
        }
        Update: {
          account_used?: string | null
          activitylogs?: Json | null
          analysis_text?: string | null
          category?: string | null
          chat_links?: string[] | null
          createdat?: string
          description?: string | null
          githuburl?: string | null
          id?: string
          ismonetized?: boolean
          lastupdated?: string
          milestones?: Json | null
          name?: string
          nextaction?: string | null
          pinned?: boolean | null
          progress?: number
          status?: string
          tags?: string[]
          tasks?: Json | null
          type?: string
          usefulness?: number
          user_id?: string | null
          websiteurl?: string | null
        }
        Relationships: []
      }
      readings: {
        Row: {
          amount_paid: number
          created_at: string | null
          date: string
          id: string
          notes: string | null
          reading_value: number | null
          supplier_id: string
          user_id: string | null
        }
        Insert: {
          amount_paid: number
          created_at?: string | null
          date: string
          id?: string
          notes?: string | null
          reading_value?: number | null
          supplier_id: string
          user_id?: string | null
        }
        Update: {
          amount_paid?: number
          created_at?: string | null
          date?: string
          id?: string
          notes?: string | null
          reading_value?: number | null
          supplier_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "readings_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      receipt_items: {
        Row: {
          category: string
          confidence: number | null
          created_at: string
          exchange_rate: number | null
          id: string
          name: string
          original_currency: string | null
          original_price: number | null
          price: number
          quantity: number | null
          receipt_id: string
          recurring_frequency:
            | Database["public"]["Enums"]["expense_frequency"]
            | null
          recurring_pattern: string | null
          tags: string[] | null
        }
        Insert: {
          category?: string
          confidence?: number | null
          created_at?: string
          exchange_rate?: number | null
          id?: string
          name: string
          original_currency?: string | null
          original_price?: number | null
          price: number
          quantity?: number | null
          receipt_id: string
          recurring_frequency?:
            | Database["public"]["Enums"]["expense_frequency"]
            | null
          recurring_pattern?: string | null
          tags?: string[] | null
        }
        Update: {
          category?: string
          confidence?: number | null
          created_at?: string
          exchange_rate?: number | null
          id?: string
          name?: string
          original_currency?: string | null
          original_price?: number | null
          price?: number
          quantity?: number | null
          receipt_id?: string
          recurring_frequency?:
            | Database["public"]["Enums"]["expense_frequency"]
            | null
          recurring_pattern?: string | null
          tags?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "receipt_items_receipt_id_fkey"
            columns: ["receipt_id"]
            isOneToOne: false
            referencedRelation: "receipts"
            referencedColumns: ["id"]
          },
        ]
      }
      receipts: {
        Row: {
          created_at: string
          date: string
          exchange_rate: number | null
          id: string
          image_url: string
          next_occurrence: string | null
          original_currency: string | null
          original_total: number | null
          processing_date: string
          raw_text: string | null
          recurring_frequency:
            | Database["public"]["Enums"]["expense_frequency"]
            | null
          store_name: string
          tags: string[] | null
          total: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          date: string
          exchange_rate?: number | null
          id?: string
          image_url: string
          next_occurrence?: string | null
          original_currency?: string | null
          original_total?: number | null
          processing_date?: string
          raw_text?: string | null
          recurring_frequency?:
            | Database["public"]["Enums"]["expense_frequency"]
            | null
          store_name: string
          tags?: string[] | null
          total: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          exchange_rate?: number | null
          id?: string
          image_url?: string
          next_occurrence?: string | null
          original_currency?: string | null
          original_total?: number | null
          processing_date?: string
          raw_text?: string | null
          recurring_frequency?:
            | Database["public"]["Enums"]["expense_frequency"]
            | null
          store_name?: string
          tags?: string[] | null
          total?: number
          updated_at?: string
          user_id?: string | null
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
      savings_goals: {
        Row: {
          auto_contribute_amount: number | null
          auto_contribute_frequency:
            | Database["public"]["Enums"]["expense_frequency"]
            | null
          created_at: string
          current_amount: number | null
          description: string | null
          id: string
          name: string
          priority: number | null
          status: Database["public"]["Enums"]["goal_status"] | null
          tags: string[] | null
          target_amount: number
          target_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_contribute_amount?: number | null
          auto_contribute_frequency?:
            | Database["public"]["Enums"]["expense_frequency"]
            | null
          created_at?: string
          current_amount?: number | null
          description?: string | null
          id?: string
          name: string
          priority?: number | null
          status?: Database["public"]["Enums"]["goal_status"] | null
          tags?: string[] | null
          target_amount: number
          target_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_contribute_amount?: number | null
          auto_contribute_frequency?:
            | Database["public"]["Enums"]["expense_frequency"]
            | null
          created_at?: string
          current_amount?: number | null
          description?: string | null
          id?: string
          name?: string
          priority?: number | null
          status?: Database["public"]["Enums"]["goal_status"] | null
          tags?: string[] | null
          target_amount?: number
          target_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      scope_items: {
        Row: {
          category: string | null
          checked_by: string | null
          client_notes: string | null
          created_at: string | null
          id: string
          is_covered: boolean | null
          item_description: string
          survey_id: string | null
          updated_at: string | null
          zone: string
        }
        Insert: {
          category?: string | null
          checked_by?: string | null
          client_notes?: string | null
          created_at?: string | null
          id?: string
          is_covered?: boolean | null
          item_description: string
          survey_id?: string | null
          updated_at?: string | null
          zone: string
        }
        Update: {
          category?: string | null
          checked_by?: string | null
          client_notes?: string | null
          created_at?: string | null
          id?: string
          is_covered?: boolean | null
          item_description?: string
          survey_id?: string | null
          updated_at?: string | null
          zone?: string
        }
        Relationships: [
          {
            foreignKeyName: "scope_items_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "survey_analytics"
            referencedColumns: ["survey_id"]
          },
          {
            foreignKeyName: "scope_items_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      ships: {
        Row: {
          beam: string | null
          builder: string | null
          building_cost: string | null
          cabins: string | null
          created_at: string
          crew: string | null
          decks: string | null
          decks_with_cabins: string | null
          flag_state: string | null
          former_names: string | null
          gross_tonnage: string | null
          id: string
          imo_number: string | null
          last_refurbishment_year: string | null
          length_loa: string | null
          operator: string | null
          owner: string | null
          passengers: string | null
          ship_type: string | null
          sister_ships: string | null
          updated_at: string
          user_id: string | null
          vessel_name: string
          year_of_build: string | null
        }
        Insert: {
          beam?: string | null
          builder?: string | null
          building_cost?: string | null
          cabins?: string | null
          created_at?: string
          crew?: string | null
          decks?: string | null
          decks_with_cabins?: string | null
          flag_state?: string | null
          former_names?: string | null
          gross_tonnage?: string | null
          id?: string
          imo_number?: string | null
          last_refurbishment_year?: string | null
          length_loa?: string | null
          operator?: string | null
          owner?: string | null
          passengers?: string | null
          ship_type?: string | null
          sister_ships?: string | null
          updated_at?: string
          user_id?: string | null
          vessel_name: string
          year_of_build?: string | null
        }
        Update: {
          beam?: string | null
          builder?: string | null
          building_cost?: string | null
          cabins?: string | null
          created_at?: string
          crew?: string | null
          decks?: string | null
          decks_with_cabins?: string | null
          flag_state?: string | null
          former_names?: string | null
          gross_tonnage?: string | null
          id?: string
          imo_number?: string | null
          last_refurbishment_year?: string | null
          length_loa?: string | null
          operator?: string | null
          owner?: string | null
          passengers?: string | null
          ship_type?: string | null
          sister_ships?: string | null
          updated_at?: string
          user_id?: string | null
          vessel_name?: string
          year_of_build?: string | null
        }
        Relationships: []
      }
      shopping_items: {
        Row: {
          bought: boolean | null
          created_at: string
          id: string
          is_favorite: boolean | null
          name: string
          section: string
          updated_at: string
          user_id: string
        }
        Insert: {
          bought?: boolean | null
          created_at?: string
          id?: string
          is_favorite?: boolean | null
          name: string
          section: string
          updated_at?: string
          user_id: string
        }
        Update: {
          bought?: boolean | null
          created_at?: string
          id?: string
          is_favorite?: boolean | null
          name?: string
          section?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          description: string | null
          id: string
          key: string
          updated_at: string | null
          value: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: string | null
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          is_metered: boolean | null
          login_url: string | null
          name: string
          payment_type: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          is_metered?: boolean | null
          login_url?: string | null
          name: string
          payment_type?: string | null
          type: string
          user_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          is_metered?: boolean | null
          login_url?: string | null
          name?: string
          payment_type?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      survey_checklist_media: {
        Row: {
          created_at: string
          evidence_type: string | null
          file_name: string
          file_size: number | null
          file_type: string
          id: string
          last_synced_at: string | null
          local_file_data: string | null
          needs_sync: boolean | null
          response_id: string
          storage_path: string
          survey_id: string
        }
        Insert: {
          created_at?: string
          evidence_type?: string | null
          file_name: string
          file_size?: number | null
          file_type: string
          id?: string
          last_synced_at?: string | null
          local_file_data?: string | null
          needs_sync?: boolean | null
          response_id: string
          storage_path: string
          survey_id: string
        }
        Update: {
          created_at?: string
          evidence_type?: string | null
          file_name?: string
          file_size?: number | null
          file_type?: string
          id?: string
          last_synced_at?: string | null
          local_file_data?: string | null
          needs_sync?: boolean | null
          response_id?: string
          storage_path?: string
          survey_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "survey_checklist_media_response_id_fkey"
            columns: ["response_id"]
            isOneToOne: false
            referencedRelation: "survey_checklist_responses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "survey_checklist_media_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "survey_analytics"
            referencedColumns: ["survey_id"]
          },
          {
            foreignKeyName: "survey_checklist_media_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      survey_checklist_responses: {
        Row: {
          asset_tag: string | null
          created_at: string
          id: string
          is_mandatory: boolean | null
          last_synced_at: string | null
          needs_sync: boolean | null
          notes: string | null
          qr_code: string | null
          question_category: string
          question_id: string
          question_text: string
          response_type: string
          rfid_tag: string | null
          survey_id: string
          template_id: string | null
          updated_at: string
          zone_id: string | null
        }
        Insert: {
          asset_tag?: string | null
          created_at?: string
          id?: string
          is_mandatory?: boolean | null
          last_synced_at?: string | null
          needs_sync?: boolean | null
          notes?: string | null
          qr_code?: string | null
          question_category: string
          question_id: string
          question_text: string
          response_type: string
          rfid_tag?: string | null
          survey_id: string
          template_id?: string | null
          updated_at?: string
          zone_id?: string | null
        }
        Update: {
          asset_tag?: string | null
          created_at?: string
          id?: string
          is_mandatory?: boolean | null
          last_synced_at?: string | null
          needs_sync?: boolean | null
          notes?: string | null
          qr_code?: string | null
          question_category?: string
          question_id?: string
          question_text?: string
          response_type?: string
          rfid_tag?: string | null
          survey_id?: string
          template_id?: string | null
          updated_at?: string
          zone_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "survey_checklist_responses_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "survey_analytics"
            referencedColumns: ["survey_id"]
          },
          {
            foreignKeyName: "survey_checklist_responses_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "survey_checklist_responses_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "survey_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "survey_checklist_responses_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "survey_zones"
            referencedColumns: ["id"]
          },
        ]
      }
      survey_media: {
        Row: {
          created_at: string
          file_name: string
          file_size: number | null
          file_type: string
          id: string
          last_synced_at: string | null
          local_file_data: string | null
          needs_sync: boolean | null
          storage_path: string
          survey_id: string
          thumbnail_path: string | null
          zone_id: string | null
        }
        Insert: {
          created_at?: string
          file_name: string
          file_size?: number | null
          file_type: string
          id?: string
          last_synced_at?: string | null
          local_file_data?: string | null
          needs_sync?: boolean | null
          storage_path: string
          survey_id: string
          thumbnail_path?: string | null
          zone_id?: string | null
        }
        Update: {
          created_at?: string
          file_name?: string
          file_size?: number | null
          file_type?: string
          id?: string
          last_synced_at?: string | null
          local_file_data?: string | null
          needs_sync?: boolean | null
          storage_path?: string
          survey_id?: string
          thumbnail_path?: string | null
          zone_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "survey_media_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "survey_analytics"
            referencedColumns: ["survey_id"]
          },
          {
            foreignKeyName: "survey_media_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "survey_media_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "survey_zones"
            referencedColumns: ["id"]
          },
        ]
      }
      survey_notes: {
        Row: {
          created_at: string
          id: string
          last_synced_at: string | null
          needs_sync: boolean | null
          note_content: string
          section: string | null
          survey_id: string
          updated_at: string
          zone_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_synced_at?: string | null
          needs_sync?: boolean | null
          note_content: string
          section?: string | null
          survey_id: string
          updated_at?: string
          zone_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_synced_at?: string | null
          needs_sync?: boolean | null
          note_content?: string
          section?: string | null
          survey_id?: string
          updated_at?: string
          zone_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "survey_notes_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "survey_analytics"
            referencedColumns: ["survey_id"]
          },
          {
            foreignKeyName: "survey_notes_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "survey_notes_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "survey_zones"
            referencedColumns: ["id"]
          },
        ]
      }
      survey_templates: {
        Row: {
          category: string
          compliance_standards: string[] | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_default: boolean | null
          name: string
          questions: Json
          updated_at: string
        }
        Insert: {
          category?: string
          compliance_standards?: string[] | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          questions?: Json
          updated_at?: string
        }
        Update: {
          category?: string
          compliance_standards?: string[] | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          questions?: Json
          updated_at?: string
        }
        Relationships: []
      }
      survey_zones: {
        Row: {
          created_at: string
          id: string
          survey_id: string
          zone_description: string | null
          zone_metadata: Json | null
          zone_name: string
          zone_subtype: string | null
          zone_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          survey_id: string
          zone_description?: string | null
          zone_metadata?: Json | null
          zone_name: string
          zone_subtype?: string | null
          zone_type: string
        }
        Update: {
          created_at?: string
          id?: string
          survey_id?: string
          zone_description?: string | null
          zone_metadata?: Json | null
          zone_name?: string
          zone_subtype?: string | null
          zone_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "survey_zones_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "survey_analytics"
            referencedColumns: ["survey_id"]
          },
          {
            foreignKeyName: "survey_zones_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      surveys: {
        Row: {
          client_contacts: Json | null
          client_country: string
          client_id: string | null
          client_name: string
          created_at: string
          custom_fields: Json | null
          duration: string
          flight_details: Json | null
          hotel_details: Json | null
          id: string
          last_synced_at: string | null
          needs_sync: boolean | null
          project_scope: string
          ship_name: string
          status: string
          survey_date: string
          survey_location: string
          tools: string[] | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          client_contacts?: Json | null
          client_country: string
          client_id?: string | null
          client_name: string
          created_at?: string
          custom_fields?: Json | null
          duration: string
          flight_details?: Json | null
          hotel_details?: Json | null
          id?: string
          last_synced_at?: string | null
          needs_sync?: boolean | null
          project_scope: string
          ship_name: string
          status?: string
          survey_date: string
          survey_location: string
          tools?: string[] | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          client_contacts?: Json | null
          client_country?: string
          client_id?: string | null
          client_name?: string
          created_at?: string
          custom_fields?: Json | null
          duration?: string
          flight_details?: Json | null
          hotel_details?: Json | null
          id?: string
          last_synced_at?: string | null
          needs_sync?: boolean | null
          project_scope?: string
          ship_name?: string
          status?: string
          survey_date?: string
          survey_location?: string
          tools?: string[] | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "surveys_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          completed: boolean | null
          created_at: string
          due_date: string | null
          id: string
          priority: string
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          due_date?: string | null
          id?: string
          priority: string
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          due_date?: string | null
          id?: string
          priority?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      travel_expenses: {
        Row: {
          cost: number
          created_at: string
          currency: string
          description: string | null
          end_date: string | null
          expense_date: string
          expense_type: string
          id: string
          start_date: string | null
          survey_id: string
          surveyor_name: string
          updated_at: string
        }
        Insert: {
          cost: number
          created_at?: string
          currency?: string
          description?: string | null
          end_date?: string | null
          expense_date: string
          expense_type: string
          id?: string
          start_date?: string | null
          survey_id: string
          surveyor_name: string
          updated_at?: string
        }
        Update: {
          cost?: number
          created_at?: string
          currency?: string
          description?: string | null
          end_date?: string | null
          expense_date?: string
          expense_type?: string
          id?: string
          start_date?: string | null
          survey_id?: string
          surveyor_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "travel_expenses_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "survey_analytics"
            referencedColumns: ["survey_id"]
          },
          {
            foreignKeyName: "travel_expenses_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "surveys"
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
      user_preferences: {
        Row: {
          created_at: string
          id: string
          preference_key: string
          preference_value: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          preference_key: string
          preference_value?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          preference_key?: string
          preference_value?: Json
          updated_at?: string
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
      utility_readings: {
        Row: {
          amount: number
          created_at: string
          id: string
          meter_reading: number | null
          notes: string | null
          reading_date: string
          supplier_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          meter_reading?: number | null
          notes?: string | null
          reading_date: string
          supplier_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          meter_reading?: number | null
          notes?: string | null
          reading_date?: string
          supplier_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "utility_readings_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "utility_suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      utility_suppliers: {
        Row: {
          created_at: string
          id: string
          name: string
          payment_method: string | null
          subscription_based: boolean | null
          type_id: string | null
          updated_at: string
          user_id: string | null
          website_url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          payment_method?: string | null
          subscription_based?: boolean | null
          type_id?: string | null
          updated_at?: string
          user_id?: string | null
          website_url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          payment_method?: string | null
          subscription_based?: boolean | null
          type_id?: string | null
          updated_at?: string
          user_id?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "utility_suppliers_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "utility_types"
            referencedColumns: ["id"]
          },
        ]
      }
      utility_types: {
        Row: {
          created_at: string
          id: string
          name: string
          requires_meter_reading: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          requires_meter_reading?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          requires_meter_reading?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      weekly_goals: {
        Row: {
          category: string
          created_at: string
          id: string
          progress: number | null
          tasks: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          progress?: number | null
          tasks?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          progress?: number | null
          tasks?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      weekly_reviews: {
        Row: {
          created_at: string
          id: string
          user_id: string
          week_start: string
          what_could_improve: string | null
          what_worked: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
          week_start: string
          what_could_improve?: string | null
          what_worked?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
          week_start?: string
          what_could_improve?: string | null
          what_worked?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      survey_analytics: {
        Row: {
          compliant_items: number | null
          issues_found: number | null
          mandatory_skipped: number | null
          not_applicable: number | null
          ship_name: string | null
          status: string | null
          survey_id: string | null
          survey_location: string | null
          total_evidence_files: number | null
          total_responses: number | null
        }
        Relationships: []
      }
      survey_issues_by_category: {
        Row: {
          issue_count: number | null
          question_category: string | null
          survey_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "survey_checklist_responses_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "survey_analytics"
            referencedColumns: ["survey_id"]
          },
          {
            foreignKeyName: "survey_checklist_responses_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      get_all_tags: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      get_product_user_id: {
        Args: { p_product_id: string }
        Returns: string
      }
      upsert_user_setting: {
        Args: { p_key_name: string; p_value: string }
        Returns: string
      }
    }
    Enums: {
      allocation_type: "percentage" | "fixed_amount"
      app_plan: "free" | "pro" | "team" | "enterprise"
      app_role: "user" | "developer"
      budget_period: "monthly" | "weekly" | "yearly"
      expense_frequency: "one_time" | "daily" | "weekly" | "monthly" | "yearly"
      goal_status: "active" | "completed" | "paused"
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
    Enums: {
      allocation_type: ["percentage", "fixed_amount"],
      app_plan: ["free", "pro", "team", "enterprise"],
      app_role: ["user", "developer"],
      budget_period: ["monthly", "weekly", "yearly"],
      expense_frequency: ["one_time", "daily", "weekly", "monthly", "yearly"],
      goal_status: ["active", "completed", "paused"],
    },
  },
} as const
