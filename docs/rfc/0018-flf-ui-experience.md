# RFC 0018: Lesson Builder - 流程画布 (Flow Canvas) 规范

**状态**: ✅ 已实施
**作者**: AI Assistant
**创建日期**: 2026-01-25
**最后更新**: 2026-01-25

## 1. 摘要

本 RFC 专属于 **Lesson Builder 的流程画布 (Flow Canvas)** 部分。其核心任务是定义基于 **React Flow** 的可视化图编排环境。

## 2. 整体 UI 布局 (Overall Layout)

Lesson Builder 采用**全屏两栏式布局**，占据整个视口：

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Lesson Builder (Full Screen)                       │
│                              height: 100vh                                  │
├──────────────────────┬──────────────────────────────────────────────────────┤
│                      │                                                      │
│   Asset Library      │              React Flow Canvas                       │
│   width: 280px       │              flex: 1 (剩余空间)                       │
│   fixed              │                                                      │
│                      │         ┌─────────┐                                  │
│  ┌────────────────┐  │         │  Start  │                                  │
│  │ Creation Nodes │  │         └────┬────┘                                  │
│  ├────────────────┤  │              │                                       │
│  │ ▶ Start Node   │  │              ▼          ┌────────────────────────┐   │
│  │   (disabled    │  │         ┌─────────┐     │  Node Property Panel   │   │
│  │    if exists)  │  │         │  Learn  │◄────┤  (Floating Drawer)     │   │
│  ├────────────────┤  │         └────┬────┘     │                        │   │
│  │ 📖 Learn Node  │  │              │          │  width: 320px          │   │
│  ├────────────────┤  │              ▼          │  position: absolute    │   │
│  │ ⚡ Test Node   │  │         ┌─────────┐     │  right: 0              │   │
│  ├────────────────┤  │         │  Test   │     │                        │   │
│  │ 🏁 End Node    │  │         └──┬───┬──┘     │  - Title Input         │   │
│  │   (disabled    │  │            │   │        │  - Markdown Editor     │   │
│  │    if exists)  │  │       Success  Fail     │  - Asset Selector      │   │
│  └────────────────┘  │            │   │        │  - Rules Config        │   │
│                      │            ▼   ▼        │                        │   │
│  ┌────────────────┐  │         ┌─────────┐     └────────────────────────┘   │
│  │                │  │         │   End   │                                  │
│  │ Asset Drop     │  │         └─────────┘                                  │
│  │ Zone           │  │                                                      │
│  │                │  │    ┌──────────┐                    ┌──────────┐      │
│  │ ☁️ Drop assets │  │    │ Controls │                    │ MiniMap  │      │
│  │ from cloud     │  │    └──────────┘                    └──────────┘      │
│  │ (Coming Soon)  │  │                                                      │
│  │                │  │   ┌─────────────────────────────────────────────┐    │
│  └────────────────┘  │   │ Panel: [Preview Flow] [Save Mission]       │    │
│                      │   └─────────────────────────────────────────────┘    │
│                      │                                                      │
└──────────────────────┴──────────────────────────────────────────────────────┘
```

### 2.1 全屏容器规范

```css
.lesson-builder-container {
  display: flex;
  height: 100vh;           /* 全屏高度 */
  width: 100vw;            /* 全屏宽度 */
  overflow: hidden;        /* 防止滚动 */
}
```

### 2.2 左侧：Asset Library (固定宽度)

```css
.asset-library {
  width: 280px;
  flex-shrink: 0;          /* 不收缩 */
  border-right: 1px solid #e2e8f0;
  overflow-y: auto;
}
```

- **Creation Nodes**: 节点创建按钮（Start, Learn, Test, End）
- **Asset Drop Zone**: 云端资产拖放区域（规划中）
- 详见 [RFC 0022: Asset Library]

### 2.3 右侧：React Flow Canvas (弹性宽度)

```css
.canvas-container {
  flex: 1;                 /* 占据剩余空间 */
  position: relative;      /* 为浮动面板提供定位上下文 */
  overflow: hidden;
}
```

- **主画布**: 节点拖拽、缩放、连线操作
- **Controls**: 缩放控制（左下角）
- **MiniMap**: 全局预览导航（右下角）
- **Top Panel**: 操作按钮（Preview Flow, Save Mission）

### 2.4 浮动面板：Node Property Panel (Drawer)

```css
.inspector-drawer {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 320px;
  background: white;
  box-shadow: -4px 0 20px rgba(0,0,0,0.1);
  z-index: 10;
  transform: translateX(100%);  /* 初始隐藏 */
  transition: transform 0.3s ease;
}

