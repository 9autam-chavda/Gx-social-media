import { useState } from 'react';

import CommentModal from './CommentModal';
import PostActions from './PostActions';
import PostCaption from './PostCaption';
import PostHeader from './PostHeader';
import PostImage from './PostImage';

import { getId } from '../../utils/formatters';

import { useAuth } from '../../hooks/useAuth';

const PostCard = ({
  post,
  onPostChange,
}) => {
  const { user } =
    useAuth();

  const [
    commentOpen,
    setCommentOpen,
  ] = useState(false);

  const [error, setError] =
    useState('');

  const currentUserId =
    user?.id || user?._id;

  const postId = getId(post);

  const authorUsername =
    post?.user?.username ||
    post?.author?.username ||
    post?.createdBy
      ?.username;

  const authorPath =
    authorUsername
      ? `/app/profile/${authorUsername}`
      : '/app/feed';

  const syncPost = (
    updater
  ) => {
    onPostChange?.(
      postId,
      updater
    );
  };

  const isTextPost =
    post?.type === 'text';

  return (
    <article
      className="
        group overflow-hidden rounded-2xl
        border border-line/90
        bg-white shadow-sm
        transition-shadow duration-150
        hover:shadow-md
      "
    >
      {/* HEADER */}
      <div className="px-4 pt-4">
        <PostHeader
          post={post}
          authorPath={
            authorPath
          }
        />
      </div>

      {/* TEXT POST */}
      {isTextPost ? (
        <>
          <div className="px-4 pt-3">
            <PostCaption
              post={post}
              authorPath={
                authorPath
              }
            />
          </div>

          <div className="px-2 pt-2">
            <PostActions
              post={post}
              currentUser={user}
              onCommentClick={() =>
                setCommentOpen(
                  true
                )
              }
              onPostChange={
                syncPost
              }
              onError={
                setError
              }
            />
          </div>
        </>
      ) : (
        <>
          {/* MEDIA */}
          <div className="mt-4 overflow-hidden">
            <PostImage
              post={post}
              authorPath={
                authorPath
              }
            />
          </div>

          {/* ACTIONS */}
          <div className="px-2 pt-2">
            <PostActions
              post={post}
              currentUser={user}
              onCommentClick={() =>
                setCommentOpen(
                  true
                )
              }
              onPostChange={
                syncPost
              }
              onError={
                setError
              }
            />
          </div>

          {/* CAPTION */}
          <div className="px-4 pt-1">
            <PostCaption
              post={post}
              authorPath={
                authorPath
              }
            />
          </div>
        </>
      )}

      {/* COMMENTS */}
      <div className="px-4 pb-4 pt-2">
        <button
          type="button"
          onClick={() =>
            setCommentOpen(
              true
            )
          }
          className="
            mt-2 text-sm font-medium
            text-ink-muted
            transition-colors duration-150
            hover:text-ink
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-white
          "
        >
          {(post?.commentCount ||
            0) === 0
            ? 'Add a comment'
            : `View all ${
                post?.commentCount ||
                0
              } comments`}
        </button>

        {error && (
          <p className="app-alert mt-3">
            {error}
          </p>
        )}
      </div>

      {/* COMMENT MODAL */}
      <CommentModal
        open={commentOpen}
        post={post}
        currentUserId={
          currentUserId
        }
        onClose={() =>
          setCommentOpen(
            false
          )
        }
        onCommentAdded={(
          comment
        ) => {
          syncPost(
            (current) => ({
              ...current,

              comments: [
                comment,
                ...(current.comments ||
                  []),
              ],

              commentCount:
                (current.commentCount ||
                  0) + 1,
            })
          );
        }}
      />
    </article>
  );
};

export default PostCard;
