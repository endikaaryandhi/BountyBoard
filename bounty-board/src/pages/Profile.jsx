import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext'; 
import { useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/cropImage';
import { LogOut, Camera, Save, X } from 'lucide-react';

export default function Profile() {
  const { user, role, signOut } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({ username: '', avatar_url: '' });
  const [isEditing, setIsEditing] = useState(false);
  
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    if (user) getProfile();
  }, [user]);

  const getProfile = async () => {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (data) setProfile(data);
  };

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

  const uploadAvatar = async () => {
    try {
      setLoading(true);
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const fileName = `${user.id}-${Date.now()}.jpeg`;

      const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, croppedImageBlob);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
      
      await updateProfileData(publicUrl);
      setImageSrc(null);
    } catch (error) {
      showNotification('Error uploading avatar: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateProfileData = async (avatarUrl = profile.avatar_url) => {
    setLoading(true);
    const { error } = await supabase.from('profiles').update({
      username: profile.username,
      avatar_url: avatarUrl,
      updated_at: new Date(),
    }).eq('id', user.id);

    if (error) {
        showNotification(error.message, 'error');
    } else {
        showNotification("Hunter Identity Updated Successfully!", 'success');
        setIsEditing(false);
        getProfile();
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    try {
        await signOut(); 
        navigate('/login'); 
    } catch (error) {
        console.error("Logout error:", error);
        navigate('/login'); 
    }
  };

  if (!user) return <div className="text-center text-white pt-20">Please Login</div>;

  return (
    <div className="p-4 pb-20 min-h-screen flex flex-col items-center pt-10">
      
      {imageSrc && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
          <div className="relative w-full max-w-md h-80 bg-gray-800 mb-4 border-4 border-paper">
            <Cropper
              image={imageSrc} crop={crop} zoom={zoom} aspect={1}
              onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom}
            />
          </div>
          <div className="flex gap-4">
            <button onClick={() => setImageSrc(null)} className="bg-red-600 text-white px-4 py-2 rounded font-bold">Cancel</button>
            <button onClick={uploadAvatar} className="bg-green-600 text-white px-4 py-2 rounded font-bold">{loading ? 'Saving...' : 'Crop & Save'}</button>
          </div>
          <div className="mt-4 w-full max-w-xs">
             <input type="range" value={zoom} min={1} max={3} step={0.1} onChange={(e) => setZoom(e.target.value)} className="w-full"/>
          </div>
        </div>
      )}

      <div className="bg-paper p-6 rounded-lg shadow-2xl border-4 border-wood w-full max-w-sm text-center relative">
        <div className="relative inline-block group">
          <div className="w-32 h-32 bg-wood rounded-full mb-4 overflow-hidden border-4 border-stone-800 mx-auto shadow-inner">
             <img src={profile.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${profile.username}`} alt="Avatar" className="w-full h-full object-cover"/>
          </div>
          {isEditing && (
            <label className="absolute bottom-4 right-0 bg-wood text-paper p-2 rounded-full cursor-pointer hover:bg-[#4a332a] border-2 border-paper shadow-lg">
              <Camera size={18} />
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          )}
        </div>

        {isEditing ? (
          <div className="mb-4">
            <label className="text-xs font-bold text-wood/70 uppercase block mb-1">Codename</label>
            <input value={profile.username} onChange={(e) => setProfile({...profile, username: e.target.value})} className="w-full bg-white/50 border-b-2 border-wood text-center text-xl font-bold text-wood outline-none py-1"/>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-wood font-serif uppercase tracking-wider">{profile.username}</h2>
            <p className={`text-sm font-bold uppercase tracking-widest mb-6 ${role === 'admin' ? 'text-red-700' : 'text-gray-600'}`}>
              {role === 'admin' ? 'Guild Master (Admin)' : 'Licensed Hunter'}
            </p>
          </>
        )}

        <div className="flex gap-3 justify-center mb-6">
           {isEditing ? (
             <>
                <button onClick={() => updateProfileData()} disabled={loading} className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded font-bold shadow-md hover:bg-green-800"><Save size={16}/> Save</button>
                <button onClick={() => setIsEditing(false)} className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded font-bold shadow-md hover:bg-gray-600"><X size={16}/> Cancel</button>
             </>
           ) : (
             <button onClick={() => setIsEditing(true)} className="bg-wood text-paper px-6 py-2 rounded-sm font-bold uppercase tracking-wider shadow hover:bg-[#4a332a]">Edit Identity</button>
           )}
        </div>

        <div className="border-t-2 border-wood/20 pt-4">
          <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full text-red-800 font-bold hover:bg-red-100 p-2 rounded transition-colors">
            <LogOut size={18} /> Resign (Logout)
          </button>
        </div>
      </div>

      <div className="mt-8 bg-paper/90 p-4 rounded shadow border border-wood/30 max-w-sm w-full text-center">
         <p className="text-xs text-wood uppercase tracking-widest">BountyBoard v2.0 System</p>
      </div>
    </div>
  );
}