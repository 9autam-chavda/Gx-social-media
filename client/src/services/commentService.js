import api from '../api/axios';

const commentService = {
  createComment: async (
    postId,
    text
  ) => {
    const response =
      await api.post(
        '/comments',
        {
          postId,
          text,
        }
      );

    return response.data.data;
  },

  getComments: async (
    postId,
    page = 1,
    limit = 20
  ) => {
    const response =
      await api.get(
        `/comments/${postId}`,
        {
          params: {
            page,
            limit,
          },
        }
      );

    return response.data.data;
  },

  toggleUpvote: async (
    commentId
  ) => {
    const response =
      await api.patch(
        `/comments/upvote/${commentId}`
      );

    return response.data.data;
  },

  deleteComment: async (
    commentId
  ) => {
    const response =
      await api.delete(
        `/comments/${commentId}`
      );

    return response.data.data;
  },
};





export default commentService;
