"use client";

import { useState, useCallback, useMemo } from "react";
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Panel,
    ReactFlowProvider,
    Position,
    ConnectionLineType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { LearnNode, TestNode, StartNode, EndNode } from "./CustomNodes";
import NodePropertyPanel from "./NodePropertyPanel";
import {
    PlusCircle,
    Save,
    Play,
    Library,
    CloudUpload,
    BookOpen,
    Zap,
    Flag,
    X,
    Edit3,
    FileText,
} from "lucide-react";
import { FLFManifest, FLFTransformer } from "@kongzijs/flf-core";
import { toast } from "sonner";
import { Input, Label, Textarea, Button, Card, Badge } from "@borgtj/react";
import {
    enforceUniqueStartEnd,
    applyVerticalLayout,
    LAYOUT_CONFIG,
} from "./layout-utils";
import "./LessonBuilder.css";

const nodeTypes = {
    startNode: StartNode,
    learnNode: LearnNode,
    testNode: TestNode,
    endNode: EndNode,
};

interface LessonBuilderProps {
    initialManifest?: FLFManifest;
    lessonId: number;
    onSave: (
        lessonId: number,
        manifest: FLFManifest,
    ) => Promise<{ success: boolean; versionId?: string }>;
}

/**
 * Internal Lesson Builder logic
 */
