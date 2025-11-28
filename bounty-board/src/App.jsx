import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { DataProvider } from './context/DataContext';
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
import { useState } from 'react';

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
        <DataProvider>
          {showSplash ? (
            <SplashScreen onFinish={() => setShowSplash(false)} />
          ) : (
            <BrowserRouter>
              <div className="flex flex-col min-h-screen bg-[#2e2622] bg-[url('https://www.transparenttextures.com/patterns/dark-wood.png')] text-[#F5E6C8]">
                <Navbar />
                <main className="flex-grow pt-4 pb-28 md:pt-24 md:pb-8">
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/captured" element={<Captured />} />
                    <Route path="/detail/:id" element={<Detail />} />
                    <Route path="/add" element={<PrivateRoute><AddBounty /></PrivateRoute>} />
                    <Route path="/edit/:id" element={<PrivateRoute><EditBounty /></PrivateRoute>} />
                    <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                    <Route path="/approval" element={<PrivateRoute><Approval /></PrivateRoute>} />
                  </Routes>
                </main>
              </div>
            </BrowserRouter>
          )}
        </DataProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}