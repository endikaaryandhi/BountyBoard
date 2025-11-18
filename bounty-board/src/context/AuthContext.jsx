import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../config/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        // --- TIMEOUT PENGAMAN ---
        // Jika Supabase tidak merespon dalam 5 detik, kita batalkan loading
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Timeout")), 5000)
        );

        // Balapan: Mana yang lebih cepat, respon Supabase atau Timer 5 detik?
        const sessionPromise = supabase.auth.getSession();
        const { data } = await Promise.race([sessionPromise, timeoutPromise]);

        if (data?.session?.user && mounted) {
          setUser(data.session.user);
          await fetchRole(data.session.user.id);
        }
      } catch (error) {
        console.error("Gagal load session:", error);
        // Jika error/timeout, kita anggap user logout agar aplikasi tidak macet
        if (mounted) {
          setUser(null);
          setRole(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    // Listener: Memantau jika user login/logout saat aplikasi berjalan
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      if (session?.user) {
        setUser(session.user);
        await fetchRole(session.user.id);
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchRole = async (userId) => {
    try {
      const { data } = await supabase.from('profiles').select('role').eq('id', userId).single();
      if (data) setRole(data.role);
    } catch (err) {
      console.error("Gagal ambil role:", err);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
  };

  // Tampilan Loading (Maksimal muncul 5 detik sekarang)
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#2e2622] text-white font-serif">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#F5E6C8] mb-4"></div>
        <h2 className="text-xl tracking-widest animate-pulse">INITIALIZING GUILD DATABASE...</h2>
        <p className="text-xs mt-4 text-gray-400">Connecting to satellite...</p>
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