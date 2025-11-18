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
    <div className="min-h-screen bg-transparent pb-12">
      
      {/* Area Pencarian: Desain Kertas Terpaku */}
      <div className="max-w-md mx-auto mt-8 px-4 mb-8 relative z-10">
        <div className="bg-paper border-2 border-wood/30 shadow-lg p-4 transform -rotate-1 rounded-sm relative">
          {/* Efek Paku */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gray-800 border border-gray-500 shadow"></div>
          
          <h2 className="text-center text-wood font-serif font-bold uppercase tracking-widest mb-2 border-b border-wood/20 pb-1">
            Find Target
          </h2>
          
          <div className="relative">
            <input 
              type="text"
              placeholder="Search name or crime..."
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-stone-100/50 text-wood placeholder-wood/40 border border-wood/20 rounded px-4 py-2 pl-10 outline-none focus:bg-white focus:border-wood transition-all font-serif"
            />
            <Search className="absolute left-3 top-2.5 text-wood/50" size={18} />
          </div>
        </div>
      </div>

      {/* Papan Pengumuman (Grid) */}
      <div className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBounties.map(bounty => (
            <BountyCard key={bounty.id} bounty={bounty} onClick={() => navigate(`/detail/${bounty.id}`)} />
          ))}
          
          {filteredBounties.length === 0 && (
            <div className="col-span-full text-center py-20">
              <p className="text-paper font-serif text-2xl font-bold drop-shadow-md opacity-80">
                No active warrants found in this area.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}