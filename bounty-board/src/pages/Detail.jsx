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
    <div className="p-4 pb-20 min-h-screen bg-transparent flex items-center justify-center">
      <div className="w-full max-w-md relative">
        <button onClick={() => navigate(-1)} className="mb-4 text-paper font-bold hover:text-wood transition-colors">← Back</button>
        
        <div className="bg-paper p-6 rounded-lg border-4 border-wood shadow-2xl relative">
          
          {role === 'admin' && (
              <div className="absolute top-4 right-4 flex gap-2 z-10">
                  <button onClick={() => navigate(`/edit/${id}`)} className="p-2 bg-blue-700 text-white rounded shadow hover:bg-blue-800 border border-wood/50"><Edit size={18}/></button>
                  <button onClick={handleDelete} className="p-2 bg-red-800 text-white rounded shadow hover:bg-red-900 border border-wood/50"><Trash2 size={18}/></button>
              </div>
          )}

          <img 
            src={bounty.image_url || confidentialImage} 
            className={`w-full h-96 object-cover rounded border-2 border-wood mb-4 ${bounty.status === 'captured' ? 'grayscale' : ''} sepia-[.3]`}
          />
          
          <h1 className="text-3xl font-black text-wood text-center uppercase tracking-widest border-b-4 border-wood pb-2 mb-4">{bounty.name}</h1>
          
          <div className="space-y-3 text-wood font-serif">
            <div className="flex justify-between border-b border-wood/20 pb-1"><span className="font-bold opacity-70">ALIAS</span><span className="font-bold">{bounty.alias || '-'}</span></div>
            <div className="flex justify-between border-b border-wood/20 pb-1"><span className="font-bold opacity-70">CRIME</span><span className="text-red-700 font-black uppercase">{bounty.crime}</span></div>
            <div className="flex justify-between border-b border-wood/20 pb-1"><span className="font-bold opacity-70">REWARD</span><span className="font-black text-xl">$ {parseInt(bounty.bounty_amount).toLocaleString()}</span></div>
            <div className="flex justify-between border-b border-wood/20 pb-1"><span className="font-bold opacity-70">LAST SEEN</span><span>{bounty.last_seen}</span></div>
            <div className="pt-2"><p className="text-sm opacity-70 font-bold mb-1">DESCRIPTION:</p><p className="bg-stone-200/50 p-2 rounded border border-wood/10 italic text-sm">{bounty.description}</p></div>
          </div>
          
          {bounty.status === 'wanted' && role === 'admin' && (
            <button 
              onClick={() => updateStatus('captured')}
              className="w-full mt-8 bg-red-700 text-white font-bold py-4 rounded border-2 border-black shadow-lg active:translate-y-1 uppercase tracking-widest hover:bg-red-800 transition-colors"
            >
              MARK AS CAPTURED
            </button>
          )}

          {bounty.status === 'wanted' && role !== 'admin' && (
             <div className="mt-6 text-center text-xs font-bold text-red-800 uppercase tracking-widest border-t-2 border-dotted border-red-800/30 pt-2">
               Contact Guild Master to Claim Reward
             </div>
          )}

          {bounty.status === 'captured' && role === 'admin' && (
             <button onClick={() => updateStatus('wanted')} className="w-full mt-8 bg-wood text-paper font-bold py-4 rounded border-2 border-black shadow-lg active:translate-y-1 uppercase tracking-widest hover:bg-[#4a332a]">REVOKE CAPTURE</button>
          )}
          
          {bounty.status === 'captured' && role !== 'admin' && (
             <div className="mt-8 bg-stone-800 text-white text-center py-4 font-bold uppercase border-4 border-double border-red-600 -rotate-2 opacity-90 shadow-xl">
               CASE CLOSED
             </div>
          )}
        </div>
      </div>
    </div>
  );
}