import { createClient } from '@supabase/supabase-js'

// Tipos basados en el esquema de Supabase
export interface Product {
  id: number
  user_id: string
  category_id?: number | null
  name: string
  description: string
  additional_info?: string | null
  price: number
  stock: number
  image_url: string
  is_active?: boolean
  created_at: string
  updated_at: string
  categories?: Category
}

export interface Profile {
  id: string
  name: string
  specialty?: string | null
  instagram?: string | null
  tiktok?: string | null
  facebook?: string | null
  bank_info?: string | null
  mercadopago_link?: string | null
  avatar_url?: string | null
  created_at: string
  updated_at: string
}

export interface Category {
  id: number
  user_id: string
  name: string
  created_at: string
  updated_at: string
}

// Inicializar Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Funciones de base de datos
export const db = {
  // Obtener todos los productos activos (para demo)
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (*)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching products:', error)
      return []
    }

    return data as Product[]
  },

  // Obtener productos públicos de un usuario específico
  async getPublicProducts(userId: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (*)
      `)
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching user products:', error)
      return []
    }

    return data as Product[]
  },

  // Obtener perfil de usuario
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return null
    }

    return data as Profile
  },

  // Obtener categorías de un usuario
  async getCategories(userId: string): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId)
      .order('name')

    if (error) {
      console.error('Error fetching categories:', error)
      return []
    }

    return data as Category[]
  }
}

export default supabase