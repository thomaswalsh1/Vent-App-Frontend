'use client'
import React, { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useToast } from "@/hooks/use-toast"
import { useDispatch, useSelector } from "react-redux";
import { setSignin } from '@/state/auth/authSlice'
import { FaAppStoreIos } from "react-icons/fa6";
import { IoLogoGooglePlaystore } from 'react-icons/io5'
import AppStore from '@/assets/AppStore.svg';
import PlayStore from '@/assets/GooglePlay.svg';
import OpeningAnimation from '@/components/Animation/OpeningAnimation';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { AnimatePresence, motion } from "motion/react"
import { apiClient } from '@/lib/api-client'
import { SIGNUP_ROUTE, SIGNIN_ROUTE, APP_STORE_ROUTE } from '@/utils/constants'
import { useNavigate } from 'react-router-dom';
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { RootState } from '@/state/store'
import LoadingAnimation from '@/components/Animation/LoadingAnimation'
import useMediaQuery from '@mui/material/useMediaQuery'
import { ToastAction } from '@/components/ui/toast'
import MoreInfo from '@/components/about/MoreInfo'
import Support from '@/support/Support'



const signUpSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm: z.string(),
}).refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
})

const signInSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password is required"),

})

export default function NewSign() {

    const { toast } = useToast();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const [signInMode, setSignInMode] = useState(false);
    const currUser = useSelector((state: RootState) => state.auth.user);
    const [signInLoading, setSignInLoading] = useState(false);
    const [currentForm, setCurrentForm] = useState(0);
    const [direction, setDirection] = useState(0);
    const myForms = ["Email", "Name", "Password"];
    const isDesktop = useMediaQuery("(min-width: 768px)", {noSsr: true})
    console.log(isDesktop);
    const [initialized, setInitialized] = useState(false);


    useEffect(() => {
        setTimeout(() => setIsLoading(false), 200);
    }, [])


    const checkMobileScreen = async () => {
        await new Promise((res) => setTimeout(res, 1000))
        if (!isDesktop) {
            toast({
                title: "Mobile screen detected",
                description: "We highly recommend using the Vent app on mobile devices.",
                action: <ToastAction altText="AppStore">Go to app store</ToastAction>
            })
        }
    }

    useEffect(() => {
        checkMobileScreen();
    }, [isDesktop])

    async function handleSubmitSignUp(values: z.infer<typeof signUpSchema>) {
        setSignInLoading(true);
        try {

            const { firstName, lastName, email, username, password } = values;

            const payload = {
                firstName,
                lastName,
                email,
                username,
                password,
            };

            // await new Promise((resolve) => setTimeout(resolve, 5000)) // for testing the loading screen

            const res = await apiClient.post(SIGNUP_ROUTE, payload, { withCredentials: true });

            console.log(res);

            const resSignIn = await apiClient.post(SIGNIN_ROUTE, values, { withCredentials: true })

            dispatch(
                setSignin({ user: resSignIn.data.user, token: resSignIn.data.token })
            );

            toast({
                title: "Sign In Successful",
                description: `Welcome back, ${res.data.user.firstName}!`,
            });



        } catch (err: any) {
            if (err.response?.status === 409) {
                console.error("Conflict:", err.response.data.message);
                toast({
                    title: "Conflict",
                    description: err.response.data.message
                })
            } else {
                console.error("Signup Error:", err.response?.data || err.message);
                toast({
                    title: "Signup Error",
                    description: err.response.data.message
                })
            }
        } finally {
            setSignInLoading(false);
            navigate("/home");
        }
    }


    async function handleSubmitSignIn(values: z.infer<typeof signInSchema>) {
        setSignInLoading(true);
        try {

            // await new Promise((resolve) => setTimeout(resolve, 5000)) // for testing the loading screen

            const res = await apiClient.post(SIGNIN_ROUTE, values, { withCredentials: true })

            dispatch(
                setSignin({ user: res.data.user, token: res.data.token })
            );

            toast({
                title: "Sign In Successful",
                description: `Welcome back, ${res.data.user.firstName}!`,
            });

        } catch (err: any) {
            // Default error message
            const defaultErrorMessage = "An unexpected error occurred. Please try again.";

            // Check if the error has a response and handle specific status codes
            if (err.response) {
                const status = err.response.status;
                const errorMessage = err.response.data?.message || defaultErrorMessage;

                if (status === 401 || status === 404) {
                    toast({
                        title: "Error",
                        description: errorMessage,
                    });
                } else {
                    toast({
                        title: "Sign In Error",
                        description: errorMessage,
                    });
                }
            } else {
                // Handle cases where the error doesn't have a response
                console.error("Sign In Error:", err.message || err);
                toast({
                    title: "Sign In Error",
                    description: err.message || defaultErrorMessage,
                });

            }
        } finally {
            setSignInLoading(false);
            navigate("/home");
        }
    }

    const handleGoBack = async () => {
        if (currentForm > 0) {
            // Set direction first
            setDirection(-1);
            // Use setTimeout to ensure direction state is updated before form change
            setTimeout(() => {
                setCurrentForm(currentForm - 1);
            }, 0);
        }
    };

    const handleGoForward = async () => {
        if (currentForm < myForms.length - 1) { // handle validation of input page
            const fieldMap: Record<number, (keyof z.infer<typeof signUpSchema>)[]> = {
                0: ["email"],
                1: ["firstName", "lastName", "username"],
                2: ["password", "confirm"]
            }

            //
            const currentFields = fieldMap[currentForm];
            const stepValid = await trigger(currentFields)

            if (stepValid && currentForm < myForms.length - 1) {
                setDirection(1)
                setTimeout(() => {
                    setCurrentForm(currentForm + 1)

                    setTimeout(() => {
                        if (currentForm === 0) { // from email
                            const firstNameInput = document.querySelector('input[name="firstName"]');
                            if (firstNameInput instanceof HTMLElement) {
                                firstNameInput.focus();
                            }
                        }

                        if (currentForm === 1) { // from names
                            const passwordInput = document.querySelector('input[name="password"]');
                            if (passwordInput instanceof HTMLElement) {
                                passwordInput.focus();
                            }
                        }

                        if (currentForm === 2) { // from password
                            handleSubmitSignUp
                        }
                    }, 101) // add just enough for input to be on dom
                }, 0)
            }
        }
    };

    const switchToSignIn = () => {
        setSignInMode(true);
    }

    const switchToSignUp = () => {
        setSignInMode(false);
    }


    const { register, handleSubmit, formState: { errors }, trigger } = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            username: "",
            password: "",
            confirm: "",
        },
    })

    const { register: register2, handleSubmit: handleSubmit2, formState: { errors: errors2 }, trigger: trigger2 } = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })


    const renderSwitch = (fieldType: string) => {
        switch (fieldType) {
            case "Email":
                return (
                    <div className='flex flex-col gap-y-2'>
                        {errors.email && (
                            <p className="w-full h-2 text-sm text-red-500"></p> // avoid shifting in form
                        )}
                        <Label className='text-sm sm:text-[1rem]'>Email</Label>
                        <Input className='' style={{ fontSize: "1rem" }} size={40} id="email" placeholder='Enter your email' {...register("email")} onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault()
                                handleGoForward();
                            }
                        }} />
                        {errors.email && (
                            <p className="w-full h-2 text-sm text-red-500">{errors.email.message}</p>
                        )}
                    </div>
                )
            case "Name":
                return (
                    <div className="w-[80%] space-y-0 sm:space-y-4">
                        <div className="w-full space-y-1 sm:space-y-2">
                            <Label className='text-xs sm:text-[1rem]'>First Name</Label>
                            <Input
                                style={{ fontSize: "1rem" }}
                                placeholder="Enter your first name"
                                {...register("firstName")}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        const lastNameInput = document.querySelector('input[name="lastName"]');
                                        if (lastNameInput instanceof HTMLElement) {
                                            lastNameInput.focus();
                                        }
                                    }
                                }}
                            />
                            {errors.firstName && (
                                <p className="text-xs sm:text-sm text-red-500">{errors.firstName.message}</p>
                            )}
                        </div>
                        <div className="space-y-1 sm:space-y-2">
                            <Label className='text-xs sm:text-[1rem]'>Last Name</Label>
                            <Input
                                style={{ fontSize: "1rem" }}
                                placeholder="Enter your last name"
                                {...register("lastName")}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        const lastNameInput = document.querySelector('input[name="username"]');
                                        if (lastNameInput instanceof HTMLElement) {
                                            lastNameInput.focus();
                                        }
                                    }
                                }}
                            />
                            {errors.lastName && (
                                <p className="text-xs sm:text-sm text-red-500">{errors.lastName.message}</p>
                            )}
                        </div>
                        <div className="space-y-1 sm:space-y-2">
                            <Label className='text-xs sm:text-[1rem]'>Username</Label>
                            <Input
                                style={{ fontSize: "1rem" }}
                                placeholder="Choose a username"
                                {...register("username")}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault()
                                        handleGoForward();
                                    }
                                }}
                            />
                            {errors.username && (
                                <p className="text-xs sm:text-sm text-red-500">{errors.username.message}</p>
                            )}
                        </div>
                    </div>
                )
            case "Password":
                return (
                    <div className="w-[80%] space-y-4">
                        <div className="space-y-2">
                            <Label className='text-sm sm:text-[1rem]'>Password</Label>
                            <Input
                                style={{ fontSize: "1rem" }}
                                type="password"
                                placeholder="Enter your password"
                                {...register("password")}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        const lastNameInput = document.querySelector('input[name="confirm"]');
                                        if (lastNameInput instanceof HTMLElement) {
                                            lastNameInput.focus();
                                        }
                                    }
                                }}
                            />
                            {errors.password && (
                                <p className="text-sm text-red-500">{errors.password.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label className='text-sm sm:text-[1rem]'>Confirm Password</Label>
                            <Input
                                style={{ fontSize: "1rem" }}
                                type="password"
                                placeholder="Confirm your password"
                                {...register("confirm")}
                            />
                            {errors.confirm && (
                                <p className="text-sm text-red-500">{errors.confirm.message}</p>
                            )}
                        </div>
                    </div>
                )
            default:
                return null
        }
    }

    return (

        <div className='w-screen h-screen flex flex-col sm:flex-row items-center justify-center overflow-hidden bg-slate-500'>
            {signInLoading && (
                <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white w-[90%] h-[20%] sm:w-[20%] sm:h-[20%] flex items-center justify-center border-2 rounded-xl">
                        <LoadingAnimation />
                    </div>
                </div>
            )}

            <div className='flex flex-col items-center sm:items-center w-[90%] sm:w-[70%] h-[30%] sm:h-full z-10 overflow-hidden justify-center'>
                {/* <OpeningAnimation /> */}
                {!isLoading && (
                    <>
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: "0%" }}

                        >
                            <div id="heading section" className='border-4 border-transparent' style={{ textShadow: "1px 1px 2px rgb(100 116 139), 0 0 1em black, 0 0 0.2em rgb(100 116 139)" }}>
                                <span className='text-white brand-text text-7xl sm:text-9xl'>Vent</span>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: "-100%" }}
                            animate={{ opacity: "100%" }}
                        >
                            <span className='text-white italic text-sm sm:text-xl' >By Thomas Walsh</span>
                        </motion.div>
                        <div className='hidden sm:flex -mb-10'>
                            <MoreInfo />
                        </div>
                        <div id="downloadAppsDesktop" className='mt-4 sm:mt-0 flex flex-row justify-center sm:w-full gap-x-2 '>
                            <div className='hidden sm:flex w-28 sm:w-48 sm:h-48'>
                                <img className='object-cover' src={AppStore} />
                            </div>
                            <div className='hidden sm:flex w-28 sm:w-48 sm:h-48'>
                                <img className='object-cover' src={PlayStore} />
                            </div>
                            <div className='bg-white flex sm:hidden'>
                                <FaAppStoreIos className='w-8 h-8' />
                            </div>
                            <div className='bg-white flex sm:hidden'>
                                <IoLogoGooglePlaystore className='w-8 h-8' />
                            </div>
                        </div>

                    </>
                )}

            </div>
            <div className='sm:hidden relative top-6 z-20 flex'>
                <MoreInfo />
            </div>
            <div id="enter half" className='w-[100%] sm:w-[50%] h-[70%] sm:h-full flex items-center justify-center bg-white z-10'>
                <div className='w-[90%] h-full my-2 flex flex-col justify-center p-3 items-center bg-white rounded-lg overflow-hidden'>
                    <div className='absolute w-fit h-fit top-1 right-1'>
                        <Support />
                    </div>
                    <div id="getStarted" className='text-4xl'>
                        <span className='brand-text'>{!signInMode ? "Get Started" : "Sign In"}</span>
                    </div>
                    <div>
                        <span className='italic'>{!signInMode ? "Already Have an Account?" : "Creating New Account?"} <a className="cursor-pointer to-blue-500 underline" onClick={!signInMode ? switchToSignIn : switchToSignUp}>{!signInMode ? "Sign In" : "Sign Up"}</a></span>
                    </div>
                    <div className="w-full h-[40%] sm:h-[50%] md:h-[50%] my-8 sm:my-0 flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            {!signInMode ? (
                                <motion.div
                                    className='w-full'>
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={currentForm}
                                            initial={{ x: direction === 1 ? 100 : -100, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            exit={{ x: direction === 1 ? -100 : 100, opacity: 0 }}
                                            transition={{ duration: 0.1 }}
                                            className="w-full h-full flex items-center justify-center"
                                        >
                                            {renderSwitch(myForms[currentForm])}

                                        </motion.div>
                                    </AnimatePresence>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="Sign In"
                                    initial={{ x: direction === 1 ? 100 : -100, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: direction === 1 ? -100 : 100, opacity: 0 }}
                                    transition={{ duration: 0.1 }}
                                    className="w-full h-full flex items-center justify-center"
                                >
                                    <div className="w-full space-y-4">
                                        <div className="space-y-2">
                                            <Label className='text-sm sm:text-[1rem]'>Email</Label>
                                            <Input
                                                style={{ fontSize: "1rem" }}
                                                type="email"
                                                placeholder="Enter your Email"
                                                {...register2("email")}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();
                                                        const passwordInput = document.querySelector('input[name="password"]');
                                                        if (passwordInput instanceof HTMLElement) {
                                                            passwordInput.focus();
                                                        }
                                                    }
                                                }}
                                            />
                                            {errors2.email && (
                                                <p className="text-sm text-red-500">{errors2.email.message}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label className='text-sm sm:text-[1rem]'>Password</Label>
                                            <Input
                                                style={{ fontSize: "1rem" }}
                                                type="password"
                                                placeholder="Enter your password"
                                                {...register2("password")}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();
                                                    }
                                                }}
                                            />
                                            {errors2.password && (
                                                <p className="text-sm text-red-500">{errors2.password.message}</p>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-center flex-row gap-4 w-full mt-4">
                        <button
                            onClick={handleGoBack}
                            disabled={currentForm === 0 || signInMode}
                            className={`p-2 bg-gray-300 rounded ${currentForm === 0 || signInMode ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-400"
                                }`}
                        >
                            <MdNavigateBefore size={24} />
                        </button>
                        <button
                            onClick={!signInMode ? (currentForm !== 2 ? handleGoForward : handleSubmit(handleSubmitSignUp)) : handleSubmit2(handleSubmitSignIn)}
                            className={"p-2 bg-gray-300 rounded hover:bg-gray-400"}
                        >
                            {
                                !signInMode ? (
                                    currentForm === 2 ? (
                                        <p>Sign Up</p>
                                    ) : (
                                        <MdNavigateNext size={24} />

                                    )) :
                                    (<p>Sign In</p>)
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}