import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../config/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fungsi ambil role terpisah agar bisa dipanggil ulang
  const fetchRole = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
        
      if (data) {
        setRole(data.role);
        console.log("Role loaded:", data.role); // Debugging
      } else {
        setRole('hunter'); // Default jika gagal
      }
    } catch (err) {
      console.error("Error fetching role:", err);
      setRole('hunter');
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      // 1. Cek Session Awal
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await fetchRole(session.user.id);
      }
      setLoading(false);

      // 2. Listen Perubahan Auth (Login/Logout)
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          await fetchRole(session.user.id); // Ambil role setiap login
        } else {
          setUser(null);
          setRole(null);
        }
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    };

    initAuth();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);