import api from '../api/axios';

const replyService = {
  addReply: async (
    commentId,
    text,
    replyingTo = null
  ) => {
    const response =
      await api.post(
        '/replies',
        {
          commentId,
          text,
          replyingTo,
        }
      );

    return response.data.data;
  },

  getReplies: async (
    commentId
  ) => {
    const response =
      await api.get(
        `/replies/${commentId}`
      );

    return response.data.data;
  },

  toggleUpvote: async (
    replyId
  ) => {
    const response =
      await api.patch(
        `/replies/upvote/${replyId}`
      );

    return response.data.data;
  },

  deleteReply: async (
    replyId
  ) => {
    const response =
      await api.delete(
        `/replies/${replyId}`
      );

    return response.data.data;
  },
};



export default replyService;