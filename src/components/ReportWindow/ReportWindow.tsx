import { Modal } from 'flowbite-react'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { MdOutlineReport } from 'react-icons/md'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { z } from "zod";
import { useForm } from 'react-hook-form'
import { Form } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import { apiClient } from '@/lib/api-client'
import { useSelector } from 'react-redux'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useNavigate } from 'react-router-dom'
import { RootState } from '@/state/store'
import LoadingAnimation from '../Animation/LoadingAnimation'

interface ReportWindowProps {
    targetType: "Post" | "User",
    id: string,
    handleShow: (e: boolean) => void,
}

const reportSchema = z.object({
    reportType: z
        .enum([
            "Spam/Misinformation",
            "Inappropriate content",
            "Threatening behavior",
            "Other (please describe)",
        ], {
            required_error: "Please select a report type"
        }),
    message: z.string().min(20, "Report must be at least 20 characters")
})

type ReportFormValues = z.infer<typeof reportSchema>;

const REPORT_TYPES = [
    "Spam/Misinformation",
    "Inappropriate content",
    "Threatening behavior",
    "Other (please describe)",
] as const;

function ReportWindow({ targetType, id, handleShow }: ReportWindowProps) {
    const currUser = useSelector((state: RootState) => state.auth.user)
    const currToken = useSelector((state: RootState) => state.auth.token)
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    const form = useForm<ReportFormValues>({
        resolver: zodResolver(reportSchema),
        defaultValues: {
            reportType: undefined,
            message: "",
        },
    });

    const onSubmit = async (data: ReportFormValues) => {
        setLoading(true);
        try {
            // await new Promise((res) => setTimeout(res, 4000)) // testing loading 

            await apiClient.post(`/reports`, {
                ...data,
                targetType,
                targetId: id
            },{
                headers: {
                    Authorization: `Bearer ${currToken}`
                }
            })
        } catch (error) {
            console.error(error)
            toast({
                title: "Report failed",
                description: "Unable to submit report."
            })
        } finally {
            setLoading(false);
            handleShow(false);
            toast({
                title: "Report submitted",
                description: "Successfully submitted report."
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
                {loading && (
                    <div className='z-20 absolute w-full h-full flex items-center justify-center'>
                        <LoadingAnimation />
                    </div>
                )}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className='flex flex-col gap-4 items-center justify-center'>
                            <MdOutlineReport className="mx-auto mb-4 h-14 w-14 text-gray-400" />
                            <span className="text-lg font-semibold">
                                Report {targetType}
                            </span>
                            
                            <FormField
                                control={form.control}
                                name="reportType"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Reason for reporting?</FormLabel>
                                        <Select 
                                            onValueChange={field.onChange} 
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a reason" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {REPORT_TYPES.map((type) => (
                                                        <SelectItem key={type} value={type}>
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

                            <FormField
                                control={form.control}
                                name="message"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Additional Details</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Please provide more details about your report."
                                                className="min-h-[100px] resize-none focus-visible:ring-0 focus-visible:outline-transparent"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex gap-4 w-full justify-end">
                                <Button 
                                    type="button"
                                    variant="outline" 
                                    onClick={() => handleShow(false)}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit"
                                    variant="destructive"
                                >
                                    Submit Report
                                </Button>
                            </div>
                        </div>
                    </form>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default ReportWindow