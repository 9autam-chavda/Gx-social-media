import { Link } from 'react-router-dom';

const FeedCaption = ({ post, authorPath, prominent = false }) => {
  const author = post?.author || post?.user || post?.createdBy;
  const text =
    post?.type === 'text'
      ? post?.textContent || post?.caption
      : post?.caption || post?.textContent;

  if (!text) return null;

  return (
    <div
      className={
        prominent
          ? 'text-[0.98rem] font-semibold leading-6 text-ink sm:text-lg sm:leading-8'
          : 'text-[13px] leading-5 text-ink sm:text-sm sm:leading-6'
      }
    >
      {!prominent && (
        <>
          <Link className="font-black transition-colors duration-150 hover:text-brand" to={authorPath}>
            @{author?.username || 'user'}
          </Link>{' '}
        </>
      )}
      {text}
    </div>
  );
};

export default FeedCaption;
