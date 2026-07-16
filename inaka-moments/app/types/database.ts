// ═══════════════════════════════════════════════════════════════════════════
// Tipos generados desde el esquema de Supabase (proyecto inaka-moments).
// NO editar a mano. Regenerar con:
//   supabase gen types typescript --project-id kdjsbvvmcilbcycgxygo > app/types/database.ts
// ═══════════════════════════════════════════════════════════════════════════

export type Json
  = | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.5'
  }
  public: {
    Tables: {
      event_albums: {
        Row: {
          cover_image_id: string | null
          created_at: string
          event_date: string | null
          event_type: Database['public']['Enums']['event_type']
          id: string
          published: boolean
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          cover_image_id?: string | null
          created_at?: string
          event_date?: string | null
          event_type: Database['public']['Enums']['event_type']
          id?: string
          published?: boolean
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          cover_image_id?: string | null
          created_at?: string
          event_date?: string | null
          event_type?: Database['public']['Enums']['event_type']
          id?: string
          published?: boolean
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'event_albums_cover_fk'
            columns: ['cover_image_id']
            isOneToOne: false
            referencedRelation: 'gallery_images'
            referencedColumns: ['id']
          },
        ]
      }
      events: {
        Row: {
          client_contact: string | null
          client_name: string | null
          created_at: string
          end_time: string | null
          event_date: string
          event_type: Database['public']['Enums']['event_type'] | null
          id: string
          km: number | null
          lead_id: string | null
          location: string | null
          notes: string | null
          quote_id: string | null
          start_time: string | null
          status: Database['public']['Enums']['event_status']
          title: string
          travel_fee: number | null
          updated_at: string
        }
        Insert: {
          client_contact?: string | null
          client_name?: string | null
          created_at?: string
          end_time?: string | null
          event_date: string
          event_type?: Database['public']['Enums']['event_type'] | null
          id?: string
          km?: number | null
          lead_id?: string | null
          location?: string | null
          notes?: string | null
          quote_id?: string | null
          start_time?: string | null
          status?: Database['public']['Enums']['event_status']
          title: string
          travel_fee?: number | null
          updated_at?: string
        }
        Update: {
          client_contact?: string | null
          client_name?: string | null
          created_at?: string
          end_time?: string | null
          event_date?: string
          event_type?: Database['public']['Enums']['event_type'] | null
          id?: string
          km?: number | null
          lead_id?: string | null
          location?: string | null
          notes?: string | null
          quote_id?: string | null
          start_time?: string | null
          status?: Database['public']['Enums']['event_status']
          title?: string
          travel_fee?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'events_lead_id_fkey'
            columns: ['lead_id']
            isOneToOne: false
            referencedRelation: 'leads'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'events_quote_id_fkey'
            columns: ['quote_id']
            isOneToOne: false
            referencedRelation: 'quotes'
            referencedColumns: ['id']
          },
        ]
      }
      faqs: {
        Row: {
          answer: string
          category: string | null
          created_at: string
          id: string
          published: boolean
          question: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          answer: string
          category?: string | null
          created_at?: string
          id?: string
          published?: boolean
          question: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          answer?: string
          category?: string | null
          created_at?: string
          id?: string
          published?: boolean
          question?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          album_id: string
          alt: string | null
          created_at: string
          featured: boolean
          id: string
          sort_order: number
          storage_path: string
        }
        Insert: {
          album_id: string
          alt?: string | null
          created_at?: string
          featured?: boolean
          id?: string
          sort_order?: number
          storage_path: string
        }
        Update: {
          album_id?: string
          alt?: string | null
          created_at?: string
          featured?: boolean
          id?: string
          sort_order?: number
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: 'gallery_images_album_id_fkey'
            columns: ['album_id']
            isOneToOne: false
            referencedRelation: 'event_albums'
            referencedColumns: ['id']
          },
        ]
      }
      lead_activities: {
        Row: {
          created_at: string
          done: boolean
          due_date: string | null
          id: string
          lead_id: string
          note: string | null
          type: string
        }
        Insert: {
          created_at?: string
          done?: boolean
          due_date?: string | null
          id?: string
          lead_id: string
          note?: string | null
          type?: string
        }
        Update: {
          created_at?: string
          done?: boolean
          due_date?: string | null
          id?: string
          lead_id?: string
          note?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: 'lead_activities_lead_id_fkey'
            columns: ['lead_id']
            isOneToOne: false
            referencedRelation: 'leads'
            referencedColumns: ['id']
          },
        ]
      }
      leads: {
        Row: {
          created_at: string
          email: string
          espacios: Json
          estilo: string | null
          fecha: string | null
          id: string
          ideas_extra: string | null
          invitados: string | null
          nombre: string
          notes: string | null
          source: string | null
          status: Database['public']['Enums']['lead_status']
          tags: Json
          telefono: string | null
          tipo: string | null
          updated_at: string
          utm: Json
        }
        Insert: {
          created_at?: string
          email: string
          espacios?: Json
          estilo?: string | null
          fecha?: string | null
          id?: string
          ideas_extra?: string | null
          invitados?: string | null
          nombre: string
          notes?: string | null
          source?: string | null
          status?: Database['public']['Enums']['lead_status']
          tags?: Json
          telefono?: string | null
          tipo?: string | null
          updated_at?: string
          utm?: Json
        }
        Update: {
          created_at?: string
          email?: string
          espacios?: Json
          estilo?: string | null
          fecha?: string | null
          id?: string
          ideas_extra?: string | null
          invitados?: string | null
          nombre?: string
          notes?: string | null
          source?: string | null
          status?: Database['public']['Enums']['lead_status']
          tags?: Json
          telefono?: string | null
          tipo?: string | null
          updated_at?: string
          utm?: Json
        }
        Relationships: []
      }
      occasions: {
        Row: {
          created_at: string
          event_type: Database['public']['Enums']['event_type']
          featured_product_ids: Json
          hero: Json
          intro: string | null
          published: boolean
          seo_description: string | null
          seo_title: string | null
          slug: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          event_type: Database['public']['Enums']['event_type']
          featured_product_ids?: Json
          hero?: Json
          intro?: string | null
          published?: boolean
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          event_type?: Database['public']['Enums']['event_type']
          featured_product_ids?: Json
          hero?: Json
          intro?: string | null
          published?: boolean
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      packs: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          event_types: Json
          id: string
          images: Json
          includes: Json
          name: string
          price: number | null
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          event_types?: Json
          id?: string
          images?: Json
          includes?: Json
          name: string
          price?: number | null
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          event_types?: Json
          id?: string
          images?: Json
          includes?: Json
          name?: string
          price?: number | null
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          event_id: string | null
          id: string
          method: string | null
          quote_id: string | null
          status: Database['public']['Enums']['payment_status']
          stripe_checkout_session: string | null
          stripe_payment_intent: string | null
          type: Database['public']['Enums']['payment_type']
        }
        Insert: {
          amount: number
          created_at?: string
          event_id?: string | null
          id?: string
          method?: string | null
          quote_id?: string | null
          status?: Database['public']['Enums']['payment_status']
          stripe_checkout_session?: string | null
          stripe_payment_intent?: string | null
          type: Database['public']['Enums']['payment_type']
        }
        Update: {
          amount?: number
          created_at?: string
          event_id?: string | null
          id?: string
          method?: string | null
          quote_id?: string | null
          status?: Database['public']['Enums']['payment_status']
          stripe_checkout_session?: string | null
          stripe_payment_intent?: string | null
          type?: Database['public']['Enums']['payment_type']
        }
        Relationships: [
          {
            foreignKeyName: 'payments_event_id_fkey'
            columns: ['event_id']
            isOneToOne: false
            referencedRelation: 'events'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'payments_quote_id_fkey'
            columns: ['quote_id']
            isOneToOne: false
            referencedRelation: 'quotes'
            referencedColumns: ['id']
          },
        ]
      }
      products: {
        Row: {
          active: boolean
          base_price: number | null
          category: string
          created_at: string
          deposit: number
          description: string | null
          event_types: Json
          id: string
          images: Json
          is_rental: boolean
          name: string
          options: Json
          price_is_from: boolean
          pricing: Json
          sizes: Json
          slug: string
          sort_order: number
          stock: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          base_price?: number | null
          category: string
          created_at?: string
          deposit?: number
          description?: string | null
          event_types?: Json
          id?: string
          images?: Json
          is_rental?: boolean
          name: string
          options?: Json
          price_is_from?: boolean
          pricing?: Json
          sizes?: Json
          slug: string
          sort_order?: number
          stock?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          base_price?: number | null
          category?: string
          created_at?: string
          deposit?: number
          description?: string | null
          event_types?: Json
          id?: string
          images?: Json
          is_rental?: boolean
          name?: string
          options?: Json
          price_is_from?: boolean
          pricing?: Json
          sizes?: Json
          slug?: string
          sort_order?: number
          stock?: number
          updated_at?: string
        }
        Relationships: []
      }
      quote_items: {
        Row: {
          created_at: string
          id: string
          label: string
          line_total: number | null
          options: Json
          pack_id: string | null
          product_id: string | null
          qty: number
          quote_id: string
          unit_price: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          line_total?: number | null
          options?: Json
          pack_id?: string | null
          product_id?: string | null
          qty?: number
          quote_id: string
          unit_price?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          line_total?: number | null
          options?: Json
          pack_id?: string | null
          product_id?: string | null
          qty?: number
          quote_id?: string
          unit_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'quote_items_pack_id_fkey'
            columns: ['pack_id']
            isOneToOne: false
            referencedRelation: 'packs'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'quote_items_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'quote_items_quote_id_fkey'
            columns: ['quote_id']
            isOneToOne: false
            referencedRelation: 'quotes'
            referencedColumns: ['id']
          },
        ]
      }
      quotes: {
        Row: {
          adjustments: Json
          client_email: string | null
          client_name: string | null
          client_phone: string | null
          created_at: string
          deposit_amount: number | null
          deposit_status: Database['public']['Enums']['payment_status']
          distance_km: number | null
          event_date: string | null
          event_type: Database['public']['Enums']['event_type'] | null
          id: string
          lead_id: string | null
          location: string | null
          notes: string | null
          status: Database['public']['Enums']['quote_status']
          subtotal: number
          total: number
          updated_at: string
          valid_until: string | null
        }
        Insert: {
          adjustments?: Json
          client_email?: string | null
          client_name?: string | null
          client_phone?: string | null
          created_at?: string
          deposit_amount?: number | null
          deposit_status?: Database['public']['Enums']['payment_status']
          distance_km?: number | null
          event_date?: string | null
          event_type?: Database['public']['Enums']['event_type'] | null
          id?: string
          lead_id?: string | null
          location?: string | null
          notes?: string | null
          status?: Database['public']['Enums']['quote_status']
          subtotal?: number
          total?: number
          updated_at?: string
          valid_until?: string | null
        }
        Update: {
          adjustments?: Json
          client_email?: string | null
          client_name?: string | null
          client_phone?: string | null
          created_at?: string
          deposit_amount?: number | null
          deposit_status?: Database['public']['Enums']['payment_status']
          distance_km?: number | null
          event_date?: string | null
          event_type?: Database['public']['Enums']['event_type'] | null
          id?: string
          lead_id?: string | null
          location?: string | null
          notes?: string | null
          status?: Database['public']['Enums']['quote_status']
          subtotal?: number
          total?: number
          updated_at?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'quotes_lead_id_fkey'
            columns: ['lead_id']
            isOneToOne: false
            referencedRelation: 'leads'
            referencedColumns: ['id']
          },
        ]
      }
      rental_bookings: {
        Row: {
          created_at: string
          date_from: string
          date_to: string
          deposit_amount: number
          deposit_status: Database['public']['Enums']['payment_status']
          event_id: string | null
          id: string
          product_id: string
        }
        Insert: {
          created_at?: string
          date_from: string
          date_to: string
          deposit_amount?: number
          deposit_status?: Database['public']['Enums']['payment_status']
          event_id?: string | null
          id?: string
          product_id: string
        }
        Update: {
          created_at?: string
          date_from?: string
          date_to?: string
          deposit_amount?: number
          deposit_status?: Database['public']['Enums']['payment_status']
          event_id?: string | null
          id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'rental_bookings_event_id_fkey'
            columns: ['event_id']
            isOneToOne: false
            referencedRelation: 'events'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'rental_bookings_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
        ]
      }
      site_content: {
        Row: {
          data: Json
          section: string
          updated_at: string
        }
        Insert: {
          data?: Json
          section: string
          updated_at?: string
        }
        Update: {
          data?: Json
          section?: string
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          author: string | null
          client_email: string | null
          created_at: string
          event_type: Database['public']['Enums']['event_type'] | null
          id: string
          published: boolean
          quote: string | null
          quote_id: string | null
          rating: number | null
          requested_at: string | null
          responded_at: string | null
          sort_order: number
          source: string | null
          token: string | null
          updated_at: string
        }
        Insert: {
          author?: string | null
          client_email?: string | null
          created_at?: string
          event_type?: Database['public']['Enums']['event_type'] | null
          id?: string
          published?: boolean
          quote?: string | null
          quote_id?: string | null
          rating?: number | null
          requested_at?: string | null
          responded_at?: string | null
          sort_order?: number
          source?: string | null
          token?: string | null
          updated_at?: string
        }
        Update: {
          author?: string | null
          client_email?: string | null
          created_at?: string
          event_type?: Database['public']['Enums']['event_type'] | null
          id?: string
          published?: boolean
          quote?: string | null
          quote_id?: string | null
          rating?: number | null
          requested_at?: string | null
          responded_at?: string | null
          sort_order?: number
          source?: string | null
          token?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'testimonials_quote_id_fkey'
            columns: ['quote_id']
            isOneToOne: true
            referencedRelation: 'quotes'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      event_status: 'tentativo' | 'confirmado' | 'completado' | 'cancelado'
      event_type:
        | 'cumpleanos'
        | 'comunion'
        | 'bautizo'
        | 'baby_shower'
        | 'graduacion'
        | 'despedida'
        | 'jubilacion'
        | 'corporativo'
        | 'boda'
        | 'otro'
      lead_status:
        | 'nuevo'
        | 'contactado'
        | 'presupuestado'
        | 'ganado'
        | 'perdido'
      payment_status: 'pendiente' | 'pagado' | 'reembolsado' | 'fallido'
      payment_type: 'senal' | 'resto' | 'fianza' | 'reembolso_fianza'
      quote_status:
        | 'borrador'
        | 'enviado'
        | 'aceptado'
        | 'rechazado'
        | 'caducado'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
  | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
      & DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    & DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
      ? R
      : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables']
    & DefaultSchema['Views'])
    ? (DefaultSchema['Tables']
      & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
        ? R
        : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema['Tables']
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
    Insert: infer I
  }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I
    }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema['Tables']
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
    Update: infer U
  }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U
    }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
  | keyof DefaultSchema['Enums']
  | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof DefaultSchema['CompositeTypes']
  | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      event_status: ['tentativo', 'confirmado', 'completado', 'cancelado'],
      event_type: [
        'cumpleanos',
        'comunion',
        'bautizo',
        'baby_shower',
        'graduacion',
        'despedida',
        'jubilacion',
        'corporativo',
        'boda',
        'otro',
      ],
      lead_status: [
        'nuevo',
        'contactado',
        'presupuestado',
        'ganado',
        'perdido',
      ],
      payment_status: ['pendiente', 'pagado', 'reembolsado', 'fallido'],
      payment_type: ['senal', 'resto', 'fianza', 'reembolso_fianza'],
      quote_status: [
        'borrador',
        'enviado',
        'aceptado',
        'rechazado',
        'caducado',
      ],
    },
  },
} as const
