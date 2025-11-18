import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BountyCard from '../components/BountyCard';

export default function Captured() {
  const [bounties, setBounties] = useState([]);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL; // Ambil URL Backend

  useEffect(() => {
    // Ganti localhost
    axios.get(`${API_URL}/api/bounties`) 
      .then(res => setBounties(res.data.filter(b => b.status === 'captured')))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-4 pb-20 min-h-screen bg-stone-100">
      <h1 className="text-3xl font-bold text-center text-wood mb-6 font-serif">WANTED DEAD OR ALIVE</h1>
      <div className="grid grid-cols-1 gap-4">
        {bounties.map(bounty => (
          <BountyCard key={bounty.id} bounty={bounty} onClick={() => navigate(`/detail/${bounty.id}`)} />
        ))}
      </div>
    </div>
  );
}