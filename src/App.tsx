import "./styles.scss";
import React, { useEffect, useState } from "react";
import { Extensions } from "@tiptap/core";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { EditorContent, useEditor, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface MenuBarProps {
    editor: Editor | null;
}

const MenuBar: React.FC<MenuBarProps> = ({ editor }) => {
    // const { editor} = useCurrentEditor();

    if (!editor) return null;

    return (
        <>
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={editor.isActive("bold") ? "is-active" : ""}
            >
                bold
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={editor.isActive("italic") ? "is-active" : ""}
            >
                italic
            </button>
            <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
                className={editor.isActive("strike") ? "is-active" : ""}
            >
                strike
            </button>
            <button
                onClick={() => editor.chain().focus().toggleCode().run()}
                disabled={!editor.can().chain().focus().toggleCode().run()}
                className={editor.isActive("code") ? "is-active" : ""}
            >
                code
            </button>
            <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
                clear marks
            </button>
            <button onClick={() => editor.chain().focus().clearNodes().run()}>
                clear nodes
            </button>
            <button onClick={() => editor.chain().focus().setParagraph().run()}
                    className={editor.isActive("paragraph") ? "is-active" : ""}
            >
                paragraph
            </button>
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={editor.isActive("heading", { level: 1 }) ? "is-active" : ""}
            >
                h1
            </button>
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""}
            >
                h2
            </button>
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={editor.isActive("heading", { level: 3 }) ? "is-active" : ""}
            >
                h3
            </button>
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                    className={editor.isActive("heading", { level: 4 }) ? "is-active" : ""}
            >
                h4
            </button>
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
                    className={editor.isActive("heading", { level: 5 }) ? "is-active" : ""}
            >
                h5
            </button>
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
                    className={editor.isActive("heading", { level: 6 }) ? "is-active" : ""}
            >
                h6
            </button>
            <button onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive("bulletList") ? "is-active" : ""}
            >
                bullet list
            </button>
            <button onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={editor.isActive("orderedList") ? "is-active" : ""}
            >
                ordered list
            </button>
            <button onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={editor.isActive("codeBlock") ? "is-active" : ""}
            >
                code block
            </button>
            <button onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={editor.isActive("blockquote") ? "is-active" : ""}
            >
                blockquote
            </button>
            <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
                horizontal rule
            </button>
            <button onClick={() => editor.chain().focus().setHardBreak().run()}>
                hard break
            </button>
            <button onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().chain().focus().undo().run()}
            >
                undo
            </button>
            <button onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().chain().focus().redo().run()}
            >
                redo
            </button>
            <button onClick={() => editor.chain().focus().setColor("#958DF1").run()}
                    className={editor.isActive("textStyle", { color: "#958DF1" }) ? "is-active" : ""}
            >
                purple
            </button>
        </>
    );
};

const extensions: Extensions = [
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle.configure(),
    StarterKit.configure({
        bulletList: {
            keepMarks: true,
            keepAttributes: false,
        },
        orderedList: {
            keepMarks: true,
            keepAttributes: false,
        },
    }),
];

const initContent = `
<h2>
  Hi there,
</h2>
<p>
  this is a <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
</p>
<ul>
  <li>
    That’s a bullet list with one …
  </li>
  <li>
    … or two list items.
  </li>
</ul>
<p>
  Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
</p>
<pre><code class="language-css">body {
display: none;
}</code></pre>
<p>
  I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
</p>
<blockquote>
  Wow, that’s amazing. Good work, boy! 👏
  <br />
  — Mom
</blockquote>
`;

interface EditableEditorProps {
    onUpdate: (content: string) => void;
    isEditMode: boolean;
    editor: Editor | null;
}

const EditableEditor: React.FC<EditableEditorProps> = ({ onUpdate, isEditMode, editor }) => {
    useEffect(() => {
        if (editor) {
            editor.setEditable(isEditMode);
        }
    }, [editor, isEditMode]);

    return <EditorContent editor={editor} />;
};

// App Component
const App: React.FC = () => {
    const [content, setContent] = useState<string>(initContent);
    const [isEditMode, setIsEditMode] = useState<boolean>(true);

    // useEffect(() => {
    //     console.log("Content in state:", content);
    // }, [content]);
    const editor = useEditor({
        extensions,
        content: initContent,
        editable: isEditMode, // Tie editable state to isEditMode
        onUpdate: ({ editor }) => {
            const content = editor.getHTML();
            setContent(content);
        },
    });

    const handleToggle = () => {
        setIsEditMode(!isEditMode);
    };

    return (
        <div>
            <button onClick={handleToggle}>
                {isEditMode ? "Edit Mode" : "View Mode"}
            </button>
            {editor && isEditMode && <MenuBar editor={editor} />}
            {editor && (
                <EditableEditor
                    editor={editor}
                    onUpdate={setContent}
                    isEditMode={isEditMode}
                />
            )}

        </div>
    );
};

export default App;
