export interface Profile {
  id: string
  name: string | null
  role: 'customer' | 'admin'
  avatar_url: string | null
  created_at: string
}

export interface Model {
  id: string
  name: string
  description: string | null
  price: number
  category: string | null
  tags: string[] | null
  model_url: string | null
  thumbnail_url: string | null
  is_featured: boolean
  created_at: string
}

export interface CustomRequest {
  id: string
  user_id: string
  description: string
  reference_image_url: string | null
  budget: number | null
  deadline: string | null
  status: 'pending' | 'in_progress' | 'delivered'
  admin_notes: string | null
  created_at: string
}

export interface Purchase {
  id: string
  user_id: string
  model_id: string
  purchased_at: string
  model?: Model
}
