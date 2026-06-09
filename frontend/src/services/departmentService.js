import apiClient from './apiClient';

export const departmentService = {
  async getAllDepartments() {
    const response = await apiClient.get('/api/v1/dpt/get-all-department');
    return response.data;
  },

  async getDepartmentById(id) {
    const response = await apiClient.get(`/api/v1/dpt/get-department-by-id?id=${id}`);
    return response.data;
  },

  async createDepartment(data) {
    const response = await apiClient.post('/api/v1/dpt/create-department', data);
    return response.data;
  },

  async updateDepartment(data) {
    const response = await apiClient.put('/api/v1/dpt/update-department', data);
    return response.data;
  },

  async deleteDepartment(id) {
    const response = await apiClient.delete(`/api/v1/dpt/delete-department?id=${id}`);
    return response.data;
  }
};
