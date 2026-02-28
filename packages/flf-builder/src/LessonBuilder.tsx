"use client";

import React, { useState, useCallback, useMemo, useRef } from "react";
import { Save, Settings2, BookOpen, Zap } from "lucide-react";
import { FLFManifest, FLFTransformer, FLFSettings } from "@kongzijs/flf-core";
import { toast } from "sonner";
import { Button } from "@borgtj/react";
import { Node, Edge } from "@xyflow/react";
import { QuizEditorRef } from "@quizerjs/react";

import { LessonSettingsForm } from "./LessonSettingsForm";
import { SidebarItem } from "./components/SidebarItem";
import { ChapterHeader } from "./components/ChapterHeader";
import { MainContentEditor } from "./components/MainContentEditor";
import { PerformanceRules } from "./components/PerformanceRules";
import { useFLFTranslation } from "@kongzijs/flf-i18n";

import "./styles/index.css";

/** 从 API/Supabase 等错误中提取可读的 message，避免展示整段序列化对象。 */
function getReadableSaveErrorMessage(
    error: unknown,
    fallback: string,
): string {
    if (error == null) return fallback;
    const obj =
        typeof error === "object" && "message" in error
            ? (error as { message?: unknown })
            : null;
    const rawMessage =
        obj?.message ??
        (error instanceof Error ? error.message : null);
    if (typeof rawMessage === "string") {
        const trimmed = rawMessage.trim();
        if (!trimmed) return fallback;
        if (trimmed.length <= 120 && !/^\s*\{/.test(trimmed))
            return trimmed;
        const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try {
                const parsed = JSON.parse(jsonMatch[0]) as {
                    message?: string;
                };
                if (
                    typeof parsed.message === "string" &&
                    parsed.message.trim()
                )
                    return parsed.message.trim();
            } catch {
                /* try regex for non-JSON serialization (e.g. Error: {code: ..., message: "..."}) */
            }
            const quoted = jsonMatch[0].match(
                /"message"\s*:\s*"((?:[^"\\]|\\.)*)"/,
            );
            if (quoted?.[1]) return quoted[1].replace(/\\"/g, '"');
        }
        return fallback;
    }
    return fallback;
}

interface LessonBuilderProps {
    lessonId: number;
    initialManifest?: FLFManifest;
    onSave: (
        lessonId: number,
        manifest: FLFManifest,
    ) => Promise<{ success: boolean; versionId?: string; error?: string }>;
    locale?: string;
}

import { FLFNodeData } from "@kongzijs/flf-core";

