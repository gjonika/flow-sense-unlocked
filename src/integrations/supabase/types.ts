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
          category: string | null
          createdat: string
          description: string | null
          githuburl: string | null
          id: string
          ismonetized: boolean
          lastupdated: string
          milestones: Json | null
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
          category?: string | null
          createdat?: string
          description?: string | null
          githuburl?: string | null
          id?: string
          ismonetized?: boolean
          lastupdated?: string
          milestones?: Json | null
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
          category?: string | null
          createdat?: string
          description?: string | null
          githuburl?: string | null
          id?: string
          ismonetized?: boolean
          lastupdated?: string
          milestones?: Json | null
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
          survey_id?: string
          updated_at?: string
          zone_id?: string
        }
        Relationships: [
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
      survey_zones: {
        Row: {
          created_at: string
          id: string
          survey_id: string
          zone_name: string
          zone_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          survey_id: string
          zone_name: string
          zone_type: string
        }
        Update: {
          created_at?: string
          id?: string
          survey_id?: string
          zone_name?: string
          zone_type?: string
        }
        Relationships: [
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
          user_id: string
        }
        Insert: {
          client_contacts?: Json | null
          client_country: string
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
          user_id: string
        }
        Update: {
          client_contacts?: Json | null
          client_country?: string
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
          user_id?: string
        }
        Relationships: []
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
