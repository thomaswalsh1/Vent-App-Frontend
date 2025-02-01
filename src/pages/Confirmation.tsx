import LoadingAnimation from '@/components/Animation/LoadingAnimation';
import ProfileEditor from '@/components/ProfileEditor'
import { apiClient } from '@/lib/api-client';
import { RootState } from '@/state/store'
import { VERIFY_CONFIRM_ROUTE } from '@/utils/constants';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom';

function Confirmation() {
    const [tokenPresent, setTokenPresent] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [verified, setVerified] = useState(false);
    const [searchParams] = useSearchParams();
    const accessToken = searchParams.get('token');

    const verify = async () => {
        setVerifying(true);
        try {
            // await new Promise((res) => setTimeout(res, 2000)) // test loading
            const res = await apiClient.post(`${VERIFY_CONFIRM_ROUTE}/?token=${accessToken}`, {})
            if(res.data.isConfirmed === false) {
                throw new Error("Failed to confirm using token.");
            }
            setVerified(true);
        } catch (error) {
            console.error(error);
            setVerified(false);
        } finally {
            setVerifying(false);
        }
    }

    useEffect(() => {
        if (accessToken) {
            setTokenPresent(true);
        } else {
            setTokenPresent(false);
        }
    }, [accessToken])

    useEffect(() => {
        verify()
    }, [])


    return (
        <div className="flex-grow w-screen h-screen flex flex-col items-center">
            <div className='w-full h-full flex p-2 sm:p-10 flex-col items-center justify-center bg-gray-200'>
                <div className='w-full h-full flex flex-col items-center justify-center bg-white rounded-xl'>
                    {tokenPresent ?
                        (
                            <div className='flex flex-col items-center'>
                                {verifying ? (
                                    <LoadingAnimation />
                                ) : verified ? (
                                    <div className='w-full h-full flex items-center justify-center flex-col'>
                                        <span className='text-lg sm:text-2xl md:text-4xl font-bold brand-text'>
                                            Verified Successfully
                                        </span>
                                        <span className='italic text-xs sm:text-base md:text-lg'>You are now verified!</span>
                                        <span className='italic text-xs sm:text-base md:text-lg'>Redirecting to sign in...</span>
                                    </div>
                                ) : (
                                    <div className='w-full h-full flex items-center justify-center flex-col'>
                                        <span className='text-lg sm:text-2xl md:text-4xl text-red-500 font-bold brand-text'>
                                            Verification Failed
                                        </span>
                                        <span className='italic text-xs sm:text-base md:text-lg'>Verification link expired.</span>
                                    </div>
                                ) }
                            </div>

                        ) :
                        (
                            <div className='flex flex-col items-center'>
                                <span className='text-lg sm:text-2xl md:text-4xl text-red-500 font-bold brand-text'>
                                    Error 404
                                </span>
                                <span className='text-xs sm:text-base md:text-lg'>
                                    There is an issue with your link.
                                </span>
                                <span className='text-xs sm:text-base md:text-lg'>
                                    Please try a different link or contact support.
                                </span>
                            </div>
                        )}
                </div>
            </div>
        </div>
    )
}

export default Confirmation