import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import BountyCard from '../components/BountyCard';

const API_URL = import.meta.env.VITE_API_URL;

export default function Captured() {
  const [bounties, setBounties] = useState([]);
  const [search, setSearch] = useState('');
  const [minReward, setMinReward] = useState('');
  const [maxReward, setMaxReward] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_URL}/api/bounties`) 
      .then(res => setBounties(res.data.filter(b => b.status === 'captured')))
      .catch(err => console.error(err));
  }, []);

  const filteredBounties = bounties.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase()) || 
                          b.crime?.toLowerCase().includes(search.toLowerCase());
    
    const amount = parseFloat(b.bounty_amount);
    const matchesMin = minReward === '' || amount >= parseFloat(minReward);
    const matchesMax = maxReward === '' || amount <= parseFloat(maxReward);

    return matchesSearch && matchesMin && matchesMax;
  });

  return (
    <div className="min-h-screen bg-transparent">
      <div className="w-full max-w-4xl mx-auto mt-4 px-4 mb-8 relative z-10">
        <div className="bg-paper border-2 border-wood/30 shadow-lg p-4 transform md:rotate-1 rounded-sm relative w-full md:w-2/3 mx-auto transition-all duration-300">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gray-800 border border-gray-500 shadow"></div>
          <h2 className="text-center text-wood font-serif font-bold uppercase tracking-widest mb-2 border-b border-wood/20 pb-1">
            Search Captured Log
          </h2>
          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <input 
                type="text"
                placeholder="Search captured fugitives..."
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-stone-100/50 text-wood placeholder-wood/40 border border-wood/20 rounded px-4 py-2 pl-10 outline-none focus:bg-white focus:border-wood transition-all font-serif"
              />
              <Search className="absolute left-3 top-2.5 text-wood/50" size={18} />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded border border-wood/20 hover:bg-wood/10 transition-colors ${showFilters ? 'bg-wood/20 text-wood' : 'text-wood/60'}`}
              title="Filter Price"
            >
              <Filter size={20} />
            </button>
          </div>

          {showFilters && (
            <div className="mt-3 flex gap-2 animate-in slide-in-from-top-2 fade-in duration-200">
              <input 
                type="number" 
                placeholder="Min Reward" 
                value={minReward}
                onChange={(e) => setMinReward(e.target.value)}
                className="w-1/2 bg-stone-100/50 text-wood placeholder-wood/40 border border-wood/20 rounded px-3 py-1 outline-none focus:bg-white focus:border-wood font-serif text-sm"
              />
              <input 
                type="number" 
                placeholder="Max Reward" 
                value={maxReward}
                onChange={(e) => setMaxReward(e.target.value)}
                className="w-1/2 bg-stone-100/50 text-wood placeholder-wood/40 border border-wood/20 rounded px-3 py-1 outline-none focus:bg-white focus:border-wood font-serif text-sm"
              />
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredBounties.map(bounty => (
            <BountyCard key={bounty.id} bounty={bounty} onClick={() => navigate(`/detail/${bounty.id}`)} />
          ))}
          
          {filteredBounties.length === 0 && (
            <div className="col-span-full text-center py-20">
              <p className="text-paper font-serif text-2xl font-bold drop-shadow-md opacity-80">
                No captured targets found.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}