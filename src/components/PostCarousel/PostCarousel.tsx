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
import LoadingAnimation from '../Animation/LoadingAnimation';

function PostCarousel({ userId }: { userId: string }) {
    const [visiblePosts, setVisiblePosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const currToken = useSelector((state: RootState) => state.auth.token);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // await new Promise((res) => setTimeout(res, 4000)); // test load 

                const res = await apiClient.get(`${USER_ROUTES}/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${currToken}`
                    }
                });
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
                            return null;
                        }
                        throw error; // throw for other errors
                    }
                });
                let posts = await Promise.all(postPromises); // when all are completed
                posts = posts.filter((post) => post !== null);
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
                    {isLoading && (
                        <CarouselItem>
                            <div className='h-full flex flex-col items-center justify-center gap-y-8 bg-white'>
                                <LoadingAnimation />
                            </div>
                        </CarouselItem>
                    )}
                    {!isLoading && visiblePosts.length === 0 && (
                        <CarouselItem>
                            <div className='h-full flex flex-col items-center justify-center gap-y-8 bg-white'>
                                <GrDocumentMissing className='w-24 h-24' />
                                <span className='font-bold text-lg'>No posts yet!</span>
                            </div>
                        </CarouselItem>
                    )}
                    {!isLoading && visiblePosts.length !== 0 && visiblePosts.map((content, index) => (
                        <CarouselItem className='h-full' key={index}>
                            <div className='h-full' key={index}>
                                <Post data={content} key={index} />
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