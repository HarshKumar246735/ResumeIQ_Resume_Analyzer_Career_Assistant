import api from './api.js';

// Turns an Axios error into an Error with a readable message and optional field details.
function toError(err) {
  const data = err.response?.data;
  const e = new Error(data?.message || (err.request ? 'Cannot reach the ResumeIQ server. Please check your connection and try again.' : err.message));
  e.status = err.response?.status;
  e.details = data?.details;
  return e;
}

const call = async (p) => { try { return (await p).data; } catch (err) { throw toError(err); } };

export const login = (v) => call(api.post('/auth/login', { email: v.email, password: v.password }));
export const register = (v) => call(api.post('/auth/register', { name: v.name, email: v.email, password: v.password }));
export const logout = () => call(api.post('/auth/logout'));
export const fetchMe = () => call(api.get('/auth/me'));