export function LessonBuilder({
    lessonId,
    initialManifest,
    onSave,
}: LessonBuilderProps) {
    // 1. 初始化数据
    const initialData = useMemo(() => {
        if (initialManifest) {
            return FLFTransformer.toReactFlow(initialManifest);
        }
        return {
            nodes: [] as Node[],
            edges: [] as Edge[],
        };
    }, [initialManifest]);

    const [nodes, setNodes] = useState<Node[]>(initialData.nodes);
    const [settings, setSettings] = useState<FLFSettings>(
        initialManifest?.settings || {
            level_required: 1,
            total_credits: 50,
            access_control: "public",
            difficulty: "beginner",
            status: "draft",
        },
    );

    const [activeItemId, setActiveItemId] = useState<string>("settings");
    const [isSaving, setIsSaving] = useState(false);
    const editorRef = useRef<QuizEditorRef>(null);
    const { t } = useFLFTranslation();

    // 2. 核心逻辑 - 节点管理
    const contentNodes = useMemo(
        () =>
            nodes.filter(
                (n) => n.type === "learnNode" || n.type === "testNode",
            ),
        [nodes],
    );

    const activeNode = useMemo(
        () => nodes.find((n) => n.id === activeItemId),
        [nodes, activeItemId],
    );

    const activeData = (activeNode?.data as FLFNodeData) || {};

    const handleUpdateNode = useCallback(
        (id: string, newData: Partial<FLFNodeData>) => {
            setNodes((nds) =>
                nds.map((n) =>
                    n.id === id ? { ...n, data: { ...n.data, ...newData } } : n,
                ),
            );
        },
        [],
    );

    const generateId = useCallback(() => {
        if (typeof crypto !== "undefined" && crypto.randomUUID) {
            return crypto.randomUUID();
        }
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }, []);

    const addNode = (type: "learnNode" | "testNode") => {
        const id = generateId();
        const newNode: Node = {
            id,
            type,
            position: { x: 0, y: 0 },
            data: {
                title:
                    type === "learnNode"
                        ? t.editor.learnChapterTitle
                        : t.editor.testChapterTitle,
                markdown: "",
                asset_id: "",
                rules: {
                    passing_score: 0.8,
                    min_prog: 1.0,
                },
                is_milestone: false,
                questions:
                    type === "testNode"
                        ? [
                              {
                                  id: generateId(),
                                  type: "multiple_choice",
                                  text: "New Question",
                                  points: 1,
                                  options: [
                                      {
                                          id: generateId(),
                                          text: "Option 1",
                                          is_correct: true,
                                      },
                                      {
                                          id: generateId(),
                                          text: "Option 2",
                                          is_correct: false,
                                      },
                                  ],
                              },
                          ]
                        : [],
            } as FLFNodeData,
        };
        setNodes((nds) => [...nds, newNode]);
        setActiveItemId(id);
    };

    const deleteNode = (id: string) => {
        setNodes((nds) => nds.filter((n) => n.id !== id));
        if (activeItemId === id) setActiveItemId("settings");
    };

    const moveNode = (index: number, direction: "up" | "down") => {
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= contentNodes.length) return;

        const newContentNodes = [...contentNodes];
        const [movedNode] = newContentNodes.splice(index, 1);
        newContentNodes.splice(targetIndex, 0, movedNode);

        const nonContentNodes = nodes.filter(
            (n) => n.type !== "learnNode" && n.type !== "testNode",
        );
        setNodes([...nonContentNodes, ...newContentNodes]);
    };

    // 3. QuizerJS Integration
    const memoizedDSL = useMemo(() => {
        if (!activeNode || activeNode.type !== "testNode") return null;

        let questions = activeData.questions || [];
        if (questions.length === 0) {
            questions = [
                {
                    id: generateId(),
                    type: "multiple_choice",
                    text: "New Question",
                    points: 1,
                    options: [
                        {
                            id: generateId(),
                            text: "Option 1",
                            is_correct: true,
                        },
                        {
                            id: generateId(),
                            text: "Option 2",
                            is_correct: false,
                        },
                    ],
                },
            ];
        }

        if (activeData.quiz_dsl) {
            return activeData.quiz_dsl;
        }

        return FLFTransformer.toQuizDSL(questions, {
            id: `quiz-${activeNode.id}`,
            title: activeData.title || "Quiz",
        });
    }, [
        activeNode?.type,
        activeNode?.id,
        activeData.quiz_dsl,
        activeData.questions,
        activeData.title,
        generateId,
    ]);

    const handleQuizChange = useCallback(
        async (dsl: unknown) => {
            let questions = FLFTransformer.fromQuizDSL(dsl);

            if (editorRef.current) {
                const instance = editorRef.current.getEditorInstance();
                if (instance) {
                    try {
                        const rawData = await instance.save();
                        const descriptionMap = new Map<string, string>();

                        rawData.blocks.forEach((block: unknown) => {
                            const b = block as {
                                data?: {
                                    question?: {
                                        id?: string;
                                        description?: string;
                                    };
                                };
                            };
                            if (
                                b.data?.question?.id &&
                                b.data?.question?.description
                            ) {
                                descriptionMap.set(
                                    b.data.question.id,
                                    b.data.question.description,
                                );
                            }
                        });

                        questions = questions.map((q: unknown) => {
                            const question = q as {
                                id: string;
                                description?: string;
                            };
                            return {
                                ...question,
                                description:
                                    descriptionMap.get(question.id) ||
                                    question.description ||
                                    "",
                            };
                        });
                    } catch (e) {
                        console.error(
                            "Failed to recover descriptions from raw data",
                            e,
                        );
                    }
                }
            }

            if (activeNode) {
                handleUpdateNode(activeNode.id, { quiz_dsl: dsl, questions });
            }
        },
        [activeNode?.type, activeNode?.id, handleUpdateNode],
    );

    // 4. 保存逻辑：成功/失败均通过 toast 报告
    const handleSave = async () => {
        setIsSaving(true);
        try {
            const autoEdges: Edge[] = [];
            if (contentNodes.length > 0) {
                for (let i = 0; i < contentNodes.length - 1; i++) {
                    autoEdges.push({
                        id: generateId(),
                        source: contentNodes[i].id,
                        target: contentNodes[i + 1].id,
                        animated: true,
                        type: "smoothstep",
                    });
                }
            }

            const manifest = FLFTransformer.fromReactFlow(
                lessonId.toString(),
                settings,
                nodes,
                autoEdges,
                initialManifest?.assets_manifest || [],
            );

            const result = await onSave(lessonId, manifest);
            if (result.success) {
                toast.success(t.editor.saveSuccess);
            } else {
                const message =
                    result.error?.trim() || t.editor.saveError;
                toast.error(message);
            }
        } catch (error: unknown) {
            const message = getReadableSaveErrorMessage(
                error,
                t.editor.saveError,
            );
            console.error("[LessonBuilder] Save failed (user message):", message);
            console.error("[LessonBuilder] Full error detail:", error);
            if (error instanceof Error && error.stack)
                console.error("[LessonBuilder] Stack:", error.stack);
            toast.error(message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flf-builder">
            <div className="flf-builder__body">
                {/* Left Sidebar */}
                <div className="flf-builder__sidebar">
                    <div className="flf-builder__sidebar-header">
                        <span className="flf-builder__sidebar-header-label">
                            {t.editor.lessonStructure}
                        </span>
                        <div style={{ display: "flex", gap: "2px" }}>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => addNode("learnNode")}
                                title={t.editor.addLearnChapter}
                            >
                                <BookOpen size={15} />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => addNode("testNode")}
                                title={t.editor.addQuizChapter}
                            >
                                <Zap size={15} />
                            </Button>
                        </div>
                    </div>

                    <div className="flf-builder__sidebar-list">
                        {/* Fixed: Lesson Configuration */}
                        <div
                            onClick={() => setActiveItemId("settings")}
                            className={[
                                "flf-builder__sidebar-item",
                                "flf-builder__sidebar-item--settings",
                                activeItemId === "settings"
                                    ? "flf-builder__sidebar-item--active"
                                    : "",
                            ]
                                .filter(Boolean)
                                .join(" ")}
                        >
                            <div className="flf-builder__sidebar-item-icon">
                                <Settings2 size={14} />
                            </div>
                            <span className="flf-builder__sidebar-item-title">
                                {t.editor.lessonConfig}
                            </span>
                        </div>

                        <hr className="flf-builder__separator" />

                        {/* Dynamic: Chapters */}
                        {contentNodes.length === 0 ? (
                            <div className="flf-builder__sidebar-empty">
                                {t.editor.noChaptersYet}
                            </div>
                        ) : (
                            contentNodes.map((node, index) => (
                                <SidebarItem
                                    key={node.id}
                                    node={node}
                                    index={index}
                                    isActive={activeItemId === node.id}
                                    isFirst={index === 0}
                                    isLast={index === contentNodes.length - 1}
                                    onClick={() => setActiveItemId(node.id)}
                                    onMove={moveNode}
                                    onDelete={deleteNode}
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* Right Detail Area */}
                <div className="flf-builder__detail">
                    {activeItemId === "settings" ? (
                        <div
                            className="flf-builder__detail--animate"
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                flex: 1,
                                overflow: "hidden",
                            }}
                        >
                            {/* Settings toolbar */}
                            <div className="flf-builder__toolbar">
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                    }}
                                >
                                    <Settings2
                                        size={16}
                                        style={{
                                            color: "var(--flf-builder-color-text-disabled)",
                                        }}
                                    />
                                    <span className="flf-builder__toolbar-title">
                                        {t.editor.globalSettings}
                                    </span>
                                </div>
                                <Button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    size="sm"
                                >
                                    <Save size={15} />
                                    {isSaving ? t.editor.saving : t.editor.save}
                                </Button>
                            </div>
                            <div className="flf-builder__detail-scroll">
                                <div
                                    style={{
                                        padding:
                                            "var(--flf-builder-container-padding)",
                                        maxWidth:
                                            "var(--flf-builder-content-max-width)",
                                        margin: "0 auto",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "var(--flf-builder-space-6)",
                                        paddingBottom:
                                            "var(--flf-builder-space-12)",
                                    }}
                                >
                                    <LessonSettingsForm
                                        settings={settings}
                                        onUpdate={setSettings}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : activeNode ? (
                        <div
                            key={activeNode.id}
                            className="flf-builder__detail--animate"
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                flex: 1,
                                overflow: "hidden",
                            }}
                        >
                            <ChapterHeader
                                node={activeNode}
                                title={activeData.title || ""}
                                onUpdateTitle={(title) =>
                                    handleUpdateNode(activeNode.id, { title })
                                }
                                onSave={handleSave}
                                isSaving={isSaving}
                            />

                            <div className="flf-builder__detail-scroll">
                                <div
                                    style={{
                                        padding:
                                            "var(--flf-builder-container-padding)",
                                        maxWidth:
                                            "var(--flf-builder-content-max-width)",
                                        margin: "0 auto",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "var(--flf-builder-space-6)",
                                        paddingBottom:
                                            "var(--flf-builder-space-12)",
                                    }}
                                >
                                    <MainContentEditor
                                        node={activeNode}
                                        data={activeData}
                                        onUpdate={handleUpdateNode}
                                        memoizedDSL={memoizedDSL}
                                        handleQuizChange={handleQuizChange}
                                    />

                                    <hr className="flf-builder__separator" />

                                    <PerformanceRules
                                        node={activeNode}
                                        data={activeData}
                                        onUpdate={handleUpdateNode}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

export default LessonBuilder;