.inspector-drawer-open {
  transform: translateX(0);     /* 滑入显示 */
}
```

- **触发方式**: 点击画布上的节点
- **位置**: 画布右侧抽屉式滑出
- **关闭方式**: 点击画布空白区域或关闭按钮 (X)
- 详见 [RFC 0023: Node Property Editors]

## 3. 画布核心职责 (Canvas Responsibilities)

- **图构建 (Graph Construction)**：提供拖拽、缩放的主画布，支持节点（Nodes）的添加和定位。
- **逻辑连线 (Edges)**：定义学习流的先后顺序。
- **序列化 (Serialization)**：将画布上的节点空间关系与连线逻辑映射为 RFC 0017 定义的 FLF 数组结构。

## 4. 节点布局规范 (Node Layout Specification)

### 4.1 垂直流布局 (Vertical Flow)

画布采用**垂直流布局**，节点从上到下排列：

```
     ┌─────────┐
     │  Start  │  ← 顶部（唯一入口）
     └────┬────┘
          │
          ▼
     ┌─────────┐
     │  Learn  │
     └────┬────┘
          │
          ▼
     ┌─────────┐
     │  Test   │
     └──┬───┬──┘
        │   │
   Success  Fail
        │   │
        ▼   ▼
     ┌─────────┐
     │   End   │  ← 底部（唯一出口）
     └─────────┘
```

### 4.2 Handle 位置

| 节点类型 | Target Handle | Source Handle |
|----------|---------------|---------------|
| StartNode | 无 | Bottom（底部） |
| LearnNode | Top（顶部） | Bottom（底部） |
| TestNode | Top（顶部） | Bottom-Left (Success), Bottom-Right (Fail) |
| EndNode | Top（顶部） | 无 |

### 4.3 节点位置计算

- **水平居中**: `x = 400`（固定中心线）
- **垂直间距**: `verticalSpacing = 200px`
- **起始位置**: `y = 50`（Start 节点）

## 5. Start/End 节点规范

### 5.1 唯一性约束

- 画布上**始终只有 1 个 Start 节点**和 **1 个 End 节点**
- Start 节点始终位于流程顶部（第一个）
- End 节点始终位于流程底部（最后一个）

### 5.2 自动创建

| 场景 | 行为 |
|------|------|
| 新建空画布 | 自动创建默认的 Start 和 End 节点 |
| 加载 manifest 缺少 Start | 自动补充 Start 节点 |
| 加载 manifest 缺少 End | 自动补充 End 节点 |
| 加载 manifest 有多个 Start/End | 只保留第一个，过滤多余的 |

### 5.3 添加节点行为

- 用户添加 Learn/Test 节点时，新节点插入到 End 节点之前
- End 节点自动下移以保持在最底部
- Start/End 按钮在已存在对应节点时禁用

## 6. 连线逻辑 (Engagement Logic)

- **单向串联 (Sequential)**：默认的 A → B 关系，表示完成 A 后解锁 B。
- **逻辑分支 (Branching)**：
  - 成功路径 (Success Edge)：Test 成功后的去向，绿色连线，向左偏移。
  - 失败路径 (Fail Edge)：Test 失败后的回退或补偿路径，红色连线，向右偏移。

### 6.1 连线样式

| 类型 | 颜色 | 偏移 |
|------|------|------|
| Default | `#94a3b8` | 0 |
| Success | `#10b981` | -80px（左偏移） |
| Fail | `#ef4444` | +80px（右偏移） |

