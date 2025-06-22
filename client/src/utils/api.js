import axios from 'axios';

const api = axios.create({
  baseURL: '/api', 
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  config => {
    // Check for sToken first (for students)
    const sToken = localStorage.getItem('sToken');
    if (sToken) {
      config.headers.Authorization = `Bearer ${sToken}`;
      return config;
    }
    
    // Then check for aToken (for admins)
    const aToken = localStorage.getItem('aToken');
    if (aToken) {
      config.headers.Authorization = `Bearer ${aToken}`;
      return config;
    }
    
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default api;