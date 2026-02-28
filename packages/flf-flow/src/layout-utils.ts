/**
 * RFC 0018: 流程画布布局算法工具函数
 * 实现垂直流布局、拓扑排序、分支识别、重叠检测等
 */

import { Position } from "@xyflow/react";

// 布局配置常量 (RFC 0018 Section 8.3.2)
export const LAYOUT_CONFIG = {
    CENTER_X: 400,              // 主轴 X 坐标
    START_Y: 50,                // 起始 Y 坐标
    VERTICAL_SPACING: 200,      // 垂直间距
    HORIZONTAL_SPACING: 350,    // 分支水平间距
    BRANCH_OFFSET: 175,         // 分支偏移量 (HORIZONTAL_SPACING / 2)
};

// 节点尺寸常量 (RFC 0018 Section 8.3.10)
export const NODE_DIMENSIONS = {
    startNode: { width: 200, height: 120 },
    learnNode: { width: 320, height: 180 },
    testNode: { width: 320, height: 220 },
    endNode: { width: 200, height: 120 },
};

// const MIN_GAP = 50;  // 节点之间的最小间隙（预留用于重叠检测）

/**
 * 节点类型权重（用于排序）
 */
function getTypeWeight(type?: string): number {
    switch (type) {
        case "learnNode": return 0;
        case "testNode": return 1;
        case "endNode": return 2;
        default: return 9;
    }
}

/**
 * 拓扑排序算法 (RFC 0018 Section 8.2)
 * 确保节点按流程顺序排列，Start 在最前，End 在最后
 */
export function topologicalSort(
    nodes: any[],
    edges: any[]
): any[] {
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));
    const sorted: any[] = [];
    const visited = new Set<string>();

    // 找到 Start 节点
    const startNode = nodes.find((n) => n.type === "startNode");

    // 深度优先遍历 (DFS)
    function visit(nodeId: string) {
        if (visited.has(nodeId)) return;
        visited.add(nodeId);

        const node = nodeMap.get(nodeId);
        if (node) {
            sorted.push(node);

            // 获取所有出边的目标节点
            const outgoing = edges
                .filter((e) => e.source === nodeId)
                .map((e) => nodeMap.get(e.target))
                .filter(Boolean)
                .sort((a, b) => getTypeWeight(a?.type) - getTypeWeight(b?.type));

            outgoing.forEach((child) => {
                if (child) visit(child.id);
            });
        }
    }

    // 从 Start 开始遍历
    if (startNode) {
        visit(startNode.id);
    }

    // 处理未连接的节点（End 节点除外）
    nodes.forEach((n) => {
        if (!visited.has(n.id) && n.type !== "endNode") {
            sorted.push(n);
        }
    });

    // End 节点放最后
    const endNode = nodes.find((n) => n.type === "endNode");
    if (endNode && !visited.has(endNode.id)) {
        sorted.push(endNode);
    }

    return sorted;
}

/**
 * 分支信息接口 (RFC 0018 Section 8.3.4)
 */
interface BranchInfo {
    testNodeId: string;      // 触发分支的 Test 节点
    successPath: string[];   // Success 路径上的节点 ID
    failPath: string[];      // Fail 路径上的节点 ID
    mergeNodeId?: string;    // 分支合并点的节点 ID
}

/**
 * 识别分支结构 (RFC 0018 Section 8.3.5)
 */
export function identifyBranches(
    nodes: any[],
    edges: any[]
): BranchInfo[] {
    const branches: BranchInfo[] = [];

    // 找到所有 Test 节点
    const testNodes = nodes.filter((n) => n.type === "testNode");

    for (const testNode of testNodes) {
        // 获取 Success 和 Fail 出边
        const successEdge = edges.find(
            (e) => e.source === testNode.id && e.data?.condition === "success"
        );
        const failEdge = edges.find(
            (e) => e.source === testNode.id && e.data?.condition === "fail"
        );

        if (successEdge && failEdge) {
            // 追踪两条路径直到合并或结束
            const successPath = tracePath(successEdge.target, edges, nodes);
            const failPath = tracePath(failEdge.target, edges, nodes);

            // 找到合并点（两条路径的第一个共同节点）
            const mergeNodeId = findMergePoint(successPath, failPath);

            branches.push({
                testNodeId: testNode.id,
                successPath: mergeNodeId
                    ? successPath.slice(0, successPath.indexOf(mergeNodeId) + 1)
                    : successPath,
                failPath: mergeNodeId
                    ? failPath.slice(0, failPath.indexOf(mergeNodeId) + 1)
                    : failPath,
                mergeNodeId,
            });
        }
    }

    return branches;
}

/**
 * 追踪从某节点开始的路径 (RFC 0018 Section 8.3.5)
 */
function tracePath(
    startId: string,
    edges: any[],
    nodes: any[]
): string[] {
    const path: string[] = [startId];
    let current = startId;

    while (true) {
        const outEdges = edges.filter((e) => e.source === current);
        if (outEdges.length === 0) break;

        // 优先走 default 边，避免进入嵌套分支
        const nextEdge =
            outEdges.find((e) => !e.data?.condition || e.data?.condition === "default") ||
            outEdges[0];
        current = nextEdge.target;
        path.push(current);

        // 如果到达 End 节点，停止
        const node = nodes.find((n) => n.id === current);
        if (node?.type === "endNode") break;
    }

    return path;
}

