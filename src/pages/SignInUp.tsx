'use client'
import React from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useToast } from "@/hooks/use-toast"
import { useDispatch, useSelector } from "react-redux";
import { setSignin } from '@/state/auth/authSlice'
import journalertext from '../assets/journalertext.png';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { apiClient } from '@/lib/api-client'
import { SIGNUP_ROUTE, SIGNIN_ROUTE } from '@/utils/constants'
import { useNavigate } from 'react-router-dom';


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
  password: z.string().min(1, "Password is required"),
})

export default function SignInUp() {
  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
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

  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();


  async function onSubmitUp(values: z.infer<typeof signUpSchema>) {
    try {
      const { firstName, lastName, email, username, password } = values;

      const payload = {
        firstName,
        lastName,
        email,
        username,
        password,
      };

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

      navigate("/home");

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
    }
  }


  async function onSubmitIn(values: z.infer<typeof signInSchema>) {
    try {
      const res = await apiClient.post(SIGNIN_ROUTE, values, { withCredentials: true })

      dispatch(
        setSignin({ user: res.data.user, token: res.data.token })
      );

      toast({
        title: "Sign In Successful",
        description: `Welcome back, ${res.data.user.firstName}!`,
      });

      navigate("/home");
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
    }
  }

  const currUser = useSelector((state) => state.auth.user || { username: 'Guest' });
  console.log(currUser);

  

  return (
    <div className='w-screen h-screen flex flex-col items-center justify-center overflow-hidden bg-slate-500'>
      <div id="heading section" className='mb-8 border-4 border-transparent' style={{textShadow: "1px 1px 2px rgb(100 116 139), 0 0 1em black, 0 0 0.2em rgb(100 116 139)"}}>
        <span className='text-white brand-text text-5xl'>Vent</span>
      </div>
      <div className='flex flex-col justify-center p-3 items-center w-[90%] max-w-[30rem] h-[40rem] drop-shadow-lg bg-white rounded-lg overflow-hidden'>
        <Tabs defaultValue='signin' className="w-full h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
            <TabsTrigger value="signin">Sign In</TabsTrigger>
          </TabsList>
          <div className="flex-grow overflow-hidden">
            <TabsContent value='signup' className="p-6 h-full">
              <form onSubmit={signUpForm.handleSubmit(onSubmitUp)} className="space-y-4 p-2 h-full flex flex-col">
                <div className="space-y-2 flex-grow">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...signUpForm.register("email")} />
                    {signUpForm.formState.errors.email && (
                      <p className="text-red-500 text-sm">{signUpForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" {...signUpForm.register("username")} />
                    {signUpForm.formState.errors.username && (
                      <p className="text-red-500 text-sm">{signUpForm.formState.errors.username.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fName">First Name</Label>
                      <Input id="fName" {...signUpForm.register("firstName")} />
                      {signUpForm.formState.errors.firstName && (
                        <p className="text-red-500 text-sm">{signUpForm.formState.errors.firstName.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lName">Last Name</Label>
                      <Input id="lName" {...signUpForm.register("lastName")} />
                      {signUpForm.formState.errors.lastName && (
                        <p className="text-red-500 text-sm">{signUpForm.formState.errors.lastName.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" {...signUpForm.register("password")} />
                    {signUpForm.formState.errors.password && (
                      <p className="text-red-500 text-sm">{signUpForm.formState.errors.password.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm">Confirm Password</Label>
                    <Input id="confirm" type="password" {...signUpForm.register("confirm")} />
                    {signUpForm.formState.errors.confirm && (
                      <p className="text-red-500 text-sm">{signUpForm.formState.errors.confirm.message}</p>
                    )}
                  </div>
                </div>
                <Button type="submit" className="w-full rounded-full bg-slate-500 hover:bg-slate-600">Sign Up</Button>
              </form>
            </TabsContent>
            <TabsContent value="signin" className="p-6 h-full">
              <form onSubmit={signInForm.handleSubmit(onSubmitIn)} className="space-y-4 p-2 h-full flex flex-col">
                <div className="space-y-4 flex-grow">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input id="signin-email" type="email" {...signInForm.register("email")} />
                    {signInForm.formState.errors.email && (
                      <p className="text-red-500 text-sm">{signInForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input id="signin-password" type="password" {...signInForm.register("password")} />
                    {signInForm.formState.errors.password && (
                      <p className="text-red-500 text-sm">{signInForm.formState.errors.password.message}</p>
                    )}
                  </div>
                </div>
                <Button type="submit" className="w-full rounded-full bg-slate-500 hover:bg-slate-600">Sign In</Button>
              </form>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}