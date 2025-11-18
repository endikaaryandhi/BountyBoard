import { Home, ScrollText, PlusCircle, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path ? "text-wood font-bold" : "text-gray-500";

  return (
    <div className="fixed bottom-0 w-full bg-paper border-t-2 border-wood h-16 flex justify-around items-center z-50 shadow-inner">
      <button onClick={() => navigate('/')} className={`flex flex-col items-center ${isActive('/')}`}>
        <Home size={24} />
        <span className="text-xs">Wanted</span>
      </button>
      <button onClick={() => navigate('/captured')} className={`flex flex-col items-center ${isActive('/captured')}`}>
        <ScrollText size={24} />
        <span className="text-xs">Log</span>
      </button>
      <button onClick={() => navigate('/add')} className={`flex flex-col items-center ${isActive('/add')}`}>
        <PlusCircle size={32} className="text-wood mb-1" />
      </button>
      <button onClick={() => navigate('/profile')} className={`flex flex-col items-center ${isActive('/profile')}`}>
        <User size={24} />
        <span className="text-xs">Hunter</span>
      </button>
    </div>
  );
}