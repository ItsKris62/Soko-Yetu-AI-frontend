export interface User {
    id: string
    first_name: string
    last_name: string
    id_number: string
    profile_picture?: string
    gender: 'male' | 'female'
    location: {
      lat: number
      lng: number
    }
    county_id?: number
    sub_county_id?: number
    role: 'farmer' | 'buyer' | 'other'
    created_at: string
    updated_at: string
  }
  