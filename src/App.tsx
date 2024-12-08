import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './store/store';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Assets from './pages/Assets';
import Users from './pages/Users';
import UserProfile from './pages/UserProfile';
import Categories from './pages/Categories';
import Requests from './pages/Requests';
import Reports from './pages/Reports';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import PrivateRoute from './components/auth/PrivateRoute';
import AdminRoute from './components/auth/AdminRoute';
import ManagerRoute from './components/auth/ManagerRoute';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/assets"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <Assets />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/requests"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <Requests />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/categories"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <Categories />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />

            {/* Admin/Manager Routes */}
            <Route
              path="/users"
              element={
                <AdminRoute>
                  <DashboardLayout>
                    <Users />
                  </DashboardLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ManagerRoute>
                  <DashboardLayout>
                    <Reports />
                  </DashboardLayout>
                </ManagerRoute>
              }
            />

            {/* Profile Routes */}
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <UserProfile />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
