import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bountyRoutes from './routes/bountyRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/bounties', bountyRoutes);

app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});