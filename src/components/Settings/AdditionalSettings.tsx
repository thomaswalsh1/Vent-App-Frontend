import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Modal, ModalBody, ModalHeader } from 'flowbite-react'
import { MdAdminPanelSettings } from "react-icons/md";
import { Separator } from '../ui/separator';
import { Textarea } from '../ui/textarea';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';
import { BiLeftArrow, BiShow } from "react-icons/bi";
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@radix-ui/react-hover-card';
import { FaChevronLeft } from 'react-icons/fa';
import LoadingAnimation from '../Animation/LoadingAnimation';
import { useToast } from '@/hooks/use-toast';
import { Description } from '@radix-ui/react-toast';

function AdditionalSettings({ close }: { close: () => void }) {

    const currUser = useSelector((state: RootState) => state.auth.user)

    const [showEmail, setShowEmail] = useState(false);

    const [resetEmailScreen, setResetEmailScreen] = useState(false)
    const [resetPasswordScreen, setResetPasswordScreen] = useState(false)
    const [deleteAccountScreen, setDeleteAccountScreen] = useState(false)

    const [emailIsConfirmed, setEmailIsConfirmed] = useState(false);

    const { toast } = useToast();

    const [loading, setLoading] = useState(true);

    const [emailSendingResetEmail, setEmailSendingResetEmail] = useState(false);
    const [emailSentResetEmail, setEmailSentResetEmail] = useState(false);

    const [emailSendingResetPassword, setEmailSendingResetPassword] = useState(false);
    const [emailSentResetPassword, setEmailSentResetPassword] = useState(false);

    const [emailSendingDeleteAccount, setEmailSendingDeleteAccount] = useState(false);
    const [emailSentDeleteAccount, setEmailSentDeleteAccount] = useState(false);

    const checkEmailConfirmed = async () => {
        try {

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        checkEmailConfirmed()
    }, [])

    const sendResetEmail = async () => {
        setEmailSendingResetEmail(true)
        try {
            await new Promise((res) => setTimeout(res, 4000)); // testing load
        } catch (error) {
            console.error(error)
            toast({
                title: "Reset Email Failed",
                description: "Failed to send email with instructions."
            })
        } finally {
            setEmailSendingResetEmail(false);
            setEmailSentResetEmail(true);
            toast({
                title: "Email Sent",
                description: "Check your inbox for instructions on resetting your email."
            })
        }
    }

    const sendResetPassword = async () => {
        setEmailSendingResetPassword(true)
        try {
            await new Promise((res) => setTimeout(res, 4000)); // testing load
        } catch (error) {
            console.error(error)
            toast({
                title: "Reset Password Failed",
                description: "Failed to send email with instructions."
            })
        } finally {
            setEmailSendingResetPassword(false);
            setEmailSentResetPassword(true);
            toast({
                title: "Email Sent",
                description: "Check your inbox for instructions on resetting your password."
            })
        }
    }

    const handleDeleteAccount = async () => {
        setEmailSendingDeleteAccount(true)
        try {
            await new Promise((res) => setTimeout(res, 4000)); // testing load
        } catch (error) {
            console.error(error)
            toast({
                title: "Delete Account Email Failed",
                description: "Failed to send email with instructions."
            })
        } finally {
            setEmailSendingDeleteAccount(false);
            setEmailSentDeleteAccount(true);
            toast({
                title: "Email Sent",
                description: "Check your inbox for instructions on deleting your account."
            })
        }
    }

    return (
        <Modal
            show={true}
            onClose={close}
            size='md'
            popup
        >
            <ModalHeader />
            {!resetEmailScreen && !resetPasswordScreen && !deleteAccountScreen && (
                <ModalBody className='w-full h-full flex flex-col items-center p-4 gap-y-4'>
                    <div className='w-fit h-fit'>
                        <MdAdminPanelSettings className='w-16 h-16' />
                    </div>
                    <div>
                        <span className='text-lg font-semibold'>Additional Settings</span>
                    </div>
                    <Separator />
                    <div id="listOfItems" className='w-full gap-y-4 flex flex-col items-center justify-center'>
                        <div className='w-full flex flex-row items-center gap-x-2 justify-between'>
                            <div className='flex flex-row items-center gap-x-1'>
                                <span>Email:</span>
                                <div className=' border-2 p-1 bg-gray-100'>
                                    {showEmail ? (
                                        <span className='text-sm'>{currUser.email}</span>
                                    ) : (
                                        <span>{"*".repeat(currUser.email.length)}</span>
                                    )}
                                </div>
                                <BiShow className='cursor-pointer w-5 h-5' onClick={() => setShowEmail(!showEmail)} />
                            </div>
                            <HoverCard>
                                <HoverCardTrigger>
                                    <Button onClick={() => setResetEmailScreen(true)} className="text-white rounded-xl bg-slate-500 hover:text-white hover:bg-black">
                                        Reset Email
                                    </Button>
                                </HoverCardTrigger>
                                <HoverCardContent className='bg-white p-2 text-sm rounded-xl'>
                                    Change the email associated with this account.
                                </HoverCardContent>
                            </HoverCard>

                        </div>
                        <div className='w-full flex flex-row items-center justify-center'>
                            <HoverCard>
                                <HoverCardTrigger>
                                    <Button onClick={() => setResetPasswordScreen(true)} className="text-white rounded-xl bg-slate-500 hover:text-white hover:bg-black">
                                        Reset Password
                                    </Button>
                                </HoverCardTrigger>
                                <HoverCardContent className='bg-white p-2 text-sm rounded-xl'>
                                    Change the password associated with this account.
                                </HoverCardContent>
                            </HoverCard>
                        </div>
                        <div className='w-[50%] flex flex-row items-center justify-center'>
                            <HoverCard>
                                <HoverCardTrigger>
                                    <Button onClick={() => setDeleteAccountScreen(true)} className="text-white rounded-xl bg-red-500 hover:text-white hover:bg-black">
                                        Delete Account
                                    </Button>
                                </HoverCardTrigger>
                                <HoverCardContent className='bg-white p-2 text-sm rounded-xl'>
                                    Permanently delete this account.
                                </HoverCardContent>
                            </HoverCard>

                        </div>
                    </div>

                </ModalBody>
            )}
            {resetEmailScreen && (
                <ModalBody className='w-full h-full flex flex-col gap-y-4'>
                    <div className='flex flex-row w-full justify-between items-center'>
                        <FaChevronLeft className="h-6 w-6" onClick={() => setResetEmailScreen(false)} />
                        <span className='text-lg font-semibold'>Reset Email</span>
                        <div className='w-6 h-6'></div>
                    </div>

                    <div className='flex flex-col text-center gap-y-2 w-full h-full'>
                        <span>
                            An message will be sent to the email currently associated with your account containing instructions for resetting your email.
                        </span>
                        <span className='text-semibold'>
                            Check your spam folder in case the email does not appear in your inbox.
                        </span>
                    </div>

                    <div className='flex flex-row items-center justify-center'>
                        <Button onClick={!emailSendingResetEmail && !emailSentResetEmail ? sendResetEmail : null} className="text-white rounded-xl bg-slate-500 hover:text-white hover:bg-black">
                            {emailSendingResetEmail && (
                                <LoadingAnimation />
                            )}
                            {!emailSendingResetEmail && !emailSentResetEmail && (
                                <span>Send</span>
                            )}
                            {emailSentResetEmail && (
                                <span>Sent!</span>
                            )}
                        </Button>
                    </div>

                </ModalBody>
            )}
            {resetPasswordScreen && (
                <ModalBody className='w-full h-full flex flex-col gap-y-4'>
                    <div className='flex flex-row w-full justify-between items-center'>
                        <FaChevronLeft className="h-6 w-6" onClick={() => setResetPasswordScreen(false)} />
                        <span className='text-lg font-semibold'>Reset Password</span>
                        <div className='w-6 h-6'></div>
                    </div>

                    <div className='flex flex-col text-center gap-y-2 w-full h-full'>
                        <span>
                            An message will be sent to the email currently associated with your account containing instructions for resetting your password.
                        </span>
                        <span className='text-semibold'>
                            Check your spam folder in case the email does not appear in your inbox.
                        </span>
                    </div>

                    <div className='flex flex-row items-center justify-center'>
                        <Button onClick={!emailSendingResetPassword && !emailSentResetPassword ? sendResetPassword : null} className="text-white rounded-xl bg-slate-500 hover:text-white hover:bg-black">
                            {emailSendingResetPassword && (
                                <LoadingAnimation />
                            )}
                            {!emailSendingResetPassword && !emailSentResetPassword && (
                                <span>Send</span>
                            )}
                            {emailSentResetPassword && (
                                <span>Sent!</span>
                            )}
                        </Button>
                    </div>

                </ModalBody>
            )}
            {deleteAccountScreen && (
                <ModalBody className='w-full h-full flex flex-col gap-y-4'>
                    <div className='flex flex-row w-full justify-between items-center'>
                        <FaChevronLeft className="h-6 w-6" onClick={() => setDeleteAccountScreen(false)} />
                        <span className='text-lg font-semibold'>Delete Account</span>
                        <div className='w-6 h-6'></div>
                    </div>
                    <div className='flex flex-col text-center gap-y-2 w-full h-full'>
                        <span>
                            An message will be sent to the email currently associated with your account containing instructions for deleting your account.
                        </span>
                        <span className=''>
                            Check your spam folder in case the email does not appear in your inbox.
                        </span>
                        <span className='font-bold'>
                            Once an account is deleted, it cannot be undone.
                        </span>
                    </div>

                    <div className='flex flex-row items-center justify-center'>
                        <Button onClick={!emailSendingDeleteAccount && !emailSentDeleteAccount ? handleDeleteAccount: null} className="text-white rounded-xl bg-slate-500 hover:text-white hover:bg-black">
                            {emailSendingDeleteAccount && (
                                <LoadingAnimation />
                            )}
                            {!emailSendingDeleteAccount && !emailSentDeleteAccount && (
                                <span>Send</span>
                            )}
                            {emailSentDeleteAccount && (
                                <span>Sent!</span>
                            )}
                        </Button>
                    </div>
                    
                </ModalBody>
            )}

        </Modal>
    )
}

export default AdditionalSettings