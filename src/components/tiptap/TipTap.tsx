"use client"
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { ToolBar } from "./ToolBar";
import Heading from '@tiptap/extension-heading'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'

export default function TipTap({
    content,
    onChange,
}: {
    content: string,
    onChange: (richText: string) => void
}) {
    
    const editor = useEditor({
        extensions: [StarterKit.configure({

        }), Heading.configure({
            HTMLAttributes: {
                class: "text-xl font-bold",
                levels: [2],
            }
        }), BulletList.configure({
            HTMLAttributes: {
                class: "list-disc ml-5"
            }
        }), OrderedList.configure({
            HTMLAttributes: {
                class: "list-decimal ml-5"
            }
        })],
        content: content,
        editorProps: {
            attributes: {
                class:
                    "focus:outline-none w-full border-2 border-slate-200 mt-[5px] overflow-scroll min-h-[550px] max-h-[450px] p-3 no-scrollbar"
            },
        },
        onUpdate({ editor }) {
            onChange(editor.getHTML())
        },
    })
    return(
        <div className="flex flex-col items-center sm:justify-stretch min-h-[250px]">
            <ToolBar editor={editor} />
            <EditorContent editor={editor} className="w-full"/>
        </div>
    )
}