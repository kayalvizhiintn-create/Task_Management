import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5092';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add auth token or user info if needed
apiClient.interceptors.request.use(
  (config) => {
    // If we are sending FormData, let the browser set Content-Type with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    const userStr = localStorage.getItem('navanala_currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        // Assuming there is some token logic or just passing user info
        // config.headers.Authorization = `Bearer ${user.token}`;
      } catch (error) {
        console.error("Error parsing user from localStorage", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle responses globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
