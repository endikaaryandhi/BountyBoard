import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BountyCard from '../components/BountyCard';

export default function Captured() {
  const [bounties, setBounties] = useState([]);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios.get(`${API_URL}/api/bounties`) 
      .then(res => setBounties(res.data.filter(b => b.status === 'captured')))
      .catch(err => console.error(err));
  }, [API_URL]);

  return (
    // Background transparan agar ikut index.css
    <div className="p-4 pb-20 min-h-screen bg-transparent"> 
      <h1 className="text-3xl font-bold text-center text-paper mb-6 font-serif uppercase tracking-widest drop-shadow-md border-b-4 border-wood/50 pb-2 inline-block w-full">
        CAPTURED
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {bounties.map(bounty => (
          <BountyCard key={bounty.id} bounty={bounty} onClick={() => navigate(`/detail/${bounty.id}`)} />
        ))}
        {bounties.length === 0 && (
             <div className="col-span-full text-center py-20 opacity-50">
               <p className="text-paper font-serif text-xl">No captured fugitives logs yet.</p>
             </div>
        )}
      </div>
    </div>
  );
}