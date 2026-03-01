import { Button } from "@borgtj/react";
import { Save, BookOpen, Zap } from "lucide-react";
import { Node } from "@xyflow/react";
import { useFLFTranslation } from "@kongzijs/flf-i18n";

interface ChapterHeaderProps {
    node: Node;
    title: string;
    onUpdateTitle: (title: string) => void;
    onSave: () => void;
    isSaving: boolean;
}

export function ChapterHeader({
    node,
    title,
    onUpdateTitle,
    onSave,
    isSaving,
}: ChapterHeaderProps) {
    const isLearnNode = node.type === "learn" || node.type === "learnNode";
    const typeModifier = isLearnNode
        ? "flf-builder__chapter-header-icon--learn"
        : "flf-builder__chapter-header-icon--quiz";
    const badgeModifier = isLearnNode
        ? "flf-builder__chapter-header-badge--learn"
        : "flf-builder__chapter-header-badge--quiz";

    const { t } = useFLFTranslation();

    return (
        <div className="flf-builder__chapter-header">
            {/* Left: icon + title */}
            <div className="flf-builder__chapter-header-left">
                <div
                    className={`flf-builder__chapter-header-icon ${typeModifier}`}
                >
                    {isLearnNode ? <BookOpen size={18} /> : <Zap size={18} />}
                </div>
                <input
                    className="flf-builder__chapter-header-title"
                    value={title || ""}
                    onChange={(e) => onUpdateTitle(e.target.value)}
                    placeholder={t.editor.chapterTitle}
                />
            </div>

            {/* Right: type badge + save */}
            <div className="flf-builder__chapter-header-right">
                <div
                    className={`flf-builder__chapter-header-badge ${badgeModifier}`}
                >
                    {isLearnNode
                        ? t.editor.learnChapterTitle
                        : t.editor.testChapterTitle}
                </div>
                <div className="flf-builder__chapter-header-divider" />
                <Button onClick={onSave} disabled={isSaving} size="sm">
                    <Save size={15} />
                    {isSaving ? t.editor.saving : t.editor.save}
                </Button>
            </div>
        </div>
    );
}
