import fs from 'fs';
import path from 'path';

// 防止路径穿越：只允许在 rootDir 下操作
export function resolveSafePath(rootDir, relativePath = '') {
  const safe = path.normalize(path.join(rootDir, relativePath));
  if (!safe.startsWith(path.normalize(rootDir))) {
    throw new Error('Invalid path');
  }
  return safe;
}

export function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export function listDirectory(rootDir, relativePath = '') {
  const target = resolveSafePath(rootDir, relativePath);
  ensureDir(target);
  const entries = fs.readdirSync(target, { withFileTypes: true });
  const result = entries.map(e => {
    const stat = fs.statSync(path.join(target, e.name));
    return {
      id: path.join(relativePath, e.name), // 可以作为唯一标识（在前端可 base64 等）
      name: e.name,
      type: e.isDirectory() ? 'folder' : 'file',
      size: stat.size,
      createdAt: stat.birthtimeMs,
      updatedAt: stat.mtimeMs,
      path: path.join(relativePath, e.name).replace(/\\/g, '/')
    };
  });
  // 按 updatedAt 降序
  result.sort((a, b) => b.updatedAt - a.updatedAt);
  return result;
}

export function createFolder(rootDir, relativePath = '', folderName = '未命名文件') {
  const target = resolveSafePath(rootDir, path.join(relativePath, folderName));
  ensureDir(target);
  return {
    name: folderName,
    path: path.join(relativePath, folderName).replace(/\\/g, '/')
  };
}

export function deleteEntry(rootDir, relativePath) {
  const target = resolveSafePath(rootDir, relativePath);
  if (!fs.existsSync(target)) return false;
  const stat = fs.statSync(target);
  if (stat.isDirectory()) {
    // 递归删除
    fs.rmSync(target, { recursive: true, force: true });
  } else {
    fs.unlinkSync(target);
  }
  return true;
}

export function renameEntry(rootDir, relativePath, newName) {
  const src = resolveSafePath(rootDir, relativePath);
  if (!fs.existsSync(src)) throw new Error('Not exist');
  const parent = path.dirname(src);
  const dest = path.join(parent, newName);
  if (fs.existsSync(dest)) throw new Error('Target name already exists');
  fs.renameSync(src, dest);
  // 返回新的相对路径
  const relParent = path.relative(rootDir, parent);
  return path.join(relParent, newName).replace(/\\/g, '/');
}