import express from 'express';
import { 
    getBounties, 
    getBountyById, 
    addBounty, 
    updateStatus, 
    updateBounty, // Import baru
    deleteBounty  // Import baru
} from '../controllers/bountyController.js';

const router = express.Router();

router.get('/', getBounties);
router.get('/:id', getBountyById);
router.post('/', addBounty);
router.put('/:id/status', updateStatus);

// --- RUTE BARU ---
router.put('/:id', updateBounty);    // Untuk Edit Data
router.delete('/:id', deleteBounty); // Untuk Hapus Data

export default router;