/**
 * 找到两条路径的第一个共同节点 (RFC 0018 Section 8.3.5)
 */
function findMergePoint(
    path1: string[],
    path2: string[]
): string | undefined {
    const set2 = new Set(path2);
    return path1.find((id) => set2.has(id));
}

/**
 * 计算节点深度 (BFS) (RFC 0018 Section 8.3.6)
 */
export function computeDepths(
    nodes: any[],
    edges: any[],
    _branches: BranchInfo[]  // 预留用于嵌套分支处理
): Map<string, number> {
    const depths = new Map<string, number>();
    const startNode = nodes.find((n) => n.type === "startNode");

    if (!startNode) return depths;

    // BFS 遍历
    const queue: Array<{ id: string; depth: number }> = [
        { id: startNode.id, depth: 0 },
    ];

    while (queue.length > 0) {
        const { id, depth } = queue.shift()!;

        // 如果已访问且深度更小，跳过
        if (depths.has(id) && depths.get(id)! <= depth) continue;
        depths.set(id, depth);

        // 获取所有出边
        const outEdges = edges.filter((e) => e.source === id);

        for (const edge of outEdges) {
            queue.push({
                id: edge.target,
                depth: depth + 1,
            });
        }
    }

    return depths;
}

/**
 * 计算分支归属 (RFC 0018 Section 8.3.7)
 */
export function computeBranchAssignment(
    nodes: any[],
    branches: BranchInfo[]
): Map<string, "main" | "left" | "right"> {
    const assignments = new Map<string, "main" | "left" | "right">();

    // 默认所有节点在主干
    nodes.forEach((n) => assignments.set(n.id, "main"));

    // 标记分支节点
    for (const branch of branches) {
        // Success 路径 -> 左分支
        branch.successPath.forEach((id) => assignments.set(id, "left"));

        // Fail 路径 -> 右分支
        branch.failPath.forEach((id) => assignments.set(id, "right"));
    }

    return assignments;
}

/**
 * 线性布局算法 (RFC 0018 Section 8.3.3)
 */
export function applyLinearLayout(sortedNodes: any[]): any[] {
    const { CENTER_X, START_Y, VERTICAL_SPACING } = LAYOUT_CONFIG;

    return sortedNodes.map((node, index) => ({
        ...node,
        position: {
            x: CENTER_X,
            y: START_Y + index * VERTICAL_SPACING,
        },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
    }));
}

/**
 * 树形布局算法 (RFC 0018 Section 8.3.4)
 */
export function applyTreeLayout(
    nodes: any[],
    _edges: any[],  // 预留用于边交叉最小化
    depths: Map<string, number>,
    branchAssignments: Map<string, "main" | "left" | "right">
): any[] {
    const { CENTER_X, START_Y, VERTICAL_SPACING, BRANCH_OFFSET } = LAYOUT_CONFIG;

    return nodes.map((node) => {
        const depth = depths.get(node.id) || 0;
        const branch = branchAssignments.get(node.id) || "main";

        let x = CENTER_X;
        if (branch === "left") {
            x = CENTER_X - BRANCH_OFFSET;
        } else if (branch === "right") {
            x = CENTER_X + BRANCH_OFFSET;
        }

        return {
            ...node,
            position: {
                x,
                y: START_Y + depth * VERTICAL_SPACING,
            },
            sourcePosition: Position.Bottom,
            targetPosition: Position.Top,
        };
    });
}

/**
 * 完整的垂直布局算法 (RFC 0018 Section 8.3.9)
 */
export function applyVerticalLayout(
    nodes: any[],
    edges: any[]
): any[] {
    // 1. 拓扑排序
    const sortedNodes = topologicalSort(nodes, edges);

    // 2. 检测是否需要树形布局
    const branches = identifyBranches(sortedNodes, edges);
    const needsTreeLayout = branches.length > 0;

    if (!needsTreeLayout) {
        // 简单线性布局
        return applyLinearLayout(sortedNodes);
    }

    // 3. 计算深度
    const depths = computeDepths(sortedNodes, edges, branches);

    // 4. 计算分支归属
    const branchAssignments = computeBranchAssignment(sortedNodes, branches);

    // 5. 应用树形布局
    return applyTreeLayout(sortedNodes, edges, depths, branchAssignments);
}

/**
 * 确保 Start/End 唯一性 (RFC 0018 Section 8.5)
 */
export function enforceUniqueStartEnd(
    nodes: any[],
    defaultStart: any,
    defaultEnd: any
): any[] {
    let hasStart = false;
    let hasEnd = false;

    // 过滤：只保留第一个 Start 和 End
    const filtered = nodes.filter((n) => {
        if (n.type === "startNode") {
            if (hasStart) return false;
            hasStart = true;
        }
        if (n.type === "endNode") {
            if (hasEnd) return false;
            hasEnd = true;
        }
        return true;
    });

    // 补充缺失的 Start/End
    if (!hasStart) filtered.unshift(defaultStart);
    if (!hasEnd) filtered.push(defaultEnd);

    return filtered;
}
