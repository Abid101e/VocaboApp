import { useState, useEffect, useRef } from 'react';
import { Post } from '../../../types';
import { fetchPosts } from '../../../services/api';
import { POSTS_PER_PAGE } from '../../../constants/config';

const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const isFetching = useRef(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const load = async (pageNumber: number) => {
    if (isFetching.current) return;
    isFetching.current = true;
    setLoading(true);
    setError(null);

    try {
      const data = await fetchPosts(pageNumber);
      if (!isMounted.current) return;
      if (data.length < POSTS_PER_PAGE) setHasMore(false);
      setPosts(prev => pageNumber === 1 ? data : [...prev, ...data]);
      setPage(pageNumber);
    } catch (err: unknown) {
      if (!isMounted.current) return;
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      if (isMounted.current) {
        setLoading(false);
        setInitialLoading(false);
      }
      isFetching.current = false;
    }
  };

  useEffect(() => {
    load(1);
  }, []);

  const loadMore = () => {
    if (!hasMore || isFetching.current) return;
    load(page + 1);
  };

  return { posts, loading, initialLoading, error, loadMore, hasMore };
};

export default usePosts;
