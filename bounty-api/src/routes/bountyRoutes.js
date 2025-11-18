import express from 'express';
import { getBounties, getBountyById, addBounty, updateStatus } from '../controllers/bountyController.js';

const router = express.Router();

router.get('/', getBounties);
router.get('/:id', getBountyById);
router.post('/', addBounty);
router.put('/:id/status', updateStatus);

export default router;