// feedback schema.


export interface Feedback {
    id: number;
    user_id?: number | null;
    name?: string; // Optional: Add if backend returns name with feedback object
    feedback: string;
    created_at?: string;
  }
  
  export interface FeedbackRequest {
    user_id?: number | null;
    name: string; // Add the name field
    feedback: string;
  }
  
  export interface FeedbackResponse {
    message: string;
  }