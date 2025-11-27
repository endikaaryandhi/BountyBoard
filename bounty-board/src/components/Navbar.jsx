import { Home, ScrollText, Plus, User, ClipboardCheck, LogIn } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext'; 

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role } = useAuth();
  const { showNotification } = useNotification(); 

  const hideOnPaths = ['/login', '/register'];
  if (hideOnPaths.includes(location.pathname)) return null;

  const handlePostClick = () => {
    if (!user) {
      showNotification("Access Restricted: Login Required.", "error");
    } else {
      navigate('/add');
    }
  };

  // Komponen Item Navigasi Biasa
  const NavItem = ({ to, icon: Icon, label }) => {
    const isActive = location.pathname === to;
    return (
      <button 
        onClick={() => navigate(to)} 
        className={`relative flex flex-col items-center justify-center w-14 h-14 transition-all duration-300 group ${isActive ? '-translate-y-2' : ''}`}
      >
        {/* Active Indicator Background */}
        <div className={`absolute inset-0 bg-paper rounded-full opacity-0 transition-all duration-300 scale-0 ${isActive ? 'opacity-10 scale-100' : ''}`}></div>
        
        <Icon 
          size={24} 
          className={`z-10 transition-colors duration-300 ${isActive ? 'text-paper drop-shadow-[0_0_5px_rgba(245,230,200,0.5)]' : 'text-paper/50 group-hover:text-paper/80'}`} 
          strokeWidth={isActive ? 2.5 : 2}
        />
        
        <span className={`text-[10px] font-bold uppercase tracking-widest mt-1 transition-all duration-300 ${isActive ? 'text-paper opacity-100' : 'text-paper/0 opacity-0 h-0 overflow-hidden group-hover:text-paper/50 group-hover:opacity-100 group-hover:h-auto'}`}>
          {label}
        </span>
        
        {/* Dot Indicator for Active State */}
        {isActive && <div className="absolute -bottom-2 w-1 h-1 bg-paper rounded-full shadow-[0_0_5px_#F5E6C8]"></div>}
      </button>
    );
  };

  return (
    <>
      {/* Spacer agar konten paling bawah tidak tertutup navbar */}
      <div className="h-24" />
      
      <nav className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto">
        {/* Container Navbar: Bentuk Kayu Melayang */}
        <div className="bg-wood/95 backdrop-blur-md border-2 border-paper/20 rounded-2xl shadow-2xl shadow-black/50 px-2 h-16 flex justify-between items-center relative">
          
          {/* Left Group */}
          <div className="flex-1 flex justify-around items-center">
            <NavItem to="/" icon={Home} label="Home" />
            <NavItem to="/captured" icon={ScrollText} label="Logs" />
          </div>

          {/* Center Floating Button (Post) */}
          <div className="relative -top-6 mx-2">
            <button 
              onClick={handlePostClick}
              className="w-16 h-16 bg-gradient-to-b from-paper to-[#d4c5a9] rounded-full border-[6px] border-[#2e2622] shadow-[0_8px_10px_rgba(0,0,0,0.4)] flex items-center justify-center transform transition-transform active:scale-90 group"
            >
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-wood/30 animate-[spin_10s_linear_infinite]"></div>
              <Plus size={32} className="text-wood drop-shadow-sm group-hover:rotate-90 transition-transform duration-300" strokeWidth={3} />
            </button>
          </div>

          {/* Right Group */}
          <div className="flex-1 flex justify-around items-center">
            {user && role === 'admin' ? (
               <NavItem to="/approval" icon={ClipboardCheck} label="Review" />
            ) : (
               // Placeholder kosong jika bukan admin agar simetris, atau bisa diisi fitur lain
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