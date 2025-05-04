// feedback schema.


export interface Feedback {
    id: number;
    user_id?: number | null;
    feedback: string;
    created_at?: string;
  }
  
  export interface FeedbackRequest {
    user_id?: number | null;
    feedback: string;
  }
  
  export interface FeedbackResponse {
    message: string;
  }