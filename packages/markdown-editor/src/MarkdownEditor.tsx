import React, { useEffect, useRef } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import {
    Bold,
    Italic,
    Strikethrough,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    Code,
    Undo,
    Redo,
} from "lucide-react";

export interface MarkdownEditorProps {
    value: string;
    onChange?: (value: string) => void;
    height?: string | number;
    placeholder?: string;
    readOnly?: boolean;
    localization?: Record<string, string>;
}

const defaultLocalization = {
    bold: "Bold",
    italic: "Italic",
    strikethrough: "Strikethrough",
    heading1: "Heading 1",
    heading2: "Heading 2",
    heading3: "Heading 3",
    bulletList: "Bullet List",
    orderedList: "Ordered List",
    blockquote: "Blockquote",
    codeBlock: "Code Block",
    undo: "Undo",
    redo: "Redo",
};

const MenuBar = ({
    editor,
    localization = defaultLocalization,
}: {
    editor: Editor | null;
    localization?: Record<string, string>;
}) => {
    if (!editor) {
        return null;
    }

    const ToolbarButton = ({
        onClick,
        isActive = false,
        disabled = false,
        icon: Icon,
        title,
    }: any) => (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={title}
            style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "28px",
                height: "28px",
                borderRadius: "var(--flf-builder-radius-sm, 4px)",
                background: isActive
                    ? "var(--flf-builder-color-primary, #3b82f6)"
                    : "transparent",
                border: "none",
                color: isActive
                    ? "var(--flf-builder-color-primary-fg, #ffffff)"
                    : "var(--flf-builder-color-text-muted, #64748b)",
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.5 : 1,
                padding: 0,
            }}
            onMouseEnter={(e) => {
                if (!disabled && !isActive) {
                    e.currentTarget.style.backgroundColor =
                        "var(--flf-builder-color-border, #e2e8f0)";
                    e.currentTarget.style.color =
                        "var(--flf-builder-color-text, #0f172a)";
                }
            }}
            onMouseLeave={(e) => {
                if (!disabled && !isActive) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color =
                        "var(--flf-builder-color-text-muted, #64748b)";
                }
            }}
        >
            <Icon size={16} />
        </button>
    );

    return (
        <div
            style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "4px",
                padding: "8px",
                borderBottom:
                    "1px solid var(--flf-builder-color-border, #e2e8f0)",
                backgroundColor:
                    "var(--flf-builder-color-surface-raised, #f8fafc)",
                borderTopLeftRadius: "var(--flf-builder-radius-md, 8px)",
                borderTopRightRadius: "var(--flf-builder-radius-md, 8px)",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive("bold")}
                    icon={Bold}
                    title={localization.bold}
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive("italic")}
                    icon={Italic}
                    title={localization.italic}
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    isActive={editor.isActive("strike")}
                    icon={Strikethrough}
                    title={localization.strikethrough}
                />
            </div>

            <div
                style={{
                    width: "1px",
                    height: "20px",
                    backgroundColor: "var(--flf-builder-color-border, #e2e8f0)",
                    margin: "0 4px",
                }}
            />

            <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                <ToolbarButton
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 1 }).run()
                    }
                    isActive={editor.isActive("heading", { level: 1 })}
                    icon={Heading1}
                    title={localization.heading1}
                />
                <ToolbarButton
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    isActive={editor.isActive("heading", { level: 2 })}
                    icon={Heading2}
                    title={localization.heading2}
                />
                <ToolbarButton
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 3 }).run()
                    }
                    isActive={editor.isActive("heading", { level: 3 })}
                    icon={Heading3}
                    title={localization.heading3}
                />
            </div>

            <div
                style={{
                    width: "1px",
                    height: "20px",
                    backgroundColor: "var(--flf-builder-color-border, #e2e8f0)",
                    margin: "0 4px",
                }}
            />

            <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                <ToolbarButton
                    onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                    }
                    isActive={editor.isActive("bulletList")}
                    icon={List}
                    title={localization.bulletList}
                />
                <ToolbarButton
                    onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                    }
                    isActive={editor.isActive("orderedList")}
                    icon={ListOrdered}
                    title={localization.orderedList}
                />
            </div>

            <div
                style={{
                    width: "1px",
                    height: "20px",
                    backgroundColor: "var(--flf-builder-color-border, #e2e8f0)",
                    margin: "0 4px",
                }}
            />

            <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                <ToolbarButton
                    onClick={() =>
                        editor.chain().focus().toggleBlockquote().run()
                    }
                    isActive={editor.isActive("blockquote")}
                    icon={Quote}
                    title={localization.blockquote}
                />
                <ToolbarButton
                    onClick={() =>
                        editor.chain().focus().toggleCodeBlock().run()
                    }
                    isActive={editor.isActive("codeBlock")}
                    icon={Code}
                    title={localization.codeBlock}
                />
            </div>

            <div
                style={{
                    width: "1px",
                    height: "20px",
                    backgroundColor: "var(--flf-builder-color-border, #e2e8f0)",
                    margin: "0 4px",
                }}
            />

            <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                <ToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    icon={Undo}
                    title={localization.undo}
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    icon={Redo}
                    title={localization.redo}
                />
            </div>
        </div>
    );
};

