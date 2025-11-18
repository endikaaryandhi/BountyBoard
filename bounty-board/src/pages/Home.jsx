import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import BountyCard from '../components/BountyCard';

export default function Home() {
  const [bounties, setBounties] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3000/api/bounties') 
      .then(res => setBounties(res.data.filter(b => b.status === 'wanted')))
      .catch(err => console.error(err));
  }, []);

  const filteredBounties = bounties.filter(b => 
    b.name.toLowerCase().includes(search.toLowerCase()) || 
    b.crime.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-stone-200 pb-24">
      {/* Header Kayu */}
      <div className="bg-wood text-paper py-6 px-4 shadow-lg sticky top-0 z-40 border-b-4 border-[#3e2b25]">
        <h1 className="text-3xl font-serif font-black text-center tracking-[0.2em] uppercase drop-shadow-md">
          Bounty Board
        </h1>
        
        {/* Search Bar */}
        <div className="mt-4 relative max-w-md mx-auto">
          <input 
            type="text"
            placeholder="Search target or crime..."
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#4a332a] text-paper placeholder-paper/50 border-2 border-paper/20 rounded-full py-2 pl-10 pr-4 outline-none focus:border-paper transition-all"
          />
          <Search className="absolute left-3 top-2.5 text-paper/50" size={18} />
        </div>
      </div>

      {/* Papan Pengumuman (Grid) */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
        {filteredBounties.map(bounty => (
          <BountyCard key={bounty.id} bounty={bounty} onClick={() => navigate(`/detail/${bounty.id}`)} />
        ))}
        
        {filteredBounties.length === 0 && (
          <div className="col-span-full text-center py-20 opacity-50">
            <p className="text-wood font-serif text-xl">No active warrants found.</p>
          </div>
        )}
      </div>
    </div>
  );
}