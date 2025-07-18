export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string | null
          description: string | null
          earned: boolean | null
          earned_date: string | null
          id: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          earned?: boolean | null
          earned_date?: string | null
          id?: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          earned?: boolean | null
          earned_date?: string | null
          id?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      goals: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          impact_score: number | null
          parent_goal_id: string | null
          priority: string | null
          progress: number | null
          title: string
          type: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          impact_score?: number | null
          parent_goal_id?: string | null
          priority?: string | null
          progress?: number | null
          title: string
          type?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          impact_score?: number | null
          parent_goal_id?: string | null
          priority?: string | null
          progress?: number | null
          title?: string
          type?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "goals_parent_goal_id_fkey"
            columns: ["parent_goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
        ]
      }
      impediments: {
        Row: {
          created_at: string | null
          description: string
          id: string
          resolved: boolean | null
          resolved_at: string | null
          task_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          resolved?: boolean | null
          resolved_at?: string | null
          task_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          resolved?: boolean | null
          resolved_at?: string | null
          task_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "impediments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          completed: boolean | null
          created_at: string | null
          description: string | null
          estimated_time: number | null
          goal_id: string | null
          id: string
          impact_score: number | null
          in_progress: boolean | null
          priority: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          description?: string | null
          estimated_time?: number | null
          goal_id?: string | null
          id?: string
          impact_score?: number | null
          in_progress?: boolean | null
          priority?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          description?: string | null
          estimated_time?: number | null
          goal_id?: string | null
          id?: string
          impact_score?: number | null
          in_progress?: boolean | null
          priority?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string | null
          goals: Json | null
          id: string
          motivators: Json | null
          personality: Json | null
          preferences: Json | null
          streak_best: number | null
          streak_current: number | null
          streak_last_updated: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          goals?: Json | null
          id?: string
          motivators?: Json | null
          personality?: Json | null
          preferences?: Json | null
          streak_best?: number | null
          streak_current?: number | null
          streak_last_updated?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          goals?: Json | null
          id?: string
          motivators?: Json | null
          personality?: Json | null
          preferences?: Json | null
          streak_best?: number | null
          streak_current?: number | null
          streak_last_updated?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string | null
          id: string
          motivators: Json | null
          personality: Json | null
          preferences: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          motivators?: Json | null
          personality?: Json | null
          preferences?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          motivators?: Json | null
          personality?: Json | null
          preferences?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
