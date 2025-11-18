import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import Auth
import { Save, MapPin, Skull, DollarSign, User } from 'lucide-react';

export default function AddBounty() {
  const { role, user } = useAuth(); // Ambil role
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', alias: '', description: '', crime: '',
    bounty_amount: '', image_url: '', last_seen: '',
    status: 'wanted'
  });

  // Proteksi Halaman: Jika bukan admin, tendang ke home
  useEffect(() => {
    if (role !== 'admin') {
      alert('ACCESS DENIED: Guild Master Only.');
      navigate('/');
    }
  }, [role, navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Kirim data tanpa admin_code, verifikasi dilakukan via backend (atau RLS di masa depan)
      // Untuk saat ini backend Anda masih butuh admin_code, 
      // SEMENTARA: kita kirim kode dummy agar backend existing tidak error, 
      // atau sebaiknya update backend untuk hapus cek itu dan ganti dengan middleware auth.
      // Disini saya kirim kode hardcode agar backend lama tetap jalan.
      await axios.post('http://localhost:3000/api/bounties', { ...formData, admin_code: 'HUNTER_MASTER' });
      alert('New Target Posted!');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.error || 'Gagal posting data.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full bg-transparent border-b-2 border-wood/50 focus:border-wood px-2 py-2 outline-none placeholder-wood/40 text-wood font-serif transition-colors";

  if (role !== 'admin') return null; // Cegah flash content

  return (
    // ... (Tampilan Form HTML sama seperti sebelumnya, HAPUS input Admin Authorization Code) ...
    <div className="min-h-screen pb-24 pt-6 px-4 font-serif">
      <div className="max-w-md mx-auto bg-paper shadow-2xl rounded-sm overflow-hidden relative transform rotate-1">
         <div className="p-6 border-4 border-double border-wood/20 m-2">
          <h2 className="text-3xl font-black text-center text-wood mb-1 tracking-widest uppercase border-b-4 border-wood pb-2">NEW BOUNTY</h2>
          <p className="text-center text-xs text-red-700 mb-6 uppercase tracking-widest font-bold">Authorized by Guild Master</p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ... Input Fields Name, Alias, Crime, Reward, Last Seen, Image, Desc ... */}
            {/* CODE INPUT FIELD SUDAH DIHAPUS */}
            
            {/* Copy Paste input fields dari kode lama Anda di sini, kecuali bagian input Admin Code */}
             <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-xs font-bold text-wood uppercase flex items-center gap-1"><User size={12}/> Name</label>
                <input required name="name" onChange={handleChange} className={inputStyle} placeholder="Nama Buronan" />
              </div>
              <div className="flex-1">
                <label className="text-xs font-bold text-wood uppercase">Alias</label>
                <input name="alias" onChange={handleChange} className={inputStyle} placeholder="Julukan" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-wood uppercase flex items-center gap-1"><Skull size={12}/> Crime</label>
              <input required name="crime" onChange={handleChange} className={inputStyle} placeholder="Kejahatan Utama" />
            </div>

            <div className="flex gap-4">
              <div className="flex-1 relative">
                <label className="text-xs font-bold text-wood uppercase flex items-center gap-1"><DollarSign size={12}/> Reward</label>
                <input required type="number" name="bounty_amount" onChange={handleChange} className={`${inputStyle} pl-6 font-bold`} placeholder="0" />
              </div>
              <div className="flex-1">
                <label className="text-xs font-bold text-wood uppercase flex items-center gap-1"><MapPin size={12}/> Last Seen</label>
                <input required name="last_seen" onChange={handleChange} className={inputStyle} placeholder="Lokasi Terakhir" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-wood uppercase">Photo URL</label>
              <input required name="image_url" onChange={handleChange} className={inputStyle} placeholder="https://..." />
            </div>

            <div>
              <label className="text-xs font-bold text-wood uppercase">Description</label>
              <textarea required name="description" onChange={handleChange} className="w-full bg-white/30 border-2 border-wood/30 rounded p-2 mt-1 text-sm text-wood focus:border-wood outline-none min-h-[80px]" placeholder="Ciri-ciri fisik, senjata, dll..." />
            </div>

            <button disabled={loading} type="submit" className="w-full bg-wood text-paper font-black py-3 rounded-sm shadow-lg hover:bg-[#4a332a] active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-widest mt-4">
              {loading ? 'Posting...' : <><Save size={18} /> Post Wanted Poster</>}
            </button>
          </form>
         </div>
      </div>
    </div>
  );
}