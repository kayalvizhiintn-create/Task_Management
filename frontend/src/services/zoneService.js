import apiClient from './apiClient';

export const zoneService = {
  async getAllZones() {
    const response = await apiClient.get('/api/v1/zone/get-all-zones');
    return response.data;
  },

  async getZoneById(id) {
    const response = await apiClient.get(`/api/v1/zone/get-zone-by-id?id=${id}`);
    return response.data;
  },

  async createZone(data) {
    const response = await apiClient.post('/api/v1/zone/create-zone', data);
    return response.data;
  },

  async updateZone(data) {
    const response = await apiClient.put('/api/v1/zone/update-zone', data);
    return response.data;
  },

  async deleteZone(id) {
    const response = await apiClient.delete(`/api/v1/zone/delete-zone?id=${id}`);
    return response.data;
  }
};
