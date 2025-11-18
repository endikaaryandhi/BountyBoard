import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import { supabase } from '../config/supabase'; 
import { Save, MapPin, Skull, DollarSign, User, Camera, X, Upload } from 'lucide-react';
import Cropper from 'react-easy-crop'; 
import { getCroppedImg } from '../utils/cropImage'; 

export default function EditBounty() {
  const { id } = useParams();
  const { role } = useAuth();
  const navigate = useNavigate();
  
  // Gunakan Env Variable
  const API_URL = import.meta.env.VITE_API_URL;

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', alias: '', description: '', crime: '',
    bounty_amount: '', image_url: '', last_seen: '',
    status: 'wanted'
  });

  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    if (role !== 'admin') {
      alert('Access Denied');
      navigate('/');
      return;
    }

    // Ganti localhost
    axios.get(`${API_URL}/api/bounties/${id}`)
      .then(res => setFormData(res.data))
      .catch(err => console.error(err));
  }, [id, role, navigate, API_URL]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => setImageSrc(reader.result));
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = (_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const processImage = async () => {
    if (!imageSrc) return formData.image_url;

    try {
      setUploading(true);
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const fileName = `bounty-${Date.now()}.jpeg`;

      const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, croppedImageBlob);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
      return publicUrl;
    } catch (error) {
      alert('Gagal mengupload gambar: ' + error.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = formData.image_url;
      if (imageSrc) {
        finalImageUrl = await processImage();
        if (!finalImageUrl) return; 
      }

      const payload = { ...formData, image_url: finalImageUrl };
      
      // Ganti localhost
      await axios.put(`${API_URL}/api/bounties/${id}`, payload);
      
      alert('Bounty Updated Successfully!');
      // Replace history agar Back tidak kembali ke Edit
      navigate(`/detail/${id}`, { replace: true });
    } catch (err) {
      alert(err.response?.data?.error || 'Gagal update data.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full bg-transparent border-b-2 border-wood/50 focus:border-wood px-2 py-2 outline-none placeholder-wood/40 text-wood font-serif transition-colors";

  return (
    <div className="min-h-screen pb-24 pt-6 px-4 font-serif bg-stone-200">
      
      {imageSrc && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
          <div className="relative w-full max-w-md h-80 bg-gray-800 mb-4 border-4 border-paper">
            <Cropper
              image={imageSrc} crop={crop} zoom={zoom} aspect={3 / 4}
              onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom}
            />
          </div>
          <div className="flex gap-4">
            <button onClick={() => setImageSrc(null)} className="bg-red-600 text-white px-4 py-2 rounded font-bold flex items-center gap-2"><X size={18}/> Cancel</button>
            <button 
              onClick={() => processImage().then(url => { if(url) { setFormData({...formData, image_url: url}); setImageSrc(null); } })} 
              disabled={uploading}
              className="bg-green-600 text-white px-4 py-2 rounded font-bold flex items-center gap-2"
            >
              {uploading ? 'Uploading...' : <><Upload size={18}/> Use Photo</>}
            </button>
          </div>
           <div className="mt-4 w-full max-w-xs">
             <input type="range" value={zoom} min={1} max={3} step={0.1} onChange={(e) => setZoom(e.target.value)} className="w-full"/>
          </div>
        </div>
      )}

      <div className="max-w-md mx-auto bg-paper shadow-2xl rounded-sm overflow-hidden relative transform rotate-1">
         <div className="p-6 border-4 border-double border-wood/20 m-2">
          <h2 className="text-3xl font-black text-center text-wood mb-1 tracking-widest uppercase border-b-4 border-wood pb-2">EDIT FILE</h2>
          <p className="text-center text-xs text-wood/70 mb-6 uppercase tracking-widest">Update Fugitive Information</p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col items-center mb-4">
                <div className="w-32 h-40 bg-gray-200 border-4 border-wood mb-2 overflow-hidden relative group">
                    {formData.image_url ? (
                        <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover sepia-[.3]" />
                    ) : (
                        <div className="flex items-center justify-center h-full text-wood/40 bg-stone-300"><User size={40} /></div>
                    )}
                    <label className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors cursor-pointer">
                        <div className="bg-wood text-paper p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"><Camera size={20} /></div>
                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                </div>
            </div>

             <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-xs font-bold text-wood uppercase flex items-center gap-1"><User size={12}/> Name</label>
                <input required name="name" value={formData.name} onChange={handleChange} className={inputStyle} />
              </div>
              <div className="flex-1">
                <label className="text-xs font-bold text-wood uppercase">Alias</label>
                <input name="alias" value={formData.alias} onChange={handleChange} className={inputStyle} />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-wood uppercase flex items-center gap-1"><Skull size={12}/> Crime</label>
              <input required name="crime" value={formData.crime} onChange={handleChange} className={inputStyle} />
            </div>

            <div className="flex gap-4">
              <div className="flex-1 relative">
                <label className="text-xs font-bold text-wood uppercase flex items-center gap-1"><DollarSign size={12}/> Reward</label>
                <input required type="number" name="bounty_amount" value={formData.bounty_amount} onChange={handleChange} className={`${inputStyle} pl-6 font-bold`} />
              </div>
              <div className="flex-1">
                <label className="text-xs font-bold text-wood uppercase flex items-center gap-1"><MapPin size={12}/> Last Seen</label>
                <input required name="last_seen" value={formData.last_seen} onChange={handleChange} className={inputStyle} />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-wood uppercase">Description</label>
              <textarea required name="description" value={formData.description} onChange={handleChange} className="w-full bg-white/30 border-2 border-wood/30 rounded p-2 mt-1 text-sm text-wood focus:border-wood outline-none min-h-[80px]" />
            </div>

            <button disabled={loading || uploading} type="submit" className="w-full bg-wood text-paper font-black py-3 rounded-sm shadow-lg hover:bg-[#4a332a] active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-widest mt-4 disabled:opacity-70">
              {loading ? 'Updating...' : <><Save size={18} /> Save Changes</>}
            </button>
          </form>
         </div>
      </div>
    </div>
  );
}