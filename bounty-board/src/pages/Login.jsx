import { useState } from 'react';
import { supabase } from '../config/supabase';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-900 bg-[url('https://www.transparenttextures.com/patterns/dark-wood.png')]">
      <div className="bg-paper p-8 rounded-sm shadow-2xl border-4 border-wood max-w-md w-full transform rotate-1">
        <h2 className="text-3xl font-serif font-black text-wood text-center mb-6 uppercase tracking-widest border-b-4 border-wood pb-2">Hunter Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input className="w-full p-3 bg-transparent border-2 border-wood/50 placeholder-wood/60 text-wood font-bold focus:border-wood outline-none" type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required />
          <input className="w-full p-3 bg-transparent border-2 border-wood/50 placeholder-wood/60 text-wood font-bold focus:border-wood outline-none" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
          <button className="w-full bg-wood text-paper font-bold py-3 hover:bg-[#4a332a] transition-colors">ENTER GUILD</button>
        </form>
        <p className="text-center mt-4 text-wood text-sm">New Hunter? <Link to="/register" className="font-bold underline">Sign Up</Link></p>
      </div>
    </div>
  );
}