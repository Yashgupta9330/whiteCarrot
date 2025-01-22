import { NavigateFunction } from 'react-router-dom';

export const handleAuthError = (navigate: NavigateFunction, errorMessage?: string) => {
  if (errorMessage?.toLowerCase().includes('invalid credentials') || errorMessage?.toLowerCase().includes('Error during authentication')) {
    localStorage.removeItem('token');
    navigate('/');
  } 
};