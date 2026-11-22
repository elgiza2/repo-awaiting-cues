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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      ai_events: {
        Row: {
          created_at: string
          id: string
          kind: string
          model: string | null
          run_id: string | null
          tokens: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          kind?: string
          model?: string | null
          run_id?: string | null
          tokens?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string
          model?: string | null
          run_id?: string | null
          tokens?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_usage: {
        Row: {
          actions: number
          period: string
          updated_at: string
          user_id: string
        }
        Insert: {
          actions?: number
          period: string
          updated_at?: string
          user_id: string
        }
        Update: {
          actions?: number
          period?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_usage_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      app_connections: {
        Row: {
          created_at: string
          email: string | null
          external_account_id: string | null
          id: string
          meta: Json
          provider: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          external_account_id?: string | null
          id?: string
          meta?: Json
          provider: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          external_account_id?: string | null
          id?: string
          meta?: Json
          provider?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "app_connections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bg_ad_daily: {
        Row: {
          count: number
          day: string
          telegram_id: number
        }
        Insert: {
          count?: number
          day: string
          telegram_id: number
        }
        Update: {
          count?: number
          day?: string
          telegram_id?: number
        }
        Relationships: []
      }
      bg_admins: {
        Row: {
          added_by: string | null
          created_at: string
          role: string
          telegram_id: number | null
          username: string
        }
        Insert: {
          added_by?: string | null
          created_at?: string
          role: string
          telegram_id?: number | null
          username: string
        }
        Update: {
          added_by?: string | null
          created_at?: string
          role?: string
          telegram_id?: number | null
          username?: string
        }
        Relationships: []
      }
      bg_config: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      bg_contest_payouts: {
        Row: {
          created_at: string
          currency: string
          day: string
          invites: number
          prize: number
          rank: number
          telegram_id: number
        }
        Insert: {
          created_at?: string
          currency?: string
          day: string
          invites: number
          prize: number
          rank: number
          telegram_id: number
        }
        Update: {
          created_at?: string
          currency?: string
          day?: string
          invites?: number
          prize?: number
          rank?: number
          telegram_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "bg_contest_payouts_telegram_id_fkey"
            columns: ["telegram_id"]
            isOneToOne: false
            referencedRelation: "bg_players"
            referencedColumns: ["telegram_id"]
          },
        ]
      }
      bg_gift_claims: {
        Row: {
          claimed_at: string
          gift_id: string
          telegram_id: number
        }
        Insert: {
          claimed_at?: string
          gift_id: string
          telegram_id: number
        }
        Update: {
          claimed_at?: string
          gift_id?: string
          telegram_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "bg_gift_claims_gift_id_fkey"
            columns: ["gift_id"]
            isOneToOne: false
            referencedRelation: "bg_gifts"
            referencedColumns: ["id"]
          },
        ]
      }
      bg_gifts: {
        Row: {
          amount: number
          created_at: string
          expires_at: string
          id: string
          title: string
        }
        Insert: {
          amount: number
          created_at?: string
          expires_at?: string
          id?: string
          title: string
        }
        Update: {
          amount?: number
          created_at?: string
          expires_at?: string
          id?: string
          title?: string
        }
        Relationships: []
      }
      bg_jobs: {
        Row: {
          cursor: number
          done: boolean
          key: string
          sent: number
          updated_at: string
        }
        Insert: {
          cursor?: number
          done?: boolean
          key: string
          sent?: number
          updated_at?: string
        }
        Update: {
          cursor?: number
          done?: boolean
          key?: string
          sent?: number
          updated_at?: string
        }
        Relationships: []
      }
      bg_ledger: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: number
          meta: Json | null
          reason: string
          telegram_id: number
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: number
          meta?: Json | null
          reason: string
          telegram_id: number
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: number
          meta?: Json | null
          reason?: string
          telegram_id?: number
        }
        Relationships: []
      }
      bg_operators: {
        Row: {
          boost_pct: number
          id: string
          image: string
          name: string
          price: number
          rarity: string
          sort: number
          unlock_ads: number
        }
        Insert: {
          boost_pct: number
          id: string
          image: string
          name: string
          price?: number
          rarity: string
          sort?: number
          unlock_ads?: number
        }
        Update: {
          boost_pct?: number
          id?: string
          image?: string
          name?: string
          price?: number
          rarity?: string
          sort?: number
          unlock_ads?: number
        }
        Relationships: []
      }
      bg_owned_operators: {
        Row: {
          acquired_at: string
          operator_id: string
          telegram_id: number
        }
        Insert: {
          acquired_at?: string
          operator_id: string
          telegram_id: number
        }
        Update: {
          acquired_at?: string
          operator_id?: string
          telegram_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "bg_owned_operators_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "bg_operators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bg_owned_operators_telegram_id_fkey"
            columns: ["telegram_id"]
            isOneToOne: false
            referencedRelation: "bg_players"
            referencedColumns: ["telegram_id"]
          },
        ]
      }
      bg_owned_servers: {
        Row: {
          acquired_at: string
          expires_at: string
          id: string
          server_id: number
          source: string
          telegram_id: number
        }
        Insert: {
          acquired_at?: string
          expires_at: string
          id?: string
          server_id: number
          source: string
          telegram_id: number
        }
        Update: {
          acquired_at?: string
          expires_at?: string
          id?: string
          server_id?: number
          source?: string
          telegram_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "bg_owned_servers_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "bg_servers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bg_owned_servers_telegram_id_fkey"
            columns: ["telegram_id"]
            isOneToOne: false
            referencedRelation: "bg_players"
            referencedColumns: ["telegram_id"]
          },
        ]
      }
      bg_payments: {
        Row: {
          amount_nano: number
          confirmed_at: string | null
          created_at: string
          expires_at: string
          id: string
          memo: string
          purpose: string
          ref: string | null
          sender: string | null
          status: string
          telegram_id: number
          tx_hash: string | null
        }
        Insert: {
          amount_nano: number
          confirmed_at?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          memo: string
          purpose: string
          ref?: string | null
          sender?: string | null
          status?: string
          telegram_id: number
          tx_hash?: string | null
        }
        Update: {
          amount_nano?: number
          confirmed_at?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          memo?: string
          purpose?: string
          ref?: string | null
          sender?: string | null
          status?: string
          telegram_id?: number
          tx_hash?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bg_payments_telegram_id_fkey"
            columns: ["telegram_id"]
            isOneToOne: false
            referencedRelation: "bg_players"
            referencedColumns: ["telegram_id"]
          },
        ]
      }
      bg_players: {
        Row: {
          activated: boolean
          ad_last_at: string | null
          ads_day: string | null
          ads_today: number
          ads_total: number
          balance: number
          boost_until: string | null
          bot_blocked: boolean
          created_at: string
          first_name: string | null
          gram_balance: number
          is_premium: boolean
          joined_channel: boolean
          language_code: string | null
          last_checkin: string | null
          last_claim_at: string
          last_name: string | null
          last_seen_at: string | null
          operator_id: string
          photo_url: string | null
          ref_count: number
          referrer_id: number | null
          referrer2_id: number | null
          started_bot: boolean
          streak: number
          telegram_id: number
          total_mined: number
          total_ref_earned: number
          total_spent: number
          total_swapped: number
          updated_at: string
          username: string | null
          wallet_address: string | null
        }
        Insert: {
          activated?: boolean
          ad_last_at?: string | null
          ads_day?: string | null
          ads_today?: number
          ads_total?: number
          balance?: number
          boost_until?: string | null
          bot_blocked?: boolean
          created_at?: string
          first_name?: string | null
          gram_balance?: number
          is_premium?: boolean
          joined_channel?: boolean
          language_code?: string | null
          last_checkin?: string | null
          last_claim_at?: string
          last_name?: string | null
          last_seen_at?: string | null
          operator_id?: string
          photo_url?: string | null
          ref_count?: number
          referrer_id?: number | null
          referrer2_id?: number | null
          started_bot?: boolean
          streak?: number
          telegram_id: number
          total_mined?: number
          total_ref_earned?: number
          total_spent?: number
          total_swapped?: number
          updated_at?: string
          username?: string | null
          wallet_address?: string | null
        }
        Update: {
          activated?: boolean
          ad_last_at?: string | null
          ads_day?: string | null
          ads_today?: number
          ads_total?: number
          balance?: number
          boost_until?: string | null
          bot_blocked?: boolean
          created_at?: string
          first_name?: string | null
          gram_balance?: number
          is_premium?: boolean
          joined_channel?: boolean
          language_code?: string | null
          last_checkin?: string | null
          last_claim_at?: string
          last_name?: string | null
          last_seen_at?: string | null
          operator_id?: string
          photo_url?: string | null
          ref_count?: number
          referrer_id?: number | null
          referrer2_id?: number | null
          started_bot?: boolean
          streak?: number
          telegram_id?: number
          total_mined?: number
          total_ref_earned?: number
          total_spent?: number
          total_swapped?: number
          updated_at?: string
          username?: string | null
          wallet_address?: string | null
        }
        Relationships: []
      }
      bg_posts: {
        Row: {
          created_at: string
          error: string | null
          id: string
          message_id: number | null
          slot: string
          status: string
          text: string | null
        }
        Insert: {
          created_at?: string
          error?: string | null
          id?: string
          message_id?: number | null
          slot: string
          status?: string
          text?: string | null
        }
        Update: {
          created_at?: string
          error?: string | null
          id?: string
          message_id?: number | null
          slot?: string
          status?: string
          text?: string | null
        }
        Relationships: []
      }
      bg_servers: {
        Row: {
          active: boolean
          daily_rate: number
          duration_days: number
          id: number
          image: string
          level: number
          name: string
          price: number
          rarity: string
          slug: string
          sort: number
          tier: number
          unlock: string
          unlock_goal: number
        }
        Insert: {
          active?: boolean
          daily_rate: number
          duration_days: number
          id: number
          image: string
          level: number
          name: string
          price?: number
          rarity: string
          slug: string
          sort?: number
          tier: number
          unlock: string
          unlock_goal?: number
        }
        Update: {
          active?: boolean
          daily_rate?: number
          duration_days?: number
          id?: number
          image?: string
          level?: number
          name?: string
          price?: number
          rarity?: string
          slug?: string
          sort?: number
          tier?: number
          unlock?: string
          unlock_goal?: number
        }
        Relationships: []
      }
      bg_task_claims: {
        Row: {
          claimed_at: string
          period: string
          task_id: string
          telegram_id: number
        }
        Insert: {
          claimed_at?: string
          period: string
          task_id: string
          telegram_id: number
        }
        Update: {
          claimed_at?: string
          period?: string
          task_id?: string
          telegram_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "bg_task_claims_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "bg_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bg_task_claims_telegram_id_fkey"
            columns: ["telegram_id"]
            isOneToOne: false
            referencedRelation: "bg_players"
            referencedColumns: ["telegram_id"]
          },
        ]
      }
      bg_tasks: {
        Row: {
          active: boolean
          chat_username: string | null
          created_at: string
          created_by: number | null
          description: string | null
          goal: number
          icon: string
          id: string
          kind: string
          repeat: string
          reward: number
          sort: number
          title: string
          updated_at: string
          url: string | null
        }
        Insert: {
          active?: boolean
          chat_username?: string | null
          created_at?: string
          created_by?: number | null
          description?: string | null
          goal?: number
          icon?: string
          id?: string
          kind: string
          repeat?: string
          reward?: number
          sort?: number
          title: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          active?: boolean
          chat_username?: string | null
          created_at?: string
          created_by?: number | null
          description?: string | null
          goal?: number
          icon?: string
          id?: string
          kind?: string
          repeat?: string
          reward?: number
          sort?: number
          title?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      bg_withdrawals: {
        Row: {
          admin_note: string | null
          amount: number
          created_at: string
          currency: string
          fee_payment_id: string | null
          id: string
          processed_at: string | null
          processed_by: number | null
          status: string
          telegram_id: number
          wallet: string
        }
        Insert: {
          admin_note?: string | null
          amount: number
          created_at?: string
          currency?: string
          fee_payment_id?: string | null
          id?: string
          processed_at?: string | null
          processed_by?: number | null
          status?: string
          telegram_id: number
          wallet: string
        }
        Update: {
          admin_note?: string | null
          amount?: number
          created_at?: string
          currency?: string
          fee_payment_id?: string | null
          id?: string
          processed_at?: string | null
          processed_by?: number | null
          status?: string
          telegram_id?: number
          wallet?: string
        }
        Relationships: [
          {
            foreignKeyName: "bg_withdrawals_fee_payment_id_fkey"
            columns: ["fee_payment_id"]
            isOneToOne: false
            referencedRelation: "bg_payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bg_withdrawals_telegram_id_fkey"
            columns: ["telegram_id"]
            isOneToOne: false
            referencedRelation: "bg_players"
            referencedColumns: ["telegram_id"]
          },
        ]
      }
      billing_events: {
        Row: {
          amount: number | null
          created_at: string
          currency: string
          event: string
          external_id: string | null
          id: string
          plan: Database["public"]["Enums"]["plan_tier"]
          provider: string
          user_id: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          currency?: string
          event: string
          external_id?: string | null
          id?: string
          plan: Database["public"]["Enums"]["plan_tier"]
          provider?: string
          user_id: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          currency?: string
          event?: string
          external_id?: string | null
          id?: string
          plan?: Database["public"]["Enums"]["plan_tier"]
          provider?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "billing_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_events: {
        Row: {
          attendees: string[]
          created_at: string
          email_id: string | null
          ends_at: string | null
          id: string
          location: string | null
          starts_at: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          attendees?: string[]
          created_at?: string
          email_id?: string | null
          ends_at?: string | null
          id?: string
          location?: string | null
          starts_at: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          attendees?: string[]
          created_at?: string
          email_id?: string | null
          ends_at?: string | null
          id?: string
          location?: string | null
          starts_at?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_email_id_fkey"
            columns: ["email_id"]
            isOneToOne: false
            referencedRelation: "emails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ceyo_links: {
        Row: {
          access_expires_at: string | null
          access_token_enc: string | null
          ceyo_user_id: string
          created_at: string
          current_period_end: string | null
          email: string | null
          plan: string | null
          plan_interval: string | null
          refresh_token_enc: string | null
          sub_active: boolean
          sub_checked_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_expires_at?: string | null
          access_token_enc?: string | null
          ceyo_user_id: string
          created_at?: string
          current_period_end?: string | null
          email?: string | null
          plan?: string | null
          plan_interval?: string | null
          refresh_token_enc?: string | null
          sub_active?: boolean
          sub_checked_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_expires_at?: string | null
          access_token_enc?: string | null
          ceyo_user_id?: string
          created_at?: string
          current_period_end?: string | null
          email?: string | null
          plan?: string | null
          plan_interval?: string | null
          refresh_token_enc?: string | null
          sub_active?: boolean
          sub_checked_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      copilot_messages: {
        Row: {
          content: string
          created_at: string
          email_id: string | null
          id: string
          role: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          email_id?: string | null
          id?: string
          role: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          email_id?: string | null
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "copilot_messages_email_id_fkey"
            columns: ["email_id"]
            isOneToOne: false
            referencedRelation: "emails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "copilot_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_briefs: {
        Row: {
          created_at: string
          data: Json
          id: string
          period: string
          summary: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json
          id?: string
          period: string
          summary?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          period?: string
          summary?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_briefs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      emails: {
        Row: {
          account_id: string
          ai_analysis: Json | null
          ai_translation: Json | null
          attachments: Json
          body: string
          body_purged_at: string | null
          box: Database["public"]["Enums"]["mail_box"]
          created_at: string
          external_id: string | null
          from_email: string
          from_name: string
          has_attachments: boolean
          id: string
          is_read: boolean
          labels: string[]
          links: string[]
          priority: number
          search_vector: unknown
          sent_at: string
          shield_verdict: string
          snippet: string | null
          starred: boolean
          subject: string
          thread_id: string | null
          to_address: string
          updated_at: string
          user_id: string
          vip: boolean
        }
        Insert: {
          account_id: string
          ai_analysis?: Json | null
          ai_translation?: Json | null
          attachments?: Json
          body?: string
          body_purged_at?: string | null
          box?: Database["public"]["Enums"]["mail_box"]
          created_at?: string
          external_id?: string | null
          from_email?: string
          from_name?: string
          has_attachments?: boolean
          id?: string
          is_read?: boolean
          labels?: string[]
          links?: string[]
          priority?: number
          search_vector?: unknown
          sent_at?: string
          shield_verdict?: string
          snippet?: string | null
          starred?: boolean
          subject?: string
          thread_id?: string | null
          to_address?: string
          updated_at?: string
          user_id: string
          vip?: boolean
        }
        Update: {
          account_id?: string
          ai_analysis?: Json | null
          ai_translation?: Json | null
          attachments?: Json
          body?: string
          body_purged_at?: string | null
          box?: Database["public"]["Enums"]["mail_box"]
          created_at?: string
          external_id?: string | null
          from_email?: string
          from_name?: string
          has_attachments?: boolean
          id?: string
          is_read?: boolean
          labels?: string[]
          links?: string[]
          priority?: number
          search_vector?: unknown
          sent_at?: string
          shield_verdict?: string
          snippet?: string | null
          starred?: boolean
          subject?: string
          thread_id?: string | null
          to_address?: string
          updated_at?: string
          user_id?: string
          vip?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "emails_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "mail_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emails_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          created_at: string
          id: string
          message: string
          rating: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          rating?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          rating?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      gemston_players: {
        Row: {
          created_at: string
          first_name: string
          referrer_id: number | null
          telegram_id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          first_name?: string
          referrer_id?: number | null
          telegram_id: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          first_name?: string
          referrer_id?: number | null
          telegram_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gemston_players_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "gemston_players"
            referencedColumns: ["telegram_id"]
          },
        ]
      }
      gemston_referral_rewards: {
        Row: {
          coin_price_usd: number | null
          created_at: string
          credited_at: string | null
          gemston_amount: number | null
          invitee_id: number
          inviter_id: number
          reward_usd: number
          updated_at: string
          withdrawal_id: string
        }
        Insert: {
          coin_price_usd?: number | null
          created_at?: string
          credited_at?: string | null
          gemston_amount?: number | null
          invitee_id: number
          inviter_id: number
          reward_usd?: number
          updated_at?: string
          withdrawal_id: string
        }
        Update: {
          coin_price_usd?: number | null
          created_at?: string
          credited_at?: string | null
          gemston_amount?: number | null
          invitee_id?: number
          inviter_id?: number
          reward_usd?: number
          updated_at?: string
          withdrawal_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gemston_referral_rewards_invitee_id_fkey"
            columns: ["invitee_id"]
            isOneToOne: true
            referencedRelation: "gemston_players"
            referencedColumns: ["telegram_id"]
          },
          {
            foreignKeyName: "gemston_referral_rewards_inviter_id_fkey"
            columns: ["inviter_id"]
            isOneToOne: false
            referencedRelation: "gemston_players"
            referencedColumns: ["telegram_id"]
          },
          {
            foreignKeyName: "gemston_referral_rewards_withdrawal_id_fkey"
            columns: ["withdrawal_id"]
            isOneToOne: true
            referencedRelation: "gemston_verified_withdrawals"
            referencedColumns: ["id"]
          },
        ]
      }
      gemston_verified_withdrawals: {
        Row: {
          amount: number
          created_at: string
          currency: string
          destination: string
          id: string
          telegram_id: number
          transaction_hash: string
          updated_at: string
          verified_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency: string
          destination: string
          id?: string
          telegram_id: number
          transaction_hash: string
          updated_at?: string
          verified_at: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          destination?: string
          id?: string
          telegram_id?: number
          transaction_hash?: string
          updated_at?: string
          verified_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gemston_verified_withdrawals_telegram_id_fkey"
            columns: ["telegram_id"]
            isOneToOne: false
            referencedRelation: "gemston_players"
            referencedColumns: ["telegram_id"]
          },
        ]
      }
      mail_accounts: {
        Row: {
          composio_account_id: string | null
          connected_at: string | null
          created_at: string
          email: string
          history_id: string | null
          id: string
          is_primary: boolean
          last_synced_at: string | null
          message_count: number
          name: string
          provider: Database["public"]["Enums"]["mail_provider"]
          sync_cursor: string | null
          sync_error: string | null
          sync_status: string
          unread_count: number
          updated_at: string
          user_id: string
        }
        Insert: {
          composio_account_id?: string | null
          connected_at?: string | null
          created_at?: string
          email: string
          history_id?: string | null
          id?: string
          is_primary?: boolean
          last_synced_at?: string | null
          message_count?: number
          name?: string
          provider: Database["public"]["Enums"]["mail_provider"]
          sync_cursor?: string | null
          sync_error?: string | null
          sync_status?: string
          unread_count?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          composio_account_id?: string | null
          connected_at?: string | null
          created_at?: string
          email?: string
          history_id?: string | null
          id?: string
          is_primary?: boolean
          last_synced_at?: string | null
          message_count?: number
          name?: string
          provider?: Database["public"]["Enums"]["mail_provider"]
          sync_cursor?: string | null
          sync_error?: string | null
          sync_status?: string
          unread_count?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mail_accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mail_rules: {
        Row: {
          action: string
          created_at: string
          enabled: boolean
          id: string
          label: string | null
          match_field: string
          match_value: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          action?: string
          created_at?: string
          enabled?: boolean
          id?: string
          label?: string | null
          match_field?: string
          match_value: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          enabled?: boolean
          id?: string
          label?: string | null
          match_field?: string
          match_value?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mail_rules_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string
          id: string
          last_seen_at: string | null
          locale: string
          onboarded_at: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          id: string
          last_seen_at?: string | null
          locale?: string
          onboarded_at?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          id?: string
          last_seen_at?: string | null
          locale?: string
          onboarded_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      shit_jobs: {
        Row: {
          key: string
          ran_at: string
        }
        Insert: {
          key: string
          ran_at?: string
        }
        Update: {
          key?: string
          ran_at?: string
        }
        Relationships: []
      }
      shit_payments: {
        Row: {
          amount: number
          comment: string
          created_at: string
          id: string
          item: string
          paid_at: string | null
          status: string
          telegram_id: number
          tx_hash: string | null
        }
        Insert: {
          amount: number
          comment: string
          created_at?: string
          id?: string
          item: string
          paid_at?: string | null
          status?: string
          telegram_id: number
          tx_hash?: string | null
        }
        Update: {
          amount?: number
          comment?: string
          created_at?: string
          id?: string
          item?: string
          paid_at?: string | null
          status?: string
          telegram_id?: number
          tx_hash?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shit_payments_telegram_id_fkey"
            columns: ["telegram_id"]
            isOneToOne: false
            referencedRelation: "shit_players"
            referencedColumns: ["telegram_id"]
          },
        ]
      }
      shit_players: {
        Row: {
          created_at: string
          first_name: string | null
          gram_spent: number
          last_seen: string
          owned_crew: number[]
          owned_servers: number[]
          pass_until: string | null
          referrals: number
          referred_by: number | null
          telegram_id: number
          turbo_until: string | null
          username: string | null
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          gram_spent?: number
          last_seen?: string
          owned_crew?: number[]
          owned_servers?: number[]
          pass_until?: string | null
          referrals?: number
          referred_by?: number | null
          telegram_id: number
          turbo_until?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string
          first_name?: string | null
          gram_spent?: number
          last_seen?: string
          owned_crew?: number[]
          owned_servers?: number[]
          pass_until?: string | null
          referrals?: number
          referred_by?: number | null
          telegram_id?: number
          turbo_until?: string | null
          username?: string | null
        }
        Relationships: []
      }
      shit_staff: {
        Row: {
          created_at: string
          role: string
          username: string
        }
        Insert: {
          created_at?: string
          role: string
          username: string
        }
        Update: {
          created_at?: string
          role?: string
          username?: string
        }
        Relationships: []
      }
      shit_tasks: {
        Row: {
          active: boolean
          created_at: string
          id: string
          reward: number
          title: string
          url: string | null
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          reward?: number
          title: string
          url?: string | null
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          reward?: number
          title?: string
          url?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean
          created_at: string
          current_period_end: string | null
          external_id: string | null
          plan: Database["public"]["Enums"]["plan_tier"]
          provider: string
          seats: number
          status: string
          trial_ends_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          external_id?: string | null
          plan?: Database["public"]["Enums"]["plan_tier"]
          provider?: string
          seats?: number
          status?: string
          trial_ends_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          external_id?: string | null
          plan?: Database["public"]["Enums"]["plan_tier"]
          provider?: string
          seats?: number
          status?: string
          trial_ends_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sync_runs: {
        Row: {
          account_id: string
          added: number
          error: string | null
          fetched: number
          finished_at: string | null
          id: string
          started_at: string
          status: string
          user_id: string
        }
        Insert: {
          account_id: string
          added?: number
          error?: string | null
          fetched?: number
          finished_at?: string | null
          id?: string
          started_at?: string
          status?: string
          user_id: string
        }
        Update: {
          account_id?: string
          added?: number
          error?: string | null
          fetched?: number
          finished_at?: string | null
          id?: string
          started_at?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sync_runs_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "mail_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sync_runs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      talon_characters: {
        Row: {
          boost: number
          created_at: string
          id: string
          name: string
          referrals: number
          sort: number
          specialty: string
          updated_at: string
        }
        Insert: {
          boost: number
          created_at?: string
          id: string
          name: string
          referrals: number
          sort?: number
          specialty: string
          updated_at?: string
        }
        Update: {
          boost?: number
          created_at?: string
          id?: string
          name?: string
          referrals?: number
          sort?: number
          specialty?: string
          updated_at?: string
        }
        Relationships: []
      }
      talon_config: {
        Row: {
          created_at: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          created_at?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      talon_contests: {
        Row: {
          created_at: string
          day: string
          prize: number
          settled_at: string | null
          starts_at: string
          status: string
          updated_at: string
          winner_id: number | null
          winning_score: number
        }
        Insert: {
          created_at?: string
          day: string
          prize: number
          settled_at?: string | null
          starts_at: string
          status?: string
          updated_at?: string
          winner_id?: number | null
          winning_score?: number
        }
        Update: {
          created_at?: string
          day?: string
          prize?: number
          settled_at?: string | null
          starts_at?: string
          status?: string
          updated_at?: string
          winner_id?: number | null
          winning_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "talon_contests_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "talon_players"
            referencedColumns: ["id"]
          },
        ]
      }
      talon_gifts: {
        Row: {
          amount: number
          claimed_at: string | null
          created_at: string
          id: string
          player_id: number
          updated_at: string
        }
        Insert: {
          amount: number
          claimed_at?: string | null
          created_at?: string
          id?: string
          player_id: number
          updated_at?: string
        }
        Update: {
          amount?: number
          claimed_at?: string | null
          created_at?: string
          id?: string
          player_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "talon_gifts_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "talon_players"
            referencedColumns: ["id"]
          },
        ]
      }
      talon_jobs: {
        Row: {
          created_at: string
          key: string
          last_run: string | null
          locked_until: string | null
          state: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          key: string
          last_run?: string | null
          locked_until?: string | null
          state?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          key?: string
          last_run?: string | null
          locked_until?: string | null
          state?: Json
          updated_at?: string
        }
        Relationships: []
      }
      talon_ledger: {
        Row: {
          amount: number
          created_at: string
          id: string
          kind: string
          player_id: number
          reference: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          kind: string
          player_id: number
          reference?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          kind?: string
          player_id?: number
          reference?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "talon_ledger_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "talon_players"
            referencedColumns: ["id"]
          },
        ]
      }
      talon_owned_servers: {
        Row: {
          created_at: string
          player_id: number
          server_id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          player_id: number
          server_id: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          player_id?: number
          server_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "talon_owned_servers_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "talon_players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "talon_owned_servers_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "talon_servers"
            referencedColumns: ["id"]
          },
        ]
      }
      talon_payments: {
        Row: {
          amount_ton: number
          created_at: string
          expires_at: string
          id: string
          item_id: number | null
          kind: string
          player_id: number
          status: string
          tx_hash: string | null
          updated_at: string
          used: boolean
        }
        Insert: {
          amount_ton: number
          created_at?: string
          expires_at?: string
          id?: string
          item_id?: number | null
          kind: string
          player_id: number
          status?: string
          tx_hash?: string | null
          updated_at?: string
          used?: boolean
        }
        Update: {
          amount_ton?: number
          created_at?: string
          expires_at?: string
          id?: string
          item_id?: number | null
          kind?: string
          player_id?: number
          status?: string
          tx_hash?: string | null
          updated_at?: string
          used?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "talon_payments_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "talon_players"
            referencedColumns: ["id"]
          },
        ]
      }
      talon_players: {
        Row: {
          active_character: string | null
          ads: number
          ads_day: string | null
          ads_today: number
          balance: number
          created_at: string
          first_name: string
          id: number
          joined_community: boolean
          last_ad_at: string | null
          last_daily: string | null
          last_notified: string | null
          mining_rate: number | null
          mining_since: string | null
          notify: boolean
          referral_earned: number
          referrer: number | null
          updated_at: string
          username: string | null
        }
        Insert: {
          active_character?: string | null
          ads?: number
          ads_day?: string | null
          ads_today?: number
          balance?: number
          created_at?: string
          first_name: string
          id: number
          joined_community?: boolean
          last_ad_at?: string | null
          last_daily?: string | null
          last_notified?: string | null
          mining_rate?: number | null
          mining_since?: string | null
          notify?: boolean
          referral_earned?: number
          referrer?: number | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          active_character?: string | null
          ads?: number
          ads_day?: string | null
          ads_today?: number
          balance?: number
          created_at?: string
          first_name?: string
          id?: number
          joined_community?: boolean
          last_ad_at?: string | null
          last_daily?: string | null
          last_notified?: string | null
          mining_rate?: number | null
          mining_since?: string | null
          notify?: boolean
          referral_earned?: number
          referrer?: number | null
          updated_at?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "talon_players_referrer_fkey"
            columns: ["referrer"]
            isOneToOne: false
            referencedRelation: "talon_players"
            referencedColumns: ["id"]
          },
        ]
      }
      talon_posts: {
        Row: {
          attempts: number
          body: string
          campaign: string
          created_at: string
          headline: string
          id: string
          image_path: string
          last_error: string | null
          locked_until: string | null
          message_id: number | null
          scheduled_at: string
          sent_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          attempts?: number
          body: string
          campaign: string
          created_at?: string
          headline: string
          id?: string
          image_path: string
          last_error?: string | null
          locked_until?: string | null
          message_id?: number | null
          scheduled_at: string
          sent_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          attempts?: number
          body?: string
          campaign?: string
          created_at?: string
          headline?: string
          id?: string
          image_path?: string
          last_error?: string | null
          locked_until?: string | null
          message_id?: number | null
          scheduled_at?: string
          sent_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      talon_roles: {
        Row: {
          created_at: string
          player_id: number
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          player_id: number
          role: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          player_id?: number
          role?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "talon_roles_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "talon_players"
            referencedColumns: ["id"]
          },
        ]
      }
      talon_servers: {
        Row: {
          created_at: string
          id: number
          image_key: string
          name: string
          price_ton: number
          rate: number
          threshold: number
          tier: number
          unlock_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: number
          image_key: string
          name: string
          price_ton: number
          rate: number
          threshold?: number
          tier: number
          unlock_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          image_key?: string
          name?: string
          price_ton?: number
          rate?: number
          threshold?: number
          tier?: number
          unlock_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      talon_task_claims: {
        Row: {
          created_at: string
          player_id: number
          task_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          player_id: number
          task_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          player_id?: number
          task_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "talon_task_claims_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "talon_players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "talon_task_claims_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "talon_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      talon_tasks: {
        Row: {
          active: boolean
          created_at: string
          id: string
          kind: string
          reward: number
          sort: number
          target: number
          title: string
          updated_at: string
          url: string | null
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          kind: string
          reward: number
          sort?: number
          target?: number
          title: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          kind?: string
          reward?: number
          sort?: number
          target?: number
          title?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      talon_withdrawals: {
        Row: {
          address: string
          amount: number
          created_at: string
          fee_payment: string | null
          id: string
          player_id: number
          status: string
          tx_hash: string | null
          updated_at: string
        }
        Insert: {
          address: string
          amount: number
          created_at?: string
          fee_payment?: string | null
          id?: string
          player_id: number
          status?: string
          tx_hash?: string | null
          updated_at?: string
        }
        Update: {
          address?: string
          amount?: number
          created_at?: string
          fee_payment?: string | null
          id?: string
          player_id?: number
          status?: string
          tx_hash?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "talon_withdrawals_fee_payment_fkey"
            columns: ["fee_payment"]
            isOneToOne: true
            referencedRelation: "talon_payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "talon_withdrawals_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "talon_players"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          completed_at: string | null
          created_at: string
          done: boolean
          due_at: string | null
          email_id: string | null
          id: string
          notes: string | null
          source: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          done?: boolean
          due_at?: string | null
          email_id?: string | null
          id?: string
          notes?: string | null
          source?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          done?: boolean
          due_at?: string | null
          email_id?: string | null
          id?: string
          notes?: string | null
          source?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_email_id_fkey"
            columns: ["email_id"]
            isOneToOne: false
            referencedRelation: "emails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tln_admins: {
        Row: {
          added_by: string | null
          created_at: string
          role: string
          username: string
        }
        Insert: {
          added_by?: string | null
          created_at?: string
          role?: string
          username: string
        }
        Update: {
          added_by?: string | null
          created_at?: string
          role?: string
          username?: string
        }
        Relationships: []
      }
      tln_config: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      tln_contest_rewards: {
        Row: {
          contest_day: string
          created_at: string
          id: string
          invites: number
          notified_at: string | null
          rank: number
          reward: number
          tg_id: number
          updated_at: string
        }
        Insert: {
          contest_day: string
          created_at?: string
          id?: string
          invites: number
          notified_at?: string | null
          rank: number
          reward: number
          tg_id: number
          updated_at?: string
        }
        Update: {
          contest_day?: string
          created_at?: string
          id?: string
          invites?: number
          notified_at?: string | null
          rank?: number
          reward?: number
          tg_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tln_contest_rewards_tg_id_fkey"
            columns: ["tg_id"]
            isOneToOne: false
            referencedRelation: "tln_players"
            referencedColumns: ["tg_id"]
          },
        ]
      }
      tln_crew: {
        Row: {
          bonus: number
          id: string
          image: string
          name: string
          price_gram: number | null
          sort: number
          tagline: string
          target: number | null
          unlock: string
        }
        Insert: {
          bonus?: number
          id: string
          image: string
          name: string
          price_gram?: number | null
          sort?: number
          tagline?: string
          target?: number | null
          unlock?: string
        }
        Update: {
          bonus?: number
          id?: string
          image?: string
          name?: string
          price_gram?: number | null
          sort?: number
          tagline?: string
          target?: number | null
          unlock?: string
        }
        Relationships: []
      }
      tln_gift_claims: {
        Row: {
          claimed_at: string
          gift_id: string
          tg_id: number
        }
        Insert: {
          claimed_at?: string
          gift_id: string
          tg_id: number
        }
        Update: {
          claimed_at?: string
          gift_id?: string
          tg_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "tln_gift_claims_gift_id_fkey"
            columns: ["gift_id"]
            isOneToOne: false
            referencedRelation: "tln_gifts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tln_gift_claims_tg_id_fkey"
            columns: ["tg_id"]
            isOneToOne: false
            referencedRelation: "tln_players"
            referencedColumns: ["tg_id"]
          },
        ]
      }
      tln_gifts: {
        Row: {
          amount: number
          claims: number
          created_at: string
          expires_at: string
          id: string
          title: string
        }
        Insert: {
          amount: number
          claims?: number
          created_at?: string
          expires_at: string
          id?: string
          title: string
        }
        Update: {
          amount?: number
          claims?: number
          created_at?: string
          expires_at?: string
          id?: string
          title?: string
        }
        Relationships: []
      }
      tln_jobs: {
        Row: {
          created_at: string
          cursor: number
          error: string | null
          failed: number
          finished_at: string | null
          id: string
          kind: string
          payload: Json
          sent: number
          slot_key: string
          status: string
        }
        Insert: {
          created_at?: string
          cursor?: number
          error?: string | null
          failed?: number
          finished_at?: string | null
          id?: string
          kind: string
          payload?: Json
          sent?: number
          slot_key: string
          status?: string
        }
        Update: {
          created_at?: string
          cursor?: number
          error?: string | null
          failed?: number
          finished_at?: string | null
          id?: string
          kind?: string
          payload?: Json
          sent?: number
          slot_key?: string
          status?: string
        }
        Relationships: []
      }
      tln_ledger: {
        Row: {
          amount: number
          created_at: string
          id: number
          reason: string
          ref: string | null
          tg_id: number
        }
        Insert: {
          amount: number
          created_at?: string
          id?: number
          reason: string
          ref?: string | null
          tg_id: number
        }
        Update: {
          amount?: number
          created_at?: string
          id?: number
          reason?: string
          ref?: string | null
          tg_id?: number
        }
        Relationships: []
      }
      tln_owned_crew: {
        Row: {
          acquired_at: string
          crew_id: string
          tg_id: number
        }
        Insert: {
          acquired_at?: string
          crew_id: string
          tg_id: number
        }
        Update: {
          acquired_at?: string
          crew_id?: string
          tg_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "tln_owned_crew_crew_id_fkey"
            columns: ["crew_id"]
            isOneToOne: false
            referencedRelation: "tln_crew"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tln_owned_crew_tg_id_fkey"
            columns: ["tg_id"]
            isOneToOne: false
            referencedRelation: "tln_players"
            referencedColumns: ["tg_id"]
          },
        ]
      }
      tln_owned_servers: {
        Row: {
          acquired_at: string
          expires_at: string | null
          id: string
          server_id: number
          source: string
          tg_id: number
        }
        Insert: {
          acquired_at?: string
          expires_at?: string | null
          id?: string
          server_id: number
          source?: string
          tg_id: number
        }
        Update: {
          acquired_at?: string
          expires_at?: string | null
          id?: string
          server_id?: number
          source?: string
          tg_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "tln_owned_servers_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "tln_servers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tln_owned_servers_tg_id_fkey"
            columns: ["tg_id"]
            isOneToOne: false
            referencedRelation: "tln_players"
            referencedColumns: ["tg_id"]
          },
        ]
      }
      tln_payments: {
        Row: {
          amount_gram: number
          created_at: string
          id: string
          item: string | null
          kind: string
          memo: string
          notified: boolean
          paid_at: string | null
          sender: string | null
          status: string
          tg_id: number
          tx_hash: string | null
        }
        Insert: {
          amount_gram: number
          created_at?: string
          id?: string
          item?: string | null
          kind: string
          memo: string
          notified?: boolean
          paid_at?: string | null
          sender?: string | null
          status?: string
          tg_id: number
          tx_hash?: string | null
        }
        Update: {
          amount_gram?: number
          created_at?: string
          id?: string
          item?: string | null
          kind?: string
          memo?: string
          notified?: boolean
          paid_at?: string | null
          sender?: string | null
          status?: string
          tg_id?: number
          tx_hash?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tln_payments_tg_id_fkey"
            columns: ["tg_id"]
            isOneToOne: false
            referencedRelation: "tln_players"
            referencedColumns: ["tg_id"]
          },
        ]
      }
      tln_players: {
        Row: {
          active_invites: number
          ads_day: string
          ads_today: number
          ads_total: number
          balance: number
          banned: boolean
          bot_blocked: boolean
          community_joined: boolean
          created_at: string
          crew_id: string
          first_name: string | null
          gram_spent: number
          invites: number
          lang: string | null
          last_ad_at: string | null
          last_checkin: string | null
          last_claim_at: string
          last_name: string | null
          last_seen_at: string
          mined_total: number
          pass_until: string | null
          photo_url: string | null
          ref_activated: boolean
          ref_earned: number
          referrer_id: number | null
          storage_hours: number
          streak: number
          tg_id: number
          turbo_stacks: number
          turbo_until: string | null
          username: string | null
          wallet: string | null
        }
        Insert: {
          active_invites?: number
          ads_day?: string
          ads_today?: number
          ads_total?: number
          balance?: number
          banned?: boolean
          bot_blocked?: boolean
          community_joined?: boolean
          created_at?: string
          crew_id?: string
          first_name?: string | null
          gram_spent?: number
          invites?: number
          lang?: string | null
          last_ad_at?: string | null
          last_checkin?: string | null
          last_claim_at?: string
          last_name?: string | null
          last_seen_at?: string
          mined_total?: number
          pass_until?: string | null
          photo_url?: string | null
          ref_activated?: boolean
          ref_earned?: number
          referrer_id?: number | null
          storage_hours?: number
          streak?: number
          tg_id: number
          turbo_stacks?: number
          turbo_until?: string | null
          username?: string | null
          wallet?: string | null
        }
        Update: {
          active_invites?: number
          ads_day?: string
          ads_today?: number
          ads_total?: number
          balance?: number
          banned?: boolean
          bot_blocked?: boolean
          community_joined?: boolean
          created_at?: string
          crew_id?: string
          first_name?: string | null
          gram_spent?: number
          invites?: number
          lang?: string | null
          last_ad_at?: string | null
          last_checkin?: string | null
          last_claim_at?: string
          last_name?: string | null
          last_seen_at?: string
          mined_total?: number
          pass_until?: string | null
          photo_url?: string | null
          ref_activated?: boolean
          ref_earned?: number
          referrer_id?: number | null
          storage_hours?: number
          streak?: number
          tg_id?: number
          turbo_stacks?: number
          turbo_until?: string | null
          username?: string | null
          wallet?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tln_players_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "tln_players"
            referencedColumns: ["tg_id"]
          },
        ]
      }
      tln_servers: {
        Row: {
          active: boolean
          duration_days: number | null
          family: number
          id: number
          level: number
          name: string
          price_gram: number | null
          rate_per_hour: number
          tint: string
          unlock: string
          unlock_target: number | null
        }
        Insert: {
          active?: boolean
          duration_days?: number | null
          family: number
          id: number
          level: number
          name: string
          price_gram?: number | null
          rate_per_hour: number
          tint: string
          unlock?: string
          unlock_target?: number | null
        }
        Update: {
          active?: boolean
          duration_days?: number | null
          family?: number
          id?: number
          level?: number
          name?: string
          price_gram?: number | null
          rate_per_hour?: number
          tint?: string
          unlock?: string
          unlock_target?: number | null
        }
        Relationships: []
      }
      tln_task_claims: {
        Row: {
          claimed_at: string
          period: string
          reward: number
          task_id: string
          tg_id: number
        }
        Insert: {
          claimed_at?: string
          period?: string
          reward?: number
          task_id: string
          tg_id: number
        }
        Update: {
          claimed_at?: string
          period?: string
          reward?: number
          task_id?: string
          tg_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "tln_task_claims_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tln_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tln_task_claims_tg_id_fkey"
            columns: ["tg_id"]
            isOneToOne: false
            referencedRelation: "tln_players"
            referencedColumns: ["tg_id"]
          },
        ]
      }
      tln_tasks: {
        Row: {
          active: boolean
          chat: string | null
          created_at: string
          created_by: number | null
          description: string
          icon: string
          id: string
          image_url: string | null
          kind: string
          reward: number
          sort: number
          target: number
          title: string
          updated_at: string
          url: string | null
        }
        Insert: {
          active?: boolean
          chat?: string | null
          created_at?: string
          created_by?: number | null
          description?: string
          icon?: string
          id?: string
          image_url?: string | null
          kind?: string
          reward?: number
          sort?: number
          target?: number
          title: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          active?: boolean
          chat?: string | null
          created_at?: string
          created_by?: number | null
          description?: string
          icon?: string
          id?: string
          image_url?: string | null
          kind?: string
          reward?: number
          sort?: number
          target?: number
          title?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      tln_withdrawals: {
        Row: {
          address: string
          amount: number
          created_at: string
          fee_payment_id: string
          id: string
          note: string | null
          processed_at: string | null
          processed_by: string | null
          status: string
          tg_id: number
          tx_hash: string | null
        }
        Insert: {
          address: string
          amount: number
          created_at?: string
          fee_payment_id: string
          id?: string
          note?: string | null
          processed_at?: string | null
          processed_by?: string | null
          status?: string
          tg_id: number
          tx_hash?: string | null
        }
        Update: {
          address?: string
          amount?: number
          created_at?: string
          fee_payment_id?: string
          id?: string
          note?: string | null
          processed_at?: string | null
          processed_by?: string | null
          status?: string
          tg_id?: number
          tx_hash?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tln_withdrawals_fee_payment_id_fkey"
            columns: ["fee_payment_id"]
            isOneToOne: true
            referencedRelation: "tln_payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tln_withdrawals_tg_id_fkey"
            columns: ["tg_id"]
            isOneToOne: false
            referencedRelation: "tln_players"
            referencedColumns: ["tg_id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          auto_summarize: boolean
          auto_translate: boolean
          daily_brief_enabled: boolean
          daily_brief_time: string
          locale: string
          shield_level: string
          signature: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_summarize?: boolean
          auto_translate?: boolean
          daily_brief_enabled?: boolean
          daily_brief_time?: string
          locale?: string
          shield_level?: string
          signature?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_summarize?: boolean
          auto_translate?: boolean
          daily_brief_enabled?: boolean
          daily_brief_time?: string
          locale?: string
          shield_level?: string
          signature?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      bg_admin_stats: { Args: never; Returns: Json }
      bg_claim: { Args: { _bonus?: number; _tid: number }; Returns: number }
      bg_credit: {
        Args: { _amount: number; _meta?: Json; _reason: string; _tid: number }
        Returns: number
      }
      bg_credit_gram: {
        Args: { _amount: number; _meta?: Json; _reason: string; _tid: number }
        Returns: number
      }
      bg_daily_ranks: {
        Args: { _day: string; _limit?: number }
        Returns: {
          first_name: string
          invites: number
          rank: number
          telegram_id: number
          username: string
        }[]
      }
      bg_pending: {
        Args: { _cap_hours?: number; _tid: number }
        Returns: number
      }
      bg_record_ad: {
        Args: {
          _boost_minutes: number
          _daily_cap: number
          _min_gap_seconds: number
          _reward: number
          _tid: number
        }
        Returns: Json
      }
      bg_settle_daily_contest: { Args: { _day: string }; Returns: number }
      bg_swap: {
        Args: { _gram: number; _pubg: number; _tid: number }
        Returns: Json
      }
      bg_top_inviters: {
        Args: { _limit?: number; _since: string }
        Returns: {
          first_name: string
          invites: number
          telegram_id: number
          username: string
        }[]
      }
      consume_ai_action: { Args: { p_kind?: string }; Returns: Json }
      gemston_referral_summary: {
        Args: { p_coin_price?: number; p_id: number }
        Returns: Json
      }
      gemston_register: {
        Args: { p_first: string; p_id: number; p_referrer?: number }
        Returns: undefined
      }
      provision_user: {
        Args: { _email: string; _name: string; _uid: string }
        Returns: undefined
      }
      purge_old_email_bodies: { Args: { p_days?: number }; Returns: number }
      seed_welcome_mail: {
        Args: { _account: string; _addr: string; _full: string; _uid: string }
        Returns: undefined
      }
      talon_action: {
        Args: { p_action: string; p_item?: string; p_player: number }
        Returns: Json
      }
      talon_claim_job: {
        Args: { p_key: string; p_seconds: number }
        Returns: boolean
      }
      talon_claim_post: {
        Args: never
        Returns: {
          attempts: number
          body: string
          campaign: string
          created_at: string
          headline: string
          id: string
          image_path: string
          last_error: string | null
          locked_until: string | null
          message_id: number | null
          scheduled_at: string
          sent_at: string | null
          status: string
          updated_at: string
        }[]
        SetofOptions: {
          from: "*"
          to: "talon_posts"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      talon_confirm_payment: {
        Args: { p_payment: string; p_tx: string }
        Returns: Json
      }
      talon_contest_ranks: {
        Args: { p_day: string }
        Returns: {
          player_id: number
          rank: number
          reached_at: string
          score: number
        }[]
      }
      talon_contest_state: { Args: { p_player: number }; Returns: Json }
      talon_register: {
        Args: {
          p_first: string
          p_id: number
          p_referrer: number
          p_username: string
        }
        Returns: boolean
      }
      talon_reject_withdrawal: { Args: { p_id: string }; Returns: undefined }
      talon_request_withdrawal: {
        Args: { p_address: string; p_amount: number; p_player: number }
        Returns: string
      }
      talon_settle_contests: { Args: never; Returns: number }
      talon_stats: { Args: never; Returns: Json }
      tln_ad_view: { Args: { _tg: number }; Returns: Json }
      tln_checkin: { Args: { _tg: number }; Returns: Json }
      tln_claim: { Args: { _tg: number }; Returns: Json }
      tln_claim_gift: { Args: { _gift: string; _tg: number }; Returns: Json }
      tln_claim_task: { Args: { _task: string; _tg: number }; Returns: Json }
      tln_contest_board: {
        Args: { _day: string }
        Returns: {
          invites: number
          player_id: number
          rank: number
        }[]
      }
      tln_credit: {
        Args: { _amt: number; _reason: string; _ref?: string; _tg: number }
        Returns: undefined
      }
      tln_econ: { Args: { d: number; k: string }; Returns: number }
      tln_fulfill_payment: {
        Args: { _pid: string; _sender: string; _tx: string }
        Returns: Json
      }
      tln_mult: {
        Args: { p: Database["public"]["Tables"]["tln_players"]["Row"] }
        Returns: number
      }
      tln_pay_upline: {
        Args: {
          _amt: number
          _l1: number
          _l2: number
          _reason: string
          _tg: number
        }
        Returns: undefined
      }
      tln_pending_for: { Args: { _tg: number }; Returns: number }
      tln_process_withdraw: {
        Args: { _approve: boolean; _by: string; _id: string; _tx: string }
        Returns: Json
      }
      tln_register: {
        Args: {
          _first: string
          _lang: string
          _last: string
          _photo: string
          _ref: number
          _tg: number
          _username: string
        }
        Returns: Json
      }
      tln_request_withdraw: {
        Args: { _address: string; _amount: number; _fee: string; _tg: number }
        Returns: Json
      }
      tln_select_crew: { Args: { _crew: string; _tg: number }; Returns: Json }
      tln_settle_referral_contest: { Args: { _day: string }; Returns: number }
      tln_stats: { Args: never; Returns: Json }
      tln_today: { Args: never; Returns: string }
    }
    Enums: {
      app_role: "admin" | "support"
      mail_box: "inbox" | "sent" | "archive" | "trash"
      mail_provider: "ceyo" | "google" | "outlook" | "icloud" | "imap"
      plan_tier: "free" | "pro" | "business" | "ultra"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "support"],
      mail_box: ["inbox", "sent", "archive", "trash"],
      mail_provider: ["ceyo", "google", "outlook", "icloud", "imap"],
      plan_tier: ["free", "pro", "business", "ultra"],
    },
  },
} as const
