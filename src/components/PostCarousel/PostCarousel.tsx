import { apiClient } from '@/lib/api-client';
import { POST_ROUTES, USER_ROUTES } from '@/utils/constants';
import React, { useEffect, useState } from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import Post from '../Post';
import { useSelector } from 'react-redux';
import { PostType } from '@/lib/PostType';
import { GrDocumentMissing } from "react-icons/gr";
import axios, { AxiosError } from 'axios';
import { RootState } from '@/state/store';

function PostCarousel({ userId }: { userId: string }) {
    const [visiblePosts, setVisiblePosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const currToken = useSelector((state: RootState) => state.auth.token);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setIsLoading(true);

                const res = await apiClient.get(`${USER_ROUTES}/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${currToken}`
                    }
                });
                console.log(res.data.posts);
                const postPromises = res.data.posts.map(async (postId: string) => {
                    try {
                        const res = await apiClient.get(`${POST_ROUTES}/${postId}`, {
                            headers: {
                                Authorization: `Bearer ${currToken}`
                            }
                        })
                        return res.data
                    } catch (error: unknown) {
                        if (axios.isAxiosError(error) && error.response?.status === 401) {
                            console.log(`Skipping post ${postId} due to 401 error`);
                            return null;
                        }
                        throw error; // throw for other errors
                    }
                });
                let posts = await Promise.all(postPromises); // when all are completed
                posts = posts.filter((post) => post !== null);
                console.log("posts are: " + posts);
                setVisiblePosts(posts);
            } catch (error) {
                console.log(`Error fetching user data: ${error}`)
            } finally {
                setIsLoading(false)
            }
        }
        fetchUserData();
    }, [userId])

    return (
        <div id='carousel-container' className='w-full bg-slate-300 p-3 border-4 rounded-2xl border-transparent h-full flex justify-center items-center'>
            <Carousel className="w-[90%] h-full flex justify-center items-center">
                <CarouselContent className='h-full'>
                    {!isLoading && visiblePosts.length === 0 && (
                        <CarouselItem>
                            <div className='h-full flex flex-col items-center justify-center gap-y-8 bg-white'>
                                <GrDocumentMissing className='w-24 h-24' />
                                <span className='font-bold text-lg'>No posts yet!</span>
                            </div>
                        </CarouselItem>
                    )}
                    {!isLoading && visiblePosts.length !== 0 && visiblePosts.map((content, index) => (
                            <CarouselItem key={index} className='h-full'>
                                <div className='h-full'>
                                    <Post data={content} />
                                </div>
                            </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    )
}

export default PostCarousel