import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message, type = 'info') => {
    setNotification({ message, type });
    
    // Hilang otomatis setelah 3 detik
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      
      {/* Komponen UI Notifikasi */}
      {notification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[10000] animate-slide-down">
          <div className={`
            flex items-center gap-3 px-6 py-3 rounded-sm shadow-2xl border-l-4 min-w-[300px]
            ${notification.type === 'success' ? 'bg-[#1b5e20] border-green-400 text-white' : ''}
            ${notification.type === 'error' ? 'bg-[#b71c1c] border-red-400 text-white' : ''}
            ${notification.type === 'info' ? 'bg-[#5D4037] border-[#F5E6C8] text-[#F5E6C8]' : ''}
          `}>
            {notification.type === 'success' && <CheckCircle size={24} />}
            {notification.type === 'error' && <XCircle size={24} />}
            {notification.type === 'info' && <Info size={24} />}
            
            <div>
              <h4 className="font-bold uppercase tracking-wider text-xs opacity-80">
                {notification.type === 'error' ? 'System Alert' : 'Guild Message'}
              </h4>
              <p className="font-serif font-medium">{notification.message}</p>
            </div>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);