export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export const CACHE_TTL_MS = 5 * 60 * 1000;

export const POSTS_PER_PAGE = 10;

export const CACHE_KEYS = {
  postsPage: (page: number) => `cache_posts_page_${page}`,
  postDetail: (id: number) => `cache_post_${id}`,
};
