import { Home, ScrollText, Plus, User, ClipboardCheck, LogIn, LogOut } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { supabase } from '../config/supabase';
import logoImage from '../assets/logo.png';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role, signOut } = useAuth();
  const { showNotification } = useNotification();
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const { data } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', user.id)
          .single();
        if (data) {
          setProfileImage(data.avatar_url);
        }
      };
      fetchProfile();
    }
  }, [user]);

  const hideOnPaths = ['/login', '/register'];
  if (hideOnPaths.includes(location.pathname)) return null;

  const handlePostClick = () => {
    if (!user) {
      showNotification("Access Restricted: Login Required.", "error");
    } else {
      navigate('/add');
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const NavItem = ({ to, icon: Icon, label }) => {
    const isActive = location.pathname === to;
    return (
      <button 
        onClick={() => navigate(to)} 
        className={`relative flex flex-col items-center justify-center w-14 h-14 transition-all duration-300 group ${isActive ? '-translate-y-1' : ''}`}
      >
        <div className={`absolute inset-0 bg-paper rounded-full opacity-0 transition-all duration-300 scale-0 ${isActive ? 'opacity-10 scale-100' : ''}`}></div>
        
        <Icon 
          size={24} 
          className={`z-10 transition-colors duration-300 ${isActive ? 'text-paper drop-shadow-[0_0_5px_rgba(245,230,200,0.5)]' : 'text-paper/50 group-hover:text-paper/80'}`} 
          strokeWidth={isActive ? 2.5 : 2}
        />
        
        <span className={`text-[10px] font-bold uppercase tracking-widest mt-1 transition-all duration-300 ${isActive ? 'text-paper opacity-100' : 'text-paper/0 opacity-0 h-0 overflow-hidden group-hover:text-paper/50 group-hover:opacity-100 group-hover:h-auto'}`}>
          {label}
        </span>
      </button>
    );
  };

  return (
    <>
      <nav className="hidden md:flex fixed top-0 left-0 right-0 h-20 bg-wood/95 backdrop-blur-md border-b-4 border-paper shadow-2xl z-50 px-8 justify-between items-center">
        <Link to="/" className="text-2xl font-serif font-black text-paper tracking-[0.2em] uppercase drop-shadow-md flex items-center gap-3">
          <img 
            src={logoImage} 
            alt="Bounty Board Logo" 
            className="w-8 h-8 md:w-14 md:h-14 rounded-full border-2 border-stone-800 object-contain bg-paper"
          />
          BOUNTY BOARD
        </Link>

        <div className="flex items-center gap-8">
          <Link to="/" className={`text-sm font-bold uppercase tracking-widest hover:text-paper transition-colors ${location.pathname === '/' ? 'text-paper underline underline-offset-4 decoration-2' : 'text-paper/60'}`}>Home</Link>
          <Link to="/captured" className={`text-sm font-bold uppercase tracking-widest hover:text-paper transition-colors ${location.pathname === '/captured' ? 'text-paper underline underline-offset-4 decoration-2' : 'text-paper/60'}`}>Captured</Link>
          {user && role === 'admin' && (
             <Link to="/approval" className={`text-sm font-bold uppercase tracking-widest hover:text-paper transition-colors ${location.pathname === '/approval' ? 'text-paper underline underline-offset-4 decoration-2' : 'text-paper/60'}`}>Review</Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={handlePostClick}
            className="bg-paper text-wood px-6 py-2 rounded-sm font-bold uppercase tracking-wider hover:bg-white transition-colors shadow-lg flex items-center gap-2"
          >
            <Plus size={18} strokeWidth={3} /> Post Bounty
          </button>

          {user ? (
            <div className="flex items-center gap-4 border-l-2 border-paper/20 pl-4">
              <Link to="/profile" className="flex items-center gap-2 group">
                 <div className="text-right hidden lg:block">
                    <p className="text-xs text-paper font-bold uppercase tracking-wider">{user.email?.split('@')[0]}</p>
                    <p className="text-[10px] text-paper/60 uppercase">{role}</p>
                 </div>
                 <div className="w-10 h-10 bg-paper/20 rounded-full flex items-center justify-center border-2 border-paper group-hover:bg-paper group-hover:text-wood transition-colors overflow-hidden">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User size={20} />
                    )}
                 </div>
              </Link>
              <button onClick={handleLogout} className="text-red-400 hover:text-red-300 transition-colors" title="Logout">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-paper font-bold uppercase tracking-widest hover:text-white flex items-center gap-2">
              <LogIn size={18} /> Login
            </Link>
          )}
        </div>
      </nav>

      <nav className="md:hidden fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto">
        <div className="bg-wood/95 backdrop-blur-md border-2 border-paper/20 rounded-2xl shadow-2xl shadow-black/50 px-2 h-16 flex justify-between items-center relative">
          
          <div className="flex-1 flex justify-around items-center">
            <NavItem to="/" icon={Home} label="Home" />
            <NavItem to="/captured" icon={ScrollText} label="Logs" />
          </div>

          <div className="mx-2">
            <button 
              onClick={handlePostClick}
              className="w-12 h-12 bg-gradient-to-b from-paper to-[#d4c5a9] rounded-full shadow-lg flex items-center justify-center transform transition-transform active:scale-90 group border-2 border-wood"
            >
              <div className="absolute inset-0 rounded-full border border-dashed border-wood/30 animate-[spin_10s_linear_infinite]"></div>
              <Plus size={24} className="text-wood drop-shadow-sm group-hover:rotate-90 transition-transform duration-300" strokeWidth={3} />
            </button>
          </div>

          <div className="flex-1 flex justify-around items-center">
            {user && role === 'admin' ? (
               <NavItem to="/approval" icon={ClipboardCheck} label="Review" />
            ) : (
               <div className="w-14" /> 
            )}
            
            {user ? (
              <NavItem to="/profile" icon={User} label="Me" />
            ) : (
              <NavItem to="/login" icon={LogIn} label="Login" />
            )}
          </div>

        </div>
      </nav>
    </>
  );
}