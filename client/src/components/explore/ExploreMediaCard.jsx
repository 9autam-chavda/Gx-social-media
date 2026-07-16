import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getPostCounts,
  getPostHref,
  getPostMedia,
  getPostPreviewText,
} from '../content/contentCardUtils';
import Icon from '../icons/Icon';

const ExploreMediaCard = ({ post, featured = false }) => {
  const { mediaUrl, isVideo, poster } = getPostMedia(post);
  const counts = getPostCounts(post);
  const videoRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isVideo || !videoRef.current) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.55 },
    );

    observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, [isVideo]);

  useEffect(() => {
    if (!isVideo || !videoRef.current) return;

    if (visible) {
      videoRef.current.play().catch(() => {});
      return;
    }

    videoRef.current.pause();
  }, [isVideo, visible]);

  if (!mediaUrl) return null;

  const handlePreview = () => {
    if (!isVideo || !videoRef.current) return;
    videoRef.current.play().catch(() => {});
  };

  const handlePausePreview = () => {
    if (!isVideo || !videoRef.current || visible) return;
    videoRef.current.pause();
  };

  return (
    <Link
      className="group relative block h-full overflow-hidden bg-ink"
      onMouseEnter={handlePreview}
      onMouseLeave={handlePausePreview}
      to={getPostHref(post)}
    >
      {isVideo ? (
        <video
          ref={videoRef}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.035]"
          loop
          muted
          playsInline
          poster={poster}
          preload="metadata"
          src={mediaUrl}
        />
      ) : (
        <img
          alt={getPostPreviewText(post)}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.035]"
          decoding="async"
          loading="lazy"
          src={mediaUrl}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/5 opacity-0 transition duration-200 group-hover:opacity-100" />

      {isVideo && (
        <span className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-black/45 text-xs text-white backdrop-blur-sm">
          <Icon name="play" />
        </span>
      )}

      <div className="absolute inset-x-0 bottom-0 flex translate-y-2 items-center gap-3 p-2.5 text-xs font-bold text-white opacity-0 transition duration-200 group-hover:translate-y-0 group-hover:opacity-100 sm:p-3">
        <span className="inline-flex items-center gap-1">
          <Icon name="like" size={13} />
          {counts.likes}
        </span>
        <span className="inline-flex items-center gap-1">
          <Icon name="commentSolid" size={13} />
          {counts.comments}
        </span>
        {featured && <span className="ml-auto">Featured</span>}
      </div>
    </Link>
  );
};

export default ExploreMediaCard;