## 7. 状态同步

- 画布不存储资产内容，仅存储 Node 的 ID、Position 和指向的资产引用标识。
- 所有的细节编辑由 [RFC 0023] 定义的属性面板处理。

## 8. 流程生成算法 (Flow Generation Algorithm)

### 8.1 初始化流程 (Initialization)

当 Lesson Builder 加载时，执行以下算法生成初始节点布局：

```typescript
function initializeFlow(manifest?: FLFManifest): { nodes, edges } {
  // 1. 定义默认节点
  const defaultStart = createStartNode({ x: 400, y: 50 });
  const defaultEnd = createEndNode({ x: 400, y: 350 });

  // 2. 如果没有 manifest，返回默认布局
  if (!manifest) {
    return { nodes: [defaultStart, defaultEnd], edges: [] };
  }

  // 3. 从 manifest 转换节点
  let nodes = FLFTransformer.toReactFlow(manifest).nodes;
  let edges = manifest.flow_edges;

  // 4. 确保 Start/End 唯一性
  nodes = enforceUniqueStartEnd(nodes, defaultStart, defaultEnd);

  // 5. 拓扑排序
  nodes = topologicalSort(nodes, edges);

  // 6. 应用垂直布局
  nodes = applyVerticalLayout(nodes);

  return { nodes, edges };
}
```

### 8.2 拓扑排序算法 (Topological Sort)

确保节点按流程顺序排列，Start 在最前，End 在最后：

```typescript
function topologicalSort(nodes: Node[], edges: Edge[]): Node[] {
  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  const visited = new Set<string>();
  const sorted: Node[] = [];

  // 1. 找到 Start 节点
  const startNode = nodes.find(n => n.type === 'startNode');

  // 2. DFS 遍历
  function visit(nodeId: string) {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);

    const node = nodeMap.get(nodeId);
    if (node) {
      sorted.push(node);

      // 获取所有出边的目标节点
      const outgoing = edges
        .filter(e => e.source === nodeId)
        .map(e => nodeMap.get(e.target))
        .filter(Boolean)
        .sort((a, b) => getTypeWeight(a.type) - getTypeWeight(b.type));

      outgoing.forEach(child => visit(child.id));
    }
  }

  // 3. 从 Start 开始遍历
  if (startNode) visit(startNode.id);

  // 4. 处理未连接的节点（End 节点除外）
  nodes.forEach(n => {
    if (!visited.has(n.id) && n.type !== 'endNode') {
      sorted.push(n);
    }
  });

  // 5. End 节点放最后
  const endNode = nodes.find(n => n.type === 'endNode');
  if (endNode && !visited.has(endNode.id)) {
    sorted.push(endNode);
  }

  return sorted;
}

// 节点类型权重（决定同级节点的排序）
function getTypeWeight(type: string): number {
  switch (type) {
    case 'learnNode': return 0;
    case 'testNode': return 1;
    case 'endNode': return 2;
    default: return 9;
  }
}
```

### 8.3 垂直布局算法 (Vertical Layout)

#### 8.3.1 布局类型

根据流程复杂度，支持两种布局模式：

| 模式 | 触发条件 | 描述 |
|------|----------|------|
| **线性布局** | 无分支或所有分支最终合并 | 所有节点在同一垂直线上 |
| **树形布局** | 存在 Test 节点的 Success/Fail 分支 | 分支节点水平展开 |

#### 8.3.2 布局常量

```typescript
const LAYOUT_CONFIG = {
  CENTER_X: 400,              // 主轴 X 坐标
  START_Y: 50,                // 起始 Y 坐标
  VERTICAL_SPACING: 200,      // 垂直间距
  HORIZONTAL_SPACING: 350,    // 分支水平间距
  BRANCH_OFFSET: 175,         // 分支偏移量 (HORIZONTAL_SPACING / 2)
};
```