/**
 * WYSIWYG Markdown Editor based on Tiptap
 * Designed for the Learn module content editing
 */
export function MarkdownEditor({
    value,
    onChange,
    height = 400,
    readOnly = false,
    localization = defaultLocalization,
}: MarkdownEditorProps) {
    const isUpdatingRef = useRef(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Markdown.configure({
                html: false,
                tightLists: true,
                tightListClass: "tight",
                bulletListMarker: "-",
                linkify: true,
                breaks: true,
            }),
        ],
        content: value,
        editable: !readOnly,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            if (onChange) {
                isUpdatingRef.current = true;
                const markdown = (editor.storage as { markdown?: { getMarkdown: () => string } }).markdown?.getMarkdown() ?? "";
                onChange(markdown);
                // Reset sync flag after a short delay
                setTimeout(() => {
                    isUpdatingRef.current = false;
                }, 10);
            }
        },
    });

    // Sync external value changes if not actively typing
    useEffect(() => {
        if (editor && value !== undefined && !isUpdatingRef.current) {
            const currentMarkdown = (
                editor.storage as { markdown?: { getMarkdown: () => string } }
            ).markdown?.getMarkdown() ?? "";
            if (value !== currentMarkdown) {
                editor.commands.setContent(value);
            }
        }
    }, [value, editor]);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                border: "1px solid var(--flf-builder-color-border, #e2e8f0)",
                borderRadius: "var(--flf-builder-radius-md, 8px)",
                backgroundColor: "var(--flf-builder-color-surface, #ffffff)",
                color: "var(--flf-builder-color-text, #0f172a)",
                height,
            }}
        >
            <MenuBar editor={editor} localization={localization} />
            <div
                style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "16px",
                    cursor: "text",
                }}
            >
                <style
                    dangerouslySetInnerHTML={{
                        __html: `
                    .ProseMirror { outline: none; min-height: 100%; }
                    .ProseMirror > *:first-child { margin-top: 0; }
                    .ProseMirror p { margin: 0.75em 0; line-height: 1.6; }
                    .ProseMirror h1, .ProseMirror h2, .ProseMirror h3 { margin-top: 1.5em; margin-bottom: 0.5em; font-weight: 600; line-height: 1.3; }
                    .ProseMirror h1 { font-size: 1.875rem; }
                    .ProseMirror h2 { font-size: 1.5rem; }
                    .ProseMirror h3 { font-size: 1.25rem; }
                    .ProseMirror ul, .ProseMirror ol { padding-left: 1.5rem; margin: 0.75em 0; }
                    .ProseMirror li > p { margin: 0; }
                    .ProseMirror blockquote { border-left: 3px solid var(--flf-builder-color-border, #cbd5e1); margin-left: 0; padding-left: 1rem; font-style: italic; color: var(--flf-builder-color-text-muted, #64748b); }
                    .ProseMirror code { background-color: var(--flf-builder-color-surface-raised, #f1f5f9); padding: 0.2em 0.4em; border-radius: 3px; font-family: 'Plus Jakarta Sans', ui-monospace, SFMono-Regular, monospace; font-size: 0.875em; }
                    .ProseMirror pre { background-color: var(--flf-builder-color-text, #0f172a); color: var(--flf-builder-color-bg, #f8fafc); padding: 1rem; border-radius: var(--flf-builder-radius-md, 8px); overflow-x: auto; font-family: inherit; }
                    .ProseMirror pre code { background: transparent; padding: 0; color: inherit; }
                `,
                    }}
                />
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
