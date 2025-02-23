"use client"
import { type Editor } from '@tiptap/react';
import {
    Bold,
    Strikethrough,
    Italic,
    List,
    ListOrdered,
    Heading2,
} from "lucide-react"
import { Toggle } from "../ui/toggle"

type Props = {
    editor: Editor | null
}

export function ToolBar({ editor }: Props) {
    if (!editor) {
        return null
    }
    return (
        <div className='border w-fit sm:w-full flex items-center p-2 justify-center space-x-1 sm:space-x-3 bg-transparent border-slate-500 rounded-br-lg'>
            <Toggle
                size="lg"
                pressed={editor.isActive("heading")}
                onPressedChange={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
            >
                <Heading2 className='h-4 w-4' />
            </Toggle>
            <Toggle
                size="lg"
                pressed={editor.isActive("bold")}
                onPressedChange={() =>
                    editor.chain().focus().toggleBold().run()
                }
            >
                <Bold className='h-4 w-4' />
            </Toggle>
            <Toggle
                size="lg"
                pressed={editor.isActive("italic")}
                onPressedChange={() =>
                    editor.chain().focus().toggleItalic().run()
                }
            >
                <Italic className='h-4 w-4' />
            </Toggle>
            <Toggle
                size="lg"
                pressed={editor.isActive("strike")}
                onPressedChange={() =>
                    editor.chain().focus().toggleStrike().run()
                }
            >
                <Strikethrough className='h-4 w-4' />
            </Toggle>
            <Toggle
                size="lg"
                pressed={editor.isActive("bulletList")}
                onPressedChange={() => 
                    editor.chain().focus().toggleBulletList().run()
                }
            >
                <List className='h-4 w-4' />
            </Toggle>
            <Toggle
                size="lg"
                pressed={editor.isActive("orderedList")}
                onPressedChange={() =>
                    editor.chain().focus().toggleOrderedList().run()
                }
            >
                <ListOrdered className='h-4 w-4' />
            </Toggle>
        </div>
    )
}