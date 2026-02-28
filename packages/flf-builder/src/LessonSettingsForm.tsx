import React from "react";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
    Input,
    Textarea,
} from "@borgtj/react";
import { FLFSettings } from "@kongzijs/flf-core";
import { Settings2, BookOpen, SlidersHorizontal, Layers } from "lucide-react";
import { useFLFTranslation } from "@kongzijs/flf-i18n";

interface LessonSettingsFormProps {
    settings: FLFSettings;
    onUpdate: (settings: FLFSettings) => void;
}

export function LessonSettingsForm({
    settings,
    onUpdate,
}: LessonSettingsFormProps) {
    const handleChange = (key: keyof FLFSettings, value: unknown) => {
        onUpdate({ ...settings, [key]: value });
    };

    const { t } = useFLFTranslation();

    return (
        <div className="flf-builder__form">
            <div className="flf-builder__form-card">
                {/* Card Header */}
                <div className="flf-builder__form-card-header">
                    <div className="flf-builder__form-card-icon">
                        <Settings2 size={20} />
                    </div>
                    <div className="flf-builder__form-card-titles">
                        <h2 className="flf-builder__form-card-title">
                            {t.editor.lessonConfig}
                        </h2>
                        <p className="flf-builder__form-card-desc">
                            {t.editor.lessonConfigDesc}
                        </p>
                    </div>
                </div>

                {/* Card Body */}
                <div className="flf-builder__form-card-body">
                    {/* Section 1: Basic Info */}
                    <div className="flf-builder__form-section">
                        <div className="flf-builder__form-section-header">
                            <BookOpen size={14} />
                            {t.editor.sectionBasicInfo}
                        </div>
                        <div className="flf-builder-grid">
                            <div className="flf-builder__form-field">
                                <label className="flf-builder__form-label">
                                    {t.editor.courseTitle}
                                </label>
                                <Input
                                    placeholder={t.editor.placeholderCourseTitle}
                                    value={settings.title || ""}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        handleChange("title", e.target.value)
                                    }
                                />
                            </div>
                            <div className="flf-builder__form-field">
                                <label className="flf-builder__form-label">
                                    {t.editor.courseDescription}
                                </label>
                                <Textarea
                                    placeholder={t.editor.placeholderCourseDesc}
                                    value={settings.description || ""}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                        handleChange(
                                            "description",
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <hr className="flf-builder__form-divider" />

                    {/* Section 2: Properties */}
                    <div className="flf-builder__form-section">
                        <div className="flf-builder__form-section-header">
                            <SlidersHorizontal size={14} />
                            {t.editor.sectionAttributes}
                        </div>
                        <div className="flf-builder-grid">
                            {/* Difficulty */}
                            <div className="flf-builder__form-field">
                                <label className="flf-builder__form-label">
                                    {t.settings.difficulty}
                                </label>
                                <Select
                                    value={settings.difficulty || "beginner"}
                                    onValueChange={(val: string) =>
                                        handleChange("difficulty", val)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue
                                            placeholder={
                                                t.editor.selectDifficulty
                                            }
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="beginner">
                                            {t.settings.beginner}
                                        </SelectItem>
                                        <SelectItem value="intermediate">
                                            {t.settings.intermediate}
                                        </SelectItem>
                                        <SelectItem value="advanced">
                                            {t.settings.advanced}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Access Control */}
                            <div className="flf-builder__form-field">
                                <label className="flf-builder__form-label">
                                    {t.settings.accessControl}
                                </label>
                                <Select
                                    value={settings.access_control || "public"}
                                    onValueChange={(val: string) =>
                                        handleChange("access_control", val)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue
                                            placeholder={
                                                t.editor.selectAccess
                                            }
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="public">
                                            {t.settings.public}
                                        </SelectItem>
                                        <SelectItem value="protected">
                                            {t.settings.premium}
                                        </SelectItem>
                                        <SelectItem value="private">
                                            {t.settings.private}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Duration */}
                            <div className="flf-builder__form-field">
                                <label className="flf-builder__form-label">
                                    {t.editor.estimatedDuration}
                                </label>
                                <div className="flf-builder__form-input-wrap">
                                    <Input
                                        type="number"
                                        value={
                                            settings.estimated_duration || 10
                                        }
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            handleChange(
                                                "estimated_duration",
                                                parseInt(e.target.value) || 0,
                                            )
                                        }
                                    />
                                    <span className="flf-builder__form-input-suffix">
                                        {t.editor.estimatedDurationUnit}
                                    </span>
                                </div>
                            </div>

                            {/* Credits */}
                            <div className="flf-builder__form-field">
                                <label className="flf-builder__form-label">
                                    {t.settings.totalCredits}
                                </label>
                                <div className="flf-builder__form-input-wrap">
                                    <Input
                                        type="number"
                                        value={settings.total_credits || 50}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            handleChange(
                                                "total_credits",
                                                parseInt(e.target.value) || 0,
                                            )
                                        }
                                    />
                                    <span className="flf-builder__form-input-suffix">
                                        pts
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="flf-builder__form-divider" />

                    {/* Section 3: Status & Requirements */}
                    <div className="flf-builder__form-section">
                        <div className="flf-builder__form-section-header">
                            <Layers size={14} />
                            {t.editor.sectionStatusReqs}
                        </div>
                        <div className="flf-builder-grid">
                            {/* Level Required */}
                            <div className="flf-builder__form-field">
                                <label className="flf-builder__form-label">
                                    {t.settings.levelRequired}
                                </label>
                                <Input
                                    type="number"
                                    value={settings.level_required || 1}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        handleChange(
                                            "level_required",
                                            parseInt(e.target.value) || 1,
                                        )
                                    }
                                />
                            </div>

                            {/* Status */}
                            <div className="flf-builder__form-field">
                                <label className="flf-builder__form-label">
                                    {t.settings.status}
                                </label>
                                <Select
                                    value={settings.status || "draft"}
                                    onValueChange={(val: string) =>
                                        handleChange("status", val)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue
                                            placeholder={
                                                t.editor.selectStatus
                                            }
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">
                                            {t.settings.draft}
                                        </SelectItem>
                                        <SelectItem value="review">
                                            {t.settings.review}
                                        </SelectItem>
                                        <SelectItem value="published">
                                            {t.settings.published}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
