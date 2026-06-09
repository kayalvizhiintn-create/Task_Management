import apiClient from './apiClient';

export const statusService = {
  async getAllStatuses() {
    const response = await apiClient.get('/api/v1/status/get-all-statuses');
    return response.data;
  },

  async getStatusById(id) {
    const response = await apiClient.get(`/api/v1/status/get-status-by-id?id=${id}`);
    return response.data;
  },

  async createStatus(data) {
    const response = await apiClient.post('/api/v1/status/create-status', data);
    return response.data;
  },

  async updateStatus(data) {
    const response = await apiClient.put('/api/v1/status/update-status', data);
    return response.data;
  },

  async deleteStatus(id) {
    const response = await apiClient.delete(`/api/v1/status/delete-status?id=${id}`);
    return response.data;
  }
};
