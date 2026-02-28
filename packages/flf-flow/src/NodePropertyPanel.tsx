"use client";

import React from "react";
import {
    Input,
    Label,
    Textarea,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@borgtj/react";
import {
    BookOpen,
    Zap,
    Hash,
    Settings2,
    FileText,
    Target,
    Sparkles,
    TrendingUp,
    CheckCircle2,
    X,
} from "lucide-react";
import "./NodePropertyPanel.css";

interface NodePropertyPanelProps {
    node: any; // React Flow Node
    onUpdate: (id: string, data: any) => void;
    onClose?: () => void; // 可选的关闭回调
}

/**
 * Node Property Panel (RFC 0023) - 全面重新设计的现代化 UI
 * 负责对 Learn/Test 节点进行精细化属性编辑
 */
export default function NodePropertyPanel({
    node,
    onUpdate,
    onClose,
}: NodePropertyPanelProps) {
    if (!node) return null;

    const { id, type, data } = node;
    const isLearnNode = type === "learnNode";
    const accentColorClass = isLearnNode
        ? "bg-blue-500 text-white"
        : "bg-orange-500 text-white";
    const accentBgClass = isLearnNode
        ? "bg-blue-50 text-blue-600"
        : "bg-orange-50 text-orange-600";
    const accentBorderClass = isLearnNode
        ? "border-blue-200 focus:border-blue-500 focus:ring-blue-500/20"
        : "border-orange-200 focus:border-orange-500 focus:ring-orange-500/20";

    const handleChange = (field: string, value: any) => {
        onUpdate(id, { ...data, [field]: value });
    };

    const handleRuleChange = (field: string, value: any) => {
        onUpdate(id, {
            ...data,
            rules: { ...(data.rules || {}), [field]: value },
        });
    };

    const passingScore = Math.round((data.rules?.passing_score || 0.8) * 100);
    const minProgress = Math.round((data.rules?.min_prog || 1) * 100);

    return (
        <div
            className="flex flex-1 flex-col overflow-hidden bg-gradient-to-b from-white to-slate-50/50"
            style={{ minHeight: 0 }}
        >
            {/* Enhanced Header */}
            <div className="inspector-header-enhanced">
                <div className="flex items-start gap-4">
                    <div
                        className={`inspector-icon-wrapper ${accentColorClass}`}
                    >
                        {isLearnNode ? (
                            <BookOpen size={24} strokeWidth={2.5} />
                        ) : (
                            <Zap size={24} strokeWidth={2.5} />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-slate-900 text-lg">
                                    Edit {isLearnNode ? "Learn" : "Test"} Node
                                </h3>
                                {!isLearnNode && (
                                    <Sparkles
                                        size={16}
                                        className="text-orange-500"
                                    />
                                )}
                            </div>
                            {onClose && (
                                <button
                                    className="inspector-close-button-inline"
                                    onClick={onClose}
                                    aria-label="Close Inspector"
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>
                        <p className="text-sm text-slate-500 font-medium">
                            Configure node properties and mission rules
                        </p>
                        <div className="mt-3 flex items-center gap-2">
                            <Hash size={12} className="text-slate-400" />
                            <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                                {id}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content with better spacing */}
            <div className="flex-1 overflow-y-auto inspector-content">
                {/* Basic Settings Section */}
                <div className="inspector-section">
                    <div className="inspector-section-header">
                        <FileText size={16} className="text-slate-400" />
                        <span className="inspector-section-title">
                            Basic Settings
                        </span>
                    </div>

                    <div className="inspector-form-group">
                        <Label htmlFor="title" className="inspector-label">
                            Node Title
                        </Label>
                        <Input
                            id="title"
                            value={data.title || ""}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>,
                            ) => handleChange("title", e.target.value)}
                            placeholder="e.g. Introduction to Grammar"
                            className={`inspector-input ${accentBorderClass}`}
                        />
                        <p className="inspector-hint">
                            Enter a descriptive title for this node
                        </p>
                    </div>

                    {isLearnNode && (
                        <div className="inspector-form-group">
                            <Label
                                htmlFor="markdown"
                                className="inspector-label"
                            >
                                Content (Markdown)
                            </Label>
                            <Textarea
                                id="markdown"
                                className={`inspector-textarea ${accentBorderClass}`}
                                value={data.markdown || ""}
                                onChange={(
                                    e: React.ChangeEvent<HTMLTextAreaElement>,
                                ) => handleChange("markdown", e.target.value)}
                                placeholder="# Welcome to Fluence...&#10;&#10;This is your learning content.&#10;Use Markdown to format your text."
                                rows={10}
                            />
                            <div className="flex items-center gap-2 mt-2">
                                <CheckCircle2
                                    size={14}
                                    className="text-blue-500"
                                />
                                <p className="inspector-hint">
                                    Supports Markdown syntax for rich text
                                    formatting
                                </p>
                            </div>
                        </div>
                    )}

                    {!isLearnNode && (
                        <div className="inspector-form-group">
                            <div className="flex items-center justify-between mb-2">
                                <Label className="inspector-label">
                                    Quiz Asset
                                </Label>
                                <div className="flex items-center gap-1.5">
                                    <Target
                                        size={12}
                                        className="text-orange-500"
                                    />
                                    <p className="inspector-hint-small">
                                        Choose a quiz asset
                                    </p>
                                </div>
                            </div>
                            <Select
                                value={data.asset_id || ""}
                                onValueChange={(val) =>
                                    handleChange("asset_id", val)
                                }
                            >
                                <SelectTrigger
                                    className={`inspector-select-enhanced ${accentBorderClass}`}
                                >
                                    <SelectValue placeholder="Select a quiz asset" />
                                </SelectTrigger>
                                <SelectContent
                                    className="inspector-select-content"
                                    position="popper"
                                >
                                    <SelectItem
                                        value="intro.quiz"
                                        className="inspector-select-item"
                                    >
                                        <span className="inspector-select-item-text">
                                            intro.quiz
                                        </span>
                                    </SelectItem>
                                    <SelectItem
                                        value="final-test.quiz"
                                        className="inspector-select-item"
                                    >
                                        <span className="inspector-select-item-text">
                                            final-test.quiz
                                        </span>
                                    </SelectItem>
                                    <SelectItem
                                        value="vocab-check.quiz"
                                        className="inspector-select-item"
                                    >
                                        <span className="inspector-select-item-text">
                                            vocab-check.quiz
                                        </span>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>

                {/* Mission Rules Section */}
                <div className="inspector-section">
                    <div className="inspector-section-header">
                        <Settings2 size={16} className="text-slate-400" />
                        <span className="inspector-section-title">
                            Mission Rules
                        </span>
                    </div>

                    {isLearnNode ? (
                        <div className="inspector-form-group">
                            <div className="flex items-center justify-between mb-3">
                                <Label
                                    htmlFor="min_prog"
                                    className="inspector-label"
                                >
                                    Minimum Viewing Progress
                                </Label>
                                <div
                                    className={`inspector-badge ${accentBgClass}`}
                                >
                                    <TrendingUp size={12} />
                                    <span className="font-bold">
                                        {minProgress}%
                                    </span>
                                </div>
                            </div>
                            <div className="relative">
                                <Input
                                    type="number"
                                    id="min_prog"
                                    min="0"
                                    max="100"
                                    value={minProgress}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>,
                                    ) => {
                                        const value = Math.max(
                                            0,
                                            Math.min(
                                                100,
                                                parseFloat(e.target.value) || 0,
                                            ),
                                        );
                                        handleRuleChange(
                                            "min_prog",
                                            value / 100,
                                        );
                                    }}
                                    className={`inspector-input inspector-input-with-suffix ${accentBorderClass}`}
                                />
                                <span className="inspector-input-suffix">
                                    %
                                </span>
                            </div>
                            <div className="mt-3 bg-slate-100 rounded-full h-2 overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-300 ${
                                        isLearnNode
                                            ? "bg-blue-500"
                                            : "bg-orange-500"
                                    }`}
                                    style={{ width: `${minProgress}%` }}
                                />
                            </div>
                            <p className="inspector-hint mt-2">
                                Students must view at least this percentage to
                                proceed
                            </p>
                        </div>
                    ) : (
                        <div className="inspector-form-group">
                            <div className="flex items-center justify-between mb-3">
                                <Label
                                    htmlFor="passing_score"
                                    className="inspector-label"
                                >
                                    Passing Score
                                </Label>
                                <div
                                    className={`inspector-badge ${accentBgClass}`}
                                >
                                    <Target size={12} />
                                    <span className="font-bold">
                                        {passingScore}%
                                    </span>
                                </div>
                            </div>
                            <div className="relative">
                                <Input
                                    type="number"
                                    id="passing_score"
                                    min="0"
                                    max="100"
                                    value={passingScore}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>,
                                    ) => {
                                        const value = Math.max(
                                            0,
                                            Math.min(
                                                100,
                                                parseFloat(e.target.value) || 0,
                                            ),
                                        );
                                        handleRuleChange(
                                            "passing_score",
                                            value / 100,
                                        );
                                    }}
                                    className={`inspector-input inspector-input-with-suffix ${accentBorderClass}`}
                                />
                                <span className="inspector-input-suffix">
                                    %
                                </span>
                            </div>
                            <div className="mt-3 bg-slate-100 rounded-full h-2 overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-300 bg-gradient-to-r from-orange-500 to-amber-400"
                                    style={{ width: `${passingScore}%` }}
                                />
                            </div>
                            <p className="inspector-hint mt-2">
                                Minimum score required to pass this test
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
