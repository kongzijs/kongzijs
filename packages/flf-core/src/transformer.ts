import { FLFManifest, FlowNodeType } from "./types";

/**
 * FLF Transformer (RFC 0020)
 * 负责在 FLF JSON 格式与数据库关系模型之间进行双向转换
 */

export const FLFTransformer = {
    /**
     * 将 FLF 清单转换为适合 React Flow 渲染的节点和连线结构
     */
    toReactFlow(manifest: FLFManifest) {
        const nodes = manifest.flow_nodes.map((node) => {
            // 映射 FLF 节点类型到 React Flow 节点类型
            let reactFlowType: string;
            if (node.type === "learn") {
                reactFlowType = "learnNode";
            } else if (node.type === "test") {
                reactFlowType = "testNode";
            } else if (node.type === "start") {
                reactFlowType = "startNode";
            } else if (node.type === "end") {
                reactFlowType = "endNode";
            } else {
                reactFlowType = "learnNode"; // 默认
            }

            return {
                id: node.id,
                type: reactFlowType,
                position: node.position || { x: 0, y: 0 },
                data: {
                    ...node.data,
                    asset_id: node.asset_id,
                    rules: node.rules,
                    is_milestone: node.is_milestone,
                },
            };
        });

        const edges = manifest.flow_edges.map((edge) => {
            // 根据 condition 设置 sourceHandle（RFC 0018: Success/Fail 分支）
            let sourceHandle: string | undefined = undefined;
            if (edge.condition === "success") {
                sourceHandle = "success";
            } else if (edge.condition === "fail") {
                sourceHandle = "fail";
            }
            
            // 水平 flow 的路径分离
            // pathOptions.offset 是垂直方向的偏移（对于水平 flow）
            let pathOffset = 0;
            if (edge.condition === "success") {
                pathOffset = -100; // Success 向上偏移 100px
            } else if (edge.condition === "fail") {
                pathOffset = 100; // Fail 向下偏移 100px
            }

            return {
                id: edge.id,
                source: edge.source,
                target: edge.target,
                sourceHandle,
                type: "smoothstep",
                label: edge.label,
                animated: true,
                data: { condition: edge.condition },
                style: {
                    strokeWidth: 3,
                    stroke: edge.condition === "success" ? "#10b981" 
                        : edge.condition === "fail" ? "#ef4444" 
                        : "#94a3b8",
                },
                pathOptions: {
                    offset: pathOffset, // 垂直方向的偏移（对于水平 flow）
                    borderRadius: 20, // 更大的圆角，使路径更平滑地绕过节点
                },
                markerEnd: {
                    type: "arrowclosed",
                    color: edge.condition === "success" ? "#10b981" 
                        : edge.condition === "fail" ? "#ef4444" 
                        : "#94a3b8",
                },
            };
        });

        return { nodes, edges };
    },

    /**
     * 将 React Flow 的状态转换回 FLF 清单格式
     */
    fromReactFlow(
        lessonId: string,
        settings: any,
        nodes: any[],
        edges: any[],
        assets: any[],
    ): FLFManifest {
        return {
            flf_version: "1.0",
            lesson_id: lessonId,
            settings: settings,
            assets_manifest: assets,
            flow_nodes: nodes.map((n) => {
                // 映射 React Flow 节点类型到 FLF 节点类型
                let flfType: FlowNodeType;
                if (n.type === "learnNode") {
                    flfType = "learn";
                } else if (n.type === "testNode") {
                    flfType = "test";
                } else if (n.type === "startNode") {
                    flfType = "start";
                } else if (n.type === "endNode") {
                    flfType = "end";
                } else {
                    flfType = "learn"; // 默认
                }

                return {
                    id: n.id,
                    type: flfType,
                    asset_id: n.data?.asset_id,
                    data: {
                        markdown: n.data?.markdown,
                        title: n.data?.title,
                        media_ids: n.data?.media_ids,
                    },
                    rules: n.data?.rules,
                    position: n.position,
                    is_milestone: n.data?.is_milestone,
                };
            }),
            flow_edges: edges.map((e) => ({
                id: e.id,
                source: e.source,
                target: e.target,
                label: e.label,
                // 从 sourceHandle 或 data.condition 获取 condition（RFC 0018）
                condition: e.sourceHandle === "success" ? "success" 
                    : e.sourceHandle === "fail" ? "fail"
                    : e.data?.condition || "default",
            })),
        };
    },
};
