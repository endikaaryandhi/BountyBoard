import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import Auth
import axios from 'axios';

export default function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useAuth(); // Ambil role
  const [bounty, setBounty] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3000/api/bounties/${id}`)
      .then(res => setBounty(res.data));
  }, [id]);

  const updateStatus = (newStatus) => {
    axios.put(`http://localhost:3000/api/bounties/${id}/status`, { status: newStatus })
      .then(() => {
        alert(newStatus === 'captured' ? "Target Captured!" : "Target Marked as WANTED again!");
        navigate(newStatus === 'captured' ? '/captured' : '/');
      });
  };

  if (!bounty) return <div>Loading...</div>;

  return (
    <div className="p-4 pb-20 min-h-screen">
      <button onClick={() => navigate(-1)} className="mb-4 text-paper font-bold">← Back</button>
      <div className="bg-paper p-6 rounded-lg border-4 border-wood shadow-xl max-w-md mx-auto">
        {/* ... (Tampilan gambar dan info sama) ... */}
        <img src={bounty.image_url} className={`w-full h-64 object-cover rounded border-2 border-wood mb-4 ${bounty.status === 'captured' ? 'grayscale' : ''}`}/>
        
        {/* Logika Tombol */}
        {bounty.status === 'wanted' && (
          <button 
            onClick={() => updateStatus('captured')}
            className="w-full mt-8 bg-red-700 text-white font-bold py-4 rounded border-2 border-black shadow-lg active:translate-y-1 uppercase tracking-widest"
          >
            MARK AS CAPTURED
          </button>
        )}

        {/* FITUR ADMIN: Batalkan Capture */}
        {bounty.status === 'captured' && role === 'admin' && (
           <button 
            onClick={() => updateStatus('wanted')}
            className="w-full mt-8 bg-wood text-paper font-bold py-4 rounded border-2 border-black shadow-lg active:translate-y-1 uppercase tracking-widest"
          >
            REVOKE CAPTURE (Mark Wanted)
          </button>
        )}
        
        {/* Tampilan Biasa untuk Hunter jika sudah Captured */}
        {bounty.status === 'captured' && role !== 'admin' && (
           <div className="mt-8 bg-stone-800 text-white text-center py-4 font-bold uppercase border-4 border-double border-red-600 -rotate-2 opacity-90">
             CASE CLOSED
           </div>
        )}

      </div>
    </div>
  );
}