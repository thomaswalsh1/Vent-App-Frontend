import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from '@tiptap/extension-heading'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import { useEffect } from "react";

export default function TipTapViewOnly({
    content,
}: {
    content: string,
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
        editable: false,
        editorProps: {
            attributes: {
                class:
                    "rounded-md no-scrollbar text-xs sm:text-md md:text-basis lg:text-lg focus:outline-none mt-[5px] focus:outline-slate-600 overflow-scroll min-h-[450px] border-input p-3"
            },
        }
    })

    useEffect(() => {
        if (editor && content) {
            editor.commands.setContent(content);
        }
    }, [editor, content]);


    return (
        <div className="flex flex-col justify-stretch min-h-[250px]">
            <EditorContent editor={editor} />
        </div>
    )
}