import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  addDoc,
  query,
  orderBy,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '../../../services/firebase';
import { Comment } from '../../../types';

const likesCollection = (postId: number) =>
  collection(db, 'posts', String(postId), 'likes');

const commentsCollection = (postId: number) =>
  collection(db, 'posts', String(postId), 'comments');

export const toggleLike = async (
  postId: number,
  userId: string,
  currentlyLiked: boolean,
): Promise<void> => {
  const likeDoc = doc(db, 'posts', String(postId), 'likes', userId);
  if (currentlyLiked) {
    await deleteDoc(likeDoc);
  } else {
    await setDoc(likeDoc, { likedAt: serverTimestamp() });
  }
};

export const addComment = async (
  postId: number,
  userId: string,
  text: string,
): Promise<void> => {
  await addDoc(commentsCollection(postId), {
    postId,
    userId,
    text,
    createdAt: Date.now(),
  });
};

export const subscribeToLikes = (
  postId: number,
  userId: string,
  onUpdate: (likeCount: number, isLiked: boolean) => void,
): Unsubscribe =>
  onSnapshot(likesCollection(postId), (snapshot) => {
    onUpdate(snapshot.size, snapshot.docs.some((d) => d.id === userId));
  });

export const subscribeToComments = (
  postId: number,
  onUpdate: (comments: Comment[]) => void,
): Unsubscribe => {
  const q = query(commentsCollection(postId), orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const comments: Comment[] = snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Comment, 'id'>),
    }));
    onUpdate(comments);
  });
};
