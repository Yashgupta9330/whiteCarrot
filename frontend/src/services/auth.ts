import { NavigateFunction } from 'react-router-dom';

export const handleAuthError = (navigate: NavigateFunction, errorMessage?: string) => {
  localStorage.removeItem('token');
  if (errorMessage?.toLowerCase().includes('invalid credentials')) {
    navigate('/');
  } else {
    navigate('/login');
  }
};