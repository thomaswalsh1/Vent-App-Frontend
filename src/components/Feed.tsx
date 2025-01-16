import React, { useState, useEffect, useRef } from 'react';
import Post from './Post';
import { apiClient } from '@/lib/api-client';
import { POST_ROUTES } from '@/utils/constants';
import { Skeleton } from '@/components/ui/skeleton';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';

interface PostData {
  title: string;
  content: string;
  author: string;
  userId: string;
  _id: string;
  imageUrl?: string;
  visibility: string;
  tags: string[]
}

export default function Feed() {
  const currUser = useSelector((state: RootState) => state.auth.user);
  const myToken = useSelector((state: RootState) => state.auth.token);
  
  const [visiblePosts, setVisiblePosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // infinite scrolling
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);


  const getPosts = async (page: number) => {
    try {
      setIsFetchingMore(true);
      const res = await apiClient.get(POST_ROUTES, {
        params: { page, limit: 10 },
        headers: { Authorization: `Bearer ${myToken}` }, // add user token for authorization
        timeout: 20000,
        withCredentials: true
      });

      const { posts, hasMore: newHasMore } = res.data;
      setVisiblePosts((prev) => [...prev, ...posts]);
      setHasMore(newHasMore);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to fetch posts. Please try again later.');
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  // Initial load
  useEffect(() => {
    getPosts(1);
  }, []);

  // Load more when scrolling
  useEffect(() => {
    if (!observerRef.current || !hasMore || isFetchingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetchingMore) {
          setCurrentPage((prev) => prev + 1);
          getPosts(currentPage + 1);
        }
      },
      {
        threshold: 0.5,  // Trigger when element is 50% visible
        rootMargin: '100px' // Start loading 100px before element is visible
      }
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [hasMore, isFetchingMore, currentPage]);

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="w-full sm:w-[75vw] h-screen max-h-screen p-4 bg-gray-100 overflow-y-scroll no-scrollbar">
      {loading && currentPage === 1 ? (
        <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-2 sm:grid-cols-1 gap-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <Skeleton key={index} className="w-full h-[200px] rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-2 sm:grid-cols-1 gap-4">
          {visiblePosts.map((data, index) => (
            <div
              key={index}
              className="flex rounded-2xl m-3 mb-8 mt-8 min-h-[15rem] border-2 flex-row items-start max-h-[40rem] overflow-hidden"
            >
              <Post data={data} />
            </div>
          ))}
          {isFetchingMore &&
            Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={`loading-${index}`} className="w-full h-[200px] rounded-lg" />
            ))}
          <div ref={observerRef}></div>
        </div>
      )}
    </div>
  );
}