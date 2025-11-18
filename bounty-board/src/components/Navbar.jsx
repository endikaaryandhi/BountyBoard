import { Home, ScrollText, PlusCircle, User, ClipboardCheck, LogIn } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role } = useAuth();

  const navItemClass = (path) => `
    flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200
    ${location.pathname === path 
      ? "bg-paper text-wood font-bold shadow-inner transform scale-105" 
      : "text-paper/70 hover:text-paper hover:bg-[#4a332a]"}
  `;

  // Sembunyikan navbar HANYA di halaman login/register
  const hideOnPaths = ['/login', '/register'];
  if (hideOnPaths.includes(location.pathname)) return null;

  return (
    <nav className="sticky top-0 z-50 w-full bg-wood border-b-8 border-[#3e2b25] shadow-2xl">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* Logo */}
        <div onClick={() => navigate('/')} className="cursor-pointer flex items-center gap-3 group">
          <div className="w-10 h-10 bg-paper rounded-full flex items-center justify-center border-2 border-[#3e2b25] group-hover:rotate-12 transition-transform shadow-md">
            <span className="text-2xl filter sepia">☠️</span>
          </div>
          <div className="hidden md:block">
            <h1 className="text-xl font-serif font-black text-paper tracking-[0.2em] uppercase leading-none drop-shadow-md">
              BOUNTY
            </h1>
            <span className="text-[0.65rem] font-bold text-paper/60 uppercase tracking-widest">Hunter Guild DB</span>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex items-center gap-1 md:gap-4">
          <button onClick={() => navigate('/')} className={navItemClass('/')}>
            <Home size={20} />
            <span className="hidden md:inline text-sm uppercase tracking-wider">Wanted</span>
          </button>
          
          {/* Tombol Log (Captured) tetap tampil, kalau diklik guest akan diarahkan ke login oleh PrivateRoute */}
          <button onClick={() => navigate('/captured')} className={navItemClass('/captured')}>
            <ScrollText size={20} />
            <span className="hidden md:inline text-sm uppercase tracking-wider">Log</span>
          </button>

          {/* Menu Admin: Hanya jika login DAN admin */}
          {user && role === 'admin' && (
            <button onClick={() => navigate('/approval')} className={navItemClass('/approval')}>
              <ClipboardCheck size={20} />
              <span className="hidden md:inline text-sm uppercase tracking-wider">Review</span>
            </button>
          )}

          {/* Tombol Post (Klik -> Redirect Login oleh PrivateRoute) */}
          <button onClick={() => navigate('/add')} className={navItemClass('/add')}>
            <PlusCircle size={20} />
            <span className="hidden md:inline text-sm uppercase tracking-wider">Post</span>
          </button>

          {/* Logika Tombol Profile / Login */}
          {user ? (
            <button onClick={() => navigate('/profile')} className={navItemClass('/profile')}>
              <User size={20} />
              <span className="hidden md:inline text-sm uppercase tracking-wider">
                {role === 'admin' ? 'Master' : 'Hunter'}
              </span>
            </button>
          ) : (
            <button 
              onClick={() => navigate('/login')} 
              className="flex items-center gap-2 px-4 py-2 rounded-md text-paper bg-[#4a332a] hover:bg-paper hover:text-wood transition-all font-bold shadow-md border border-paper/20"
            >
              <LogIn size={18} />
              <span className="hidden md:inline text-sm uppercase tracking-wider">Login</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}