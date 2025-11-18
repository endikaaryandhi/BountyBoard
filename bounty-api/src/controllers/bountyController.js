import { supabase } from '../config/supabase.js';

export const getBounties = async (req, res) => {
    const { data, error } = await supabase.from('fugitives').select('*').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
};

export const getBountyById = async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase.from('fugitives').select('*').eq('id', id).single();
    if (error) return res.status(404).json({ error: 'Buronan tidak ditemukan' });
    res.json(data);
};

export const addBounty = async (req, res) => {
    // Validasi Admin Sederhana (Hardcoded untuk simulasi)
    const { admin_code, ...bountyData } = req.body;
    if (admin_code !== 'HUNTER_MASTER') {
        return res.status(403).json({ error: 'Akses Ditolak: Hanya Admin yang boleh menambah buronan.' });
    }

    const { data, error } = await supabase.from('fugitives').insert([bountyData]).select();
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data[0]);
};

export const updateStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // status: 'captured' or 'wanted'
    const { data, error } = await supabase.from('fugitives').update({ status }).eq('id', id).select();
    if (error) return res.status(400).json({ error: error.message });
    res.json(data[0]);
};