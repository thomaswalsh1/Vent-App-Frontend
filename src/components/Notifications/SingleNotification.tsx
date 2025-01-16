import React, { useEffect, useRef, useState } from 'react'
import { NotificationType } from '@/lib/NotificationType'
import { apiClient } from '@/lib/api-client';
import { USER_ROUTES } from '@/utils/constants';
import emptyPfp from '../../assets/emptypfp.png';
import { useNavigate } from 'react-router-dom';
import { scrapeTime } from '@/lib/scrapeTime';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { TiDelete } from "react-icons/ti";
import { Description } from '@radix-ui/react-toast';
import { toast } from '@/hooks/use-toast';

interface NotifProps {
    data: NotificationType;
}

interface NotificationVisual {
    username: string;
    createdAt: string;
    type: string;
    pfp: string;
    read: boolean;
    likedPostId?: string;
    accepted?: boolean;
}

function SingleNotification({ data }: NotifProps) {
    const navigate = useNavigate();
    const notificationRef = useRef<HTMLDivElement>(null);

    const currToken = useSelector((state) => state.auth.token);

    const [loadedData, setLoadedData] = useState<NotificationVisual>({
        username: "",
        createdAt: "",
        type: "",
        pfp: emptyPfp,
        read: true,
    })

    const fetchUserData = async () => {
        try {
            const res = await apiClient.get(`${USER_ROUTES}/${data.fromUser}`, {
                headers: {
                    Authorization: `Bearer ${currToken}`
                }
            })
            setLoadedData({
                username: res.data.username,
                createdAt: data.createdAt,
                type: data.type,
                pfp: res.data.pfp || emptyPfp,
                read: data.read,
                likedPostId: data.likedPostId
            })
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchUserData();
    }, [])

    const goToUserPage = async () => {
        navigate(`/users/${data.fromUser}`)
    }

    const markAsRead = async () => {
        try {
            console.log("running mark as read")
            await apiClient.patch(`${USER_ROUTES}/${data.recipient}/notifications/${data._id}`, {}
                , {
                    headers: {
                        Authorization: `Bearer ${currToken}`
                    }
                });
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loadedData.read) {
                    markAsRead();
                }
            },
            { threshold: 0.5 }
        );

        if (notificationRef.current) {
            observer.observe(notificationRef.current);
        }

        return () => observer.disconnect();
    }, [loadedData.read]);

    const handleAcceptRequest = async () => {
        try {
            await apiClient.patch(`${USER_ROUTES}/${data.fromUser}/accept`, {}, {
                headers: {
                    Authorization: `Bearer ${currToken}`
                }
            })
        } catch (error) {
            console.log(error);
            toast({
                title: "Follower Accept Failed",
                description: "This user has not been accepted as follower."
            })
        } finally {
            setLoadedData((prev) => Object.assign(prev, { accepted: true }));
            setLoadedData((prev) => ({...prev, type: "follow"}))
            console.log(loadedData);
            toast({
                title: "Follower Accepted",
                description: "This user has now been accepted as follower."
            })
        }
    }
    return (
        <div ref={notificationRef} className='w-full h-full flex-col border-2 relative rounded-xl p-4 bg-white' onClick={goToUserPage}>
            {loadedData.read === false && (
                <div className='w-4 h-4 rounded-full bg-blue-400 absolute -top-2 -left-2'>
                </div>
            )}
            <div id="middlized" className='w-full flex flex-row items-center justify-between'>
                <div className='flex flex-row items-center justify-center'>
                    <img src={loadedData.pfp} alt={`${loadedData.username}'s profile`} className='border-[2px] rounded-full w-12 h-12' />
                    {loadedData.type === "follow" && (
                        <span className='ml-3'><a className='italic'>{loadedData.username}</a> followed you!</span>
                    )}
                    {loadedData.type === "like" && (
                        <span className='ml-3'><a className='italic'>{loadedData.username}</a> liked your <a href={`/posts/${data.likedPostId}`}>Post</a></span>
                    )}
                    {loadedData.type === "request" && (
                        <span className='ml-3'><a className='italic'>{loadedData.username}</a> requested to follow you.</span>
                    )}
                </div>
                <div className='flex flex-row items-center'>
                    <div className='flex flex-row items-center justify-center gap-2 mr-2'>
                        {loadedData.type === "request" && (
                            <Button className='rounded-xl bg-slate-400' onClick={(e) => {e.stopPropagation(); handleAcceptRequest();}}> Accept </Button>
                        )}
                        {loadedData.type === "request" && (
                            <Button className='rounded-xl bg-slate-400' onClick={(e) => {e.stopPropagation();}}>Delete</Button>
                        )}
                    </div>
                    {scrapeTime(loadedData.createdAt)}
                </div>
            </div>


        </div>
    )
}

export default SingleNotification