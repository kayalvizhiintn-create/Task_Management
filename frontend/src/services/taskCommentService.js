import apiClient from './apiClient';

export const taskCommentService = {
  getCommentsByTaskId: async (taskId) => {
    try {
      const response = await apiClient.get(`/api/v1/task-comment/get-comments-by-task-id?taskId=${taskId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },

  createComment: async (formData) => {
    try {
      const response = await apiClient.post('/api/v1/task-comment/create-comment', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  },

  updateComment: async (formData, userId) => {
    try {
      const response = await apiClient.put(`/api/v1/task-comment/update-comment?userId=${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  },

  deleteComment: async (id, userId) => {
    try {
      const response = await apiClient.delete(`/api/v1/task-comment/delete-comment?id=${id}&userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }
};
