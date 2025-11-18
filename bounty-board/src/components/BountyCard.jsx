export default function BountyCard({ bounty, onClick }) {
  const isCaptured = bounty.status === 'captured';

  return (
    <div 
      onClick={onClick}
      className={`relative p-4 rounded-lg shadow-lg border-4 border-wood mb-4 cursor-pointer transition-all transform hover:scale-105
        ${isCaptured ? 'bg-gray-300 grayscale' : 'bg-paper'}
      `}
    >
      {/* Logic Stempel */}
      {isCaptured && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="border-4 border-stamp text-stamp text-4xl font-black px-4 py-2 -rotate-12 opacity-80 rounded-md uppercase tracking-widest">
            CAPTURED
          </div>
        </div>
      )}

      <img 
        src={bounty.image_url} 
        alt={bounty.name} 
        className="w-full h-48 object-cover rounded-md border-2 border-wood sepia-50"
      />
      <div className="mt-3 text-center">
        <h3 className="text-2xl font-serif font-bold text-wood uppercase">{bounty.name}</h3>
        <p className="text-wood font-semibold">Reward: ${parseInt(bounty.bounty_amount).toLocaleString()}</p>
      </div>
    </div>
  );
}