#### 8.3.3 线性布局算法

适用于无分支的简单流程：

```
     ┌─────────┐
     │  Start  │  y = 50
     └────┬────┘
          │
          ▼
     ┌─────────┐
     │  Learn  │  y = 250
     └────┬────┘
          │
          ▼
     ┌─────────┐
     │  Test   │  y = 450
     └────┬────┘
          │
          ▼
     ┌─────────┐
     │   End   │  y = 650
     └─────────┘

     x = 400 (所有节点)
```

```typescript
function applyLinearLayout(sortedNodes: Node[]): Node[] {
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
```

#### 8.3.4 树形分支布局算法

当存在 Test 节点的 Success/Fail 分支时，使用树形布局：

```
                    ┌─────────┐
                    │  Start  │  depth=0, x=400
                    └────┬────┘
                         │
                         ▼
                    ┌─────────┐
                    │  Learn  │  depth=1, x=400
                    └────┬────┘
                         │
                         ▼
                    ┌─────────┐
                    │  Test   │  depth=2, x=400
                    └──┬───┬──┘
                       │   │
                  Success  Fail
                       │   │
          ┌────────────┘   └────────────┐
          ▼                             ▼
     ┌─────────┐                   ┌─────────┐
     │ Learn A │ depth=3           │ Learn B │  depth=3
     │ x=225   │                   │ x=575   │
     └────┬────┘                   └────┬────┘
          │                             │
          └──────────┬──────────────────┘
                     │
                     ▼
                ┌─────────┐
                │   End   │  depth=4, x=400
                └─────────┘
```

**核心数据结构：**

```typescript
interface LayoutNode {
  id: string;
  type: string;
  depth: number;           // 垂直层级（从 0 开始）
  branch: 'main' | 'left' | 'right';  // 所属分支
  branchParent?: string;   // 分支的父节点 ID（Test 节点）
  children: string[];      // 子节点 ID 列表
}

interface BranchInfo {
  testNodeId: string;      // 触发分支的 Test 节点
  successPath: string[];   // Success 路径上的节点 ID
  failPath: string[];      // Fail 路径上的节点 ID
  mergeNodeId?: string;    // 分支合并点的节点 ID
}
```

**算法步骤：**

```typescript
function applyTreeLayout(nodes: Node[], edges: Edge[]): Node[] {
  const { CENTER_X, START_Y, VERTICAL_SPACING, BRANCH_OFFSET } = LAYOUT_CONFIG;

  // Step 1: 构建邻接表
  const adjacency = buildAdjacencyList(nodes, edges);

  // Step 2: 识别分支结构
  const branches = identifyBranches(nodes, edges);

  // Step 3: 计算每个节点的深度和分支归属
  const layoutInfo = computeLayoutInfo(nodes, edges, branches);

  // Step 4: 应用位置
  return nodes.map(node => {
    const info = layoutInfo.get(node.id);
    let x = CENTER_X;

    // 根据分支调整 X 坐标
    if (info.branch === 'left') {
      x = CENTER_X - BRANCH_OFFSET;
    } else if (info.branch === 'right') {
      x = CENTER_X + BRANCH_OFFSET;
    }

    return {
      ...node,
      position: {
        x,
        y: START_Y + info.depth * VERTICAL_SPACING,
      },
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    };
  });
}
```

#### 8.3.5 分支识别算法

识别 Test 节点产生的 Success/Fail 分支：

