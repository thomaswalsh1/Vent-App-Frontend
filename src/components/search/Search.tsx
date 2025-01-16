import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from '../ui/input';
import { apiClient } from '@/lib/api-client';
import { SEARCH_POST_ROUTE, SEARCH_USER_ROUTE } from '@/utils/constants';
import PostData from '../Post';
import { useSelector } from 'react-redux';
import { Skeleton } from '../ui/skeleton';
import UserSearchCarousel from './UserSearchCarousel';
import { Button } from '../ui/button';
import UserCard from './UserCard';
import { useLocation } from 'react-router-dom';

interface PostData {
    title: string;
    content: string;
    author: string;
    userId: string;
    _id?: string;
    imageUrl?: string;
}

interface UserCardProps {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    pfp: string;
}

function Search() {
    const myToken = useSelector((state: any) => state.auth.token);

    // check if query is available in url
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialSearch = queryParams.get('query') || '';

    const [currSearch, setCurrSearch] = useState(initialSearch);

    const [visiblePosts, setVisiblePosts] = useState<PostData[]>([]);
    const [visibleUsers, setVisibleUsers] = useState<UserCardProps[]>([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [viewingUsers, setViewingUsers] = useState(false);

    // Infinite scrolling
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const observerRef = useRef<HTMLDivElement>(null);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    // Infinite scrolling for users

    const [currentPageUser, setCurrentPageUser] = useState(1);
    const [hasMoreUser, setHasMoreUser] = useState(true);
    const observerRefUser = useRef<HTMLDivElement>(null);
    const [isFetchingMoreUser, setIsFetchingMoreUser] = useState(false);

    

    // Fetch posts
    const getPosts = useCallback(async (page: number, isNewSearch = false) => {
        try {
            if (isNewSearch) setIsLoading(true);
            setIsFetchingMore(true);

            const res = await apiClient.get(SEARCH_POST_ROUTE, {
                params: { search: currSearch, page, limit: 10 },
                headers: { Authorization: `Bearer ${myToken}` },
                timeout: 20000,
            });



            const { posts, hasMore: newHasMore } = res.data;

            setVisiblePosts((prev) => (isNewSearch ? posts : [...prev, ...posts]));
            setHasMore(newHasMore);
        } catch (error) {
            console.error('Error fetching posts:', error);
            setError('Failed to fetch posts. Please try again later.');
        } finally {
            setTimeout(() => {
                setIsLoading(false);
                setIsFetchingMore(false);
            }, 500) // for smoother transition
        }
    }, [currSearch, myToken])

    // fetch users

    const getUsers = useCallback(async (page: number, isNewSearch = false) => {
        try {
            if (isNewSearch) setIsLoading(true);
            setIsFetchingMoreUser(true);

            const res = await apiClient.get(SEARCH_USER_ROUTE, {
                params: { search: currSearch, page, limit: 10 },
                headers: { Authorization: `Bearer ${myToken}` },
                timeout: 20000,
            });

            const { users, hasMore: newHasMore } = res.data;

            setVisibleUsers((prev) => (isNewSearch ? users : [...prev, ...users]));
            setHasMoreUser(newHasMore);
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to fetch users. Please try again later.');
        } finally {
            setTimeout(() => {
                setIsLoading(false);
                setIsFetchingMoreUser(false);
            }, 500) // for smoother transition
        }
    }, [currSearch, myToken])

    // check for url query
    useEffect(() => {
        const queryFromURL = queryParams.get('query') || '';
        if (queryFromURL !== currSearch) {
            setCurrSearch(queryFromURL);
            setCurrentPage(1);
            getPosts(1, true);
            getUsers(1, true);
        }
    }, []);

    // Initial load
    useEffect(() => {
        getPosts(1, true);
        getUsers(1, true);
    }, []);

    // Fetch new posts on search change
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setCurrentPage(1);
            getPosts(1, true);
            getUsers(1, true);
        }, 300); // Debounce to avoid rapid API calls

        return () => clearTimeout(delayDebounce);
    }, [currSearch, getPosts, getUsers]); // if getPost runs, run this again

    // Infinite scroll logic
    useEffect(() => {
        if (!observerRef.current || !hasMore || isFetchingMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isFetchingMore) {
                    setCurrentPage((prev) => {
                        const nextPage = prev + 1;
                        getPosts(nextPage);
                        return nextPage;
                    });
                }
            },
            {
                threshold: 0.5,
                rootMargin: '100px',
            }
        );

        observer.observe(observerRef.current);

        return () => observer.disconnect();
    }, [hasMore, isFetchingMore]);

    useEffect(() => {
        if (!observerRefUser.current || !hasMoreUser || isFetchingMoreUser) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMoreUser && !isFetchingMoreUser) {
                    setCurrentPageUser((prev) => {
                        const nextPage = prev + 1;
                        getUsers(nextPage);
                        return nextPage;
                    });
                }
            },
            {
                threshold: 0.5,
                rootMargin: '100px',
            }
        );

        observer.observe(observerRefUser.current);

        return () => observer.disconnect();
    }, [hasMoreUser, isFetchingMoreUser, viewingUsers])

    const handleSearchChange = (search: string) => {
        setCurrSearch(search);
    };

    const switchToPostView = () => {
        setViewingUsers(false);
    }
    const switchToUserView = () => {
        setViewingUsers(true);
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    return (
        <div className="w-[90vw] sm:w-[75vw] h-screen p-4 bg-gray-100 flex flex-col gap-y-4 items-center">
            <div id="searchbar-container" className="bg-white w-[90%] sm:w-[60%] h-auto">
                <Input
                    placeholder="Search for something..."
                    onChange={(e) => handleSearchChange(e.target.value)}
                />
            </div>
            <div className='flex flex-row gap-3'>
                <Button onClick={switchToPostView} className={`w-24 rounded-xl ${viewingUsers ? "bg-slate-300" : "bg-slate-500"}`}>
                    Posts
                </Button>
                <Button onClick={switchToUserView} className={`w-24 rounded-xl ${!viewingUsers ? "bg-slate-300" : "bg-slate-500"}`}>
                    Users
                </Button>
            </div>
            {!viewingUsers ? (
                <div id="search-feed-container" className="w-full sm:w-[70%] bg-gray-100 h-screen overflow-scroll no-scrollbar">
                    {isLoading && currentPage === 1 ? (
                        <div className='w-full flex flex-col justify-center items-center'>
                            {Array.from({ length: 12 }).map((_, index) => (
                                <Skeleton key={index} className="m-5 w-[80%] h-48 rounded-2xl" />
                            ))}
                        </div>
                    ) : (
                        <div>
                            {visiblePosts.map((data, index) => (
                                <div
                                    key={index}
                                    className="flex text-xs sm:text-md md:text-lg rounded-2xl m-3 mb-8 mt-8 flex-row items-start border-2 max-h-[40rem] overflow-hidden"
                                >
                                    <PostData data={data} />
                                </div>
                            ))}
                            {(isLoading || isFetchingMore) &&
                                Array.from({ length: 4 }).map((_, index) => (
                                    <Skeleton key={`loading-${index}`} className="w-full h-[200px] rounded-lg" />
                                ))}
                            <div ref={observerRef}></div>
                            {visiblePosts.length !== 0 ? (<></>) :
                                (
                                    <div className='flex justify-center items-center w-full h-[40rem]'>
                                        <span className='text-red-500'>No results found</span>
                                    </div>

                                )

                            }
                        </div>
                    )}
                </div>
            ) : (
                <div id="search-feed-container-user" className="w-full sm:w-[70%] bg-gray-100 h-screen overflow-scroll no-scrollbar">
                    {isLoading && currentPageUser === 1 ? (
                        <div className='flex flex-col items-center justify-center'>
                            {Array.from({ length: 12 }).map((_, index) => (
                                <Skeleton key={index} className="m-5 w-[80%] h-48 rounded-2xl" />
                            ))}
                        </div>
                    ) : (
                        <div>
                            {visibleUsers.map((data, index) => (
                                <div
                                    key={index}
                                    className="flex rounded-2xl m-3 mb-8 mt-8 flex-col justify-center items-center max-h-[40rem] overflow-hidden"
                                >
                                    <UserCard data={data} />
                                </div>
                            ))}
                            {(isLoading || isFetchingMoreUser) &&
                                Array.from({ length: 4 }).map((_, index) => (
                                    <Skeleton key={`loading-${index}`} className="w-full h-[200px] rounded-lg" />
                                ))}
                            <div ref={observerRefUser}></div>
                            {visibleUsers.length !== 0 ? (<></>) :
                                (
                                    <div className='flex justify-center items-center w-full h-[40rem]'>
                                        <span className='text-red-500'>No results found</span>
                                    </div>
                                )
                            }
                        </div>
                    )}
                </div>
            )}

        </div>
    );
}

export default Search;
