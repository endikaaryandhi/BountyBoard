import { useState, useEffect } from 'react'; 
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext'; 
import Navbar from './components/Navbar';
import SplashScreen from './components/SplashScreen'; 
import Home from './pages/Home';
import Captured from './pages/Captured';
import Detail from './pages/Detail';
import AddBounty from './pages/AddBounty';
import EditBounty from './pages/EditBounty';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Approval from './pages/Approval';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null; 
  return user ? children : <Navigate to="/login" />;
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <NotificationProvider>
      <AuthProvider>
        {showSplash ? (
          <SplashScreen onFinish={() => setShowSplash(false)} />
        ) : (
          <BrowserRouter>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/" element={<Home />} />
                  <Route path="/detail/:id" element={<Detail />} />
                  <Route path="/captured" element={<PrivateRoute><Captured /></PrivateRoute>} />
                  <Route path="/add" element={<PrivateRoute><AddBounty /></PrivateRoute>} />
                  <Route path="/edit/:id" element={<PrivateRoute><EditBounty /></PrivateRoute>} />
                  <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                  <Route path="/approval" element={<PrivateRoute><Approval /></PrivateRoute>} />
                </Routes>
              </main>
            </div>
          </BrowserRouter>
        )}
      </AuthProvider>
    </NotificationProvider>
  );
}