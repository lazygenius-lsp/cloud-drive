import express from 'express';
import cors from 'cors';
import fs from 'fs';
import fileRoutes from './routes/files.js';
import { PORT, ROOT_DIR } from './config.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 确保上传目录存在
if (!fs.existsSync(ROOT_DIR)) fs.mkdirSync(ROOT_DIR, { recursive: true });

app.use('/api/files', fileRoutes);

app.listen(PORT, () => {
  console.log(`Backend listening at http://localhost:${PORT}`);
});