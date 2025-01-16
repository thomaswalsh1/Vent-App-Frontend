import { Modal } from 'flowbite-react'
import React from 'react'
import { Button } from '../ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { z } from "zod";
import { useForm } from 'react-hook-form'
import { Form } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import { MdEditDocument } from "react-icons/md";
import { apiClient } from '@/lib/api-client'
import { useSelector } from 'react-redux'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useNavigate } from 'react-router-dom'
import { POST_ROUTES } from '@/utils/constants'
import { RootState } from '@/state/store';

interface EditPostWindowProps {
    id: string;
    handleShow: (e: boolean) => void;
    defaultVisibility: "public" | "private" | "followersOnly" | "friendsOnly" 
}

const editPostSchema = z.object({
    visibility: z
        .enum([
            "public",
            "private",
            "followersOnly",
            "friendsOnly",
        ], {
            required_error: "Please select a report type"
        }),
})

type EditPostFormValues = z.infer<typeof editPostSchema>;

const VISIBILITY_TYPES = [
    "Public",
    "Private",
    "Followers Only",
    "Friends Only",
];

const VISIBILITY_TYPES_NAMED = [
    "public",
    "private",
    "followersOnly",
    "friendsOnly",
]

function EditPostMenu({ handleShow, id, defaultVisibility }: EditPostWindowProps) {
    const currUser = useSelector((state: RootState) => state.auth.user)
    const currToken = useSelector((state: RootState) => state.auth.token)
    const navigate = useNavigate();

    const form = useForm<EditPostFormValues>({
        resolver: zodResolver(editPostSchema),
        defaultValues: {
            visibility: defaultVisibility,
        },
    });

    const onSubmit = async (data: EditPostFormValues) => {
        try {
            await apiClient.patch(`${POST_ROUTES}/${id}`, {
                visibility: data.visibility
            }, {
                headers: {
                    Authorization: `Bearer ${currToken}`
                }
            })
        } catch (error) {
            console.error(error)
            toast({
                title: "Edit Post failed",
                description: "Unable to edit post."
            })
        } finally {
            handleShow(false);
            toast({
                title: "Post Edited",
                description: "Successfully edited post."
            })
            navigate("/");
        }
    }

    return (
        <Modal
            show={true}
            size="md"
            onClose={() => handleShow(false)}
            popup
        >
            <Modal.Header />
            <Modal.Body>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className='flex flex-col gap-4 items-center justify-center'>
                            <MdEditDocument className="mx-auto mb-4 h-14 w-14 text-gray-400" />
                            <span className="text-lg font-semibold">
                                Edit Post
                            </span>

                            <FormField
                                control={form.control}
                                name="visibility"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Change visibility</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={"Old visibility"} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {VISIBILITY_TYPES.map((type, idx) => (
                                                        <SelectItem key={idx} value={VISIBILITY_TYPES_NAMED[idx]}>
                                                            {type}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex gap-4 w-full justify-end">
                                <Button
                                    className='bg-slate-300 rounded-xl'
                                    type="button"
                                    onClick={() => handleShow(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                className='bg-slate-500 rounded-xl'
                                    type="submit"
                                >
                                    Finish Editing
                                </Button>
                            </div>
                        </div>
                    </form>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default EditPostMenu