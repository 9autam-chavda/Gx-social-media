import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../common/Avatar';
import Icon from '../icons/Icon';
import { searchService } from '../../services/searchService';

const RECENT_SEARCHES_KEY = 'gx_recent_searches';

const emptyResults = {
  users: [],
  posts: [],
};

const normalizeSearchResults = (data) => ({
  users: Array.isArray(data?.users) ? data.users : [],
  posts: Array.isArray(data?.posts) ? data.posts : [],
});

const readRecentSearches = () => {
  if (typeof window === 'undefined') return [];

  try {
    const stored = window.localStorage.getItem(RECENT_SEARCHES_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
};

const writeRecentSearches = (items) => {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(items));
};

const SearchPanel = ({ mode = 'sidebar', onClose }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(emptyResults);
  const [recentSearches, setRecentSearches] = useState(readRecentSearches);
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const searchIdRef = useRef(0);

  const searchTerm = query.trim();
  const hasResults = results.users.length > 0 || results.posts.length > 0;
  const limitedPosts = useMemo(() => results.posts.slice(0, 4), [results.posts]);

  useEffect(() => {
    if (mode === 'sheet') {
      inputRef.current?.focus();
    }
  }, [mode]);

  useEffect(() => {
    const nextSearchId = searchIdRef.current + 1;
    searchIdRef.current = nextSearchId;

    if (!searchTerm) {
      setResults(emptyResults);
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
          setResults(normalizeSearchResults(data));
        }
      } catch (err) {
        if (searchIdRef.current === nextSearchId) {
          setResults(emptyResults);
          setError(err?.message || 'Unable to load search results.');
        }
      } finally {
        if (searchIdRef.current === nextSearchId) {
          setLoading(false);
        }
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const persistSearch = (value) => {
    const normalized = value.trim();
    if (!normalized) return;

    setRecentSearches((current) => {
      const next = [normalized, ...current.filter((item) => item !== normalized)].slice(0, 7);
      writeRecentSearches(next);
      return next;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!searchTerm) return;
    persistSearch(searchTerm);
  };

  const handleSelectTerm = (value) => {
    setQuery(value);
    persistSearch(value);
  };

  const clearQuery = () => {
    setQuery('');
    setResults(emptyResults);
    setError('');
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    writeRecentSearches([]);
  };

  const content = (
    <div className={mode === 'sheet' ? 'flex h-full flex-col bg-white' : 'w-full'}>
      {mode === 'sheet' && (
        <div className="flex items-center gap-3 border-b border-line/80 bg-white px-3 py-3 shadow-sm">
          <button
            aria-label="Close search"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line/70 text-ink transition-all duration-150 hover:bg-surface-muted"
            onClick={onClose}
            type="button"
          >
            <Icon name="arrowLeft" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-black text-ink">Search</p>
            <p className="truncate text-xs font-semibold text-ink-muted">Find people, posts, and captions</p>
          </div>
        </div>
      )}

      <div className={mode === 'sheet' ? 'flex-1 overflow-y-auto px-3 pb-6 pt-3' : 'px-0'}>
        <form className="flex min-h-11 items-center gap-2 rounded-xl border border-line bg-surface-muted px-3 py-2.5 text-sm text-ink-muted transition-colors duration-150 focus-within:border-brand/50 focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(37,99,235,0.12)]" onSubmit={handleSubmit}>
          <Icon name="search" />
          <input
            ref={inputRef}
            aria-label="Search users or posts"
            className="w-full bg-transparent text-ink outline-none placeholder:text-ink-muted"
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                persistSearch(searchTerm);
              }
            }}
            placeholder="Search users or posts"
            type="search"
            value={query}
          />
          {query ? (
            <button
              aria-label="Clear search"
              className="rounded-full p-1 text-ink-muted transition-colors duration-150 hover:bg-white hover:text-ink"
              onClick={clearQuery}
              type="button"
            >
              <Icon name="close" />
            </button>
          ) : null}
        </form>

        <div className="mt-4 min-h-24" aria-live="polite">
          {!searchTerm ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-black text-ink">Recent searches</p>
                {recentSearches.length > 0 ? (
                  <button className="text-xs font-black text-brand" onClick={clearRecentSearches} type="button">
                    Clear all
                  </button>
                ) : null}
              </div>

              {recentSearches.length > 0 ? (
                <div className="space-y-2">
                  {recentSearches.map((item) => (
                    <button
                      key={item}
                      className="flex w-full items-center justify-between rounded-xl border border-line/70 bg-white px-3 py-3 text-left text-sm font-semibold text-ink transition-colors duration-150 hover:bg-surface-muted"
                      onClick={() => handleSelectTerm(item)}
                      type="button"
                    >
                      <span className="flex items-center gap-2">
                        <Icon name="history" />
                        {item}
                      </span>
                      <Icon name="arrowRight" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-line/80 bg-surface-muted px-4 py-6 text-center text-sm font-semibold text-ink-muted">
                  Your recent searches will appear here.
                </div>
              )}
            </div>
          ) : loading ? (
            <div className="space-y-2">
              {[0, 1, 2].map((item) => (
                <div key={item} className="skeleton h-14 rounded-xl" />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-xl bg-surface-muted px-4 py-5 text-sm font-semibold text-ink-muted">
              {error}
            </div>
          ) : !hasResults ? (
            <div className="rounded-xl bg-surface-muted px-4 py-5 text-sm font-semibold text-ink-muted">
              No results found for this search.
            </div>
          ) : (
            <div className="space-y-4">
              {results.users.length > 0 && (
                <div>
                  <p className="px-1 text-xs font-black uppercase tracking-normal text-ink-muted">People</p>
                  <div className="mt-2 space-y-1">
                    {results.users.map((user) => (
                      <Link
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-150 hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                        key={user._id}
                        onClick={() => handleSelectTerm(user.username || query)}
                        to={`/app/profile/${user.username}`}
                      >
                        <Avatar user={user} size="sm" />
                        <p className="min-w-0 truncate text-sm font-black text-ink">@{user.username}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {limitedPosts.length > 0 && (
                <div>
                  <p className="px-1 text-xs font-black uppercase tracking-normal text-ink-muted">Posts</p>
                  <div className="mt-2 space-y-1">
                    {limitedPosts.map((post) => (
                      <Link
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-150 hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                        key={post._id}
                        onClick={() => handleSelectTerm(post.caption || post.textContent || query)}
                        to={`/app/post/${post._id}`}
                      >
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
                          <Icon name="hashtag" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-black text-ink">@{post.user?.username || 'user'}</p>
                          <p className="truncate text-xs font-semibold text-ink-muted">{post.caption || post.textContent || 'View post'}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (mode === 'sheet') {
    return (
      <div className="fixed inset-0 z-[60] bg-white/95 backdrop-blur-xl">
        {content}
      </div>
    );
  }

  return (
    <section className="rounded-xl border border-line bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-black text-ink">
        <Icon name="search" className="text-brand" />
        Search
      </div>
      {content}
    </section>
  );
};

export default SearchPanel;
