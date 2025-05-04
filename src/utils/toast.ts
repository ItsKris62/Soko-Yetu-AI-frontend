// Toast notification utilities

interface ToastOptions {
    message: string;
    type: 'success' | 'error';
    duration?: number;
  }
  
  export const showToast = ({ message, type, duration = 3000 }: ToastOptions): void => {
    const event = new CustomEvent('show-toast', { detail: { message, type, duration } });
    window.dispatchEvent(event);
  };