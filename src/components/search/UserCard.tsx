import React from 'react'
import emptyPfp from '@/assets/emptypfp.png'
import { useNavigate } from 'react-router-dom';

interface UserWindowCardProps {
    data: {
        _id: string;
        username: string;
        firstName: string;
        lastName: string;
        pfp: string;
        posts: [];
        num_followers: number;
        num_following: number;
    }
}

function UserCard({ data }: UserWindowCardProps) {

    const navigate = useNavigate();

    return (
        <div className='flex flex-col border-2 items-center justify-between p-3 px-8 gap-2 bg-white w-full sm:w-[70%] h-full rounded-2xl overflow-hidden' onClick={() => navigate(`/users/${data._id}`)}>
            <div className='flex items-center justify-center w-full'>
                    <img className='w-16 h-16 sm:min-w-24 sm:h-24 md:w-28 md:h-28 rounded-full' src={data.pfp || emptyPfp} />
                </div>
            <div className='w-full flex flex-row  items-center justify-between gap-x-3'>   
                <div className='flex flex-col items-center justify-center w-full'>
                    <span className='italic'>{data.username}</span>
                    <div className='flex flex-row gap-1'>
                        <span>{data.firstName}</span>
                        <span>{data.lastName}</span>
                    </div>
                </div>
            </div>
            <div className='flex flex-col items-center justify-center w-full'>
                <div id="numbers" className='flex flex-row justify-evenly border-2 w-full p-2 rounded-xl'>
                    <div className='flex flex-1 flex-col items-center'>
                        <span className='text-xs sm:text-md font-bold'>Posts</span>
                        <span>{data.posts.length}</span>
                    </div>
                    <div className='flex flex-1 flex-col items-center'>
                        <span className='text-xs sm:text-md font-bold'>Followers</span>
                        <span>{data.num_followers}</span>
                    </div>
                    <div className='flex flex-1 flex-col items-center'>
                        <span className='text-xs sm:text-md font-bold'>Following</span>
                        <span>{data.num_following}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserCard