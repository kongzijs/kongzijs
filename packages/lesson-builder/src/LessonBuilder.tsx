"use client";

import React, { useState, useCallback, useMemo } from "react";
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
} from "lucide-react";
import { FLFManifest, FLFTransformer } from "@kongzijs/flf-core";
import { toast } from "sonner";
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
    // 1. 初始化状态，并自动布局节点
    const initialData = useMemo(() => {
        if (initialManifest) {
            const data = FLFTransformer.toReactFlow(initialManifest);

            // 自动布局：水平排列节点，避免重叠
            const verticalCenter = 250;

            // 按类型和顺序重新排列节点位置
            // 确保 Start 在最前，End 在最后
            // 使用拓扑排序：根据 edges 的连接关系确定顺序
            const nodeMap = new Map(data.nodes.map((n) => [n.id, n]));
            const sortedNodes: typeof data.nodes = [];
            const visited = new Set<string>();

            // 1. 优先找到类型为 'startNode' 的节点
            let startNodes = data.nodes.filter((n) => n.type === "startNode");

            // 2. 如果没找到明确的 startNode，则寻找没有入边的节点
            if (startNodes.length === 0) {
                const nodesWithIncoming = new Set(
                    data.edges.map((e) => e.target),
                );
                startNodes = data.nodes.filter(
                    (n) => !nodesWithIncoming.has(n.id),
                );
            }

            // 3. 如果还是没有找到 (e.g. 循环图)，取第一个
            if (startNodes.length === 0 && data.nodes.length > 0) {
                startNodes = [data.nodes[0]];
            }

            // 深度优先遍历 (DFS)
            const visit = (nodeId: string) => {
                if (visited.has(nodeId)) return;
                visited.add(nodeId);

                const node = nodeMap.get(nodeId);
                if (node) {
                    sortedNodes.push(node);

                    // 访问所有从当前节点出发的边指向的节点
                    const outgoingEdges = data.edges.filter(
                        (e) => e.source === nodeId,
                    );

                    // 按照类型优先级排序子节点 (Learn > Test > End) 以保持视觉整洁
                    const targetNodes = outgoingEdges
                        .map((e) => nodeMap.get(e.target))
                        .filter(Boolean)
                        .sort((a, b) => {
                            // 简单的权重排序：Learn(0) < Test(1) < End(2)
                            const getWeight = (t?: string) => {
                                if (t === "learnNode") return 0;
                                if (t === "testNode") return 1;
                                if (t === "endNode") return 2;
                                return 9;
                            };
                            return getWeight(a?.type) - getWeight(b?.type);
                        });

                    targetNodes.forEach((child) => {
                        if (child) visit(child.id);
                    });
                }
            };

            // 开始遍历
            startNodes.forEach((n) => visit(n.id));

            // 处理未连接的剩余节点
            data.nodes.forEach((n) => {
                if (!visited.has(n.id)) {
                    sortedNodes.push(n);
                }
            });

            const layoutedNodes = sortedNodes.map((node, index) => {
                // 确保 Start 节点在最前（index 0），End 节点在最后
                const nodeType = node.type as string;
                let finalIndex = index;

                // 如果 Start 节点不在最前，强制调整
                if (nodeType === "startNode") {
                    finalIndex = 0;
                } else if (nodeType === "endNode") {
                    // End 节点应该在最后
                    finalIndex = sortedNodes.length - 1;
                }

                return {
                    ...node,
                    position: {
                        x: 100 + finalIndex * 400, // Hardcoded horizontalSpacing
                        y: verticalCenter,
                    },
                    // 水平 flow：source 在右侧，target 在左侧
                    sourcePosition: Position.Right,
                    targetPosition: Position.Left,
                };
            });

            return {
                nodes: layoutedNodes,
                edges: data.edges,
            };
        }
        return { nodes: [], edges: [] };
    }, [initialManifest]);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialData.nodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(
        initialData.edges as any[],
    );
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isInspectorOpen, setIsInspectorOpen] = useState(false);

    // 2. 连线逻辑 (RFC 0018: 支持 Success/Fail 分支，智能路径避免重叠)
    const onConnect = useCallback(
        (params: Connection) => {
            // 如果是从 Test Node 的特定 handle 连接，设置 condition
            const sourceNode = nodes.find((n) => n.id === params.source);
            let condition: "success" | "fail" | "default" = "default";

            if (sourceNode?.type === "testNode") {
                // 根据 sourceHandle 确定 condition
                if (params.sourceHandle === "success") {
                    condition = "success";
                } else if (params.sourceHandle === "fail") {
                    condition = "fail";
                }
            }

            // 智能计算路径偏移以避免重叠
            // 计算从同一 source 出发的所有边（包括不同 target）
            const edgesFromSource = edges.filter(
                (e) => e.source === params.source,
            );

            // 水平 flow 的路径分离
            // 根据 React Flow 文档，pathOptions.offset 是垂直方向的偏移（对于水平 flow）
            // 但要让路径绕过节点，主要靠增加节点间距和 borderRadius
            let pathOffset = 0;
            if (condition === "success") {
                // Success 路径：向上偏移（负值 = 上方）
                pathOffset = -100; // 向上偏移 100px，确保绕过节点
            } else if (condition === "fail") {
                // Fail 路径：向下偏移（正值 = 下方）
                pathOffset = 100; // 向下偏移 100px，确保绕过节点
            } else {
                // 默认路径：不垂直偏移
                pathOffset = 0;
            }

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
                            ? "#10b981"
                            : condition === "fail"
                              ? "#ef4444"
                              : "#94a3b8",
                },
                pathOptions: {
                    offset: pathOffset, // 垂直方向的偏移（对于水平 flow）
                    borderRadius: 20, // 更大的圆角，使路径更平滑地绕过节点
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

            setEdges((eds: any[]) => addEdge(newEdge, eds));
        },
        [setEdges, nodes, edges],
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

        // 智能计算新节点位置，避免重叠
        const existingNodes = nodes;
        const nodeWidth = 320;
        const nodeHeight = 200;
        const spacing = 50;

        // 找到最右边的节点位置
        let maxX = 100;
        if (existingNodes.length > 0) {
            maxX =
                Math.max(
                    ...existingNodes.map(
                        (n) => (n.position?.x || 0) + nodeWidth,
                    ),
                ) + spacing;
        }

        // 垂直居中
        const centerY = 250;

        const newNode = {
            id,
            type,
            position: { x: maxX, y: centerY },
            data: baseData,
            // 水平 flow：source 在右侧，target 在左侧
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
        };
        setNodes((nds) => nds.concat(newNode));
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
            {/* 左侧 Asset Library */}
            <div className="asset-library">
                <div className="asset-library-header">
                    <h2>
                        <Library size={20} strokeWidth={2.5} />
                        Asset Library
                    </h2>
                </div>

                <div className="node-creation-section">
                    <div className="node-creation-label">Creation Nodes</div>
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
                                <PlusCircle size={16} className="opacity-50" />
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
                                <PlusCircle size={16} className="opacity-50" />
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
                        setIsInspectorOpen(false); // 关闭 drawer
                    }}
                    nodeTypes={nodeTypes}
                    defaultEdgeOptions={{
                        type: "smoothstep",
                        animated: true,
                        style: {
                            strokeWidth: 3,
                        },
                        pathOptions: {
                            offset: 0, // 默认不偏移
                            borderRadius: 20, // 更大的圆角，使路径平滑绕过节点
                        } as any,
                        markerEnd: {
                            type: "arrowclosed",
                        },
                    }}
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

                    <Panel position="top-right" className="canvas-controls">
                        <button
                            className="canvas-control-button"
                            onClick={() =>
                                toast.info("Preview feature coming soon")
                            }
                        >
                            <Play size={16} />
                            Preview Flow
                        </button>
                        <button
                            className="canvas-control-button primary"
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            <Save size={16} />
                            {isSaving ? "Saving..." : "Save Mission"}
                        </button>
                    </Panel>
                </ReactFlow>
            </div>

            {/* 右侧 Inspector Drawer */}
            {isInspectorOpen && selectedNode && (
                <div className="inspector-drawer inspector-drawer-open">
                    <div className="inspector-header-with-close">
                        <h3>Inspector</h3>
                        <button
                            className="inspector-close-button"
                            onClick={() => {
                                setSelectedNodeId(null);
                                setIsInspectorOpen(false);
                            }}
                            aria-label="Close Inspector"
                        >
                            <X size={18} />
                        </button>
                    </div>
                    <NodePropertyPanel
                        node={selectedNode}
                        onUpdate={updateNodeData}
                        onClose={() => {
                            setSelectedNodeId(null);
                            setIsInspectorOpen(false);
                        }}
                    />
                </div>
            )}
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
