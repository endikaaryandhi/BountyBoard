import { useEffect, useState } from 'react';

export default function SplashScreen({ onFinish }) {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Mulai efek fade-out setelah 2.5 detik
    const timer = setTimeout(() => setFade(true), 2500);
    
    // Hapus splash screen dari DOM setelah animasi selesai (3 detik total)
    const finishTimer = setTimeout(onFinish, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#2e2622] bg-[url('https://www.transparenttextures.com/patterns/dark-wood.png')] transition-opacity duration-700 ${fade ? 'opacity-0' : 'opacity-100'}`}>
      <div className="relative w-32 h-32 mb-6 animate-bounce">
        <div className="absolute inset-0 bg-paper rounded-full border-4 border-[#5D4037] flex items-center justify-center shadow-2xl">
          <span className="text-6xl filter sepia">☠️</span>
        </div>
      </div>
      
      <h1 className="text-4xl font-serif font-black text-paper tracking-[0.5em] uppercase drop-shadow-lg mb-2 animate-pulse">
        WANTED
      </h1>
      <p className="text-[#8d6e63] text-sm tracking-widest uppercase font-bold">Hunter Guild Database Loading...</p>
    </div>
  );
}