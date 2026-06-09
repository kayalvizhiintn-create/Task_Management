import apiClient from './apiClient';

export const taskFileService = {
  async getAllTaskFiles() {
    const response = await apiClient.get('/api/v1/task-file/get-all-task-files');
    return response.data;
  },

  async getTaskFileById(id) {
    const response = await apiClient.get(`/api/v1/task-file/get-task-file-by-id?id=${id}`);
    return response.data;
  },

  async createTaskFile(data) {
    const response = await apiClient.post('/api/v1/task-file/create-task-file', data);
    return response.data;
  },

  async updateTaskFile(data) {
    const response = await apiClient.put('/api/v1/task-file/update-task-file', data);
    return response.data;
  },

  async deleteTaskFile(id) {
    const response = await apiClient.delete(`/api/v1/task-file/delete-task-file?id=${id}`);
    return response.data;
  }
};
