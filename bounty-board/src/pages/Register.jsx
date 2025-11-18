import { useState } from 'react';
import { supabase } from '../config/supabase';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('hunter');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        data: { 
          username,
          role
        } 
      } 
    });
    if (error) alert(error.message);
    else {
      alert('Registration successful! Please login.');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-paper p-8 rounded-sm shadow-2xl border-4 border-wood max-w-md w-full transform -rotate-1">
        <h2 className="text-3xl font-serif font-black text-wood text-center mb-6 uppercase tracking-widest border-b-4 border-wood pb-2">New License</h2>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-wood uppercase ml-1">Codename</label>
            <input 
              className="w-full p-3 bg-transparent border-2 border-wood/50 placeholder-wood/40 text-wood font-bold focus:border-wood outline-none transition-colors" 
              type="text" 
              placeholder="ex: Black Beard" 
              onChange={e => setUsername(e.target.value)} 
              required 
            />
          </div>

          <div>
            <label className="text-xs font-bold text-wood uppercase ml-1">Role Selection</label>
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 bg-transparent border-2 border-wood/50 text-wood font-bold focus:border-wood outline-none cursor-pointer"
            >
              <option value="hunter">⚔️ Bounty Hunter</option>
              <option value="admin">👑 Guild Master (Admin)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-wood uppercase ml-1">Email Address</label>
            <input 
              className="w-full p-3 bg-transparent border-2 border-wood/50 placeholder-wood/40 text-wood font-bold focus:border-wood outline-none" 
              type="email" 
              placeholder="email@guild.com" 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div>
            <label className="text-xs font-bold text-wood uppercase ml-1">Password</label>
            <input 
              className="w-full p-3 bg-transparent border-2 border-wood/50 placeholder-wood/40 text-wood font-bold focus:border-wood outline-none" 
              type="password" 
              placeholder="******" 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button className="w-full bg-wood text-paper font-bold py-3 hover:bg-[#4a332a] transition-colors mt-6 shadow-md active:translate-y-1">
            REGISTER LICENSE
          </button>
        </form>
        
        <p className="text-center mt-6 text-wood text-sm">
          Already have a license? <Link to="/login" className="font-bold underline">Login</Link>
        </p>
      </div>
    </div>
  );
}