// TypeScript type definitions for product


export interface Product {
    id: number;
    farmer_id: number;
    predefined_product_id: string;
    product_name: string;  
    description?: string;
    price: number;
    image_url?: string;
    country_id?: number;
    county_id?: number;
    category_id?: number;
    category_name?: string; // From categories table
    ai_suggested_price?: number; // From ai_insights table
    ai_quality_grade?: string; // From ai_insights table
    created_at?: string;
    updated_at?: string;
    county_name?: string; // From counties table
  }