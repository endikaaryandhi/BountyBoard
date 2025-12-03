import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import { useNotification } from '../context/NotificationContext';
import { Edit, Trash2 } from 'lucide-react';
import axios from 'axios';

export default function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useAuth(); 
  const { showNotification } = useNotification();
  const [bounty, setBounty] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL; 
  
  const confidentialImage = "https://placehold.co/400x500/2e2622/F5E6C8?text=CONFIDENTIAL&font=serif";

  useEffect(() => {
    axios.get(`${API_URL}/api/bounties/${id}`)
      .then(res => setBounty(res.data))
      .catch(() => showNotification("Bounty not found", "error"));
  }, [id, API_URL]);

  const updateStatus = (newStatus) => {
    axios.put(`${API_URL}/api/bounties/${id}/status`, { status: newStatus })
      .then(() => {
        if (newStatus === 'captured') {
            showNotification('Target Captured! Good work.', 'success');
            navigate('/captured');
        } else {
            showNotification('Status Revoked! Target is active again.', 'info');
            navigate('/');
        }
      });
  };

  const handleDelete = async () => {
    if(!confirm("WARNING: Are you sure you want to PERMANENTLY DELETE this bounty record?")) return;
    
    try {
        await axios.delete(`${API_URL}/api/bounties/${id}`);
        showNotification('Record Deleted.', 'error');
        navigate('/');
    } catch (err) {
        showNotification("Failed to delete: " + err.message, 'error');
    }
  };

  if (!bounty) return <div className="text-white text-center pt-20">Loading details...</div>;

  return (
    <div className="p-4 min-h-[80vh] bg-transparent flex items-center justify-center">
      <div className="w-full max-w-4xl relative">
        <button onClick={() => navigate(-1)} className="mb-4 text-paper font-bold hover:text-wood transition-colors bg-black/20 px-4 py-2 rounded-full border border-white/10">← Back to Board</button>
        
        <div className="bg-paper p-6 md:p-8 rounded-lg border-4 border-wood shadow-2xl relative flex flex-col md:flex-row gap-8">
          
          {role === 'admin' && (
              <div className="absolute top-4 right-4 flex gap-2 z-10">
                  <button onClick={() => navigate(`/edit/${id}`)} className="p-2 bg-blue-700 text-white rounded shadow hover:bg-blue-800 border border-wood/50"><Edit size={18}/></button>
                  <button onClick={handleDelete} className="p-2 bg-red-800 text-white rounded shadow hover:bg-red-900 border border-wood/50"><Trash2 size={18}/></button>
              </div>
          )}

          <div className="w-full md:w-1/2 shrink-0">
            <div className="relative border-4 border-wood shadow-lg bg-gray-900">
                <img 
                    src={bounty.image_url || confidentialImage} 
                    className={`w-full aspect-[3/4] object-cover ${bounty.status === 'captured' ? 'grayscale' : ''} sepia-[.3]`}
                />
                {bounty.status === 'captured' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
                    <div className="border-[6px] border-stamp text-stamp text-5xl md:text-6xl font-black px-4 py-2 -rotate-12 opacity-90 rounded-lg uppercase tracking-widest shadow-2xl mix-blend-hard-light">
                        CAPTURED
                    </div>
                    </div>
                )}
            </div>
          </div>
          
          <div className="w-full md:w-1/2 flex flex-col justify-between">
            <div>
                <h1 className="text-4xl md:text-5xl font-black text-wood text-left uppercase tracking-widest border-b-4 border-wood pb-2 mb-6 leading-none">{bounty.name}</h1>
                
                <div className="space-y-4 text-wood font-serif text-lg">
                    <div className="flex justify-between border-b border-wood/20 pb-1"><span className="font-bold opacity-70">ALIAS</span><span className="font-bold">{bounty.alias || '-'}</span></div>
                    <div className="flex justify-between border-b border-wood/20 pb-1"><span className="font-bold opacity-70">CRIME</span><span className="text-red-700 font-black uppercase text-right">{bounty.crime}</span></div>
                    <div className="flex justify-between border-b border-wood/20 pb-1"><span className="font-bold opacity-70">REWARD</span><span className="font-black text-2xl">$ {parseInt(bounty.bounty_amount).toLocaleString()}</span></div>
                    <div className="flex justify-between border-b border-wood/20 pb-1"><span className="font-bold opacity-70">LAST SEEN</span><span className="text-right">{bounty.last_seen}</span></div>
                    <div className="pt-4">
                        <p className="text-sm opacity-70 font-bold mb-2 uppercase tracking-wide">Official Description:</p>
                        <p className="bg-stone-200/50 p-4 rounded border border-wood/10 italic text-base leading-relaxed">{bounty.description}</p>
                    </div>
                </div>
            </div>
            
            <div className="mt-8">
                {bounty.status === 'wanted' && role === 'admin' && (
                    <button 
                    onClick={() => updateStatus('captured')}
                    className="w-full bg-red-700 text-white font-bold py-4 rounded border-2 border-black shadow-lg active:translate-y-1 uppercase tracking-widest hover:bg-red-800 transition-colors text-xl"
                    >
                    MARK AS CAPTURED
                    </button>
                )}

                {bounty.status === 'wanted' && role !== 'admin' && (
                    <div className="text-center text-sm font-bold text-red-800 uppercase tracking-widest border-2 border-dotted border-red-800/30 p-4 rounded bg-red-50">
                    Contact Guild Master to Claim Reward
                    </div>
                )}

                {bounty.status === 'captured' && role === 'admin' && (
                    <button onClick={() => updateStatus('wanted')} className="w-full bg-wood text-paper font-bold py-4 rounded border-2 border-black shadow-lg active:translate-y-1 uppercase tracking-widest hover:bg-[#4a332a]">REVOKE CAPTURE</button>
                )}
                
                {bounty.status === 'captured' && role !== 'admin' && (
                    <div className="bg-stone-800 text-white text-center py-4 font-bold uppercase border-4 border-double border-red-600 opacity-90 shadow-xl tracking-[0.5em] text-xl">
                    CASE CLOSED
                    </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}