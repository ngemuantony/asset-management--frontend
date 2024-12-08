import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface ManagerRouteProps {
  children: React.ReactNode;
}

const ManagerRoute: React.FC<ManagerRouteProps> = ({ children }) => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user?.role !== 'ADMIN' && user?.role !== 'MANAGER') {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

export default ManagerRoute;
