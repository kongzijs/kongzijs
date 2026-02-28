import React, { useCallback } from "react";
import Editor, { OnChange } from "@monaco-editor/react";

export interface FLFEditorProps {
    value: string;
    onChange?: (value: string | undefined) => void;
    height?: string | number;
    language?: string;
    theme?: "vs-dark" | "light";
    options?: any;
}

export function FLFEditor({
    value,
    onChange,
    height = "100%",
    language = "json",
    theme = "vs-dark",
    options = {},
}: FLFEditorProps) {
    const defaultOptions = {
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 14,
        fontFamily:
            "'Plus Jakarta Sans', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        automaticLayout: true,
        wordWrap: "on",
        ...options,
    };

    const handleChange: OnChange = useCallback(
        (val) => {
            onChange?.(val);
        },
        [onChange],
    );

    return (
        <div
            style={{
                width: "100%",
                height,
                border: "1px solid var(--flf-builder-color-border, #ccc)",
                borderRadius: "var(--flf-builder-radius-md, 4px)",
                overflow: "hidden",
            }}
        >
            <Editor
                height="100%"
                language={language}
                theme={theme}
                value={value}
                onChange={handleChange}
                options={defaultOptions}
            />
        </div>
    );
}
