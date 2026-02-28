import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { 
  BookOpen, 
  Zap,
  Target,
  Play,
  Flag,
} from "lucide-react";
import "./CustomNodes.css";

/**
 * Learn Node (内容节点) - 全面重新设计的现代化 UI (RFC 0018)
 */
export const LearnNode = memo(({ data, selected }: NodeProps) => {
  const hasMedia = data.media_ids && (data.media_ids as string[]).length > 0;
  const hasContent = data.markdown && (data.markdown as string).trim().length > 0;
  const title = (data.title as string) || "New Content";
  const mediaCount = hasMedia ? (data.media_ids as string[]).length : 0;
  const minProgress = ((data.rules as any)?.min_prog || 1) * 100;

  return (
    <div
      className={`flow-node flow-node-learn group relative min-w-[280px] max-w-[320px] rounded-lg border-2 transition-all duration-300 ${
        selected
          ? "border-blue-500 shadow-lg"
          : "border-blue-200 shadow-md hover:border-blue-400 hover:shadow-lg"
      }`}
      style={{
        // 与 Asset Library 按钮相同的渐变背景
        background: selected
          ? "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)"
          : "linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)",
      }}
    >
      
      <div className="p-4">
        {/* Header Section - 与按钮样式匹配 */}
        <div className="mb-3 flex items-start gap-3">
          <div
            className={`flex-shrink-0 rounded-md p-2.5 transition-all duration-300 ${
              selected
                ? "bg-blue-500 text-white"
                : "bg-blue-50 text-blue-600"
            }`}
          >
            <BookOpen size={20} strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-slate-900 leading-tight mb-1">
              {title}
            </h3>
            <p className="text-xs text-slate-500">
              {hasMedia ? `${mediaCount} media` : "Learning content"}
            </p>
          </div>
        </div>

        {/* Content Preview Section - 简化版 */}
        <div className="mt-2">
          {hasContent ? (
            <p className="text-xs text-slate-500 line-clamp-2">
              {(data.markdown as string).substring(0, 60)}
              {(data.markdown as string).length > 60 && "..."}
            </p>
          ) : (
            <p className="text-xs text-slate-400">No content yet</p>
          )}
        </div>
      </div>

      {/* Handles - 垂直布局：顶部输入，底部输出 */}
      <Handle
        type="target"
        position={Position.Top}
        className="flow-handle flow-handle-target !h-4 !w-4 !bg-slate-400 !border-3 !border-white"
        style={{ top: -8 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="flow-handle flow-handle-source flow-handle-blue !h-4 !w-4 !bg-blue-500 !border-3 !border-white"
        style={{ bottom: -8 }}
      />
    </div>
  );
});

LearnNode.displayName = "LearnNode";

/**
 * Test Node (测验节点) - 全面重新设计的现代化 UI (RFC 0018)
 */
export const TestNode = memo(({ data, selected }: NodeProps) => {
  const passingScore = ((data.rules as any)?.passing_score || 0.8) * 100;
  const assetId = (data.asset_id as string) || "None";
  const title = (data.title as string) || "Quiz Challenge";
  const hasAsset = assetId !== "None";

  return (
    <div
      className={`flow-node flow-node-test group relative min-w-[280px] max-w-[320px] rounded-lg border-2 transition-all duration-300 ${
        selected
          ? "border-orange-500 shadow-lg"
          : "border-orange-200 shadow-md hover:border-orange-400 hover:shadow-lg"
      }`}
      style={{
        // 与 Asset Library 按钮相同的渐变背景
        background: selected
          ? "linear-gradient(135deg, #fffbeb 0%, #fed7aa 100%)"
          : "linear-gradient(135deg, #ffffff 0%, #fffbeb 100%)",
      }}
    >
      
      <div className="p-4">
        {/* Header Section - 与按钮样式匹配 */}
        <div className="mb-3 flex items-start gap-3">
          <div
            className={`flex-shrink-0 rounded-md p-2.5 transition-all duration-300 ${
              selected
                ? "bg-orange-500 text-white"
                : "bg-orange-50 text-orange-600"
            }`}
          >
            <Zap size={20} strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-slate-900 leading-tight mb-1">
              {title}
            </h3>
            <p className="text-xs text-slate-500">
              Quiz challenge
            </p>
          </div>
        </div>

        {/* Stats Section - 简化版 */}
        <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
          <Target size={12} className="text-orange-500" />
          <span>Passing: {Math.round(passingScore)}%</span>
        </div>
      </div>

      {/* Handles - 垂直布局：顶部输入，底部输出（Success/Fail） */}
      <Handle
        type="target"
        position={Position.Top}
        className="flow-handle flow-handle-target !h-4 !w-4 !bg-slate-400 !border-3 !border-white"
        style={{ top: -8 }}
      />

      {/* Success Handle - 底部左侧 */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="success"
        className="flow-handle flow-handle-source flow-handle-success !h-4 !w-4 !bg-green-500 !border-3 !border-white hover:!bg-green-600 transition-all"
        style={{ bottom: -8, left: "30%" }}
      />

      {/* Fail Handle - 底部右侧 */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="fail"
        className="flow-handle flow-handle-source flow-handle-fail !h-4 !w-4 !bg-red-500 !border-3 !border-white hover:!bg-red-600 transition-all"
        style={{ bottom: -8, left: "70%" }}
      />

      {/* Success/Fail Labels - 简化版 */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6 pointer-events-none">
        <span className="text-[9px] font-semibold text-green-600">Success</span>
        <span className="text-[9px] font-semibold text-red-600">Fail</span>
      </div>
    </div>
  );
});

TestNode.displayName = "TestNode";

/**
 * Start Node (开始节点) - 流程入口 (RFC 0018)
 */
export const StartNode = memo(({ data, selected }: NodeProps) => {
  const title = (data.title as string) || "Start";

  return (
    <div
      className={`flow-node flow-node-start group relative min-w-[200px] max-w-[240px] rounded-lg border-2 transition-all duration-300 ${
        selected
          ? "border-green-500 shadow-lg"
          : "border-green-200 shadow-md hover:border-green-400 hover:shadow-lg"
      }`}
      style={{
        // 与 Asset Library 按钮相同的渐变背景
        background: selected
          ? "linear-gradient(135deg, #f0fdf4 0%, #bbf7d0 100%)"
          : "linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)",
      }}
    >
      <div className="p-4">
        {/* Header Section - 与按钮样式匹配 */}
        <div className="flex items-center justify-center gap-3 mb-2">
          <div
            className={`rounded-md p-2.5 transition-all duration-300 ${
              selected
                ? "bg-green-500 text-white"
                : "bg-green-50 text-green-600"
            }`}
          >
            <Play size={18} strokeWidth={2.5} fill="currentColor" />
          </div>
        </div>
        
        <div className="text-center">
          <h3 className="text-sm font-semibold text-slate-900 mb-1">
            {title}
          </h3>
          <p className="text-xs text-slate-500">
            Flow entry point
          </p>
        </div>
      </div>

      {/* Only Source Handle - 垂直布局：底部输出 */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="flow-handle flow-handle-source flow-handle-green !h-4 !w-4 !bg-green-500 !border-3 !border-white"
        style={{ bottom: -8 }}
      />
    </div>
  );
});

StartNode.displayName = "StartNode";

/**
 * End Node (结束节点) - 流程出口 (RFC 0018)
 */
export const EndNode = memo(({ data, selected }: NodeProps) => {
  const title = (data.title as string) || "End";
  const isMilestone = data.is_milestone === true;

  return (
    <div
      className={`flow-node flow-node-end group relative min-w-[200px] max-w-[240px] rounded-lg border-2 transition-all duration-300 ${
        selected
          ? "border-purple-500 shadow-lg"
          : "border-purple-200 shadow-md hover:border-purple-400 hover:shadow-lg"
      }`}
      style={{
        // 与 Asset Library 按钮相同的渐变背景
        background: selected
          ? "linear-gradient(135deg, #faf5ff 0%, #e9d5ff 100%)"
          : "linear-gradient(135deg, #ffffff 0%, #faf5ff 100%)",
      }}
    >
      <div className="p-4">
        {/* Header Section - 与按钮样式匹配 */}
        <div className="flex items-center justify-center gap-3 mb-2">
          <div
            className={`rounded-md p-2.5 transition-all duration-300 ${
              selected
                ? "bg-purple-500 text-white"
                : "bg-purple-50 text-purple-600"
            }`}
          >
            <Flag size={18} strokeWidth={2.5} fill="currentColor" />
          </div>
        </div>
        
        <div className="text-center">
          <h3 className="text-sm font-semibold text-slate-900 mb-1">
            {title}
          </h3>
          <p className="text-xs text-slate-500">
            {isMilestone ? "Milestone endpoint" : "Flow exit point"}
          </p>
        </div>
      </div>

      {/* Only Target Handle - 垂直布局：顶部输入 */}
      <Handle
        type="target"
        position={Position.Top}
        className="flow-handle flow-handle-target flow-handle-purple !h-4 !w-4 !bg-purple-500 !border-3 !border-white"
        style={{ top: -8 }}
      />
    </div>
  );
});

EndNode.displayName = "EndNode";
