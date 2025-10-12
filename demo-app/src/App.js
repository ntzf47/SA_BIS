import React, { useContext } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import HeadcountSummary from './pages/HeadcountSummary';
import ManageEmployee from './pages/ManageEmployee';
import CreateRequest from './pages/CreateRequest';
import Register from './pages/Register';
import ManpowerPlan from './pages/ManpowerPlan';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

function AppContent() {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: '#0a0e27',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" /> : <Login />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/" /> : <Register />}
      />
      <Route
        path="/dashboard"
        element={user ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/employee-dashboard"
        element={user ? <EmployeeDashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/headcount-summary"
        element={user ? <HeadcountSummary /> : <Navigate to="/login" />}
      />
      <Route
        path="/manage-employee"
        element={user ? <ManageEmployee /> : <Navigate to="/login" />}
      />
      <Route
        path="/create-request"
        element={user ? <CreateRequest /> : <Navigate to="/login" />}
      />
      <Route
        path="/manpower-plan"
        element={user ? <ManpowerPlan /> : <Navigate to="/login" />}
      />
      <Route
        path="*"
        element={
          user ? (
            <Navigate
              to={(
                user.role === 'Admin' ||
                user.role === 'HR-Manager' ||
                user.role === 'Manager'
              ) ? '/dashboard' : '/employee-dashboard'}
            />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;