import { useState } from "react";
import { LessonBuilder } from "@kongzijs/flf-builder";
import type { FLFManifest, FLFNodeData } from "@kongzijs/flf-core";
import { FLFBuilderProvider, enUS } from "@kongzijs/flf-i18n";
import { Toaster } from "sonner";

const MOCK_MANIFEST: FLFManifest = {
    flf_version: "1.0",
    lesson_id: "test-lesson-id",
    settings: {
        title: "KongziJS Builder Preview",
        description: "Interactive FLF Lesson Node Editor",
        difficulty: "intermediate",
    },
    assets_manifest: [],
    flow_nodes: [
        {
            id: "node-1",
            type: "start",
            position: { x: 50, y: 150 },
            data: { title: "Start" },
        },
        {
            id: "node-learn",
            type: "learn",
            position: { x: 300, y: 150 },
            data: {
                title: "Learn Module",
                is_milestone: false,
                rules: { min_prog: 1.0 },
            } as FLFNodeData,
        },
        {
            id: "node-2",
            type: "test",
            position: { x: 550, y: 150 },
            data: {
                title: "Quiz Section",
                quiz_dsl: {
                    version: "1.0.0",
                    quiz: {
                        id: "quiz-1",
                        title: "Interactive Quiz",
                        sections: [],
                    },
                },
            },
        },
    ],
    flow_edges: [
        {
            id: "e1",
            source: "node-1",
            target: "node-learn",
            condition: "default",
        },
        {
            id: "e2",
            source: "node-learn",
            target: "node-2",
            condition: "default",
        },
    ],
};

export const BuilderDemo = () => {
    const [manifest, setManifest] = useState<FLFManifest>(MOCK_MANIFEST);

    const handleSave = async (_id: number, updatedManifest: FLFManifest) => {
        console.log("Saved Manifest:", updatedManifest);
        setManifest(updatedManifest);
        return { success: true };
    };

    return (
        <div
            style={
                {
                    height: "600px",
                    width: "100%",
                    borderRadius: "12px",
                    overflow: "hidden",
                    border: "1px solid #334155",
                    boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
                    position: "relative",

                    /* Layer 2 semantic tokens — PUBLIC API per RFC 0035 */
                    "--flf-builder-color-bg": "#0F172A",
                    "--flf-builder-color-surface": "#1E293B",
                    "--flf-builder-color-surface-raised": "#253247",
                    "--flf-builder-color-surface-subtle": "#1A2640",

                    "--flf-builder-color-border": "#334155",
                    "--flf-builder-color-border-subtle": "#1E293B",

                    "--flf-builder-color-text": "#F8FAFC",
                    "--flf-builder-color-text-muted": "#94A3B8",
                    "--flf-builder-color-text-disabled": "#64748B",
                } as React.CSSProperties
            }
        >
            <FLFBuilderProvider locale="en" dictionary={enUS}>
                <LessonBuilder
                    lessonId={999}
                    initialManifest={manifest}
                    onSave={handleSave}
                />
            </FLFBuilderProvider>
            <Toaster position="top-right" richColors />
        </div>
    );
};
