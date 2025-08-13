import express from 'express';
import { getList, searchFiles, makeFolder, remove, rename, uploadHandlerFactory } from '../controllers/filesController.js';

const router = express.Router();

// 列表
router.get('/', getList);
// 搜索
router.get('/search', searchFiles);
// 新建文件夹
router.post('/folder', makeFolder);
// 上传（字段 name=file）
const uploader = uploadHandlerFactory();
router.post('/upload', uploader.single('file'), (req, res) => {
  res.json({ success: true, file: { originalname: req.file.originalname, filename: req.file.filename } });
});
// 删除 (路径作为 wildcard)
router.delete('/delete/*', remove);
// 重命名 (路径作为 wildcard)
router.put('/rename/*', rename);

export default router;