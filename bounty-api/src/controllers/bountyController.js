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
    const bountyData = req.body;
    const { data, error } = await supabase.from('fugitives').insert([bountyData]).select();
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data[0]);
};

export const updateStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; 
    
    if (status === 'rejected') {
        const { error } = await supabase.from('fugitives').delete().eq('id', id);
        if (error) return res.status(400).json({ error: error.message });
        return res.json({ message: "Bounty rejected and deleted" });
    }

    const { data, error } = await supabase.from('fugitives').update({ status }).eq('id', id).select();
    if (error) return res.status(400).json({ error: error.message });
    res.json(data[0]);
};

export const updateBounty = async (req, res) => {
    const { id } = req.params;
    const updates = req.body; 

    const { data, error } = await supabase
        .from('fugitives')
        .update(updates)
        .eq('id', id)
        .select();

    if (error) return res.status(400).json({ error: error.message });
    res.json(data[0]);
};

export const deleteBounty = async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase
        .from('fugitives')
        .delete()
        .eq('id', id);

    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: "Bounty deleted successfully" });
};