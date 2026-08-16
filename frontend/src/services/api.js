import axios from 'axios';

const API_BASE_URL = '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchPortfolioData = async () => {
  const response = await api.get('/portfolio');
  return response.data;
};

export const fetchGithubStatsApi = async (username) => {
  const response = await api.get(`/github/stats/${username}`);
  return response.data;
};

export const loginAdmin = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const updateProfileApi = async (profileData) => {
  const response = await api.put('/profile', profileData);
  return response.data;
};

export const createProjectApi = async (projectData) => {
  const response = await api.post('/projects', projectData);
  return response.data;
};

export const updateProjectApi = async (id, projectData) => {
  const response = await api.put(`/projects/${id}`, projectData);
  return response.data;
};

export const deleteProjectApi = async (id) => {
  const response = await api.delete(`/projects/${id}`);
  return response.data;
};

export const createExperienceApi = async (expData) => {
  const response = await api.post('/experiences', expData);
  return response.data;
};

export const updateExperienceApi = async (id, expData) => {
  const response = await api.put(`/experiences/${id}`, expData);
  return response.data;
};

export const deleteExperienceApi = async (id) => {
  const response = await api.delete(`/experiences/${id}`);
  return response.data;
};

export const createSkillApi = async (skillData) => {
  const response = await api.post('/skills', skillData);
  return response.data;
};

export const updateSkillApi = async (id, skillData) => {
  const response = await api.put(`/skills/${id}`, skillData);
  return response.data;
};

export const deleteSkillApi = async (id) => {
  const response = await api.delete(`/skills/${id}`);
  return response.data;
};

export const createPublicationApi = async (data) => {
  const response = await api.post('/publications', data);
  return response.data;
};

export const updatePublicationApi = async (id, data) => {
  const response = await api.put(`/publications/${id}`, data);
  return response.data;
};

export const deletePublicationApi = async (id) => {
  const response = await api.delete(`/publications/${id}`);
  return response.data;
};

export const updateContactApi = async (contactData) => {
  const response = await api.put('/contact', contactData);
  return response.data;
};

export const uploadMediaApi = async (file, folder = 'images') => {
  const formData = new FormData();
  formData.append('file', file);
  if (folder) formData.append('folder', folder);
  const response = await api.post('/admin/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const fetchMediaApi = async () => {
  const response = await api.get('/admin/media');
  return response.data;
};

export const deleteMediaApi = async (key) => {
  const response = await api.delete(`/admin/media/${key}`);
  return response.data;
};
