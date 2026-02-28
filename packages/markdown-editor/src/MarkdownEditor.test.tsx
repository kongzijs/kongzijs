import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";
import { MarkdownEditor } from "./MarkdownEditor";

describe("MarkdownEditor", () => {
    it("renders the editor with the provided initial value", () => {
        const initialValue = "# Hello World";
        render(<MarkdownEditor value={initialValue} />);

        // Tiptap should render the markdown as HTML
        const editorContent = screen.getByText("Hello World");
        expect(editorContent).toBeInTheDocument();
        expect(editorContent.tagName).toBe("H1");
    });

    it("renders all toolbar formatting buttons", () => {
        render(<MarkdownEditor value="" />);

        expect(screen.getByTitle("Bold")).toBeInTheDocument();
        expect(screen.getByTitle("Italic")).toBeInTheDocument();
        expect(screen.getByTitle("Strikethrough")).toBeInTheDocument();
        expect(screen.getByTitle("Heading 1")).toBeInTheDocument();
        expect(screen.getByTitle("Bullet List")).toBeInTheDocument();
        expect(screen.getByTitle("Code Block")).toBeInTheDocument();
        expect(screen.getByTitle("Undo")).toBeInTheDocument();
    });

    it("applies the readOnly prop correctly", () => {
        const { container } = render(
            <MarkdownEditor value="Read Only Text" readOnly={true} />,
        );

        // Tiptap's ProseMirror instance should have contenteditable="false"
        const proseMirror = container.querySelector(".ProseMirror");
        expect(proseMirror).toHaveAttribute("contenteditable", "false");
    });
});
