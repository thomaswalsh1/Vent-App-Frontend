import React, { useEffect, useState } from 'react'
import emptypfp from '@/assets/emptypfp.png';
import { apiClient } from '@/lib/api-client';
import { USER_ROUTES } from '@/utils/constants';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';
import LoadingAnimation from '../Animation/LoadingAnimation';
import { useNavigate } from 'react-router-dom';

interface User {
    pfp: string;
    firstName: string;
    lastName: string;
    username: string;
}

function RightbarUserCard({ userId }: { userId: string }) {

    const currToken = useSelector((state: RootState) => state.auth.token)
    const [user, setUser] = useState<User>({
        pfp: "",
        firstName: "",
        lastName: "",
        username: ""
    })
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchUserData = async () => {
        setLoading(true);
        try {
            await new Promise((res) => setTimeout(res, 2000)); // test loading
            const res = await apiClient.get(`${USER_ROUTES}/${userId}`, {
                headers: {
                    Authorization: `Bearer ${currToken}`
                }
            })
            // console.log(res.data);
            setUser(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUserData();
    }, [])

    return (<>
        {!loading ? (
            <div className='w-full h-fit border-2 justify-between items-center rounded-xl bg-white flex flex-row p-4' onClick={() => navigate(`/users/${userId}`)}>
                <img className="w-10 h-10 object-fit rounded-full border-2" src={user.pfp || emptypfp} />
                <div className='flex gap-x-4'>
                    <span className='text-sm sm:text-base font-bold'>{user.username}</span>
                    <span className='text-sm sm:text-base'>{`${user.firstName} ${user.lastName}`}</span>
                </div>
            </div>
        ) : ( 
            <div>
                <div className='w-full h-fit border-2 justify-between items-center rounded-xl bg-white flex flex-row p-4'>
                    <LoadingAnimation />
                </div>
            </div>
        )}

    </>)
}

export default RightbarUserCard