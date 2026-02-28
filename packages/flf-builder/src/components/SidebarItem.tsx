import React from "react";
import { Button } from "@borgtj/react";
import { ArrowUp, ArrowDown, Trash2, BookOpen, Zap } from "lucide-react";
import { Node } from "@xyflow/react";
import { FLFNodeData } from "@kongzijs/flf-core";
import { useFLFTranslation } from "@kongzijs/flf-i18n";

interface SidebarItemProps {
    node: Node;
    index: number;
    isActive: boolean;
    isFirst: boolean;
    isLast: boolean;
    onClick: () => void;
    onMove: (index: number, direction: "up" | "down") => void;
    onDelete: (id: string) => void;
}

export function SidebarItem({
    node,
    index,
    isActive,
    isFirst,
    isLast,
    onClick,
    onMove,
    onDelete,
}: SidebarItemProps) {
    const data = node.data as FLFNodeData;
    const isLearn = node.type === "learnNode";
    const typeModifier = isLearn
        ? "flf-builder__sidebar-item--learn"
        : "flf-builder__sidebar-item--quiz";

    const { t } = useFLFTranslation();

    return (
        <div
            onClick={onClick}
            className={[
                "flf-builder__sidebar-item",
                typeModifier,
                isActive ? "flf-builder__sidebar-item--active" : "",
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <div className="flf-builder__sidebar-item-icon">
                {isLearn ? <BookOpen size={14} /> : <Zap size={14} />}
            </div>
            <span className="flf-builder__sidebar-item-title">
                {data.title || t.editor.chapterTitle}
            </span>
            <div className="flf-builder__sidebar-item-actions">
                <Button
                    variant="ghost"
                    size="icon"
                    disabled={isFirst}
                    onClick={(e) => {
                        e.stopPropagation();
                        onMove(index, "up");
                    }}
                    aria-label="Move up"
                >
                    <ArrowUp size={12} />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    disabled={isLast}
                    onClick={(e) => {
                        e.stopPropagation();
                        onMove(index, "down");
                    }}
                    aria-label="Move down"
                >
                    <ArrowDown size={12} />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Delete Chapter"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(node.id);
                    }}
                >
                    <Trash2 size={12} />
                </Button>
            </div>
        </div>
    );
}
