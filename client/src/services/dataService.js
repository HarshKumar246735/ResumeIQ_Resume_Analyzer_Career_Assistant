import api from './api.js';

const unwrap = async (p) => {
  try { return (await p).data; } catch (err) {
    const data = err.response?.data;
    const e = new Error(data?.message || (err.request ? 'Cannot reach the ResumeIQ server. Please try again.' : err.message));
    e.status = err.response?.status; e.details = data?.details;
    throw e;
  }
};

export const uploadResume = (file, onProgress) => {
  const form = new FormData();
  form.append('file', file);
  return unwrap(api.post('/resumes/upload', form, { timeout: 60000, onUploadProgress: (e) => e.total && onProgress?.(Math.round((e.loaded / e.total) * 100)) }));
};
export const listResumes = (params) => unwrap(api.get('/resumes', { params }));
export const deleteResume = (id) => unwrap(api.delete(`/resumes/${id}`));
export const createAnalysis = (body) => unwrap(api.post('/analysis', body));
export const listAnalyses = (params) => unwrap(api.get('/analysis', { params }));
export const getAnalysis = (id) => unwrap(api.get(`/analysis/${id}`));
export const deleteAnalysis = (id) => unwrap(api.delete(`/analysis/${id}`));
export const getOverview = () => unwrap(api.get('/dashboard/overview'));

export const listBuilder = (params) => unwrap(api.get('/builder', { params }));
export const createBuilder = (body) => unwrap(api.post('/builder', body));
export const getBuilder = (id) => unwrap(api.get(`/builder/${id}`));
export const updateBuilder = (id, body) => unwrap(api.patch(`/builder/${id}`, body));
export const deleteBuilder = (id) => unwrap(api.delete(`/builder/${id}`));
