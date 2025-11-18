import { supabase } from '../config/supabase.js';

export const getBounties = async (req, res) => {
    // Mengambil semua data (termasuk pending), filtering dilakukan di Frontend
    const { data, error } = await supabase
        .from('fugitives')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
};

export const getBountyById = async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase.from('fugitives').select('*').eq('id', id).single();
    if (error) return res.status(404).json({ error: 'Buronan tidak ditemukan' });
    res.json(data);
};

// MODIFIKASI: Hapus cek admin_code
export const addBounty = async (req, res) => {
    const bountyData = req.body;

    // Masukkan data apa adanya (status pending/wanted diatur dari frontend)
    const { data, error } = await supabase.from('fugitives').insert([bountyData]).select();
    
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data[0]);
};

// MODIFIKASI: Logika Reject (Hapus Data)
export const updateStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; 

    // Jika status 'rejected', hapus data dari database
    if (status === 'rejected') {
        const { error } = await supabase.from('fugitives').delete().eq('id', id);
        if (error) return res.status(400).json({ error: error.message });
        return res.json({ message: "Bounty rejected and deleted" });
    }

    // Update status normal (wanted/captured)
    const { data, error } = await supabase.from('fugitives').update({ status }).eq('id', id).select();
    if (error) return res.status(400).json({ error: error.message });
    res.json(data[0]);
};