function LessonBuilderInner({
    initialManifest,
    lessonId,
    onSave,
}: LessonBuilderProps) {
    // 1. 初始化状态，并自动布局节点（垂直流：从上到下）
    const initialData = useMemo(() => {
        // 默认的 Start 和 End 节点
        const defaultStartNode = {
            id: `startNode-default`,
            type: "startNode" as const,
            position: { x: 400, y: 50 },
            data: {
                title: "Start",
                asset_id: undefined,
                rules: undefined,
                is_milestone: false,
            },
            sourcePosition: Position.Bottom,
            targetPosition: Position.Top,
        };

        const defaultEndNode = {
            id: `endNode-default`,
            type: "endNode" as const,
            position: { x: 400, y: 350 },
            data: {
                title: "End",
                is_milestone: false,
                asset_id: undefined,
                rules: undefined,
            },
            sourcePosition: Position.Bottom,
            targetPosition: Position.Top,
        };

        if (initialManifest) {
            const data = FLFTransformer.toReactFlow(initialManifest);

            // RFC 0018 Section 8.5: 确保 Start/End 唯一性
            const filteredNodes = enforceUniqueStartEnd(
                data.nodes,
                defaultStartNode,
                defaultEndNode,
            );

            // RFC 0018 Section 8.3.9: 应用垂直布局（支持线性/树形）
            const layoutedNodes = applyVerticalLayout(
                filteredNodes,
                data.edges,
            );

            return {
                nodes: layoutedNodes,
                edges: data.edges,
            };
        }

        // 没有 initialManifest 时，返回默认的 Start 和 End 节点
        return {
            nodes: [defaultStartNode, defaultEndNode],
            edges: [],
        };
    }, [initialManifest]);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialData.nodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(
        initialData.edges as any[],
    );
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isInspectorOpen, setIsInspectorOpen] = useState(false);

    // Lesson metadata state
    const [lessonTitle, setLessonTitle] = useState<string>(
        initialManifest?.lesson_title || "",
    );
    const [lessonDescription, setLessonDescription] = useState<string>(
        initialManifest?.lesson_description || "",
    );

    // RFC 0018 Section 6: 连线逻辑（支持 Success/Fail 分支）
    const onConnect = useCallback(
        (params: Connection) => {
            // 如果是从 Test Node 的特定 handle 连接，设置 condition
            const sourceNode = nodes.find((n) => n.id === params.source);
            let condition: "success" | "fail" | "default" = "default";

            if (sourceNode?.type === "testNode") {
                if (params.sourceHandle === "success") {
                    condition = "success";
                } else if (params.sourceHandle === "fail") {
                    condition = "fail";
                }
            }

            // RFC 0018 Section 6.1: 连线样式（Success/Fail 偏移）
            const newEdge: any = {
                ...params,
                type: "smoothstep",
                animated: true,
                label:
                    condition === "success"
                        ? "Success"
                        : condition === "fail"
                          ? "Fail"
                          : undefined,
                data: {
                    condition,
                },
                style: {
                    strokeWidth: 3,
                    stroke:
                        condition === "success"
                            ? "#10b981" // RFC 0018: Success 绿色
                            : condition === "fail"
                              ? "#ef4444" // RFC 0018: Fail 红色
                              : "#94a3b8", // RFC 0018: Default 灰色
                },
                markerEnd: {
                    type: "arrowclosed",
                    color:
                        condition === "success"
                            ? "#10b981"
                            : condition === "fail"
                              ? "#ef4444"
                              : "#94a3b8",
                },
            };

            setEdges((eds: any[]) => {
                const newEdges = addEdge(newEdge, eds);

                // RFC 0018: 如果添加了 Success/Fail 分支，重新应用布局
                if (condition === "success" || condition === "fail") {
                    const updatedNodes = applyVerticalLayout(nodes, newEdges);
                    setNodes(updatedNodes);
                }

                return newEdges;
            });
        },
        [setEdges, setNodes, nodes],
    );

    // 3. 节点编辑逻辑
    const onNodeClick = useCallback((_: any, node: any) => {
        setSelectedNodeId(node.id);
        setIsInspectorOpen(true); // 打开 drawer
    }, []);

    const updateNodeData = useCallback(
        (id: string, newData: any) => {
            setNodes((nds) =>
                nds.map((node) => {
                    if (node.id === id) {
                        return { ...node, data: newData };
                    }
                    return node;
                }),
            );
        },
        [setNodes],
    );

    // Check for existing start/end nodes
    const hasStartNode = useMemo(
        () => nodes.some((n) => n.type === "startNode"),
        [nodes],
    );
    const hasEndNode = useMemo(
        () => nodes.some((n) => n.type === "endNode"),
        [nodes],
    );

    const addNode = (
        type: "startNode" | "learnNode" | "testNode" | "endNode",
    ) => {
        // Prevent duplicate Start/End nodes
        if (type === "startNode" && hasStartNode) {
            toast.warning("Start Node already exists.");
            return;
        }
        if (type === "endNode" && hasEndNode) {
            toast.warning("End Node already exists.");
            return;
        }
        const id = `${type}-${Date.now()}`;
        const baseData: any = {
            title:
                type === "startNode"
                    ? "Start"
                    : type === "endNode"
                      ? "End"
                      : type === "learnNode"
                        ? "New Lesson Content"
                        : "Knowledge Check",
        };

        if (type === "learnNode" || type === "testNode") {
            baseData.markdown = "";
            baseData.asset_id = "";
            baseData.rules =
                type === "learnNode" ? { min_prog: 1 } : { passing_score: 0.8 };
        }

        if (type === "endNode") {
            baseData.is_milestone = false;
        }

        // RFC 0018 Section 8.4: 添加节点算法
        const existingNodes = nodes;
        const { CENTER_X, START_Y, VERTICAL_SPACING } = LAYOUT_CONFIG;

        // 找到 End 节点的位置（新节点插入到 End 节点之前）
        const endNode = existingNodes.find((n) => n.type === "endNode");
        const nonEndNodes = existingNodes.filter((n) => n.type !== "endNode");

        // 计算新节点的 Y 位置：在 End 节点之前
        let newY = START_Y + VERTICAL_SPACING;
        if (nonEndNodes.length > 0) {
            const maxY = Math.max(
                ...nonEndNodes.map((n) => n.position?.y || 0),
            );
            newY = maxY + VERTICAL_SPACING;
        }

        const newNode = {
            id,
            type,
            position: { x: CENTER_X, y: newY },
            data: baseData,
            // RFC 0018 Section 4.2: 垂直 flow - source 在底部，target 在顶部
            sourcePosition: Position.Bottom,
            targetPosition: Position.Top,
        };

        // RFC 0018 Section 8.4: 如果添加的是 Learn 或 Test 节点，需要把 End 节点往下移
        if ((type === "learnNode" || type === "testNode") && endNode) {
            setNodes((nds) => {
                const updated = nds.map((n) => {
                    if (n.type === "endNode") {
                        return {
                            ...n,
                            position: {
                                ...n.position,
                                y: newY + VERTICAL_SPACING,
                            },
                        };
                    }
                    return n;
                });
                return updated.concat(newNode);
            });
        } else {
            setNodes((nds) => nds.concat(newNode));
        }
    };

    const selectedNode = useMemo(
        () => nodes.find((n) => n.id === selectedNodeId),
        [nodes, selectedNodeId],
    );

    // 4. 保存逻辑
    const handleSave = async () => {
        setIsSaving(true);
        try {
            const manifest = FLFTransformer.fromReactFlow(
                lessonId.toString(),
                initialManifest?.settings || { total_credits: 50 },
                nodes,
                edges,
                initialManifest?.assets_manifest || [],
                lessonTitle || undefined,
                lessonDescription || undefined,
            );

            const result = await onSave(lessonId, manifest);
            if (result.success) {
                toast.success("Lesson mission saved successfully!");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to save lesson draft.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="lesson-builder-container">
            {/* 顶部工具栏 - 新增 Lesson 信息编辑 */}
            <div className="top-toolbar">
                <div className="toolbar-left">
                    <div className="toolbar-logo">
                        <BookOpen size={24} strokeWidth={2.5} />
                        <h1 className="toolbar-title">Lesson Builder</h1>
                    </div>
                </div>

                <div className="toolbar-center">
                    <Card className="lesson-info-card">
                        <div className="lesson-info-form">
                            <div className="lesson-info-field">
                                <Label
                                    htmlFor="lesson-title"
                                    className="lesson-info-label"
                                >
                                    Lesson Title
                                </Label>
                                <Input
                                    id="lesson-title"
                                    value={lessonTitle}
                                    onChange={(e) =>
                                        setLessonTitle(e.target.value)
                                    }
                                    placeholder="Enter lesson title..."
                                    className="lesson-info-input"
                                />
                            </div>
                            <div className="lesson-info-field">
                                <Label
                                    htmlFor="lesson-description"
                                    className="lesson-info-label"
                                >
                                    Description
                                </Label>
                                <Textarea
                                    id="lesson-description"
                                    value={lessonDescription}
                                    onChange={(e) =>
                                        setLessonDescription(e.target.value)
                                    }
                                    placeholder="Enter lesson description..."
                                    className="lesson-info-textarea"
                                    rows={2}
                                />
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="toolbar-right">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            toast.info("Preview feature coming soon")
                        }
                        className="toolbar-button"
                    >
                        <Play size={16} />
                        Preview
                    </Button>
                    <Button
                        variant="default"
                        size="sm"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="toolbar-button toolbar-button-primary"
                    >
                        <Save size={16} />
                        {isSaving ? "Saving..." : "Save"}
                    </Button>
                </div>
            </div>

            {/* 主内容区域 */}
            <div className="lesson-builder-main">
                {/* 左侧 Asset Library */}
                <div className="asset-library">
                    <div className="asset-library-header">
                        <div className="asset-library-title">
                            <Library size={20} strokeWidth={2.5} />
                            <h2>Asset Library</h2>
                        </div>
                        <Badge
                            variant="secondary"
                            className="asset-count-badge"
                        >
                            {nodes.length} nodes
                        </Badge>
                    </div>

                    <div className="node-creation-section">
                        <div className="node-creation-label">
                            Creation Nodes
                        </div>
                        <div className="node-creation-buttons">
                            <button
                                className={`create-node-button start ${hasStartNode ? "opacity-50 cursor-not-allowed" : ""}`}
                                onClick={() => addNode("startNode")}
                                disabled={hasStartNode}
                                title={
                                    hasStartNode
                                        ? "Start node already exists"
                                        : "Add Start Node"
                                }
                            >
                                <div className="create-node-icon">
                                    <Play
                                        size={18}
                                        strokeWidth={2.5}
                                        fill="currentColor"
                                    />
                                </div>
                                <div className="create-node-text">
                                    <span className="label">Start Node</span>
                                    <span className="description">
                                        {hasStartNode
                                            ? "Already added"
                                            : "Flow entry point"}
                                    </span>
                                </div>
                                {hasStartNode ? null : (
                                    <PlusCircle
                                        size={16}
                                        className="opacity-50"
                                    />
                                )}
                            </button>

                            <button
                                className="create-node-button learn"
                                onClick={() => addNode("learnNode")}
                            >
                                <div className="create-node-icon">
                                    <BookOpen size={20} strokeWidth={2.5} />
                                </div>
                                <div className="create-node-text">
                                    <span className="label">Learn Node</span>
                                    <span className="description">
                                        Add learning content
                                    </span>
                                </div>
                                <PlusCircle size={16} className="opacity-50" />
                            </button>

                            <button
                                className="create-node-button test"
                                onClick={() => addNode("testNode")}
                            >
                                <div className="create-node-icon">
                                    <Zap size={20} strokeWidth={2.5} />
                                </div>
                                <div className="create-node-text">
                                    <span className="label">Test Node</span>
                                    <span className="description">
                                        Add quiz challenge
                                    </span>
                                </div>
                                <PlusCircle size={16} className="opacity-50" />
                            </button>

                            <button
                                className={`create-node-button end ${hasEndNode ? "opacity-50 cursor-not-allowed" : ""}`}
                                onClick={() => addNode("endNode")}
                                disabled={hasEndNode}
                                title={
                                    hasEndNode
                                        ? "End node already exists"
                                        : "Add End Node"
                                }
                            >
                                <div className="create-node-icon">
                                    <Flag
                                        size={18}
                                        strokeWidth={2.5}
                                        fill="currentColor"
                                    />
                                </div>
                                <div className="create-node-text">
                                    <span className="label">End Node</span>
                                    <span className="description">
                                        {hasEndNode
                                            ? "Already added"
                                            : "Flow exit point"}
                                    </span>
                                </div>
                                {hasEndNode ? null : (
                                    <PlusCircle
                                        size={16}
                                        className="opacity-50"
                                    />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="asset-drop-zone">
                        <div className="asset-drop-zone-placeholder">
                            <CloudUpload size={48} strokeWidth={1.5} />
                            <p>Drop assets from cloud here</p>
                            <p className="text-xs mt-1 text-slate-400">
                                Coming soon
                            </p>
                        </div>
                    </div>
                </div>

                {/* 中间画布区域 */}
                <div className="canvas-container">
                    <div className="canvas-header">
                        <h3 className="canvas-title">Flow Canvas</h3>
                        <div className="canvas-stats">
                            <Badge variant="outline" className="stat-badge">
                                {nodes.length} nodes
                            </Badge>
                            <Badge variant="outline" className="stat-badge">
                                {edges.length} edges
                            </Badge>
                        </div>
                    </div>
                    <ReactFlow
                        key={`flow-${nodes.length}-${edges.length}`}
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onNodeClick={onNodeClick}
                        onPaneClick={() => {
                            setSelectedNodeId(null);
                            setIsInspectorOpen(false);
                        }}
                        nodeTypes={nodeTypes}
                        defaultEdgeOptions={{
                            type: "smoothstep",
                            animated: true,
                            style: {
                                strokeWidth: 3,
                            },
                            markerEnd: {
                                type: "arrowclosed",
                            },
                        }}
                        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
                        connectionLineType={ConnectionLineType.SmoothStep}
                        fitView
                        fitViewOptions={{
                            padding: 0.15,
                            minZoom: 0.4,
                            maxZoom: 1.5,
                            duration: 300,
                        }}
                        className="react-flow-wrapper"
                    >
                        <Background
                            color="#cbd5e1"
                            gap={24}
                            size={1}
                            style={{ opacity: 0.3 }}
                        />
                        <Controls />
                        <MiniMap
                            zoomable
                            pannable
                            nodeColor={(node) => {
                                if (node.type === "startNode") return "#10b981";
                                if (node.type === "learnNode") return "#3b82f6";
                                if (node.type === "testNode") return "#f59e0b";
                                if (node.type === "endNode") return "#a855f7";
                                return "#94a3b8";
                            }}
                            maskColor="rgba(0, 0, 0, 0.1)"
                        />
                    </ReactFlow>
                </div>

                {/* 右侧 Inspector Drawer */}
                {isInspectorOpen && selectedNode ? (
                    <div className="inspector-drawer inspector-drawer-open">
                        <NodePropertyPanel
                            node={selectedNode}
                            onUpdate={updateNodeData}
                            onClose={() => {
                                setSelectedNodeId(null);
                                setIsInspectorOpen(false);
                            }}
                        />
                    </div>
                ) : (
                    <div className="inspector-drawer inspector-drawer-closed">
                        <div className="inspector-empty-state">
                            <div className="inspector-empty-icon">
                                <Edit3 size={32} strokeWidth={1.5} />
                            </div>
                            <h4 className="inspector-empty-title">
                                No Node Selected
                            </h4>
                            <p className="inspector-empty-description">
                                Click on a node in the canvas to edit its
                                properties
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

/**
 * Lesson Builder 主组件 (RFC 0018)
 */
export default function LessonBuilder(props: LessonBuilderProps) {
    return (
        <ReactFlowProvider>
            <LessonBuilderInner {...props} />
        </ReactFlowProvider>
    );
}
