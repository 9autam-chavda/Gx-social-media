import { Link } from 'react-router-dom';

const PostCaption = ({ post, authorPath }) => {
  const author = post?.author || post?.user;
  const captionText =
    post?.type === 'text'
      ? post?.textContent || post?.caption
      : post?.caption || post?.textContent;

  return (
    <div className="mt-2 text-sm leading-6 text-ink">
      <Link className="font-black" to={authorPath}>
        @{author?.username || 'user'}
      </Link>{' '}
      {captionText || 'No description available.'}
    </div>
  );
};

export default PostCaption;
