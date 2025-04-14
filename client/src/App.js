import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useContext } from 'react';
import { AuthContext } from './contexts/AuthContext';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Signup from './pages/SignUp';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import StoreOwnerDashboard from './pages/StoreOwnerDashboard';

// User Pages
import StoreDetail from './components/user/StoreDetail';

// Import CSS
import './App.css';

// Auth check component
const AuthCheck = () => {
  const {  currentUser } = useContext(AuthContext);

  console.log(currentUser);
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Redirect to appropriate dashboard based on role
  switch (currentUser.role) {
    case 'admin':
      return <Navigate to="/admin" />;
    case 'storeOwner':
      return <Navigate to="/store-owner" />;
    default:
      return <Navigate to="/dashboard" />;
  }
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Route redirects based on auth state */}
              <Route path="/" element={<AuthCheck />} />
              
              {/* Protected routes - Admin */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminDashboard activeTab="users" />} />
                <Route path="/admin/stores" element={<AdminDashboard activeTab="stores" />} />
              </Route>
              
              {/* Protected routes - Store Owner */}
              <Route element={<ProtectedRoute allowedRoles={['storeOwner']} />}>
                <Route path="/store-owner" element={<StoreOwnerDashboard />} />
              </Route>
              
              {/* Protected routes - Normal User */}
              <Route element={<ProtectedRoute allowedRoles={['user']} />}>
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/stores" element={<UserDashboard activeTab="stores" />} />
                <Route path="/stores/:storeId" element={<StoreDetail />} />
                <Route path="/update-password" element={<UserDashboard activeTab="password" />} />
              </Route>
              
              {/* Catch all - redirect to login */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;