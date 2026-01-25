import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { 
  BookOpen, 
  Video, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Zap,
  Clock,
  Target,
  Sparkles,
  ChevronRight,
  Play,
  Flag,
  CheckCircle
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
      className={`flow-node flow-node-learn group relative min-w-[280px] max-w-[320px] rounded-2xl border-2 bg-white transition-all duration-300 ${
        selected
          ? "border-blue-500 shadow-2xl shadow-blue-500/30 scale-[1.02]"
          : "border-slate-200 shadow-lg hover:border-blue-400 hover:shadow-xl"
      }`}
      style={{
        background: selected
          ? "linear-gradient(135deg, #ffffff 0%, #eff6ff 50%, #ffffff 100%)"
          : "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
      }}
    >
      {/* 顶部装饰条 - 渐变 */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 rounded-t-2xl" />
      
      {/* 选中状态光晕效果 */}
      {selected && (
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-blue-400 rounded-2xl opacity-20 blur-sm -z-10 animate-pulse" />
      )}
      
      <div className="p-5">
        {/* Header Section */}
        <div className="mb-4 flex items-start gap-3">
          <div
            className={`flex-shrink-0 rounded-2xl p-3 transition-all duration-300 ${
              selected
                ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/40 scale-110"
                : "bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 group-hover:from-blue-100 group-hover:to-blue-200"
            }`}
          >
            <BookOpen size={22} strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[9px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                Learn Node
              </span>
              {hasMedia ? (
                <span className="flex items-center gap-1 text-[9px] font-bold text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded">
                  <Video size={10} />
                  {mediaCount}
                </span>
              ) : null}
            </div>
            <h3 className="text-base font-bold text-slate-900 leading-tight line-clamp-2">
              {title}
            </h3>
          </div>
        </div>

        {/* Content Preview Section */}
        <div className="space-y-3">
          {hasContent ? (
            <div className="relative">
              <div 
                className="text-xs text-slate-600 leading-relaxed line-clamp-3 pr-2"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {(data.markdown as string).substring(0, 100)}
                {(data.markdown as string).length > 100 && "..."}
              </div>
              <div className="absolute bottom-0 right-0 bg-gradient-to-l from-white to-transparent w-8 h-6" />
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 rounded-lg px-3 py-2 border border-slate-200">
              <FileText size={12} />
              <span className="font-medium">No content yet</span>
            </div>
          )}

          {/* Progress Rule Indicator */}
          {minProgress < 100 && (
            <div className="flex items-center gap-2 text-[10px] text-slate-500 bg-slate-50 rounded-lg px-2.5 py-1.5 border border-slate-200">
              <Clock size={11} className="text-blue-500" />
              <span className="font-medium">Min: {Math.round(minProgress)}% progress</span>
            </div>
          )}
        </div>
      </div>

      {/* Handles with enhanced styling - 水平布局：左侧输入，右侧输出 */}
      <Handle
        type="target"
        position={Position.Left}
        className="flow-handle flow-handle-target !h-4 !w-4 !bg-slate-400 !border-3 !border-white"
        style={{ left: -8 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="flow-handle flow-handle-source flow-handle-blue !h-4 !w-4 !bg-blue-500 !border-3 !border-white"
        style={{ right: -8 }}
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
      className={`flow-node flow-node-test group relative min-w-[280px] max-w-[320px] rounded-2xl border-2 bg-white transition-all duration-300 ${
        selected
          ? "border-orange-500 shadow-2xl shadow-orange-500/30 scale-[1.02]"
          : "border-slate-200 shadow-lg hover:border-orange-400 hover:shadow-xl"
      }`}
      style={{
        background: selected
          ? "linear-gradient(135deg, #ffffff 0%, #fffbeb 50%, #ffffff 100%)"
          : "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
      }}
    >
      {/* 顶部装饰条 - 渐变 */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 rounded-t-2xl" />
      
      {/* 选中状态光晕效果 */}
      {selected && (
        <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-amber-400 rounded-2xl opacity-20 blur-sm -z-10 animate-pulse" />
      )}
      
      <div className="p-5">
        {/* Header Section */}
        <div className="mb-4 flex items-start gap-3">
          <div
            className={`flex-shrink-0 rounded-2xl p-3 transition-all duration-300 ${
              selected
                ? "bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/40 scale-110"
                : "bg-gradient-to-br from-orange-50 to-amber-50 text-orange-600 group-hover:from-orange-100 group-hover:to-amber-100"
            }`}
          >
            <Zap size={22} strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[9px] font-black uppercase tracking-widest text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                Test Node
              </span>
              <Sparkles size={12} className="text-orange-500" />
            </div>
            <h3 className="text-base font-bold text-slate-900 leading-tight line-clamp-2">
              {title}
            </h3>
          </div>
        </div>

        {/* Stats Section */}
        <div className="space-y-3">
          {/* Asset Info */}
          <div className={`flex items-center justify-between text-xs rounded-xl px-3 py-2.5 border ${
            hasAsset 
              ? "bg-orange-50 border-orange-200" 
              : "bg-slate-50 border-slate-200"
          }`}>
            <div className="flex items-center gap-2">
              <Target size={14} className={hasAsset ? "text-orange-600" : "text-slate-400"} />
              <span className={`font-semibold ${hasAsset ? "text-slate-900" : "text-slate-500"}`}>
                {hasAsset ? assetId : "No asset"}
              </span>
            </div>
            {hasAsset && (
              <ChevronRight size={12} className="text-orange-500" />
            )}
          </div>
          
          {/* Passing Score with Visual Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Target size={12} className="text-orange-500" />
                Passing Score
              </span>
              <span className="text-xs font-black text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">
                {Math.round(passingScore)}%
              </span>
            </div>
            <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div
                className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 rounded-full transition-all duration-500 relative overflow-hidden"
                style={{ width: `${passingScore}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Handles - 水平布局：左侧输入，右侧输出（Success/Fail） */}
      <Handle
        type="target"
        position={Position.Left}
        className="flow-handle flow-handle-target !h-4 !w-4 !bg-slate-400 !border-3 !border-white"
        style={{ left: -8 }}
      />
      
      {/* Success Handle - 右侧上方（水平 flow：Success 在上方） */}
      <Handle
        type="source"
        position={Position.Right}
        id="success"
        className="flow-handle flow-handle-source flow-handle-success !h-4 !w-4 !bg-green-500 !border-3 !border-white hover:!bg-green-600 transition-all"
        style={{ right: -8, top: "30%" }}
      />
      
      {/* Fail Handle - 右侧下方（水平 flow：Fail 在下方） */}
      <Handle
        type="source"
        position={Position.Right}
        id="fail"
        className="flow-handle flow-handle-source flow-handle-fail !h-4 !w-4 !bg-red-500 !border-3 !border-white hover:!bg-red-600 transition-all"
        style={{ right: -8, top: "70%" }}
      />
      
      {/* Success/Fail Labels - 显示在节点内部右侧，与 handles 对齐 */}
      <div className="absolute right-12 top-1/2 -translate-y-1/2 flex flex-col items-end gap-6 pointer-events-none">
        <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-green-600 bg-green-50 px-2 py-1 rounded-md border border-green-200">
          <CheckCircle2 size={11} />
          <span>Success</span>
        </div>
        <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-red-600 bg-red-50 px-2 py-1 rounded-md border border-red-200">
          <XCircle size={11} />
          <span>Fail</span>
        </div>
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
      className={`flow-node flow-node-start group relative min-w-[200px] max-w-[240px] rounded-2xl border-2 bg-white transition-all duration-300 ${
        selected
          ? "border-green-500 shadow-2xl shadow-green-500/30 scale-[1.02]"
          : "border-slate-200 shadow-lg hover:border-green-400 hover:shadow-xl"
      }`}
      style={{
        background: selected
          ? "linear-gradient(135deg, #ffffff 0%, #f0fdf4 50%, #ffffff 100%)"
          : "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
      }}
    >
      {/* 顶部装饰条 */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-green-500 via-emerald-400 to-green-500 rounded-t-2xl" />
      
      {/* 选中状态光晕效果 */}
      {selected && (
        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-400 rounded-2xl opacity-20 blur-sm -z-10 animate-pulse" />
      )}
      
      <div className="p-5">
        {/* Header Section */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <div
            className={`rounded-2xl p-4 transition-all duration-300 ${
              selected
                ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/40 scale-110"
                : "bg-gradient-to-br from-green-50 to-emerald-50 text-green-600 group-hover:from-green-100 group-hover:to-emerald-100"
            }`}
          >
            <Play size={28} strokeWidth={2.5} fill="currentColor" />
          </div>
        </div>
        
        <div className="text-center">
          <h3 className="text-base font-black text-slate-900 mb-1">
            {title}
          </h3>
          <p className="text-[10px] font-bold uppercase tracking-widest text-green-600 bg-green-50 px-3 py-1 rounded-lg inline-block">
            Start Point
          </p>
        </div>
      </div>

      {/* Only Source Handle - 水平布局：右侧输出 */}
      <Handle
        type="source"
        position={Position.Right}
        className="flow-handle flow-handle-source flow-handle-green !h-4 !w-4 !bg-green-500 !border-3 !border-white"
        style={{ right: -8 }}
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
      className={`flow-node flow-node-end group relative min-w-[200px] max-w-[240px] rounded-2xl border-2 bg-white transition-all duration-300 ${
        selected
          ? "border-purple-500 shadow-2xl shadow-purple-500/30 scale-[1.02]"
          : "border-slate-200 shadow-lg hover:border-purple-400 hover:shadow-xl"
      }`}
      style={{
        background: selected
          ? "linear-gradient(135deg, #ffffff 0%, #faf5ff 50%, #ffffff 100%)"
          : "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
      }}
    >
      {/* 顶部装饰条 */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 via-violet-400 to-purple-500 rounded-t-2xl" />
      
      {/* 选中状态光晕效果 */}
      {selected && (
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-violet-400 rounded-2xl opacity-20 blur-sm -z-10 animate-pulse" />
      )}
      
      <div className="p-5">
        {/* Header Section */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <div
            className={`rounded-2xl p-4 transition-all duration-300 ${
              selected
                ? "bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-lg shadow-purple-500/40 scale-110"
                : "bg-gradient-to-br from-purple-50 to-violet-50 text-purple-600 group-hover:from-purple-100 group-hover:to-violet-100"
            }`}
          >
            <Flag size={28} strokeWidth={2.5} fill="currentColor" />
          </div>
        </div>
        
        <div className="text-center space-y-2">
          <h3 className="text-base font-black text-slate-900">
            {title}
          </h3>
          <div className="flex items-center justify-center gap-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-purple-600 bg-purple-50 px-3 py-1 rounded-lg">
              End Point
            </p>
            {isMilestone && (
              <span className="flex items-center gap-1 text-[9px] font-black text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                <CheckCircle size={10} />
                Milestone
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Only Target Handle - 水平布局：左侧输入 */}
      <Handle
        type="target"
        position={Position.Left}
        className="flow-handle flow-handle-target flow-handle-purple !h-4 !w-4 !bg-purple-500 !border-3 !border-white"
        style={{ left: -8 }}
      />
    </div>
  );
});

EndNode.displayName = "EndNode";
