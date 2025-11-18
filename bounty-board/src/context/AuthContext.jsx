import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../config/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Cek session saat ini
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          await fetchRole(session.user.id);
        }
      } catch (error) {
        console.error("Auth Init Error:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchRole(session.user.id);
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchRole = async (userId) => {
    try {
      const { data, error } = await supabase.from('profiles').select('role').eq('id', userId).single();
      if (error) {
        // Jika profil belum ada (misal baru register), default ke hunter
        console.warn("Profile fetch warning:", error.message);
        setRole('hunter'); 
      } else if (data) {
        setRole(data.role);
      }
    } catch (err) {
      console.error("Fetch Role Error:", err);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
  };

  // TAMPILAN SAAT LOADING AGAR TIDAK BLANK
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#2e2622] text-white font-serif">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#F5E6C8] mb-4"></div>
        <h2 className="text-xl tracking-widest">INITIALIZING GUILD DATABASE...</h2>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, role, isAdmin: role === 'admin', loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);