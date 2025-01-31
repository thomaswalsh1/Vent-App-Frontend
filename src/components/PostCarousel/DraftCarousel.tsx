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
import { RootState } from '@/state/store';
import { GrDocumentMissing } from 'react-icons/gr';

function DraftCarousel({ userId }: { userId: string }) {
    const [visibleDrafts, setVisibleDrafts] = useState([]);
    const currToken = useSelector((state: RootState) => state.auth.token)

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await apiClient.get(`${USER_ROUTES}/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${currToken}`
                    }
                });
                const drafts = res.data.drafts;
                setVisibleDrafts(drafts);
            } catch (error) {
                console.log(`Error fetching user data: ${error}`)
            }
        }
        fetchUserData();
    }, [userId])

    return (
        <div id='carousel-container' className='w-full bg-slate-300 p-3 border-4 rounded-2xl border-transparent h-full flex justify-center items-center'>
            <Carousel className="w-[90%] h-full flex justify-center items-center">
                <CarouselContent className='h-full'>
                    {visibleDrafts.length === 0 && (
                                            <CarouselItem>
                                                <div className='h-full flex flex-col items-center justify-center gap-y-8 bg-white'>
                                                    <GrDocumentMissing className='w-24 h-24' />
                                                    <span className='font-bold text-lg'>No drafts yet!</span>
                                                </div>
                                            </CarouselItem>
                                        )}
                    {visibleDrafts.map((content, index) => (
                        <CarouselItem key={index} className='h-full'>
                            <div className='h-full'>
                                <Post data={content} isDraft/>
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

export default DraftCarousel