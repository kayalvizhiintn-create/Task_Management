import apiClient from './apiClient';

export const userService = {
  async getAllUsers() {
    const response = await apiClient.get('/api/v1/user/get-all-users');
    return response.data;
  },

  async getUserById(id) {
    const response = await apiClient.get(`/api/v1/user/get-user-by-id?id=${id}`);
    return response.data;
  },

  async createUser(data) {
    const response = await apiClient.post('/api/v1/user/create-user', data);
    return response.data;
  },

  async updateUser(data) {
    const response = await apiClient.put('/api/v1/user/update-user', data);
    return response.data;
  },

  async deleteUser(id) {
    const response = await apiClient.delete(`/api/v1/user/delete-user?id=${id}`);
    return response.data;
  }
};
