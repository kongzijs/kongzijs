import { Slider, CardToggle } from "@borgtj/react";
import { Settings2, Target } from "lucide-react";
import { Node } from "@xyflow/react";
import { FLFNodeData } from "@kongzijs/flf-core";
import { useFLFTranslation } from "@kongzijs/flf-i18n";

interface PerformanceRulesProps {
    node: Node;
    data: FLFNodeData;
    onUpdate: (id: string, data: Partial<FLFNodeData>) => void;
}

export function PerformanceRules({
    node,
    data,
    onUpdate,
}: PerformanceRulesProps) {
    const isLearnNode = node.type === "learn" || node.type === "learnNode";
    const rules = data.rules || {};
    const minProg = (rules.min_prog || 1) * 100;
    const passingScore = (rules.passing_score || 0.8) * 100;
    const { t } = useFLFTranslation();

    const handleRuleChange = (key: string, value: number) => {
        onUpdate(node.id, {
            rules: {
                ...rules,
                [key]: value / 100,
            },
        });
    };

    const valueBadgeClass = isLearnNode
        ? "flf-builder__perf-rules-value-badge--learn"
        : "flf-builder__perf-rules-value-badge--quiz";

    return (
        <section className="flf-builder__perf-rules">
            {/* Header */}
            <div className="flf-builder__perf-rules-header">
                <div className="flf-builder__perf-rules-icon">
                    <Settings2 size={20} />
                </div>
                <h4 className="flf-builder__perf-rules-title">
                    {t.editor.performanceRules}
                </h4>
            </div>

            {/* Equal two-column grid */}
            <div className="flf-builder__perf-rules-grid">
                {/* Column 1: Thresholds */}
                <div className="flf-builder__perf-rules-threshold">
                    <div className="flf-builder__perf-rules-threshold-header">
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                            }}
                        >
                            {!isLearnNode && (
                                <Target
                                    size={16}
                                    style={{
                                        color: "var(--flf-builder-color-secondary)",
                                    }}
                                />
                            )}
                            <span className="flf-builder__perf-rules-threshold-label">
                                {isLearnNode
                                    ? t.editor.minimumProgress
                                    : t.editor.passingScore}
                            </span>
                        </div>
                        <span
                            className={`flf-builder__perf-rules-value-badge ${valueBadgeClass}`}
                        >
                            {isLearnNode
                                ? `${Math.round(minProg)}% Required`
                                : `Min ${Math.round(passingScore)}% Correct`}
                        </span>
                    </div>

                    <Slider
                        min={0}
                        max={100}
                        step={isLearnNode ? 5 : 1}
                        value={[
                            Math.round(isLearnNode ? minProg : passingScore),
                        ]}
                        onValueChange={([val]) =>
                            handleRuleChange(
                                isLearnNode ? "min_prog" : "passing_score",
                                val,
                            )
                        }
                        aria-label={
                            isLearnNode ? "Minimum progress" : "Passing Score"
                        }
                    />

                    <p className="flf-builder__perf-rules-help">
                        {isLearnNode
                            ? t.editor.performanceRulesDesc
                            : t.editor.performanceRulesDesc}
                    </p>
                </div>

                {/* Column 2: Toggles */}
                <div className="flf-builder__perf-rules-toggles">
                    <CardToggle
                        title={t.editor.isMilestone}
                        description={t.editor.sessionPersistenceDesc}
                        checked={!!data.is_milestone}
                        onCheckedChange={(checked) =>
                            onUpdate(node.id, { is_milestone: checked })
                        }
                        variant="success"
                    />
                </div>
            </div>
        </section>
    );
}
