import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Search, CheckCircle, XCircle, Filter } from 'lucide-react';
import BountyCard from '../components/BountyCard';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

export default function Home() {
  const [bounties, setBounties] = useState([]);
  const [pendingBounties, setPendingBounties] = useState([]);
  const [search, setSearch] = useState('');
  const [view, setView] = useState('wanted'); 
  const [minReward, setMinReward] = useState('');
  const [maxReward, setMaxReward] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const { role } = useAuth();

  useEffect(() => {
    fetchBounties();
  }, []);

  const fetchBounties = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/bounties`);
      const allBounties = res.data;
      setBounties(allBounties.filter(b => b.status === 'wanted'));
      setPendingBounties(allBounties.filter(b => b.status === 'pending'));
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Approve this bounty?')) return;
    try {
      await axios.put(`${API_URL}/api/bounties/${id}/status`, { status: 'wanted' });
      fetchBounties();
    } catch (err) {
      alert('Failed to approve');
    }
  };

  const handleReject = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Reject and delete this bounty?')) return;
    try {
      await axios.delete(`${API_URL}/api/bounties/${id}`);
      fetchBounties();
    } catch (err) {
      alert('Failed to reject');
    }
  };

  const targetList = view === 'wanted' ? bounties : pendingBounties;

  const filteredBounties = targetList.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase()) || 
                          b.crime?.toLowerCase().includes(search.toLowerCase());
    
    const amount = parseFloat(b.bounty_amount);
    const matchesMin = minReward === '' || amount >= parseFloat(minReward);
    const matchesMax = maxReward === '' || amount <= parseFloat(maxReward);

    return matchesSearch && matchesMin && matchesMax;
  });

  return (
    <div className="min-h-screen bg-transparent">
      <div className="w-full max-w-4xl mx-auto mt-4 px-4 mb-8 relative z-10 flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="bg-paper border-2 border-wood/30 shadow-lg p-4 transform md:-rotate-1 rounded-sm relative w-full md:flex-1 transition-all duration-300">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gray-800 border border-gray-500 shadow"></div>
          <h2 className="text-center text-wood font-serif font-bold uppercase tracking-widest mb-2 border-b border-wood/20 pb-1">
            Find Target
          </h2>
          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <input 
                type="text"
                placeholder="Search name or crime..."
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

        {role === 'admin' && (
          <div className="flex md:flex-col justify-center gap-2 bg-black/20 p-2 rounded-lg border border-white/10 w-full md:w-auto">
            <button 
              onClick={() => setView('wanted')}
              className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider border-2 transition-all w-full ${view === 'wanted' ? 'bg-wood text-paper border-wood' : 'bg-transparent text-white/70 border-transparent hover:bg-black/40'}`}
            >
              Public List
            </button>
            <button 
              onClick={() => setView('pending')}
              className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider border-2 transition-all flex items-center justify-center gap-2 w-full ${view === 'pending' ? 'bg-orange-700 text-white border-orange-900' : 'bg-transparent text-white/70 border-transparent hover:bg-black/40'}`}
            >
              Pending 
              {pendingBounties.length > 0 && (
                <span className="bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full shadow-md">
                  {pendingBounties.length}
                </span>
              )}
            </button>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto p-4 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredBounties.map(bounty => (
            <div key={bounty.id} className="relative group">
               <BountyCard bounty={bounty} onClick={() => navigate(`/detail/${bounty.id}`)} />
               
               {view === 'pending' && role === 'admin' && (
                 <>
                    <div className="absolute inset-0 bg-black/60 z-30 rounded-sm flex items-center justify-center gap-4 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button onClick={(e) => handleApprove(bounty.id, e)} className="bg-green-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 hover:bg-green-500 transition-all cursor-pointer" title="Approve">
                            <CheckCircle size={40} />
                        </button>
                        <button onClick={(e) => handleReject(bounty.id, e)} className="bg-red-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 hover:bg-red-500 transition-all cursor-pointer" title="Reject">
                            <XCircle size={40} />
                        </button>
                    </div>
                    <div className="absolute top-2 right-2 z-20 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded shadow uppercase">
                        Waiting Approval
                    </div>
                 </>
               )}
            </div>
          ))}
          
          {filteredBounties.length === 0 && (
            <div className="col-span-full text-center py-20">
              <p className="text-paper font-serif text-2xl font-bold drop-shadow-md opacity-80">
                {view === 'wanted' ? 'No active warrants found.' : 'No pending requests.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}