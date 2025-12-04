import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Search, CheckCircle, XCircle, Filter, ArrowDown, ArrowUp, ChevronLeft, ChevronRight } from 'lucide-react';
import BountyCard from '../components/BountyCard';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const API_URL = import.meta.env.VITE_API_URL;

export default function Home() {
  const { bounties: allBounties, refreshData } = useData();
  const [search, setSearch] = useState('');
  const [view, setView] = useState('wanted'); 
  const [minReward, setMinReward] = useState('');
  const [maxReward, setMaxReward] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const navigate = useNavigate();
  const { role } = useAuth();

  const bounties = allBounties.filter(b => b.status === 'wanted');
  const pendingBounties = allBounties.filter(b => b.status === 'pending');

  useEffect(() => {
    setCurrentPage(1);
  }, [search, view, minReward, maxReward, sortOrder]);

  const handleApprove = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Approve this bounty?')) return;
    try {
      await axios.put(`${API_URL}/api/bounties/${id}/status`, { status: 'wanted' });
      refreshData();
    } catch (err) {
      alert('Failed to approve');
    }
  };

  const handleReject = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Reject and delete this bounty?')) return;
    try {
      await axios.delete(`${API_URL}/api/bounties/${id}`);
      refreshData();
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
  }).sort((a, b) => {
    const amountA = parseFloat(a.bounty_amount);
    const amountB = parseFloat(b.bounty_amount);
    return sortOrder === 'asc' ? amountA - amountB : amountB - amountA;
  });

  const totalPages = Math.ceil(filteredBounties.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBounties = filteredBounties.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="p-2 rounded border border-wood/20 hover:bg-wood/10 transition-colors text-wood/60"
              title={sortOrder === 'desc' ? "Termahal ke Termurah" : "Termurah ke Termahal"}
            >
              {sortOrder === 'desc' ? <ArrowDown size={20} /> : <ArrowUp size={20} />}
            </button>

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentBounties.map(bounty => (
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

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12 mb-8">
            <button 
              onClick={() => paginate(currentPage - 1)} 
              disabled={currentPage === 1}
              className="bg-paper text-wood p-2 rounded shadow border-2 border-wood hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            
            <div className="bg-black/40 text-paper px-4 py-2 rounded border border-white/20 font-bold font-serif min-w-[100px] text-center backdrop-blur-sm">
              Page {currentPage} / {totalPages}
            </div>

            <button 
              onClick={() => paginate(currentPage + 1)} 
              disabled={currentPage === totalPages}
              className="bg-paper text-wood p-2 rounded shadow border-2 border-wood hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}