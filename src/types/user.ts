// TypeScript type definitions for user



export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    gender?: 'male' | 'female';
    country_id?: number;
    county_id?: number;
    sub_county_id?: number;
    id_number?: string;
    is_verified?: boolean;
    avatar_url?: string;
    national_id_url?: string;
    created_at?: string;
    updated_at?: string;
    role: string;
    date_of_birth?: string | null;
  }
  
  export interface Country {
    id: number;
    name: string;
  }
  
  export interface County {
    id: number;
    name: string;
    country_id: number;
  }
  
  export interface SubCounty {
    id: number;
    name: string;
    county_id: number;
  }
  
  export interface LoginFormData {
    email: string;
    password: string;
  }
  
  export interface SignupFormData {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    password: string;
    gender?: 'male' | 'female';
    country_id?: number;
    county_id?: number;
    sub_county_id?: number;
    id_number?: string;
    avatar_url?: string;
    national_id_url?: string;
  }
  
  export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
  }