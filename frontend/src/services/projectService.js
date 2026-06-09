import apiClient from './apiClient';

export const projectService = {
  async getAllProjects() {
    const response = await apiClient.get('/api/v1/project/get-all-projects');
    return response.data;
  },

  async getProjectById(id) {
    const response = await apiClient.get(`/api/v1/project/get-project-by-id?id=${id}`);
    return response.data;
  },

  async createProject(data) {
    const response = await apiClient.post('/api/v1/project/create-project', data);
    return response.data;
  },

  async updateProject(data) {
    const response = await apiClient.put('/api/v1/project/update-project', data);
    return response.data;
  },

  async deleteProject(id) {
    const response = await apiClient.delete(`/api/v1/project/delete-project?id=${id}`);
    return response.data;
  }
};
