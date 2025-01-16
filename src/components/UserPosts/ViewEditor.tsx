import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import * as z from 'zod';
import { Button } from '../ui/button';
import { Input } from './ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import TipTapViewOnly from '../tiptap/TipTapViewOnly';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { apiClient } from '@/lib/api-client';
import { FaHeart, FaRegHeart, FaSignOutAlt } from 'react-icons/fa';
import { NEW_POST_ROUTE, POST_ROUTES } from '@/utils/constants';
import { Separator } from '../ui/separator';
import { IoMdSettings } from "react-icons/io";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from '@/hooks/use-toast';
import { useSelector } from 'react-redux';
import { Modal } from "flowbite-react";
import ReportWindow from '@/components/ReportWindow/ReportWindow';
import { CgUnavailable } from "react-icons/cg";
import EditPostMenu from './EditPostMenu';

function ViewEditor() {
    const params = useParams();
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [userId, setUserId] = useState("");
    const [tags, setTags] = useState([]);
    const [postIsFound, setPostIsFound] = useState(true);
    const [postLiked, setPostLiked] = useState(false);
    const [viewerIsAuthor, setViewerIsAuthor] = useState(false);
    const [showDeletePostMenu, setShowDeletePostMenu] = useState(false);
    const [showEditPostMenu, setShowEditPostMenu] = useState(false);
    const [showReportMenu, setShowReportMenu] = useState(false);
    const [visibility, setVisibility] = useState<"public" | "private" | "followersOnly" | "friendsOnly">("public");

    const navigate = useNavigate();

    const { toast } = useToast();

    const currUser = useSelector((state) => state.auth.user)
    const currToken = useSelector((state) => state.auth.token);

    useEffect(() => {
        const getPostDB = async () => {
            try {
                const res = await apiClient.get(`${POST_ROUTES}/${params.id}`, {
                    headers: {
                        Authorization: `Bearer ${currToken}`
                    }
                });
                const resIsLiked = await apiClient.get(`${POST_ROUTES}/${params.id}/likes/status`, {
                    headers: {
                        Authorization: `Bearer ${currToken}`
                    }
                })
                setContent(res.data.content);
                setTitle(res.data.title);
                setAuthor(res.data.author);
                setUserId(res.data.userId);
                setTags(res.data.tags);
                setPostLiked(resIsLiked.data.isLiked);
                setViewerIsAuthor(res.data.userId === currUser.id);
                setVisibility(res.data.visibility);
            } catch (err) {
                console.error('Error fetching user data:', err);
                setPostIsFound(false);
            }
        };
        getPostDB();
    }, [])


    const formSchema = z.object({
        title: z.string().min(5, "Too short, please add a longer title"),
        content: z.string().min(20, "Too short, please add more content"),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: 'onChange',
        defaultValues: {
            title: "",
            content: "",
        }
    });

    const handleLike = async () => {
        try {
            await apiClient.post(`${POST_ROUTES}/${params.id}/likes`, {}, {
                headers: {
                    Authorization: `Bearer ${currToken}`
                }
            })
        } catch (error) {
            console.error(error);
            toast({
                title: "Like Failed",
                description: "Unable to like this post."
            })
        } finally {
            setPostLiked(true);
            toast({
                title: "Post Liked",
                description: "You have now liked this post."
            })
        }
    }

    const handleUnlike = async () => {
        try {
            await apiClient.delete(`${POST_ROUTES}/${params.id}/likes`, {
                headers: {
                    Authorization: `Bearer ${currToken}`
                }
            })
        } catch (error) {
            console.error(error);
            toast({
                title: "Unlike Failed",
                description: "Unable to unlike this post."
            })
        } finally {
            setPostLiked(false);
            toast({
                title: "Post Unliked",
                description: "You have now unliked this post."
            })
        }
    }

    const handleDeletePost = async () => {
        try {
            await apiClient.delete(`${POST_ROUTES}/${params.id}`, {
                headers: {
                    Authorization: `Bearer ${currToken}`
                }
            })
        } catch (error) {
            toast({
                title: "Failed to Delete Post",
                description: "Unable to delete your post."
            })
            console.error(error);
        } finally {
            navigate("/home");
            toast({
                title: "Post Deleted",
                description: "Post successfully deleted."
            })
        }
    }

    return (
        <div className='mt-12 sm:mt-0 sm:p-14 no-scrollbar'>
            {postIsFound ? (
                <Form {...form}>
                    <form>
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem className='flex flex-col w-full text-center align-items justify-center'>
                                    <div className='flex flex-row w-full justify-between items-center'>
                                        <div className='w-6 h-6'>
                                            {postLiked ? (
                                                <FaHeart className='w-full h-full' onClick={handleUnlike} />
                                            ) : (
                                                <FaRegHeart className='w-full h-full' onClick={handleLike} />
                                            )}
                                        </div>
                                        <span className='text-lg sm:text-2xl'>{title}</span>
                                        <div className='w-10'>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger className='flex items-center focus:outline-none justify-center h-10 w-10 p-2 rounded-full bg-white hover:bg-gray-100'>
                                                    <IoMdSettings className='h-full w-full' />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    {viewerIsAuthor ? (
                                                        <>
                                                            <DropdownMenuItem onClick={() => setShowEditPostMenu(true)}>
                                                                Edit Post
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className='text-red-600' onClick={() => setShowDeletePostMenu(true)}>
                                                                Delete Post
                                                            </DropdownMenuItem>
                                                        </>
                                                    )
                                                        : (
                                                            <DropdownMenuItem className='text-red-600' onClick={() => setShowReportMenu(true)}>
                                                                Report
                                                            </DropdownMenuItem>
                                                        )
                                                    }
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                    <a className="text-md italic pt-2 pb-2 hover:text-slate-600" onClick={(e) => e.stopPropagation()} href={`/users/${userId}`}>{author}</a>
                                    <p className='flex flex-row justify-center'>{
                                        tags.map((item: string, idx) => idx < 8 ? ( // only show first 8 tags
                                            <p className='text-sm text-blue-400 ml-1'>{`#${tags[idx]} `}</p>
                                        ) : (<p />))
                                    }
                                    </p>
                                </FormItem>
                            )}
                        />

                        <Separator className='w-full mt-3' />

                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem className='m-6'>
                                    <FormControl>
                                        <TipTapViewOnly content={content} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
            ) : (
                <div className='flex justify-center flex-col items-center w-full h-full'>
                    <CgUnavailable className='w-24 h-24' />
                    <span className='text-xl'>Post not found.</span>
                </div>
            )}
            <Modal
                show={showDeletePostMenu}
                size="md"
                onClose={() => setShowDeletePostMenu(false)}
                popup
            >
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <FaSignOutAlt className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete this post?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={handleDeletePost}>
                                {"Yes, I'm sure"}
                            </Button>
                            <Button color="gray" onClick={() => setShowDeletePostMenu(false)}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            {showReportMenu && params.id && (
                <ReportWindow targetType='Post' handleShow={setShowReportMenu} id={params.id} />
            )}
            {showEditPostMenu && params.id && (
                <EditPostMenu defaultVisibility={visibility} handleShow={setShowEditPostMenu} id={params.id} />
            )}
        </div>
    )
}

export default ViewEditor