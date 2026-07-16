import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Avatar from '../components/common/Avatar';
import EmptyState from '../components/common/EmptyState';
import { GridSkeleton } from '../components/common/Skeletons';
import ExploreMasonryGrid from '../components/explore/ExploreMasonryGrid';
import Icon from '../components/icons/Icon';
import { usePaginatedPosts } from '../hooks/usePaginatedPosts';
import { feedService } from '../services/feedService';
import { searchService } from '../services/searchService';

const RECENT_SEARCHES_KEY = 'gx_recent_searches';

const readRecentSearches = () => {
  if (typeof window === 'undefined') return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(RECENT_SEARCHES_KEY) || '[]');
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
};

const writeRecentSearches = (items) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(items));
};

const Explore = () => {
  const fetchExplore = useCallback((params) => feedService.getExplore(params), []);
  const explore = usePaginatedPosts(fetchExplore, { limit: 30 });
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ users: [], posts: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recentSearches, setRecentSearches] = useState(readRecentSearches);
  const [searchFocused, setSearchFocused] = useState(false);
  const inputRef = useRef(null);
  const searchIdRef = useRef(0);

  const searchTerm = query.trim();
  const isSearching = Boolean(searchTerm);
  const showSearchPanel = searchFocused || isSearching;

  useEffect(() => {
    const nextSearchId = searchIdRef.current + 1;
    searchIdRef.current = nextSearchId;

    if (!searchTerm) {
      setSearchResults({ users: [], posts: [] });
      setLoading(false);
      setError('');
      return undefined;
    }

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        setError('');
        const data = await searchService.search(searchTerm);
        if (searchIdRef.current === nextSearchId) {
          setSearchResults({
            users: Array.isArray(data?.users) ? data.users : [],
            posts: Array.isArray(data?.posts) ? data.posts : [],
          });
        }
      } catch (err) {
        if (searchIdRef.current === nextSearchId) {
          setSearchResults({ users: [], posts: [] });
          setError(err?.message || 'Unable to load search results.');
        }
      } finally {
        if (searchIdRef.current === nextSearchId) {
          setLoading(false);
        }
      }
    }, 220);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const visiblePosts = useMemo(() => {
    const posts = explore.posts || [];
    if (!searchTerm) return posts;
    const normalized = searchTerm.toLowerCase();
    return posts.filter((post) => {
      const haystack = `${post?.caption || ''} ${post?.textContent || ''} ${post?.user?.username || ''} ${post?.author?.username || ''}`.toLowerCase();
      return haystack.includes(normalized);
    });
  }, [explore.posts, searchTerm]);

  const creatorHighlights = useMemo(() => {
    const seen = new Set();
    return (explore.posts || [])
      .map((post) => post?.author || post?.user || {})
      .filter((author) => author?.username && !seen.has(author.username) && seen.add(author.username))
      .slice(0, 8);
  }, [explore.posts]);

  const hashtags = useMemo(() => {
    const tags = (explore.posts || [])
      .flatMap((post) => (post?.hashtags || []).map((tag) => tag.toLowerCase()))
      .filter(Boolean);
    return Array.from(new Set(tags)).slice(0, 8);
  }, [explore.posts]);

  const persistSearch = (value) => {
    const normalized = value.trim();
    if (!normalized) return;
    setRecentSearches((current) => {
      const next = [normalized, ...current.filter((item) => item !== normalized)].slice(0, 7);
      writeRecentSearches(next);
      return next;
    });
  };

  const handleSelectTerm = (value) => {
    setQuery(value);
    persistSearch(value);
  };

  const clearQuery = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    writeRecentSearches([]);
  };

  const suggestionCreators = isSearching
    ? searchResults.users.slice(0, 5)
    : creatorHighlights.slice(0, 5);
  const suggestionPosts = isSearching ? searchResults.posts.slice(0, 4) : [];

  return (
    <section className="mx-auto max-w-[1180px] pb-8">
      <div className="sticky top-0 z-20 -mx-2 bg-surface-muted/90 px-2 pb-2 pt-1 backdrop-blur-xl sm:-mx-6 sm:px-6">
        <div className="relative mx-auto max-w-xl">
          <form
            className="flex h-11 items-center gap-2 rounded-full border border-line/80 bg-white/95 px-3 text-sm text-ink-muted shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition duration-150 focus-within:border-ink/20 focus-within:bg-white"
            onSubmit={(event) => {
              event.preventDefault();
              persistSearch(searchTerm);
              inputRef.current?.blur();
              setSearchFocused(false);
            }}
          >
            <Icon name="search" />
            <input
              ref={inputRef}
              aria-label="Search Explore"
              className="w-full bg-transparent text-ink outline-none placeholder:text-ink-muted"
              onBlur={() => setSearchFocused(false)}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => setSearchFocused(true)}
              placeholder="Search"
              type="search"
              value={query}
            />
            {query ? (
              <button aria-label="Clear search" className="grid h-7 w-7 place-items-center rounded-full text-ink-muted transition duration-150 hover:bg-surface-muted hover:text-ink" onClick={clearQuery} type="button">
                <Icon name="close" />
              </button>
            ) : null}
          </form>

          {showSearchPanel && (
            <div
              className="absolute inset-x-0 top-[3.25rem] z-30 overflow-hidden rounded-2xl border border-line/80 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.16)]"
              onMouseDown={(event) => event.preventDefault()}
            >
              {loading ? (
                <div className="space-y-2 p-3">
                  {[0, 1, 2].map((item) => <div key={item} className="skeleton h-10 rounded-xl" />)}
                </div>
              ) : error ? (
                <p className="px-4 py-3 text-sm font-semibold text-ink-muted">{error}</p>
              ) : (
                <div className="max-h-[70vh] overflow-y-auto p-2">
                  {!isSearching && recentSearches.length > 0 && (
                    <div className="border-b border-line/70 pb-2">
                      <div className="flex items-center justify-between px-2 py-1">
                        <p className="text-xs font-black uppercase text-ink-muted">Recent</p>
                        <button className="text-xs font-black text-brand" onClick={clearRecentSearches} type="button">Clear</button>
                      </div>
                      <div className="flex flex-wrap gap-2 px-2 py-1">
                        {recentSearches.map((item) => (
                          <button key={item} className="rounded-full bg-surface-muted px-3 py-1.5 text-sm font-semibold text-ink transition duration-150 hover:bg-line/60" onClick={() => handleSelectTerm(item)} type="button">
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {(suggestionCreators.length > 0 || hashtags.length > 0) && (
                    <div className="flex gap-2 overflow-x-auto px-2 py-2">
                      {suggestionCreators.map((user) => (
                        <a className="inline-flex shrink-0 items-center gap-2 rounded-full border border-line/70 bg-white px-2.5 py-1.5 text-sm font-bold text-ink transition duration-150 hover:border-ink/20 hover:bg-surface-muted" href={`/profile/${user.username}`} key={user._id || user.username}>
                          <Avatar user={user} size="xs" />
                          @{user.username}
                        </a>
                      ))}
                      {!isSearching && hashtags.slice(0, 5).map((tag) => (
                        <button key={tag} className="shrink-0 rounded-full border border-line/70 bg-white px-3 py-1.5 text-sm font-bold text-ink transition duration-150 hover:border-ink/20 hover:bg-surface-muted" onClick={() => handleSelectTerm(tag)} type="button">
                          #{tag}
                        </button>
                      ))}
                    </div>
                  )}

                  {suggestionPosts.length > 0 && (
                    <div className="grid grid-cols-2 gap-1.5 p-2 pt-0 sm:grid-cols-4">
                      {suggestionPosts.map((post) => (
                        <a className="line-clamp-4 min-h-24 rounded-xl bg-ink p-3 text-sm font-black leading-5 text-white transition duration-150 hover:scale-[0.99]" href={`/post/${post._id}`} key={post._id}>
                          {post.caption || post.textContent || 'View post'}
                        </a>
                      ))}
                    </div>
                  )}

                  {!isSearching && !recentSearches.length && !suggestionCreators.length && !hashtags.length && (
                    <p className="px-3 py-4 text-sm font-semibold text-ink-muted">Search for people, posts, and topics.</p>
                  )}

                  {isSearching && !suggestionCreators.length && !suggestionPosts.length && (
                    <p className="px-3 py-4 text-sm font-semibold text-ink-muted">No results found.</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-1">
        {explore.loading ? (
          <GridSkeleton />
        ) : explore.error ? (
          <EmptyState icon={() => <Icon name="compass" />} title="Explore is unavailable" description={explore.error} />
        ) : (
          <ExploreMasonryGrid posts={visiblePosts} />
        )}
      </div>
    </section>
  );
};

export default Explore;
