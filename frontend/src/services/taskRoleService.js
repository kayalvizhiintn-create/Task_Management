import apiClient from './apiClient';

export const taskRoleService = {
  async getAllRoles() {
    const response = await apiClient.get('/api/v1/role/get-all-roles');
    return response.data;
  },

  async getRoleById(id) {
    const response = await apiClient.get(`/api/v1/role/get-role-by-id?id=${id}`);
    return response.data;
  },

  async createRole(data) {
    const response = await apiClient.post('/api/v1/role/create-role', data);
    return response.data;
  },

  async updateRole(data) {
    const response = await apiClient.put('/api/v1/role/update-role', data);
    return response.data;
  },

  async deleteRole(id) {
    const response = await apiClient.delete(`/api/v1/role/delete-role?id=${id}`);
    return response.data;
  }
};
