import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { DataProvider } from './context/DataContext';
import Navbar from './components/Navbar';
import SplashScreen from './components/SplashScreen';
import Login from './pages/Login';
import Register from './pages/Register';
import AddBounty from './pages/AddBounty';
import EditBounty from './pages/EditBounty';
import Profile from './pages/Profile';
import { useState, lazy, Suspense } from 'react';

const Home = lazy(() => import('./pages/Home'));
const Captured = lazy(() => import('./pages/Captured'));
const Detail = lazy(() => import('./pages/Detail'));
const Approval = lazy(() => import('./pages/Approval'));

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
};

const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center text-[#F5E6C8]">
    <div className="w-12 h-12 border-4 border-[#F5E6C8] border-t-transparent rounded-full animate-spin mb-4"></div>
    <p className="font-serif uppercase tracking-widest text-sm opacity-70">Loading Content...</p>
  </div>
);

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
                  <Suspense fallback={<PageLoader />}>
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
                  </Suspense>
                </main>
              </div>
            </BrowserRouter>
          )}
        </DataProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}