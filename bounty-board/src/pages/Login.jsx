import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // State untuk loading tombol
  const navigate = useNavigate();
  const { user } = useAuth(); // Ambil status user dari context

  // EFEK OTOMATIS: Jika user sudah login (ada datanya), langsung pindah ke Home
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      // Tidak perlu navigate di sini, useEffect di atas yang akan jalan otomatis
    } catch (error) {
      alert(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2e2622] bg-[url('https://www.transparenttextures.com/patterns/dark-wood.png')]">
      <div className="bg-paper p-8 rounded-sm shadow-2xl border-4 border-wood max-w-md w-full transform rotate-1">
        <h2 className="text-3xl font-serif font-black text-wood text-center mb-6 uppercase tracking-widest border-b-4 border-wood pb-2">
          Hunter Login
        </h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            className="w-full p-3 bg-transparent border-2 border-wood/50 placeholder-wood/60 text-wood font-bold focus:border-wood outline-none" 
            type="email" 
            placeholder="Email" 
            onChange={e => setEmail(e.target.value)} 
            disabled={loading}
            required 
          />
          <input 
            className="w-full p-3 bg-transparent border-2 border-wood/50 placeholder-wood/60 text-wood font-bold focus:border-wood outline-none" 
            type="password" 
            placeholder="Password" 
            onChange={e => setPassword(e.target.value)} 
            disabled={loading}
            required 
          />
          
          <button 
            disabled={loading}
            className="w-full bg-wood text-paper font-bold py-3 hover:bg-[#4a332a] transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
          >
            {loading ? 'VERIFYING...' : 'ENTER GUILD'}
          </button>
        </form>
        
        <p className="text-center mt-4 text-wood text-sm">
          New Hunter? <Link to="/register" className="font-bold underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}