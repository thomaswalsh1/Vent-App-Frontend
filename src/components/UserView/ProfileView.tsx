import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PostCarousel from '@/components/PostCarousel/PostCarousel';
import emptyPfp from '../../assets/emptypfp.png';
import { IoMdSettings } from "react-icons/io";
import { apiClient } from '@/lib/api-client';
import { USER_ROUTES } from '@/utils/constants';
import { useSelector } from 'react-redux';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CurrentUser } from '@/lib/CurrentUser';
import { useToast } from '@/hooks/use-toast';
import ReportWindow from '../ReportWindow/ReportWindow';
import { CiLock } from "react-icons/ci";
import { RootState } from '@/state/store';
import Rightbar from '../Rightbar/Rightbar';
import LoadingAnimation from '../Animation/LoadingAnimation';

interface Profile {
    username: string;
    firstName: string;
    lastName: string;
    bio: string;
    pfp: string;
    num_posts: number;
    num_followers: number;
    num_following: number;
    viewable: boolean;
}

function ProfileView() {
    const { id } = useParams();

    const { toast } = useToast();

    const [profileData, setProfileData] = useState<Profile>({
        username: '',
        firstName: '',
        lastName: '',
        bio: '',
        pfp: emptyPfp,
        num_posts: 0,
        num_followers: 0,
        num_following: 0,
        viewable: true,
    });

    const [isFollowed, setIsFollowed] = useState(false);
    const [loading, setLoading] = useState(true); // prevent flashing empty data
    const [settings, openSettings] = useState(false);
    const [showReportMenu, setShowReportMenu] = useState(false);
    const [rightbarVisible, setRightbarVisible] = useState(false);
    const [currRightbarMode, setCurrRightbarMode] = useState("followers");

    const currUser: CurrentUser = useSelector((state: RootState) => state.auth.user);
    const currToken = useSelector((state: RootState) => state.auth.token);

    const navigate = useNavigate();

    const params = useParams();

    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoading(true);
            // await new Promise((res) => setTimeout(res, 4000)); // testing load
            try {
                const response = await apiClient.get(`${USER_ROUTES}/${id}`, {
                    headers: {
                        Authorization: `Bearer ${currToken}`
                    },
                    timeout: 5000,
                });

                const isFollowing = await apiClient.get(`${USER_ROUTES}/${id}/following/status`, {
                    headers: {
                        Authorization: `Bearer ${currToken}`
                    },
                })
                const fetchedData = response?.data || {};
                setProfileData({
                    username: fetchedData.username || '',
                    firstName: fetchedData.firstName || '',
                    lastName: fetchedData.lastName || '',
                    bio: fetchedData.bio || '',
                    pfp: fetchedData.pfp || emptyPfp,
                    num_posts: fetchedData.posts?.length || 0,
                    num_followers: fetchedData.num_followers || 0,
                    num_following: fetchedData.num_following || 0,
                    viewable: fetchedData.viewable || false,
                });


                if (isFollowing.data.isFollowing) {
                    setIsFollowed(true);
                }

            } catch (error) {
                console.error('Error while fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserProfile();
    }, [id, currUser.id]);

    // checks to see if user should be redirected to edit profile
    const checkForRedirect = async () => {
        // if we are looking at the current user's profile page
        if (currUser.id === id) {
            navigate("/profile");
        }
    }

    useEffect(() => {
        checkForRedirect();
    }, []);

    const handleFollow = async () => {
        try {
            // Update followers for the profile being followed
            // Update both profiles
            await apiClient.post(
                `${USER_ROUTES}/${id}/followers`, {},
                {
                    headers: { Authorization: `Bearer ${currToken}` }
                }
            );
        } catch (err) {
            console.error("Error in handleFollow:", err);
            toast({
                title: "Error",
                description: "Error occurred while following",
            });
        } finally {
            toast({
                title: "Followed!",
                description: "You have successfully followed this person.",
            });

            setIsFollowed(true);
        }
    };

    const handleUnfollow = async () => {
        try {

            await apiClient.delete(
                `${USER_ROUTES}/${id}/followers`,
                {
                    headers: { Authorization: `Bearer ${currToken}` },
                    withCredentials: true
                }
            );

            toast({
                title: "Unfollowed!",
                description: "You have successfully unfollowed this person.",
            });

            setIsFollowed(false);
        } catch (err) {
            console.error("Error in handleUnfollow:", err);
        }
    };


    const handleOpenSettings = async () => {
        openSettings(!settings);
    }

    const showFollowers = () => {
        setCurrRightbarMode("followers");
        setRightbarVisible(true);
    }

    const showFollowing = () => {
        setCurrRightbarMode("following");
        setRightbarVisible(true);
    }

    return (
        <div className="bg-gray-100 w-[90vw]  sm:w-[75vw] h-[100vh] flex justify-center items-center p-2 sm:p-4">
            {rightbarVisible && (
                <div
                    className="fixed top-0 w-[80%] sm:w-[40%] right-0 h-full z-20 transition-transform duration-300 ease-in-out overflow-hidden"
                    style={{
                        transform: !rightbarVisible ? `translateX(100%)` : `translateX(0)`,
                    }}
                >
                    <Rightbar close={() => setRightbarVisible(false)} mode={currRightbarMode} id={id} />
                </div>
            )}
            <div className="bg-white flex flex-col border-4 rounded-2xl w-full sm:w-[80%] justify-center items-center h-[100%] overflow-y-auto">
                {loading ? (
                    <div>
                        <LoadingAnimation />
                    </div>
                ) : (
                    <div className="bg-white overflow-hidden p-4 w-full h-full flex flex-col items-center">
                        {

                        }
                        <div id="top row" className='flex flex-col w-full items-center justify-center mb-4'>
                            <div className='flex flex-col items-center justify-center'>
                                <img
                                    src={profileData?.pfp || emptyPfp}
                                    className="w-24 h-24 border rounded-full bg-white mb-2"
                                    alt="User Avatar"
                                />
                                <div className='flex flex-col items-center justify-center'>
                                    <span className='font-bold'>{profileData?.username}</span>
                                    <span className="">{`${profileData?.firstName} ${profileData?.lastName}`}</span>
                                </div>
                            </div>
                            <div className='w-full flex flex-row mt-2 -mb-2 justify-between items-center'>
                                <div className='w-10 h-10'></div>
                                <Button className='bg-slate-400 sm:flex flex-initial justify-center items-center rounded-xl hover:bg-slate-500'
                                    onClick={isFollowed ? handleUnfollow : handleFollow}>
                                    {isFollowed ? (!profileData.viewable ? (
                                        <span className="text-xs sm:text-sm md:text-base lg:text-base">
                                            Requested
                                        </span>
                                    ) : (
                                        <span className="text-xs sm:text-sm md:text-base lg:text-base">
                                            Following
                                        </span>
                                    )) : (
                                        <span className="text-xs sm:text-sm md:text-base lg:text-base">
                                            Follow
                                        </span>
                                    )}
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className='flex items-center focus:outline-none justify-center h-10 w-10 p-2 rounded-full bg-white hover:bg-gray-100'>
                                        <IoMdSettings className='min-h-full min-w-full' />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>{profileData.username}</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>Block</DropdownMenuItem>
                                        <DropdownMenuItem className='text-red-600' onClick={() => setShowReportMenu(true)}>Report</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                        <Separator className='w-full mb-4' />
                        <div id="numbers" className='max-w-96 flex w-full justify-evenly p-2 border-2 rounded-xl mb-4'>
                            <div className='flex w-12 flex-col items-center'>
                                <span className='text-xs sm:text-base font-bold'>Posts</span>
                                <span>{profileData.num_posts}</span>
                            </div>
                            <div className={`flex w-12 flex-col items-center ${profileData.viewable ? "cursor-pointer" : ""}`} onClick={showFollowers}>
                                <span className='text-xs sm:text-base font-bold'>Followers</span>
                                <span>{profileData.num_followers}</span>
                            </div>
                            <div className={`flex w-12 flex-col items-center ${profileData.viewable ? "cursor-pointer" : ""}`} onClick={showFollowing}>
                                <span className='text-xs sm:text-base font-bold'>Following</span>
                                <span>{profileData.num_following}</span>
                            </div>
                        </div>
                        <span className="mt-2 italic text-center mb-4">{profileData?.bio ? `"${profileData.bio}"` : 'No bio yet!'}</span>

                        <div className='flex flex-col items-center mt-4 h-[60vh] w-full'>
                            {(!profileData.viewable) ? (
                                <div className='flex flex-col items-center justify-center'>
                                    <CiLock className='w-48 h-48' />
                                    <span className='font-bold'>
                                        This account is private
                                    </span>
                                    <span>
                                        Follow them to see their posts.
                                    </span>
                                </div>
                            ) : (
                                <PostCarousel userId={id} />
                            )}
                        </div>
                    </div>
                )}
            </div>
            {showReportMenu && params.id && (
                <ReportWindow targetType='User' handleShow={setShowReportMenu} id={params.id} />
            )}
        </div>
    );
}

export default ProfileView;
