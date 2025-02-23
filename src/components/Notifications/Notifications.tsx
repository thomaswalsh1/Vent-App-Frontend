import React, { useEffect, useRef, useState } from 'react'
import { Separator } from '../ui/separator'
import { useSelector } from 'react-redux'
import { NotificationType } from "@/lib/NotificationType";
import { apiClient } from '@/lib/api-client';
import { USER_ROUTES } from '@/utils/constants';
import SingleNotification from './SingleNotification';
import { log } from 'console';
import { RootState } from '@/state/store';
import LoadingAnimation from '../Animation/LoadingAnimation';


function Notifications() {
    const currUser = useSelector((state: RootState) => state.auth.user)
    const currToken = useSelector((state: RootState) => state.auth.token)

    const [visibleNotifs, setVisibleNotifs] = useState<NotificationType[]>([])
    const [loadingNotifs, setLoadingNotifs] = useState(false);

    // pagination for notifications
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const observerRef = useRef<HTMLDivElement>(null);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    const [error, setError] = useState(false);

    const loadNotifs = async (page: number) => {
        try {
            setIsFetchingMore(true);
            setLoadingNotifs(true);

            // await new Promise((res) => setTimeout(res, 4000)); // test loading of getting notifications
            const res = await apiClient.get(`${USER_ROUTES}/${currUser.id}/notifications`, {
                params: { page, limit: 10 },
                headers: {
                    Authorization: `Bearer ${currToken}`
                }
            });
            const notifications = res.data.notifs;
            const newHasMore = res.data.hasMore;

            // If it's the first page, replace the notifications
            // Otherwise append them
            if (page === 1) {
                setVisibleNotifs(notifications);
            } else {
                setVisibleNotifs((prev) => [...prev, ...notifications]);
            }

            setHasMore(newHasMore);
        } catch (error) {
            setError(true);
            console.error(error);
        } finally {
            setIsFetchingMore(false);
            setLoadingNotifs(false);
        }
    }

    // original load for notifications, runs once
    useEffect(() => {
        console.log("running inital load")
        loadNotifs(1);
    }, [])

    // Infinite scroll logic
    useEffect(() => {
        if (!observerRef.current || !hasMore || isFetchingMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isFetchingMore) {
                    setCurrentPage((prev) => {
                        const nextPage = prev + 1;
                        loadNotifs(nextPage);
                        return nextPage;
                    });
                }
            },
            {
                threshold: 0.5,
                rootMargin: '1000px',
            }
        );

        observer.observe(observerRef.current);

        return () => observer.disconnect();
    }, [hasMore, isFetchingMore]);


    return (
        <div ref={observerRef} className="bg-gray-100 w-[90vw] sm:w-[75vw] h-screen flex justify-center items-center sm:p-4">
            <div className="w-[100%] sm:w-[80%] bg-gray-100 sm:bg-white flex flex-col sm:border-4 sm:rounded-2xl h-full overflow-y-auto">
                <div id="heading" className='bg-white flex justify-center'>
                    <div className='m-4'>
                        <span>Notifications</span>
                    </div>
                </div>
                <Separator />
                {!error ? (
                    <div id="notifications" className='w-full h-full'>
                        {visibleNotifs.length !== 0 ? (
                            <div>
                                {visibleNotifs.map((notif, index) => (
                                    <div
                                        key={index}
                                        className="flex rounded-2xl mx-2 my-2 sm:m-3 sm:my-8 flex-row items-start p-2 sm:p-3 max-h-[40rem] overflow-hidden"
                                    >
                                        <SingleNotification data={notif} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className='flex justify-center my-8 items-center'>
                                {loadingNotifs ? (
                                    <LoadingAnimation />
                                ) : (
                                    <span>No notifications</span>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className='flex justify-center items-center'>
                        <p className='text-red-400 text-sm'>Error Fetching notifications</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Notifications