```typescript
function identifyBranches(nodes: Node[], edges: Edge[]): BranchInfo[] {
  const branches: BranchInfo[] = [];

  // 找到所有 Test 节点
  const testNodes = nodes.filter(n => n.type === 'testNode');

  for (const testNode of testNodes) {
    // 获取 Success 和 Fail 出边
    const successEdge = edges.find(
      e => e.source === testNode.id && e.data?.condition === 'success'
    );
    const failEdge = edges.find(
      e => e.source === testNode.id && e.data?.condition === 'fail'
    );

    if (successEdge && failEdge) {
      // 追踪两条路径直到合并或结束
      const successPath = tracePath(successEdge.target, edges, nodes);
      const failPath = tracePath(failEdge.target, edges, nodes);

      // 找到合并点（两条路径的第一个共同节点）
      const mergeNodeId = findMergePoint(successPath, failPath);

      branches.push({
        testNodeId: testNode.id,
        successPath: successPath.slice(0, successPath.indexOf(mergeNodeId)),
        failPath: failPath.slice(0, failPath.indexOf(mergeNodeId)),
        mergeNodeId,
      });
    }
  }

  return branches;
}

// 追踪从某节点开始的路径
function tracePath(startId: string, edges: Edge[], nodes: Node[]): string[] {
  const path: string[] = [startId];
  let current = startId;

  while (true) {
    const outEdges = edges.filter(e => e.source === current);
    if (outEdges.length === 0) break;

    // 优先走 default 边，避免进入嵌套分支
    const nextEdge = outEdges.find(e => !e.data?.condition) || outEdges[0];
    current = nextEdge.target;
    path.push(current);

    // 如果到达 End 节点，停止
    const node = nodes.find(n => n.id === current);
    if (node?.type === 'endNode') break;
  }

  return path;
}

// 找到两条路径的第一个共同节点
function findMergePoint(path1: string[], path2: string[]): string | undefined {
  const set2 = new Set(path2);
  return path1.find(id => set2.has(id));
}
```

#### 8.3.6 深度计算算法 (BFS)

使用 BFS 计算每个节点的深度：

```typescript
function computeDepths(
  nodes: Node[],
  edges: Edge[],
  branches: BranchInfo[]
): Map<string, number> {
  const depths = new Map<string, number>();
  const startNode = nodes.find(n => n.type === 'startNode');

  if (!startNode) return depths;

  // BFS 遍历
  const queue: Array<{ id: string; depth: number }> = [
    { id: startNode.id, depth: 0 }
  ];

  while (queue.length > 0) {
    const { id, depth } = queue.shift()!;

    // 如果已访问且深度更小，跳过
    if (depths.has(id) && depths.get(id)! <= depth) continue;
    depths.set(id, depth);

    // 获取所有出边
    const outEdges = edges.filter(e => e.source === id);

    for (const edge of outEdges) {
      // 分支节点需要在同一深度
      const isBranchStart = branches.some(
        b => b.testNodeId === id &&
             (edge.target === b.successPath[0] || edge.target === b.failPath[0])
      );

      queue.push({
        id: edge.target,
        depth: depth + 1,
      });
    }
  }

  return depths;
}
```

#### 8.3.7 分支归属计算

确定每个节点属于主干还是左/右分支：

```typescript
function computeBranchAssignment(
  nodes: Node[],
  branches: BranchInfo[]
): Map<string, 'main' | 'left' | 'right'> {
  const assignments = new Map<string, 'main' | 'left' | 'right'>();

  // 默认所有节点在主干
  nodes.forEach(n => assignments.set(n.id, 'main'));

  // 标记分支节点
  for (const branch of branches) {
    // Success 路径 -> 左分支
    branch.successPath.forEach(id => assignments.set(id, 'left'));

    // Fail 路径 -> 右分支
    branch.failPath.forEach(id => assignments.set(id, 'right'));
  }

  return assignments;
}
```

#### 8.3.8 嵌套分支处理

当分支内部还有 Test 节点时，需要递归处理：

