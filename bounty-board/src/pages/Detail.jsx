import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bounty, setBounty] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3000/api/bounties/${id}`)
      .then(res => setBounty(res.data));
  }, [id]);

  const handleCapture = () => {
    axios.put(`http://localhost:3000/api/bounties/${id}/status`, { status: 'captured' })
      .then(() => {
        alert("Target Captured! Good work, Hunter.");
        navigate('/captured');
      });
  };

  if (!bounty) return <div>Loading...</div>;

  return (
    <div className="p-4 pb-20 min-h-screen bg-stone-100">
      <button onClick={() => navigate(-1)} className="mb-4 text-wood font-bold">← Back</button>
      <div className="bg-paper p-6 rounded-lg border-4 border-wood shadow-xl">
        <img src={bounty.image_url} className="w-full h-64 object-cover rounded border-2 border-wood mb-4"/>
        <h1 className="text-4xl font-serif font-bold text-center text-wood uppercase mb-2">{bounty.name}</h1>
        <p className="text-center text-red-800 font-bold text-xl mb-4">${parseInt(bounty.bounty_amount).toLocaleString()}</p>
        
        <div className="space-y-2 text-wood">
          <p><strong>Alias:</strong> {bounty.alias}</p>
          <p><strong>Crime:</strong> {bounty.crime}</p>
          <p><strong>Last Seen:</strong> {bounty.last_seen}</p>
          <p><strong>Description:</strong> {bounty.description}</p>
        </div>

        {bounty.status === 'wanted' && (
          <button 
            onClick={handleCapture}
            className="w-full mt-8 bg-red-700 text-white font-bold py-4 rounded border-2 border-black shadow-lg active:translate-y-1"
          >
            MARK AS CAPTURED
          </button>
        )}
      </div>
    </div>
  );
}