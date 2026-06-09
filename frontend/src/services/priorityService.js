import apiClient from './apiClient';

export const priorityService = {
  async getAllPriorities() {
    const response = await apiClient.get('/api/v1/priority/get-all-priorities');
    return response.data;
  },

  async getPriorityById(id) {
    const response = await apiClient.get(`/api/v1/priority/get-priority-by-id?id=${id}`);
    return response.data;
  },

  async createPriority(data) {
    const response = await apiClient.post('/api/v1/priority/create-priority', data);
    return response.data;
  },

  async updatePriority(data) {
    const response = await apiClient.put('/api/v1/priority/update-priority', data);
    return response.data;
  },

  async deletePriority(id) {
    const response = await apiClient.delete(`/api/v1/priority/delete-priority?id=${id}`);
    return response.data;
  }
};