```
                    ┌─────────┐
                    │  Test A │
                    └──┬───┬──┘
                       │   │
          ┌────────────┘   └────────────┐
          ▼                             ▼
     ┌─────────┐                   ┌─────────┐
     │ Test B  │                   │ Learn   │
     └──┬───┬──┘                   └────┬────┘
        │   │                           │
   ┌────┘   └────┐                      │
   ▼             ▼                      │
┌──────┐    ┌──────┐                    │
│Learn │    │Learn │                    │
│x=137 │    │x=312 │                    │
└──┬───┘    └──┬───┘                    │
   │           │                        │
   └─────┬─────┘                        │
         │                              │
         └──────────┬───────────────────┘
                    ▼
               ┌─────────┐
               │   End   │
               └─────────┘
```

```typescript
function computeNestedBranchOffset(
  nodeId: string,
  branches: BranchInfo[],
  nestingLevel: number
): number {
  const { BRANCH_OFFSET } = LAYOUT_CONFIG;

  // 每层嵌套，偏移量减半
  const offset = BRANCH_OFFSET / Math.pow(2, nestingLevel);

  return offset;
}
```

#### 8.3.9 完整布局算法

```typescript
function applyVerticalLayout(nodes: Node[], edges: Edge[]): Node[] {
  // 1. 检测是否需要树形布局
  const branches = identifyBranches(nodes, edges);
  const needsTreeLayout = branches.length > 0;

  if (!needsTreeLayout) {
    // 简单线性布局
    return applyLinearLayout(topologicalSort(nodes, edges));
  }

  // 2. 计算深度
  const depths = computeDepths(nodes, edges, branches);

  // 3. 计算分支归属
  const branchAssignments = computeBranchAssignment(nodes, branches);

  // 4. 应用位置
  const { CENTER_X, START_Y, VERTICAL_SPACING, BRANCH_OFFSET } = LAYOUT_CONFIG;

  return nodes.map(node => {
    const depth = depths.get(node.id) || 0;
    const branch = branchAssignments.get(node.id) || 'main';

    let x = CENTER_X;
    if (branch === 'left') x = CENTER_X - BRANCH_OFFSET;
    if (branch === 'right') x = CENTER_X + BRANCH_OFFSET;

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
```

#### 8.3.10 节点重叠检测与避免

**关键约束：同一深度的节点不能重叠**

```typescript
interface NodeBounds {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

const NODE_DIMENSIONS = {
  startNode: { width: 200, height: 120 },
  learnNode: { width: 320, height: 180 },
  testNode: { width: 320, height: 220 },
  endNode: { width: 200, height: 120 },
};

const MIN_GAP = 50;  // 节点之间的最小间隙
```

**重叠检测算法：**

```typescript
function detectOverlap(node1: NodeBounds, node2: NodeBounds): boolean {
  // 只检查同一深度（相近 Y 坐标）的节点
  const sameDepth = Math.abs(node1.y - node2.y) < 50;
  if (!sameDepth) return false;

  // 计算水平方向是否重叠
  const left1 = node1.x - node1.width / 2;
  const right1 = node1.x + node1.width / 2;
  const left2 = node2.x - node2.width / 2;
  const right2 = node2.x + node2.width / 2;

  // 考虑最小间隙
  return !(right1 + MIN_GAP < left2 || right2 + MIN_GAP < left1);
}
```

**重叠解决算法：**

```typescript
function resolveOverlaps(
  nodes: Node[],
  depths: Map<string, number>
): Node[] {
  // 按深度分组
  const nodesByDepth = new Map<number, Node[]>();
  nodes.forEach(node => {
    const depth = depths.get(node.id) || 0;
    if (!nodesByDepth.has(depth)) {
      nodesByDepth.set(depth, []);
    }
    nodesByDepth.get(depth)!.push(node);
  });

  const result: Node[] = [];

  // 逐层处理
  for (const [depth, depthNodes] of nodesByDepth) {
    if (depthNodes.length === 1) {
      // 单节点，居中
      result.push({
        ...depthNodes[0],
        position: { x: CENTER_X, y: START_Y + depth * VERTICAL_SPACING },
      });
      continue;
    }

    // 多节点，计算不重叠的位置
    const positions = distributeNodesHorizontally(depthNodes);
    depthNodes.forEach((node, i) => {
      result.push({
        ...node,
        position: {
          x: positions[i],
          y: START_Y + depth * VERTICAL_SPACING,
        },
      });
    });
  }

  return result;
}
```

