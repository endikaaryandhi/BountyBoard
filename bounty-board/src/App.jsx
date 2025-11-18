import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Captured from './pages/Captured';
import Detail from './pages/Detail';
import AddBounty from './pages/AddBounty';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="text-white text-center pt-20">Authenticating...</div>;
  return user ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          {/* Navbar akan otomatis hidden di login/register berkat logika di dalam Navbar.jsx */}
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
              <Route path="/captured" element={<PrivateRoute><Captured /></PrivateRoute>} />
              <Route path="/detail/:id" element={<PrivateRoute><Detail /></PrivateRoute>} />
              <Route path="/add" element={<PrivateRoute><AddBounty /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}