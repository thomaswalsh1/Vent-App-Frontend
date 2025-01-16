import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import TipTap from './tiptap/TipTap';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast"
import { apiClient } from '@/lib/api-client';
import { NEW_POST_ROUTE, POST_ROUTES, USER_ROUTES } from '@/utils/constants';
import { useSelector } from 'react-redux';
import store, { RootState } from '@/state/store';
import { ContentMatch } from '@tiptap/pm/model';
import { motion, AnimatePresence } from 'framer-motion';
import TipTapViewOnly from './tiptap/TipTapViewOnly';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import TagInput from './InputtingTags/TagInput';
import { Separator } from "@/components/ui/separator"
import { HoverCard, HoverCardTrigger, HoverCardContent } from './ui/hover-card';


function TextEditor() {
    const { toast } = useToast()

    const currUser = useSelector((state: RootState) => state.auth.user);
    const currToken = useSelector((state: RootState) => state.auth.token)
    const [isPrivate, setIsPrivate] = useState(false);
    const [onFinalize, setOnFinalize] = useState(false);
    const [heldContent, setHeldContent] = useState("");
    const [heldTitle, setHeldTitle] = useState("");
    const [tags, setTags] = useState<string[]>([])

    useEffect(() => {
        const fetchIsPrivate = async () => {
            try {
                const res = await apiClient.get(`${USER_ROUTES}/${currUser.id}`, {
                    headers: {
                        Authorization: `Bearer ${currToken}`
                    }
                });
                setIsPrivate(res.data.private);
                finalizeForm.setValue('visibility', res.data.private ? 'followersOnly' : 'public');
            } catch (error) {
                console.error(error);
            }
        }
        fetchIsPrivate();
    }, [])


    const formSchema = z.object({
        title: z.string().min(5, "Too short, please add a longer title"),
        content: z.string().min(20, "Too short, please add more content"),
    })

    const finalizedPostSchema = z.object({
        tags: z.array(
            z.string()),
        visibility: z.union([
            z.literal('private'),
            z.literal('public'),
            z.literal('friendsOnly'),
            z.literal('followersOnly')
        ]),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: 'onChange',
        defaultValues: {
            title: "",
            content: "",
        }
    });

    const finalizeForm = useForm<z.infer<typeof finalizedPostSchema>>({
        resolver: zodResolver(finalizedPostSchema),
        defaultValues: {
            tags: [],
            visibility: isPrivate ? 'followersOnly' : 'public'
        }
    })

    const navigate = useNavigate();



    // switch to submission page
    const switchToSubmit = () => {
        setHeldTitle(form.getValues("title"));
        setHeldContent(form.getValues("content"));
        setOnFinalize(true);
    }

    const switchToEditing = () => {
        form.setValue("title", heldTitle);
        form.setValue("content", heldContent);
        setOnFinalize(false);
        console.log(form.getValues());
    }

    const handlePost = async (data: z.infer<typeof formSchema>) => {
        try {

            const postData = {
                title: data.title,
                content: data.content,
                author: currUser.username,
                userId: currUser.id,
                tags,
                visibility: finalizeForm.getValues("visibility"),
            }

            const res = await apiClient.post(NEW_POST_ROUTE, postData, { withCredentials: true })
            const resGetUser = await apiClient.get(`${USER_ROUTES}/${currUser.id}`, {
                headers: {
                    Authorization: `Bearer ${currToken}`
                }
            });

            const userPosts = resGetUser.data.posts;

            const updatedPosts = [...userPosts, res.data._id];

            const resCompletePostUpdate = await apiClient.put(`${USER_ROUTES}/${currUser.id}`, {
                posts: updatedPosts
            }, {
                headers: {
                    Authorization: `Bearer ${currToken}`
                }
            })
        } catch (err) {
            console.log(err);
        } finally {
            toast({
                title: "Journal Posted",
                description: "Check your profile for more posts.",
            })
            navigate("/home");
        }
    }

    const handleSaveDraft = async (data: z.infer<typeof formSchema>) => {
        try {
            const draftData = {
                title: data.title,
                content: data.content,
                author: currUser.username,
                userId: currUser.id,
                tags,
                visibility: finalizeForm.getValues("visibility"),
            }

            const res = await apiClient.get(`${USER_ROUTES}/${currUser.id}`, {
                headers: {
                    Authorization: `Bearer ${currToken}`
                }
            });

            const userDrafts = res.data.drafts;

            // new set of drafts
            const updatedDrafts = [...userDrafts, draftData];

            const resCompleteDraftUpdate = await apiClient.put(`${USER_ROUTES}/${currUser.id}`, {
                drafts: updatedDrafts
            }, { withCredentials: true })

            console.log(resCompleteDraftUpdate);
        } catch (err) {
            console.log(err);
        } finally {
            toast({
                title: "Draft Saved",
                description: "Check your profile for more drafts.",
            })
            navigate("/home");
        }
    }


    return (
        <div className='p-4 w-full h-full overflow-y-scroll overflow-x-hidden'>
            <div id='container' className='h-full w-full'>
                <AnimatePresence mode="wait">
                    {!onFinalize ? (
                        <motion.div
                            key="editor"
                            initial={{ x: 0, opacity: 1 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: '-100%', opacity: 0 }}
                            transition={{ duration: 0.1 }}
                            className="w-full h-full"
                        >
                            <Form {...form}>
                                <form>
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem className='sm:mx-10'>
                                                <FormLabel>Title</FormLabel>
                                                <FormControl>
                                                    <Input placeholder={field.value || heldTitle} onChange={(jsonContent) => field.onChange(jsonContent)} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="content"
                                        render={({ field }) => (
                                            <FormItem className='mt-2 sm:m-6'>
                                                <FormControl>
                                                    <TipTap content={field.value || heldContent} onChange={(jsonContent) => { field.onChange(jsonContent); }} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className='flex justify-center items-center'>
                                        <Button onClick={form.handleSubmit(switchToSubmit)} className="w-24 rounded-xl bg-slate-600 m-1" type='button'>Next</Button>
                                    </div>
                                </form>
                            </Form>
                        </motion.div>
                    ) : (

                        <motion.div
                            key="finalize"
                            initial={{ x: '100%', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: '100%', opacity: 0 }}
                            transition={{ duration: 0.1 }}
                            className="w-full h-full flex justify-center"
                        >
                            <div className='w-full h-full flex flex-col items-center '>
                                <div id="split-section" className='flex flex-col sm:flex-row h-full sm:h-[90%] w-full m-1 overflow-y-scroll sm:overflow-hidden'>
                                    <div id="left-side" className='sm:h-full sm:m-2 w-full'>
                                        <div className='flex justify-center font-bold'>
                                            {heldTitle}
                                        </div>
                                        {/* Preview Editor Content */}
                                        <div className='w-full h-full sm:h-[95%] rounded-xl sm:p-2 border-2'>
                                            <TipTapViewOnly content={heldContent} />
                                        </div>
                                    </div>
                                    <div id="tags-side" className='flex h-full w-full p-5'>
                                        {/* Form for tags and visibility */}
                                        <div className='w-full h-full sm:h-full sm:m-2'>
                                            <div id="finalized-form" className='flex flex-col gap-y-2 w-full h-fit sm:h-full justify-center sm:justify-between'>
                                                <Form {...finalizeForm}>
                                                    <form className=''>
                                                        <FormField
                                                            control={finalizeForm.control}
                                                            name="tags"
                                                            render={({ field }) => (
                                                                <FormItem className='flex flex-col w-full h-full items-center justify-center'>
                                                                    <FormLabel className='sm:m-2 sm:mt-4 text-lg'>Tags:</FormLabel>
                                                                    <FormControl className='w-full h-full'>
                                                                        <TagInput
                                                                            value={tags}
                                                                            onChange={(newTags) => {
                                                                                setTags(newTags);
                                                                                field.onChange(newTags);
                                                                            }}
                                                                            placeholder="Add tags..."
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <Separator />
                                                        <FormField
                                                            control={finalizeForm.control}
                                                            name="visibility"
                                                            render={({ field }) => (
                                                                <FormItem className='mx-2 sm:mx-10 flex flex-row gap-2 items-center justify-center'>
                                                                    <FormLabel className='sm:m-2 mt-4 text-basis sm:text-lg' >Visibility: </FormLabel>

                                                                    <FormControl>
                                                                        <Select
                                                                            value={field.value}
                                                                            onValueChange={(value) => field.onChange(value)}
                                                                        >
                                                                            <SelectTrigger className="w-full sm:w-[180px]">
                                                                                <SelectValue placeholder="Choose Visibility" />
                                                                            </SelectTrigger>
                                                                            {isPrivate ? (
                                                                                <HoverCard>
                                                                                    <SelectContent>
                                                                                        <SelectItem value="private">Private</SelectItem>
                                                                                        <SelectItem value="friendsOnly">Friends Only</SelectItem>
                                                                                        <SelectItem value="followersOnly">Followers Only</SelectItem>
                                                                                        <HoverCardTrigger>
                                                                                            <SelectItem disabled={isPrivate} value="public">Public</SelectItem>
                                                                                        </HoverCardTrigger>
                                                                                    </SelectContent>
                                                                                    <HoverCardContent className='text-sm'>
                                                                                        Disable private account to post publicly.
                                                                                    </HoverCardContent>
                                                                                </HoverCard>
                                                                            ) : (
                                                                                <SelectContent>
                                                                                    <SelectItem disabled={isPrivate} value="public">Public</SelectItem>
                                                                                    <SelectItem value="private">Private</SelectItem>
                                                                                    <SelectItem value="friendsOnly">Friends Only</SelectItem>
                                                                                    <SelectItem value="followersOnly">Followers Only</SelectItem>
                                                                                </SelectContent>
                                                                            )}

                                                                        </Select>
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </form>
                                                </Form>
                                                <div id="buttons" className='flex flex-row items-center justify-center'>
                                                    <Button onClick={() => handlePost({
                                                        title: heldTitle,
                                                        content: heldContent
                                                    })} className='sm:w-24 bg-slate-600 rounded-xl m-1'>
                                                        Post
                                                    </Button>
                                                    <Button onClick={() => handleSaveDraft({
                                                        title: heldTitle,
                                                        content: heldContent
                                                    })} className='sm:w-24 bg-slate-600 rounded-xl m-1'>
                                                        Save Draft
                                                    </Button>
                                                    <Button onClick={switchToEditing} className='sm:w-24 bg-slate-400 rounded-xl m-1'>
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default TextEditor