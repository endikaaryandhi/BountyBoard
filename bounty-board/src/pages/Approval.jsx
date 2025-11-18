import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BountyCard from '../components/BountyCard';

export default function Approval() {
  const [pendingBounties, setPendingBounties] = useState([]);
  const { role } = useAuth();
  const navigate = useNavigate();

  // Proteksi: Hanya Admin yang boleh masuk
  useEffect(() => {
    if (role !== 'admin') {
      // Jika bukan admin, tendang ke home
      navigate('/');
    }
    fetchPending();
  }, [role, navigate]);

  const fetchPending = () => {
    axios.get('http://localhost:3000/api/bounties')
      .then(res => {
        // Filter hanya yang statusnya 'pending'
        setPendingBounties(res.data.filter(b => b.status === 'pending'));
      })
      .catch(err => console.error(err));
  };

  const handleApprove = async (id) => {
    if(!confirm("Approve this bounty for Public List?")) return;
    try {
      await axios.put(`http://localhost:3000/api/bounties/${id}/status`, { status: 'wanted' });
      alert("Bounty Approved! Moved to Wanted List.");
      fetchPending(); // Refresh list
    } catch (err) {
      alert("Failed to approve.");
    }
  };

  const handleReject = async (id) => {
    if(!confirm("Reject and Delete this request permanently?")) return;
    try {
      await axios.put(`http://localhost:3000/api/bounties/${id}/status`, { status: 'rejected' });
      alert("Bounty Rejected and Deleted.");
      fetchPending(); // Refresh list
    } catch (err) {
      alert("Failed to reject.");
    }
  };

  return (
    <div className="min-h-screen bg-[#2e2622] pb-20 pt-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-paper text-center mb-2 uppercase tracking-widest border-b-4 border-wood pb-4 inline-block w-full">
          Guild Approval Desk
        </h1>
        <p className="text-center text-paper/60 mb-8 italic">Reviewing pending contracts from Hunters</p>

        {pendingBounties.length === 0 ? (
          <div className="text-center py-20 opacity-50 flex flex-col items-center gap-4">
            <CheckCircle size={64} className="text-green-600" />
            <p className="text-paper font-serif text-xl">All caught up! No pending requests.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pendingBounties.map(bounty => (
              <div key={bounty.id} className="relative group bg-black/20 p-2 rounded-lg border border-white/10">
                {/* Tombol Aksi */}
                <div className="absolute -top-4 -right-4 flex flex-col gap-2 z-50">
                   <button 
                     onClick={() => handleApprove(bounty.id)}
                     className="bg-green-600 text-white p-3 rounded-full shadow-xl hover:scale-110 transition-transform border-2 border-white cursor-pointer" 
                     title="Approve"
                   >
                      <CheckCircle size={24} />
                   </button>
                   <button 
                     onClick={() => handleReject(bounty.id)}
                     className="bg-red-600 text-white p-3 rounded-full shadow-xl hover:scale-110 transition-transform border-2 border-white cursor-pointer" 
                     title="Reject"
                   >
                      <XCircle size={24} />
                   </button>
                </div>

                {/* Kartu Buronan (Non-clickable) */}
                <div className="pointer-events-none opacity-90">
                    <BountyCard bounty={bounty} onClick={() => {}} />
                </div>
                
                <div className="mt-2 text-center">
                   <span className="bg-yellow-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center justify-center gap-1 w-max mx-auto">
                     <AlertTriangle size={12} /> PENDING REVIEW
                   </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}