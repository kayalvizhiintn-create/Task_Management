import apiClient from './apiClient';

export const taskCommentService = {
  getCommentsByTaskId: async (taskId) => {
    if (String(taskId).startsWith('team-')) {
      const teamId = String(taskId).replace('team-', '');
      try {
        const response = await apiClient.get(`/api/v1/team-comment/get-comments-by-team-id?teamId=${teamId}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching team comments:', error);
        throw error;
      }
    }
    
    try {
      const response = await apiClient.get(`/api/v1/task-comment/get-comments-by-task-id?taskId=${taskId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },

  createComment: async (formData) => {
    const taskId = formData.get('TaskId');
    if (String(taskId).startsWith('team-')) {
      const teamId = String(taskId).replace('team-', '');
      
      // We need to create a new FormData to match TeamCommentBo format
      const teamFormData = new FormData();
      teamFormData.append('TeamId', teamId);
      
      // Append other fields exactly as they are in the original formData
      if (formData.has('UserId')) teamFormData.append('UserId', formData.get('UserId'));
      if (formData.has('UserDisplayName')) teamFormData.append('UserDisplayName', formData.get('UserDisplayName'));
      if (formData.has('CommentText')) teamFormData.append('CommentText', formData.get('CommentText'));
      if (formData.has('ParentCommentId')) teamFormData.append('ParentCommentId', formData.get('ParentCommentId'));
      
      const file = formData.get('Files');
      if (file) teamFormData.append('Files', file);

      try {
        const response = await apiClient.post('/api/v1/team-comment/create-comment', teamFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } catch (error) {
        console.error('Error creating team comment:', error);
        throw error;
      }
    }

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
    const taskId = formData.get('TaskId');
    
    if (String(taskId).startsWith('team-')) {
      const teamId = String(taskId).replace('team-', '');
      
      const teamFormData = new FormData();
      teamFormData.append('CommentId', formData.get('CommentId'));
      teamFormData.append('TeamId', teamId);
      if (formData.has('UserId')) teamFormData.append('UserId', formData.get('UserId'));
      if (formData.has('CommentText')) teamFormData.append('CommentText', formData.get('CommentText'));
      
      const file = formData.get('Files');
      if (file) teamFormData.append('Files', file);

      try {
        const response = await apiClient.put(`/api/v1/team-comment/update-comment`, teamFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } catch (error) {
        console.error('Error updating team comment:', error);
        throw error;
      }
    }

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

  deleteComment: async (id, userId, taskId) => {
    if (String(taskId).startsWith('team-')) {
      try {
        const response = await apiClient.delete(`/api/v1/team-comment/delete-comment?id=${id}&userId=${userId}`);
        return response.data;
      } catch (error) {
        console.error('Error deleting team comment:', error);
        throw error;
      }
    }

    try {
      const response = await apiClient.delete(`/api/v1/task-comment/delete-comment?id=${id}&userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }
};
