import Icon from '../icons/Icon';

const CommentButton = ({ onClick }) => (
  <button className="icon-button" onClick={onClick} type="button" aria-label="Open comments" title="Comment">
    <Icon name="comment" />
  </button>
);

export default CommentButton;
