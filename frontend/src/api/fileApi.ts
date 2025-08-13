import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/files',
  timeout: 10000
});

export const getFiles = (path = '') => api.get('/', { params: { path } }).then(r => r.data);
export const searchFiles = (path = '', keyword = '') => api.get('/search', { params: { path, keyword } }).then(r => r.data);
export const uploadFile = (file: File, path = '') => {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('path', path);
  return api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
};
export const makeFolder = (path = '') => api.post('/folder', { path }).then(r => r.data);
export const deleteEntry = (relativePath: string) => api.delete(`/delete/${encodeURIComponent(relativePath)}`).then(r => r.data);
export const renameEntry = (relativePath: string, newName: string) => api.put(`/rename/${encodeURIComponent(relativePath)}`, { newName }).then(r => r.data);