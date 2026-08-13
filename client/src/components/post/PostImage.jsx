import {
  Link,
  useLocation,
} from 'react-router-dom';

import {
  useEffect,
  useRef,
  useState,
} from 'react';

import Icon from '../icons/Icon';

import {
  getMediaType,
  getMediaUrl,
} from '../../utils/formatters';

const PostImage = ({
  post,
  detail = false,
}) => {
  const location = useLocation();

  const mediaUrl = getMediaUrl(post);

  const mediaType = getMediaType(post);

  const media = Array.isArray(post?.media)
    ? post.media[0]
    : null;

  const videoRef = useRef(null);

  const [playing, setPlaying] =
    useState(false);

  const [muted, setMuted] =
    useState(true);

  const [showOverlay, setShowOverlay] =
    useState(false);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return undefined;

    const handlePlay = () => setPlaying(true);
    const handlePause = () => setPlaying(false);

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [mediaUrl]);

  if (!mediaUrl) return null;

  const showVideoOverlay = () => {
    setShowOverlay(true);

    setTimeout(() => {
      setShowOverlay(false);
    }, 450);
  };

  const toggleVideo = async (e) => {
    e.preventDefault();

    if (!videoRef.current) return;

    try {
      if (videoRef.current.paused) {
        await videoRef.current.play();
      } else {
      videoRef.current.pause();
      }
    } catch {
      setPlaying(false);
    }

    showVideoOverlay();
  };

  const toggleMute = (e) => {
    e.preventDefault();

    if (!videoRef.current) return;

    const nextMuted = !muted;

    videoRef.current.muted = nextMuted;

    setMuted(nextMuted);
  };

  const content =
    mediaType === 'video' ? (
      <div className="group relative overflow-hidden bg-black">
        <video
          ref={videoRef}
          className="
            max-h-[58vh] w-full object-contain sm:max-h-[72vh]
          "
          playsInline
          muted={muted}
          preload="metadata"
          poster={media?.thumbnail || ''}
          src={mediaUrl}
          onClick={toggleVideo}
        />

        <div
          className="
            pointer-events-none absolute inset-x-0 bottom-0
            h-20 bg-gradient-to-t
            from-black/60 via-black/10 to-transparent
            sm:h-28
          "
        />

        <div
          className={`
            pointer-events-none absolute inset-0
            flex items-center justify-center
            transition-opacity duration-150
            ${
              showOverlay
                ? 'opacity-100'
                : 'opacity-0'
            }
          `}
        >
          <div
            className="
              flex h-12 w-12 items-center justify-center
              rounded-full bg-black/40
              backdrop-blur-xl
            "
          >
            {playing ? (
              <Icon name="pause" className="text-lg text-white" />
            ) : (
              <Icon name="play" className="ml-0.5 text-lg text-white" />
            )}
          </div>
        </div>

        {/* SOUND BUTTON */}
        <button
          type="button"
          onClick={toggleMute}
          className="
            absolute bottom-2 right-2 z-20
            flex h-8 w-8 items-center justify-center
            rounded-full bg-black/40
            text-white backdrop-blur-xl
            transition-colors duration-150
            hover:bg-black/60
            sm:bottom-3 sm:right-3 sm:h-10 sm:w-10
          "
        >
          {muted ? (
            <Icon name="volumeXmark" className="text-sm" />
          ) : (
            <Icon name="volumeHigh" className="text-sm" />
          )}
        </button>
      </div>
    ) : (
      <img
        className="
          aspect-[1/1] max-h-[54vh] w-full object-cover
          transition-opacity duration-150 sm:aspect-[4/5] sm:max-h-none
        "
        src={mediaUrl}
        alt={
          post?.caption ||
          post?.textContent ||
          'Post'
        }
        decoding="async"
        loading="lazy"
      />
    );

  if (detail) {
    return content;
  }

  return (
    <Link
      to={`/app/post/${post._id}`}
      state={{
        backgroundLocation: location,
        background: location,
      }}
      aria-label="Open post details"
    >
      {content}
    </Link>
  );
};

export default PostImage;
