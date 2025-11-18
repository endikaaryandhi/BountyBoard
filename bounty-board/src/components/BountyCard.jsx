export default function BountyCard({ bounty, onClick }) {
  const isCaptured = bounty.status === 'captured';

  return (
    <div 
      onClick={onClick}
      className={`group relative w-full max-w-sm mx-auto transition-all duration-300 transform hover:-translate-y-2 hover:rotate-1 cursor-pointer
        ${isCaptured ? 'grayscale opacity-90' : ''}
      `}
    >
      {/* Efek Paku/Pin di tengah atas */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 w-4 h-4 rounded-full bg-gray-800 border-2 border-gray-400 shadow-md"></div>

      {/* Kontainer Kertas */}
      <div className="bg-paper p-4 pb-8 shadow-xl border-t border-l border-white/40 relative overflow-hidden">
        
        {/* Efek Kertas Kusut/Tekstur (CSS Gradient sederhana) */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] opacity-30 pointer-events-none"></div>

        {/* Header Wanted */}
        <div className="text-center border-b-4 border-wood mb-3 pb-1">
          <h2 className="text-4xl font-serif font-black text-wood tracking-widest uppercase scale-y-110">WANTED</h2>
          <p className="text-xs font-bold text-wood uppercase tracking-[0.2em]">Dead or Alive</p>
        </div>

        {/* Foto */}
        <div className="relative aspect-[4/3] bg-gray-200 border-4 border-wood mb-3 overflow-hidden">
          <img 
            src={bounty.image_url} 
            alt={bounty.name} 
            className="w-full h-full object-cover sepia-[.3] contrast-125 group-hover:scale-110 transition-transform duration-700"
          />
          
          {/* Stempel CAPTURED */}
          {isCaptured && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px] z-20">
              <div className="border-[6px] border-stamp text-stamp text-5xl font-black px-4 py-2 -rotate-12 opacity-90 rounded-lg uppercase tracking-widest shadow-2xl mix-blend-hard-light animate-pulse">
                CAPTURED
              </div>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="text-center space-y-1 relative z-10">
          <h3 className="text-2xl font-serif font-bold text-wood uppercase leading-none">{bounty.name}</h3>
          <p className="text-sm font-serif italic text-wood/80">"{bounty.alias}"</p>
          
          <div className="mt-4 flex items-center justify-center gap-1 text-wood">
            <span className="text-lg font-bold">$</span>
            <span className="text-3xl font-black tracking-tighter">{parseInt(bounty.bounty_amount).toLocaleString()}</span>
          </div>
        </div>

      </div>
    </div>
  );
}