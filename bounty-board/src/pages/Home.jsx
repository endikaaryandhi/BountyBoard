import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import BountyCard from '../components/BountyCard';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { useData } from '../context/DataContext';

export default function Home() {
  const { bounties: globalBounties, refreshData } = useData();
  const [search, setSearch] = useState('');
  const [view, setView] = useState('wanted');
  const navigate = useNavigate();
  const { role } = useAuth();
  const { showNotification } = useNotification();
  const API_URL = import.meta.env.VITE_API_URL;

  const bountiesList = globalBounties.filter(b => b.status === 'wanted');
  const pendingList = globalBounties.filter(b => b.status === 'pending');

  const handleApprove = async (id, e) => {
    e.stopPropagation();
    if(!confirm("Approve this bounty to Public List?")) return;
    
    try {
        await axios.put(`${API_URL}/api/bounties/${id}/status`, { status: 'wanted' });
        showNotification('Bounty Approved!', 'success');
        refreshData();
    } catch (err) {
        showNotification("Error approving", 'error');
    }
  };

  const handleReject = async (id, e) => {
    e.stopPropagation();
    if(!confirm("Reject and Delete this request?")) return;

    try {
        await axios.put(`${API_URL}/api/bounties/${id}/status`, { status: 'rejected' });
        showNotification('Bounty Rejected', 'info');
        refreshData();
    } catch (err) {
        showNotification("Error rejecting", 'error');
    }
  };

  const listToShow = view === 'wanted' ? bountiesList : pendingList;

  const filteredBounties = listToShow.filter(b => 
    b.name.toLowerCase().includes(search.toLowerCase()) || 
    b.crime.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-transparent pb-12">
      <div className="max-w-md mx-auto mt-8 px-4 mb-8 relative z-10">
        <div className="bg-paper border-2 border-wood/30 shadow-lg p-4 transform -rotate-1 rounded-sm relative">
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

        {role === 'admin' && (
          <div className="flex justify-center gap-2 mt-4">
            <button 
              onClick={() => setView('wanted')}
              className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider border-2 transition-all ${view === 'wanted' ? 'bg-wood text-paper border-wood' : 'bg-black/40 text-white/70 border-transparent hover:bg-black/60'}`}
            >
              Public List
            </button>
            <button 
              onClick={() => setView('pending')}
              className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider border-2 transition-all flex items-center gap-2 ${view === 'pending' ? 'bg-orange-700 text-white border-orange-900' : 'bg-black/40 text-white/70 border-transparent hover:bg-black/60'}`}
            >
              Pending Approval 
              {pendingList.length > 0 && (
                <span className="bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                  {pendingList.length}
                </span>
              )}
            </button>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBounties.map(bounty => (
            <div key={bounty.id} className="relative group">
               <BountyCard bounty={bounty} onClick={() => navigate(`/detail/${bounty.id}`)} />
               
               {view === 'pending' && role === 'admin' && (
                 <>
                    <div className="absolute inset-0 bg-black/60 z-30 rounded-sm flex items-center justify-center gap-4 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button onClick={(e) => handleApprove(bounty.id, e)} className="bg-green-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 hover:bg-green-500 transition-all"><CheckCircle size={40} /></button>
                        <button onClick={(e) => handleReject(bounty.id, e)} className="bg-red-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 hover:bg-red-500 transition-all"><XCircle size={40} /></button>
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