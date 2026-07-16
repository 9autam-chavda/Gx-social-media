import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { getErrorMessage } from '../utils/api';

import { getId } from '../utils/formatters';

export const usePaginatedPosts = (
  fetcher,
  options = {}
) => {
  const {
    limit = 10,
    immediate = true,
  } = options;

  const [posts, setPosts] =
    useState([]);

  const [page, setPage] =
    useState(1);

  const [pagination, setPagination] =
    useState(null);

  const [loading, setLoading] =
    useState(immediate);

  const [
    loadingMore,
    setLoadingMore,
  ] = useState(false);

  const [error, setError] =
    useState('');

  const load = useCallback(
    async (
      nextPage = 1,
      mode = 'replace'
    ) => {
      mode === 'append'
        ? setLoadingMore(true)
        : setLoading(true);

      setError('');

      try {
        const data =
          await fetcher({
            page: nextPage,
            limit,
          });

        const incoming =
          data?.posts || [];

        setPosts(
          (currentPosts) => {
            if (
              mode !== 'append'
            ) {
              return [
                ...incoming,
              ];
            }

            const seen =
              new Set(
                currentPosts.map(
                  (post) =>
                    getId(post)
                )
              );

            const filteredIncoming =
              incoming.filter(
                (post) =>
                  !seen.has(
                    getId(post)
                  )
              );

            return [
              ...currentPosts,
              ...filteredIncoming,
            ];
          }
        );

        setPagination({
          currentPage:
            data.currentPage ||
            data.pagination
              ?.currentPage ||
            nextPage,

          totalPages:
            data.totalPages ||
            data.pagination
              ?.totalPages ||
            1,

          totalPosts:
            data.totalPosts ||
            data.pagination
              ?.totalPosts ||
            incoming.length,

          hasNext:
            data.hasNext ??
            data.pagination
              ?.hasNext ??
            (
              data.currentPage ||
              nextPage
            ) <
              (
                data.totalPages ||
                data.pagination
                  ?.totalPages ||
                1
              ),
        });

        setPage(nextPage);
      } catch (err) {
        console.error(err);

        setError(
          getErrorMessage(
            err,
            'Unable to load posts'
          )
        );
      } finally {
        setLoading(false);

        setLoadingMore(false);
      }
    },
    [fetcher, limit]
  );

  useEffect(() => {
    if (immediate) {
      Promise.resolve().then(
        () => load(1)
      );
    }
  }, [immediate, load]);

  const loadMore =
    useCallback(() => {
      if (
        !loadingMore &&
        pagination?.hasNext
      ) {
        load(
          page + 1,
          'append'
        );
      }
    }, [
      load,
      loadingMore,
      page,
      pagination?.hasNext,
    ]);

  const updatePost =
    useCallback(
      (postId, updater) => {
        setPosts(
          (currentPosts) => {
            return currentPosts.map(
              (post) => {
                if (
                  getId(post) !==
                  postId
                ) {
                  return post;
                }

                const updatedPost =
                  typeof updater ===
                  'function'
                    ? updater(post)
                    : updater;

                return {
                  ...post,
                  ...updatedPost,

                  likes: [
                    ...(updatedPost?.likes ||
                      post?.likes ||
                      []),
                  ],
                };
              }
            );
          }
        );
      },
      []
    );

  return useMemo(
    () => ({
      posts,

      setPosts,

      updatePost,

      loading,

      loadingMore,

      error,

      pagination,

      refresh: () =>
        load(1),

      loadMore,
    }),
    [
      error,
      load,
      loadMore,
      loading,
      loadingMore,
      pagination,
      posts,
      updatePost,
    ]
  );
};