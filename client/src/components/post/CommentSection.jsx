import CommentList from '../comments/CommentList';

const CommentSection = ({
  comments = [],
  loading = false,
  currentUser,
  currentUserId,
  onCommentDeleted,
  onCommentUpdated,
}) => (
  <CommentList
    comments={comments}
    loading={loading}
    currentUser={currentUser}
    currentUserId={currentUserId}
    onCommentDeleted={onCommentDeleted}
    onCommentUpdated={onCommentUpdated}
    variant="media"
  />
);

export default CommentSection;
