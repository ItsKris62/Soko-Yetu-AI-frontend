// Authentication helpers

import { jwtDecode } from 'jwt-decode';
import { User } from '../types/user';

interface DecodedToken {
  sub: number; // Assuming user ID is in 'sub'
  exp: number;
}

export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const removeToken = (): void => {
  localStorage.removeItem('token');
};

export const getUserFromToken = (): User | null => {
  const token = getToken();
  if (!token) return null;
  try {
    const decoded: DecodedToken = jwtDecode(token);
    return { id: decoded.sub } as User; // Extend with API call if needed
  } catch (error) {
    console.error('Invalid token', error);
    return null;
  }
};
