import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import emptyPfp from "@/assets/emptypfp.png";
import { apiClient } from '@/lib/api-client';
import { CHECK_CONFIRM_ROUTE, SEND_CONFIRM_ROUTE, USER_ROUTES } from '@/utils/constants';
import { setSignin } from '@/state/auth/authSlice';
import { toast, useToast } from '@/hooks/use-toast';
import PostCarousel from './PostCarousel/PostCarousel';
import { motion, AnimatePresence } from 'framer-motion';
import { LuInfo } from "react-icons/lu";
import { Separator } from './ui/separator';
import DraftCarousel from './PostCarousel/DraftCarousel';
import { Switch } from "@/components/ui/switch"
import { Label } from './ui/label';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { IoInformationCircleOutline } from "react-icons/io5";
import { MdVisibility } from 'react-icons/md';
import { RootState } from '@/state/store';
import Rightbar from './Rightbar/Rightbar';
import LoadingAnimation from './Animation/LoadingAnimation';
import { IoMdSettings } from 'react-icons/io';
import AdditionalSettings from './Settings/AdditionalSettings';
import { IoMdClose } from "react-icons/io";


function ProfileEditor() {
    const currUser = useSelector((state: RootState) => state.auth.user);
    const currToken = useSelector((state: RootState) => state.auth.token);

    const dispatch = useDispatch();
    const { toast } = useToast();

    const [editMode, setEditMode] = useState(false);
    const [draftView, setDraftView] = useState(false);
    const [verified, setVerified] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingSave, setLoadingSave] = useState(false);
    const [rightbarVisible, setRightbarVisible] = useState(false);
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        bio: '',
        pfp: emptyPfp,
        num_posts: 0,
        num_followers: 0,
        num_following: 0,
        private: false,
    });

    const [currRightbarMode, setCurrRightbarMode] = useState("followers")
    const [showAdditionalSettings, setShowAdditionalSettings] = useState(false);


    const [heldData, setHeldData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        bio: '',
        pfp: emptyPfp,
        num_posts: 0,
        num_followers: 0,
        num_following: 0,
        private: false
    });

    const [confirmBox, setConfirmBox] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [emailSending, setEmailSending] = useState(false);
    const [errorEmail, setErrorEmail] = useState(false);

    /**
     * Fetch user data from DB and sync local state
     */
    const fetchUserProfile = async () => {
        setLoading(true);
        try {

            // await new Promise((res) => setTimeout(res, 4000)); // test load 

            const response = await apiClient.get(`${USER_ROUTES}/${currUser.id}`, {
                headers: {
                    Authorization: `Bearer ${currToken}`
                }
            });

            const fetchedData = response.data || {};

            const foundData = {
                firstName: fetchedData?.firstName || '',
                lastName: fetchedData?.lastName || '',
                username: fetchedData?.username || '',
                bio: fetchedData?.bio || '',
                pfp: fetchedData?.pfp || emptyPfp,
                num_posts: fetchedData?.posts?.length || 0,
                num_followers: fetchedData?.num_followers || 0,
                num_following: fetchedData?.num_following || 0,
                private: fetchedData?.private || false
            }
            setProfileData({ ...foundData });
            setHeldData({ ...foundData });
        } catch (error) {
            console.error('Error while fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };


    const checkIfVerified = async () => {
        try {
            const res = await apiClient.get(CHECK_CONFIRM_ROUTE, {
                headers: {
                    Authorization: `Bearer ${currToken}`
                }
            })
            // console.log(res.data.isConfirmed);
            if(res.data.isConfirmed === false) {
                setConfirmBox(true);
            }
            setVerified(res.data.isConfirmed)
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Handle updates on text fields in the UI
     */
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setProfileData((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    };

    /**
     * Handles cancel button logic
     */
    const handleCancel = () => {
        // console.log(originalData);
        setProfileData({ ...heldData });
        toggleEditMode();
        // fetchUserProfile();
    };

    /**
     * Enable edit mode
     */
    const toggleEditMode = () => {
        setEditMode((prev) => !prev);
    };

    /**
     * Toggle draft viewing mode
     */
    const toggleDraftMode = () => {
        setDraftView((prev) => !prev);
    }

    /**
     * Submit updated data to server
     */
    const handleSave = async () => {
        setLoadingSave(true);
        try {
            await new Promise((res) => setTimeout(res, 4000));
            const res = await apiClient.put(
                `${USER_ROUTES}/${currUser.id}`,
                profileData,
                {
                    withCredentials: true,
                }
            );

            dispatch(setSignin({
                user: {
                    ...currUser,
                    firstName: profileData.firstName,
                    lastName: profileData.lastName,
                },
                token: currToken,
            }));

            toast({
                title: 'Profile Updated',
                description: 'Your profile has been saved!',
            });

            setHeldData({ ...profileData });
            toggleEditMode();
        } catch (error) {
            console.error('Error saving profile:', error);
            toast({
                title: 'Error',
                description: 'Could not save profile changes.',
            });
        } finally {
            setLoadingSave(false);
            fetchUserProfile();
        }
    };

    useEffect(() => {
        if (currUser?.id) {
            fetchUserProfile();
        }
        checkIfVerified();
    }, [currUser?.id]);

    const handleImageUpload = (e) => {
        const file = e.target?.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setProfileData((prevData) => ({
                    ...prevData,
                    pfp: event.target.result as string,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePrivacyChange = () => {
        setProfileData((prev) => ({
            ...prev,
            private: !profileData.private
        }))
    }

    const showFollowers = () => {
        setCurrRightbarMode("followers");
        setRightbarVisible(true);
    }

    const showFollowing = () => {
        setCurrRightbarMode("following");
        setRightbarVisible(true);
    }

    const openAdditionalSettings = () => {
        setShowAdditionalSettings(true);
    }

    
    const sendNewEmail = async () => {
        setEmailSending(true);
        try {
            // await new Promise((res) => setTimeout(res, 2000)); // test loading
            await apiClient.post(SEND_CONFIRM_ROUTE, {}, {
                headers: {
                    Authorization: `Bearer ${currToken}`
                }
            });
            setEmailSent(true);
        } catch (error) {
            console.log(error);
            setErrorEmail(true);
        } finally {
            setEmailSending(false);
        }
    }

    return (
        <div className="bg-gray-100 w-[90vw] sm:w-[75vw] h-[100vh] flex justify-center items-center p-2 sm:p-4">
            {loadingSave && (
                <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white w-[90%] h-[20%] sm:w-[20%] sm:h-[20%] flex items-center justify-center border-2 rounded-xl">
                        <LoadingAnimation />
                    </div>
                </div>
            )}
            {rightbarVisible && (
                <div
                    className="fixed top-0 w-[80%] sm:w-[40%] right-0 h-full z-20 transition-transform duration-300 ease-in-out overflow-hidden"
                    style={{
                        transform: !rightbarVisible ? `translateX(100%)` : `translateX(0)`,
                    }}
                >
                    <Rightbar close={() => setRightbarVisible(false)} mode={currRightbarMode} id={currUser.id} />
                </div>
            )}
            {showAdditionalSettings && (
                <div>
                    <AdditionalSettings close={() => setShowAdditionalSettings(false)} />
                </div>
            )}
            {!verified && confirmBox && (
                <div className='z-10 absolute md:top-10 p-4 md:left-[70%] flex flex-col items-center justify-center w-64 h-32 rounded-xl drop-shadow-xl border-2 bg-white'>
                    <IoMdClose className='cursor-pointer opacity-30 absolute right-[5%] top-[5%] w-6 h-6' onClick={() => setConfirmBox(false)}/>
                    <div className='flex flex-row items-center justify-center gap-x-2'>
                        <LuInfo className='w-16 h-16 opacity-50' />
                        <span className='text-xs sm:text-sm'>
                            Check your email to verify your account.
                        </span>
                    </div>
                    <a className={`italic ${emailSent || errorEmail || emailSending ? "" : "cursor-pointer underline"} text-xs text-center sm:text-sm`} onClick={sendNewEmail}>
                        {errorEmail ? "Error sending your email." : emailSending ? "Sending..." :
                        emailSent ? (
                            "Sent to inbox!"
                        ) : (
                            "Send new email"
                        )}
                    </a>
                </div>
            )}
            <div className="flex flex-col bg-white border-4 rounded-2xl w-full sm:w-[80%] justify-center items-center h-[100%] overflow-y-auto">
                {loading ? (
                    <div>
                        <LoadingAnimation />
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        {editMode ? (
                            <motion.div
                                key="editing"
                                initial={{ x: 0, opacity: 1 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: '100%', opacity: 0 }}
                                transition={{ duration: 0.1 }}
                                className="bg-white border-4 border-transparent rounded-2xl p-8 w-full h-full flex flex-col gap-3 items-center">
                                <div className="w-full flex flex-row items-center justify-between">
                                    <div className='w-8 h-8'>

                                    </div>
                                    <div className='flex flex-row items-center justify-center'>
                                        <img src={profileData.pfp || "/placeholder.svg"} className="bg-slate-500 border-transparent rounded-full w-24 h-24" alt="Profile" />
                                        <label htmlFor="imageUpload" className="m-4 mt-6 w-40 h-10 rounded-2xl flex items-center justify-center bg-slate-400 hover:bg-slate-500 cursor-pointer text-white">
                                            Upload
                                        </label>
                                        <input
                                            id="imageUpload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageUpload}
                                        />
                                    </div>
                                    <div>
                                        <IoMdSettings className='w-8 h-8 cursor-pointer' onClick={openAdditionalSettings} />
                                    </div>
                                </div>
                                <div className="flex flex-row items-center m-4">
                                    <Input
                                        className='m-2 border-black border-[0.2px]'
                                        id="firstName"
                                        value={profileData?.firstName || ''}
                                        onChange={handleInputChange}
                                        placeholder="First name"
                                    />
                                    <Input
                                        className='m-2 border-black border-[0.2px]'
                                        id="lastName"
                                        value={profileData?.lastName || ''}
                                        onChange={handleInputChange}
                                        placeholder="Last name"
                                    />
                                </div>
                                <Input
                                    className='m-2 border-black border-[0.2px]'
                                    id="bio"
                                    value={profileData?.bio || ''}
                                    onChange={handleInputChange}
                                    placeholder="Add your bio"
                                />
                                <div className='flex items-center'>
                                    <HoverCard>
                                        <HoverCardTrigger className='flex items-center justify-center gap-2'>
                                            <Switch id="set-private-account" checked={profileData.private === true} onCheckedChange={handlePrivacyChange} className='w-10' />
                                            <Label className='text-basis' htmlFor="set-private-account">Private account</Label>
                                            <IoInformationCircleOutline className='mt-1 w-5 h-5' />
                                        </HoverCardTrigger>
                                        <HoverCardContent>
                                            <span className='text-sm'>
                                                Only followers that you follow back can see your posts.
                                            </span>
                                        </HoverCardContent>
                                    </HoverCard>
                                </div>
                                <div className="mt-4">
                                    <Button onClick={handleCancel} className="rounded-xl bg-slate-400 m-2">Cancel</Button>
                                    <Button onClick={handleSave} className="rounded-xl bg-slate-600 m-2">Save</Button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="viewing"
                                initial={{ x: 0, opacity: 1 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: '-100%', opacity: 0 }}
                                transition={{ duration: 0.1 }} className="bg-white overflow-hidden p-4 w-full h-full flex flex-col items-center">
                                <div id="top row" className='flex flex-col w-full items-center justify-center mb-4'>
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
                                <Separator className='w-full mb-4' />
                                <div id="numbers" className='max-w-96 flex w-full justify-evenly p-2 border-2 rounded-xl mb-4'>
                                    <div className='flex w-12 flex-col items-center'>
                                        <span className='text-xs sm:text-base font-bold'>Posts</span>
                                        <span>{profileData.num_posts}</span>
                                    </div>
                                    <div className='flex w-12 flex-col items-center cursor-pointer' onClick={showFollowers}>
                                        <span className='text-xs sm:text-base font-bold'>Followers</span>
                                        <span>{profileData.num_followers}</span>
                                    </div>
                                    <div className='flex w-12 flex-col items-center cursor-pointer' onClick={showFollowing}>
                                        <span className='text-xs sm:text-base font-bold'>Following</span>
                                        <span>{profileData.num_following}</span>
                                    </div>
                                </div>
                                <span className="mt-2 italic text-center mb-4">{profileData?.bio ? `"${profileData.bio}"` : 'No bio yet!'}</span>
                                <div className='flex flex-col sm:flex-row sm:gap-x-2 w-full items-center'>
                                    <Button onClick={toggleEditMode} className="mb-2 sm:mb-0 w-full text-white rounded-xl bg-slate-400 hover:text-white hover:bg-black">Edit Profile</Button>
                                    <Button onClick={toggleDraftMode} className="w-full text-white rounded-xl bg-slate-300 hover:text-white hover:bg-black">{draftView ? "View Posts" : "View Drafts"}</Button>
                                </div>
                                <AnimatePresence mode="wait">
                                    {!draftView ? (
                                        <motion.div
                                            key="viewing posts"
                                            initial={{ x: 0, opacity: 1 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            exit={{ x: '100%', opacity: 0 }}
                                            transition={{ duration: 0.1 }}
                                            className='flex flex-col items-center mt-4 h-[60vh] w-full'>
                                            <PostCarousel userId={currUser.id} />
                                        </motion.div>

                                    ) : (
                                        <motion.div
                                            key="viewing drafts"
                                            initial={{ x: 0, opacity: 1 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            exit={{ x: '-100%', opacity: 0 }}
                                            transition={{ duration: 0.1 }}
                                            className='flex flex-col items-center mt-4 h-[60vh] w-full'>
                                            <DraftCarousel userId={currUser.id} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                            </motion.div>
                        )}
                    </AnimatePresence >
                )}
            </div>
        </div>
    );
}

export default ProfileEditor;
