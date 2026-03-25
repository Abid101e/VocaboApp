import { useState, useEffect, useCallback, useRef } from 'react';
import { Post, Comment } from '../../../types';
import { fetchPost } from '../../../services/api';
import {
  toggleLike as toggleLikeService,
  addComment as addCommentService,
  subscribeToLikes,
  subscribeToComments,
} from '../services/postService';

const usePostDetail = (postId: number, userId: string, userName: string) => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');

  const isTogglingLike = useRef(false);

  useEffect(() => {
    let cancelled = false;

    fetchPost(postId)
      .then((data) => {
        if (!cancelled) {
          setPost(data);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Something went wrong');
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [postId]);

  useEffect(() => {
    const unsubLikes = subscribeToLikes(postId, userId, (count, liked) => {
      setLikeCount(count);
      setIsLiked(liked);
    });
    const unsubComments = subscribeToComments(postId, setComments);

    return () => {
      unsubLikes();
      unsubComments();
    };
  }, [postId, userId]);

  const toggleLike = useCallback(() => {
    if (isTogglingLike.current) return;
    isTogglingLike.current = true;

    const wasLiked = isLiked;
    setIsLiked(!wasLiked);
    setLikeCount((prev) => (wasLiked ? prev - 1 : prev + 1));

    toggleLikeService(postId, userId, wasLiked)
      .catch(() => {
        setIsLiked(wasLiked);
        setLikeCount((prev) => (wasLiked ? prev + 1 : prev - 1));
      })
      .finally(() => {
        isTogglingLike.current = false;
      });
  }, [postId, userId, isLiked]);

  const submitComment = useCallback(() => {
    const trimmed = commentText.trim();
    if (!trimmed) return;

    setCommentText('');
    addCommentService(postId, userId, userName, trimmed).catch(() => {
      setCommentText(trimmed);
    });
  }, [postId, userId, userName, commentText]);

  return {
    post,
    loading,
    error,
    likeCount,
    isLiked,
    comments,
    commentText,
    setCommentText,
    toggleLike,
    submitComment,
  };
};

export default usePostDetail;
