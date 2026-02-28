import React, { useRef, useEffect } from "react";
import { FileText } from "lucide-react";
import { Node } from "@xyflow/react";
import { QuizEditor, type QuizEditorRef } from "@quizerjs/react";
import { enUS, zhCN, jaJP, koKR, esES, deDE, frFR } from "@quizerjs/i18n";
import { MarkdownEditor } from "@kongzijs/markdown-editor";
import { FLFNodeData } from "@kongzijs/flf-core";
import { useFLFTranslation } from "@kongzijs/flf-i18n";

const quizLocalizationMap: Record<string, unknown> = {
    en: enUS,
    "en-US": enUS,
    "en-GB": enUS,
    "zh-CN": zhCN,
    "zh-TW": zhCN,
    ja: jaJP,
    ko: koKR,
    es: esES,
    de: deDE,
    fr: frFR,
    // FLF i18n locales without QuizerJS bundle: fallback to enUS
    hi: enUS,
    ar: enUS,
    ru: enUS,
};

/**
 * Normalize FLF locale to a key used in quizLocalizationMap so QuizEditor
 * changes locale per FLF builder setting.
 */
function normalizeQuizLocale(locale: string | undefined): string {
    if (!locale) return "en";
    const normalized = locale.replace(/_/g, "-");
    if (normalized.startsWith("en")) return "en";
    return normalized in quizLocalizationMap ? normalized : "en";
}

interface MainContentEditorProps {
    node: Node;
    data: FLFNodeData;
    onUpdate: (id: string, data: Partial<FLFNodeData>) => void;
    memoizedDSL: any;
    handleQuizChange: (dsl: any) => Promise<void>;
}

export function MainContentEditor({
    node,
    data,
    onUpdate,
    memoizedDSL,
    handleQuizChange,
}: MainContentEditorProps) {
    const editorRef = useRef<QuizEditorRef>(null);
    const prevNodeIdRef = useRef<string | null>(null);
    const { t, locale } = useFLFTranslation();

    const quizLocaleKey = normalizeQuizLocale(locale);
    const quizLocalization =
        (quizLocalizationMap[quizLocaleKey] as typeof enUS) || enUS;

    // Load editor on node change
    useEffect(() => {
        const currentNodeId = node?.id || null;
        const prevNodeId = prevNodeIdRef.current;

        if (
            node?.type === "testNode" &&
            editorRef.current &&
            memoizedDSL &&
            prevNodeId !== null &&
            prevNodeId !== currentNodeId
        ) {
            editorRef.current.load(memoizedDSL).catch((err) => {
                console.error("[LessonBuilder] Failed to load quiz data:", err);
            });
        }

        prevNodeIdRef.current = currentNodeId;
    }, [node?.id, node?.type, memoizedDSL]);

    return (
        <section className="flf-builder__form">
            <div className="flf-builder__form-card">
                <div className="flf-builder__form-card-header">
                    <div className="flf-builder__form-card-icon">
                        <FileText size={20} />
                    </div>
                    <div className="flf-builder__form-card-titles">
                        <h2 className="flf-builder__form-card-title">
                            {t.editor.mainContent}
                        </h2>
                        <p className="flf-builder__form-card-desc">
                            {t.editor.mainContentDesc}
                        </p>
                    </div>
                </div>

                <div className="flf-builder__form-card-body">
                    {node.type === "learn" || node.type === "learnNode" ? (
                        <div className="flf-builder__form-field">
                            <label className="flf-builder__form-label">
                                {t.editor.learnChapterTitle}
                            </label>
                            <MarkdownEditor
                                value={data.markdown || ""}
                                onChange={(val) =>
                                    onUpdate(node.id, {
                                        markdown: val || "",
                                    })
                                }
                                localization={t.markdown}
                            />
                        </div>
                    ) : (
                        <div className="flf-builder__form-field">
                            <label className="flf-builder__form-label">
                                {t.editor.interactiveQuizEditor}
                            </label>
                            <div className="flf-builder__perf-rules flf-builder__quiz-wrap">
                                {/* key by locale so QuizEditor remounts when FLF locale changes and uses the correct language set */}
                                <QuizEditor
                                    key={locale ?? "en"}
                                    ref={editorRef}
                                    initialDSL={memoizedDSL!}
                                    localization={quizLocalization as any}
                                    onChange={handleQuizChange}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
