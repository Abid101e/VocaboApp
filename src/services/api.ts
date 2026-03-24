import { Post } from '../types';
import { getCache, setCache } from './cache';
import { API_BASE_URL, CACHE_KEYS, POSTS_PER_PAGE } from '../constants/config';

export const fetchPosts = async (page: number): Promise<Post[]> => {
  const cacheKey = CACHE_KEYS.postsPage(page);
  const cached = await getCache<Post[]>(cacheKey);
  if (cached) return cached;

  const res = await fetch(`${API_BASE_URL!}/posts?_page=${page}&_limit=${POSTS_PER_PAGE}`);
  if (!res.ok) throw new Error('Failed to fetch posts');

  const data: Post[] = await res.json();
  await setCache(cacheKey, data);

  return data;
};

export const fetchPost = async (id: number): Promise<Post> => {
  const cacheKey = CACHE_KEYS.postDetail(id);
  const cached = await getCache<Post>(cacheKey);
  if (cached) return cached;

  const res = await fetch(`${API_BASE_URL!}/posts/${id}`);
  if (!res.ok) throw new Error('Failed to fetch post');

  const data: Post = await res.json();
  await setCache(cacheKey, data);

  return data;
};
