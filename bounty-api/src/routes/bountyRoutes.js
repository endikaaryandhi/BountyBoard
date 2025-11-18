import express from 'express';
import { 
    getBounties, 
    getBountyById, 
    addBounty, 
    updateStatus, 
    updateBounty, 
    deleteBounty 
} from '../controllers/bountyController.js';

const router = express.Router();

router.get('/', getBounties);
router.get('/:id', getBountyById);
router.post('/', addBounty);
router.put('/:id/status', updateStatus);
router.put('/:id', updateBounty);
router.delete('/:id', deleteBounty);

export default router;