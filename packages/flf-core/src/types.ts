/**
 * Fluence Lesson Format (FLF) 规范类型定义 (RFC 0017)
 */

export type FLFVersion = "1.0";

export type AssetType = "video" | "audio" | "image" | "pdf" | "quiz_dsl";

export interface AssetManifestEntry {
    id: string; // 脚本内唯一标识
    type: AssetType;
    src: string; // 协议化路径: https://, local://, asset://, blob://
    hash?: string; // 完整性校验
}

export type FlowNodeType = "start" | "learn" | "test" | "end" | "resource";

export interface FlowNodeRules {
    // Learn 节点规则
    min_prog?: number; // 0.0 to 1.0 (100%)
    min_view_time?: number; // 秒

    // Test 节点规则
    passing_score?: number; // 0.0 to 1.0
    max_attempts?: number;
    on_fail?: "stay" | "redirect" | "retry";
    redirect_node_id?: string;
}

export interface QuizOption {
    id: string; // block 内唯一标识
    text: string;
    is_correct: boolean;
}

export interface QuizQuestion {
    id: string;
    type: string;
    title?: string; // RFC 0031
    description?: string; // RFC 0031
    text: string;
    points?: number;
    options?: QuizOption[];
    section_title?: string; // Internal: RFC 0031
    correct_answer_text?: string; // Internal: RFC 0031
}

export interface FLFContentData {
    markdown?: string; // Learn 节点的富文本内容
    title?: string;
    media_ids?: string[]; // Learn 节点可以关联多个媒体音频/视频
    quiz_dsl?: any; // RFC 0031: 存储完整的 QuizDSL 对象 (保真镜像)
    questions?: QuizQuestion[]; // 兼容性字段 (RFC 0027)
}

export interface FLFFlowNode {
    id: string; // 节点 ID
    type: FlowNodeType;
    asset_id?: string; // 引用 AssetManifestEntry.id
    data?: FLFContentData;
    rules?: FlowNodeRules;
    position?: { x: number; y: number }; // 可视化编排时的位置 (React Flow 兼容)
    // 统计与追踪点 (RFC 0017 Section 4)
    track_id?: string; // 业务 ID，用于统计报表中区分特定步骤
    is_milestone?: boolean; // 是否为关键里程碑点，用于阶段性学分结算
}

// RFC 0034: React Flow Node Data (Merged Structure)
// Used by UI components to access flattened data
export interface FLFNodeData extends FLFContentData {
    asset_id?: string;
    rules?: FlowNodeRules;
    track_id?: string;
    is_milestone?: boolean;
    [key: string]: any; // Allow extensibility for UI-only state
}

export interface FLFFlowEdge {
    id: string;
    source: string; // source node id
    target: string; // target node id
    label?: string; // 如 "Success", "Fail"
    condition?: "success" | "fail" | "default";
}

export interface FLFSettings {
    title?: string;
    description?: string;
    level_required?: number;
    total_credits?: number;
    access_control?: "public" | "private" | "protected";
    estimated_duration?: number; // 分钟
    difficulty?: "beginner" | "intermediate" | "advanced";
    score_points?: number; // RFC 0009: 完成课程获得的分数
    status?: "draft" | "review" | "published";
}

/**
 * 完整的 FLF 清单对象 (lesson.flf)
 */
export interface FLFManifest {
    flf_version: FLFVersion;
    lesson_id: string;
    settings: FLFSettings;
    fingerprint?: string;
    assets_manifest: AssetManifestEntry[];
    flow_nodes: FLFFlowNode[];
    flow_edges: FLFFlowEdge[]; // 显式支撑 React Flow 的图结构
}