**水平分布算法：**

```typescript
function distributeNodesHorizontally(nodes: Node[]): number[] {
  const n = nodes.length;
  if (n === 0) return [];
  if (n === 1) return [CENTER_X];

  // 计算总宽度需求
  const totalWidth = nodes.reduce((sum, node) => {
    const dim = NODE_DIMENSIONS[node.type as keyof typeof NODE_DIMENSIONS];
    return sum + (dim?.width || 320);
  }, 0);

  const totalGaps = (n - 1) * MIN_GAP;
  const totalSpan = totalWidth + totalGaps;

  // 计算起始位置（居中分布）
  let currentX = CENTER_X - totalSpan / 2;
  const positions: number[] = [];

  for (const node of nodes) {
    const dim = NODE_DIMENSIONS[node.type as keyof typeof NODE_DIMENSIONS];
    const width = dim?.width || 320;

    // 节点中心位置
    positions.push(currentX + width / 2);
    currentX += width + MIN_GAP;
  }

  return positions;
}
```

**示例：3个节点在同一深度**

```
                         CENTER_X = 400
                              │
    ┌─────────────────────────┼─────────────────────────┐
    │                         │                         │
    │    ┌─────────┐    ┌─────────┐    ┌─────────┐     │
    │    │ Learn A │    │ Learn B │    │ Learn C │     │
    │    │ x=175   │    │ x=400   │    │ x=625   │     │
    │    └─────────┘    └─────────┘    └─────────┘     │
    │         │              │              │          │
    │         └──────────────┼──────────────┘          │
    │                        │                         │
    └────────────────────────┼─────────────────────────┘
                             │
                             ▼
                        ┌─────────┐
                        │   End   │
                        └─────────┘

    Node width = 320px
    MIN_GAP = 50px
    Total span = 320 × 3 + 50 × 2 = 1060px
    Start X = 400 - 1060/2 = -130
    Positions: 175 (= -130 + 160 + 145), 400, 625
```

#### 8.3.11 边交叉最小化

当分支合并时，边可能交叉。通过调整节点顺序来最小化交叉：

```typescript
function minimizeEdgeCrossings(
  nodes: Node[],
  edges: Edge[],
  nodesByDepth: Map<number, Node[]>
): Map<number, Node[]> {
  const result = new Map(nodesByDepth);

  // 遍历每一层（从第二层开始）
  for (let depth = 1; depth <= Math.max(...nodesByDepth.keys()); depth++) {
    const currentLayer = result.get(depth);
    const prevLayer = result.get(depth - 1);

    if (!currentLayer || !prevLayer) continue;

    // 计算每个节点的"重心"（父节点位置的平均值）
    const barycenters = currentLayer.map(node => {
      const parentEdges = edges.filter(e => e.target === node.id);
      const parentPositions = parentEdges
        .map(e => prevLayer.findIndex(n => n.id === e.source))
        .filter(i => i !== -1);

      if (parentPositions.length === 0) return 0;
      return parentPositions.reduce((a, b) => a + b, 0) / parentPositions.length;
    });

    // 按重心排序
    const sortedIndices = barycenters
      .map((bc, i) => ({ bc, i }))
      .sort((a, b) => a.bc - b.bc)
      .map(x => x.i);

    result.set(depth, sortedIndices.map(i => currentLayer[i]));
  }

  return result;
}
```

#### 8.3.12 布局算法复杂度

