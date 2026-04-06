import { Navigate } from 'react-router-dom';

export const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');
  return !token ? children : <Navigate to="/" />;
};
