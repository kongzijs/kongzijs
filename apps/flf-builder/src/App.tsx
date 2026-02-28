import React, { useState } from "react";
import { LessonBuilder } from "@kongzijs/flf-builder";
import { FLFManifest, FLFNodeData } from "@kongzijs/flf-core";
import { FLFEditor } from "@kongzijs/flf-editor";
import {
    FLFBuilderProvider,
    enUS,
    zhCN,
    zhTW,
    jaJP,
    koKR,
    esES,
    hiIN,
    ruRU,
    arSA,
} from "@kongzijs/flf-i18n";

const RECORD_DICTIONARIES: Record<string, any> = {
    en: enUS,
    "zh-CN": zhCN,
    "zh-TW": zhTW,
    ja: jaJP,
    ko: koKR,
    es: esES,
    hi: hiIN,
    ru: ruRU,
    ar: arSA,
};

import { Toaster } from "sonner";

// 模拟初始数据 (RFC 0031 验证数据)
const MOCK_MANIFEST: FLFManifest = {
    flf_version: "1.0",
    lesson_id: "test-lesson-id",
    settings: {
        title: "LessonBuilder 全保真验证 (RFC 0031)",
        description: "验证章节结构 (Sections) 是否在编排过程中丢失",
        difficulty: "intermediate",
    },
    assets_manifest: [],
    flow_nodes: [
        {
            id: "node-1",
            type: "start",
            position: { x: 100, y: 200 },
            data: { title: "开始" },
        },
        {
            // Learn module — tests PerformanceRules slider + CardToggle
            id: "node-learn",
            type: "learn",
            position: { x: 400, y: 200 },
            data: {
                title: "学习模块 (Learn Module)",
                is_milestone: false,
                rules: {
                    min_prog: 1.0, // 100% required by default
                },
            } as FLFNodeData,
        },
        {
            id: "node-2",
            type: "test",
            position: { x: 700, y: 200 },
            data: {
                title: "带章节的测验",
                // RFC 0031: 使用 quiz_dsl 存储复杂结构
                quiz_dsl: {
                    version: "1.0.0",
                    quiz: {
                        id: "quiz-complex-1",
                        title: "全保真演示测验",
                        sections: [
                            {
                                id: "sec-vocab",
                                title: "第一部分：核心词汇",
                                questions: [
                                    {
                                        id: "q-v1",
                                        type: "single_choice",
                                        text: "What is the capital of France?",
                                        points: 2,
                                        options: [
                                            {
                                                id: "o-v1-1",
                                                text: "Paris",
                                                is_correct: true,
                                            },
                                            {
                                                id: "o-v1-2",
                                                text: "London",
                                                is_correct: false,
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                id: "sec-grammar",
                                title: "第二部分：语法应用",
                                questions: [
                                    {
                                        id: "q-g1",
                                        type: "text_input",
                                        text: "Fill in: I ___ (be) a student.",
                                        points: 5,
                                        correctAnswer: "am",
                                    },
                                ],
                            },
                        ],
                    },
                },
            },
        },
    ],
    flow_edges: [
        {
            id: "e1-learn",
            source: "node-1",
            target: "node-learn",
            condition: "default",
        },
        {
            id: "e-learn-2",
            source: "node-learn",
            target: "node-2",
            condition: "default",
        },
    ],
};

function App() {
    const [manifest, setManifest] = useState<FLFManifest>(MOCK_MANIFEST);
    const [showOutput, setShowOutput] = useState(false);
    const [lastSaved, setLastSaved] = useState<FLFManifest | null>(null);
    const [locale, setLocale] = useState<string>("en");

    const handleSave = async (id: number, updatedManifest: FLFManifest) => {
        console.log("💾 保存触发 (模拟输出):", updatedManifest);
        setManifest(updatedManifest);
        setLastSaved(updatedManifest);
        setShowOutput(true);

        // 硬证据检查
        const testNode = updatedManifest.flow_nodes.find(
            (n) => n.type === "test",
        );
        console.log("🔍 审计检测 - 测验节点数据:", testNode?.data);

        // 验证章节是否保留
        if (testNode?.data?.quiz_dsl?.quiz?.sections) {
            console.log("✅ 验证成功: 章节结构已完整保留!");
        } else {
            console.warn("❌ 严重错误: 章节结构丢失!");
        }

        return { success: true };
    };

    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                position: "relative",
            }}
        >
            <header
                style={{
                    padding: "10px 20px",
                    background: "#fbfcef",
                    borderBottom: "1px solid #343b1b",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <div>
                    <h1
                        style={{
                            margin: 0,
                            fontSize: "18px",
                            color: "#343b1b",
                        }}
                    >
                        LessonBuilder 核心层验证项目
                    </h1>
                    <div style={{ fontSize: "12px", color: "#6b7040" }}>
                        模式: RFC 0031 全保真数据验证 (无 DB)
                    </div>
                </div>
                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                    }}
                >
                    <select
                        value={locale}
                        onChange={(e) => setLocale(e.target.value)}
                        style={{
                            padding: "4px 8px",
                            borderRadius: "6px",
                            border: "1px solid #343b1b",
                            background: "white",
                            fontSize: "12px",
                            cursor: "pointer",
                        }}
                    >
                        <option value="en">English (en)</option>
                        <option value="zh-CN">简体中文 (zh-CN)</option>
                        <option value="zh-TW">繁體中文 (zh-TW)</option>
                        <option value="ja">日本語 (ja)</option>
                        <option value="ko">한국어 (ko)</option>
                        <option value="es">Español (es)</option>
                        <option value="hi">हिन्दी (hi)</option>
                        <option value="ru">Русский (ru)</option>
                        <option value="ar">العربية (ar)</option>
                    </select>
                    {lastSaved && (
                        <button
                            onClick={() => setShowOutput(true)}
                            style={{
                                padding: "4px 12px",
                                borderRadius: "6px",
                                background: "#3971b8",
                                color: "white",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "12px",
                            }}
                        >
                            View Last Save
                        </button>
                    )}
                </div>
            </header>

            <main style={{ flex: 1, overflow: "hidden" }}>
                <FLFBuilderProvider
                    locale={locale as any}
                    dictionary={RECORD_DICTIONARIES[locale] || enUS}
                >
                    <LessonBuilder
                        lessonId={999}
                        initialManifest={manifest}
                        onSave={handleSave}
                    />
                </FLFBuilderProvider>
            </main>

            {showOutput && lastSaved && (
                <div
                    style={{
                        position: "absolute",
                        top: "80px",
                        right: "20px",
                        bottom: "20px",
                        width: "480px",
                        background: "rgba(255, 255, 255, 0.95)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid #343b1b",
                        borderRadius: "12px",
                        display: "flex",
                        flexDirection: "column",
                        zIndex: 1000,
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <div
                        style={{
                            padding: "12px 16px",
                            borderBottom: "1px solid #343b1b",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            background: "#343b1b",
                            color: "white",
                            borderTopLeftRadius: "11px",
                            borderTopRightRadius: "11px",
                        }}
                    >
                        <span style={{ fontWeight: "bold" }}>
                            💾 Saved Manifest (FLF)
                        </span>
                        <button
                            onClick={() => setShowOutput(false)}
                            style={{
                                background: "none",
                                border: "none",
                                color: "white",
                                cursor: "pointer",
                                fontSize: "18px",
                            }}
                        >
                            ×
                        </button>
                    </div>
                    <div style={{ flex: 1, overflow: "hidden" }}>
                        <FLFEditor
                            value={JSON.stringify(lastSaved, null, 2)}
                            language="json"
                            theme="vs-dark"
                        />
                    </div>
                </div>
            )}

            <Toaster position="top-right" richColors />
        </div>
    );
}

export default App;