| 操作 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 拓扑排序 | O(V + E) | O(V) |
| 分支识别 | O(V + E) | O(V) |
| 深度计算 | O(V + E) | O(V) |
| 分支归属 | O(V × B) | O(V) |
| 重叠检测 | O(V²) | O(1) |
| 重叠解决 | O(V × D) | O(V) |
| 边交叉最小化 | O(E × V) | O(V) |
| **总体** | **O(V² + E)** | **O(V)** |

其中 V = 节点数，E = 边数，B = 分支数，D = 最大深度
```

### 8.4 添加节点算法 (Add Node)

当用户添加新节点时，确保 End 节点保持在最底部：

```typescript
function addNode(type: NodeType, existingNodes: Node[]): Node[] {
  // 1. 检查 Start/End 唯一性
  if (type === 'startNode' && hasStartNode(existingNodes)) {
    throw new Error('Start node already exists');
  }
  if (type === 'endNode' && hasEndNode(existingNodes)) {
    throw new Error('End node already exists');
  }

  // 2. 计算新节点位置（在 End 节点之前）
  const endNode = existingNodes.find(n => n.type === 'endNode');
  const nonEndNodes = existingNodes.filter(n => n.type !== 'endNode');

  const maxY = nonEndNodes.length > 0
    ? Math.max(...nonEndNodes.map(n => n.position.y))
    : START_Y;

  const newY = maxY + VERTICAL_SPACING;

  // 3. 创建新节点
  const newNode = createNode(type, { x: CENTER_X, y: newY });

  // 4. 如果是 Learn/Test 节点，将 End 节点下移
  if ((type === 'learnNode' || type === 'testNode') && endNode) {
    const updatedNodes = existingNodes.map(n => {
      if (n.type === 'endNode') {
        return { ...n, position: { ...n.position, y: newY + VERTICAL_SPACING } };
      }
      return n;
    });
    return [...updatedNodes, newNode];
  }

  return [...existingNodes, newNode];
}
```

### 8.5 Start/End 唯一性保证 (Uniqueness Enforcement)

```typescript
function enforceUniqueStartEnd(
  nodes: Node[],
  defaultStart: Node,
  defaultEnd: Node
): Node[] {
  let hasStart = false;
  let hasEnd = false;

  // 过滤：只保留第一个 Start 和 End
  const filtered = nodes.filter(n => {
    if (n.type === 'startNode') {
      if (hasStart) return false;
      hasStart = true;
    }
    if (n.type === 'endNode') {
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
```

### 8.6 算法流程图

```
┌─────────────────────────────────────────────────────────────┐
│                    Flow Generation Pipeline                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                  ┌───────────────────────┐
                  │   Load Manifest?      │
                  └───────────────────────┘
                     │              │
                    Yes             No
                     │              │
                     ▼              ▼
        ┌─────────────────┐    ┌─────────────────┐
        │ Parse FLF JSON  │    │ Create Default  │
        │ via Transformer │    │ Start + End     │
        └─────────────────┘    └─────────────────┘
                     │              │
                     ▼              │
        ┌─────────────────┐        │
        │ Enforce Unique  │        │
        │ Start/End       │        │
        └─────────────────┘        │
                     │              │
                     ▼              │
        ┌─────────────────┐        │
        │ Topological     │        │
        │ Sort (DFS)      │        │
        └─────────────────┘        │
                     │              │
                     ▼              │
        ┌─────────────────┐        │
        │ Apply Vertical  │◄───────┘
        │ Layout          │
        └─────────────────┘
                     │
                     ▼
        ┌─────────────────┐
        │ Render React    │
        │ Flow Canvas     │
        └─────────────────┘
```

---

#### 签核确认 (Approval)

- [x] 确认 RFC 0018 仅负责图结构与连线逻辑。
- [x] 确认使用 React Flow 作为底层引擎。
- [x] 确认采用垂直流布局（从上到下）。
- [x] 确认 Start/End 节点唯一性约束和自动创建机制。
- [x] 确认流程生成算法（拓扑排序、垂直布局、唯一性保证）。
