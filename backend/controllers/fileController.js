import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { ROOT_DIR } from '../config.js';
import { listDirectory, createFolder, deleteEntry, renameEntry, resolveSafePath, ensureDir } from '../utils/fileUtils.js';

export const getList = (req, res) => {
  try {
    const relPath = req.query.path || '';
    const files = listDirectory(ROOT_DIR, relPath);
    res.json({ success: true, files });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const searchFiles = (req, res) => {
  try {
    const relPath = req.query.path || '';
    const keyword = (req.query.keyword || '').toLowerCase();
    const files = listDirectory(ROOT_DIR, relPath).filter(f => f.name.toLowerCase().includes(keyword));
    res.json({ success: true, files });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const makeFolder = (req, res) => {
  try {
    const { path: relPath = '' } = req.body;
    const info = createFolder(ROOT_DIR, relPath, '未命名文件');
    res.json({ success: true, folder: info });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const remove = (req, res) => {
  try {
    const relPath = req.params[0];
    if (!relPath) throw new Error('Missing path');
    const ok = deleteEntry(ROOT_DIR, relPath);
    res.json({ success: ok });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const rename = (req, res) => {
  try {
    const relPath = req.params[0];
    const { newName } = req.body;
    if (!relPath || !newName) throw new Error('Missing params');
    const newRel = renameEntry(ROOT_DIR, relPath, newName);
    res.json({ success: true, newPath: newRel });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const uploadHandlerFactory = () => {
  // upload 路径根据请求中的 path 字段决定放入哪个目录
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      try {
        const relPath = req.body.path || '';
        const dest = resolveSafePath(ROOT_DIR, relPath);
        ensureDir(dest);
        cb(null, dest);
      } catch (err) {
        cb(err);
      }
    },
    filename: (req, file, cb) => {
      const unique = `${Date.now()}-${file.originalname}`;
      cb(null, unique);
    }
  });
  return multer({ storage });
};