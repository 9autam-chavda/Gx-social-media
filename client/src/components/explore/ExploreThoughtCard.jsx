import { Link } from 'react-router-dom';
import {
  getPostAuthor,
  getPostHref,
  getPostPreviewText,
} from '../content/contentCardUtils';

const palettes = [
  'bg-[#111827] text-white',
  'bg-[#f8fafc] text-ink',
  'bg-[#14532d] text-white',
  'bg-[#fff7ed] text-[#431407]',
  'bg-[#312e81] text-white',
  'bg-[#fefce8] text-[#422006]',
];

const ExploreThoughtCard = ({ post }) => {
  const author = getPostAuthor(post);
  const palette = palettes[(getPostPreviewText(post).length + (author?.username?.length || 0)) % palettes.length];

  return (
    <Link
      className={`group flex h-full flex-col justify-between overflow-hidden p-4 transition duration-200 hover:scale-[0.99] ${palette}`}
      to={getPostHref(post)}
    >
      <p className="line-clamp-5 text-lg font-black leading-6 sm:text-xl sm:leading-7">
        {getPostPreviewText(post)}
      </p>
      <p className="mt-4 truncate text-xs font-bold opacity-60">
        @{author?.username || 'unknown'}
      </p>
    </Link>
  );
};

export default ExploreThoughtCard;
