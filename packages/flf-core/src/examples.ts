/**
 * FLF 示例数据生成器 (RFC 0017)
 * 用于测试、文档和开发参考
 */

import { FLFManifest } from "./types";

/**
 * 生成一个简单的示例 FLF 清单（包含一个 Learn 节点和一个 Test 节点）
 */
export function createExampleFLF(): FLFManifest {
  return {
    flf_version: "1.0",
    lesson_id: "L-101",
    settings: {
      level_required: 1,
      total_credits: 50,
      access_control: "public",
      difficulty: "intermediate",
      estimated_duration: 30,
      status: "draft",
    },
    fingerprint: "eb6a9400e29b41d4a716446655440000",
    assets_manifest: [
      {
        id: "intro_video",
        type: "video",
        src: "https://example.com/videos/intro.mp4",
        hash: "sha256:abc123...",
      },
      {
        id: "final_quiz",
        type: "quiz_dsl",
        src: "local://quizzes/final.quiz",
      },
    ],
    flow_nodes: [
      {
        id: "node_start",
        type: "start",
        data: {
          title: "Start",
        },
        position: { x: 50, y: 250 },
      },
      {
        id: "node_1",
        type: "learn",
        asset_id: "intro_video",
        data: {
          title: "课程介绍",
          markdown: "# 欢迎来到本课程\n\n这是第一课的内容...",
          media_ids: ["intro_video"],
        },
        rules: {
          min_view_time: 60, // 至少观看 60 秒
          min_prog: 0.8, // 至少完成 80%
        },
        position: { x: 350, y: 250 },
        track_id: "intro_learn",
        is_milestone: false,
      },
      {
        id: "node_2",
        type: "test",
        asset_id: "final_quiz",
        data: {
          title: "最终测验",
        },
        rules: {
          passing_score: 0.8, // 80% 通过
          max_attempts: 3,
          on_fail: "redirect",
          redirect_node_id: "node_1", // 失败后回到学习节点
        },
        position: { x: 650, y: 250 },
        track_id: "final_test",
        is_milestone: true, // 关键里程碑
      },
      {
        id: "node_end",
        type: "end",
        data: {
          title: "End",
        },
        is_milestone: true,
        position: { x: 950, y: 250 },
      },
    ],
    flow_edges: [
      {
        id: "edge_start",
        source: "node_start",
        target: "node_1",
        condition: "default",
      },
      {
        id: "edge_1",
        source: "node_1",
        target: "node_2",
        label: "完成学习",
        condition: "default",
      },
      {
        id: "edge_success",
        source: "node_2",
        target: "node_end",
        label: "Success",
        condition: "success",
      },
    ],
  };
}

/**
 * 生成一个最小化的 FLF 清单（仅包含必需字段）
 */
export function createMinimalFLF(lessonId: string): FLFManifest {
  return {
    flf_version: "1.0",
    lesson_id: lessonId,
    settings: {},
    assets_manifest: [],
    flow_nodes: [],
    flow_edges: [],
  };
}

/**
 * 生成一个包含多个 Learn 节点的复杂示例
 */
export function createComplexFLF(): FLFManifest {
  return {
    flf_version: "1.0",
    lesson_id: "L-201",
    settings: {
      level_required: 2,
      total_credits: 100,
      access_control: "protected",
      difficulty: "advanced",
      estimated_duration: 60,
      status: "published",
    },
    fingerprint: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
    assets_manifest: [
      {
        id: "video_1",
        type: "video",
        src: "https://cdn.example.com/lesson1/video1.mp4",
      },
      {
        id: "video_2",
        type: "video",
        src: "asset://550e8400-e29b-41d4-a716-446655440000",
      },
      {
        id: "audio_1",
        type: "audio",
        src: "local://audio/pronunciation.mp3",
      },
      {
        id: "quiz_1",
        type: "quiz_dsl",
        src: "local://quizzes/quiz1.quiz",
      },
      {
        id: "quiz_2",
        type: "quiz_dsl",
        src: "asset://660e8400-e29b-41d4-a716-446655440001",
      },
      {
        id: "pdf_1",
        type: "pdf",
        src: "https://example.com/resources/guide.pdf",
      },
    ],
    flow_nodes: [
      {
        id: "start",
        type: "learn",
        data: {
          title: "课程开始",
          markdown: "# 欢迎\n\n让我们开始学习...",
          media_ids: ["video_1"],
        },
        rules: {
          min_view_time: 120,
        },
        position: { x: 0, y: 0 },
        track_id: "start_node",
        is_milestone: false,
      },
      {
        id: "content_1",
        type: "learn",
        data: {
          title: "第一部分",
          markdown: "## 第一部分内容\n\n详细内容...",
          media_ids: ["video_2", "audio_1"],
        },
        rules: {
          min_view_time: 180,
          min_prog: 0.9,
        },
        position: { x: 200, y: 0 },
        track_id: "content_1",
        is_milestone: false,
      },
      {
        id: "test_1",
        type: "test",
        asset_id: "quiz_1",
        data: {
          title: "第一部分测验",
        },
        rules: {
          passing_score: 0.7,
          max_attempts: 2,
          on_fail: "redirect",
          redirect_node_id: "content_1",
        },
        position: { x: 400, y: 0 },
        track_id: "test_1",
        is_milestone: true,
      },
      {
        id: "content_2",
        type: "learn",
        data: {
          title: "第二部分",
          markdown: "## 第二部分内容\n\n继续学习...",
          media_ids: ["video_1"],
        },
        rules: {
          min_view_time: 150,
        },
        position: { x: 200, y: 200 },
        track_id: "content_2",
        is_milestone: false,
      },
      {
        id: "final_test",
        type: "test",
        asset_id: "quiz_2",
        data: {
          title: "最终测验",
        },
        rules: {
          passing_score: 0.85,
          max_attempts: 3,
          on_fail: "retry",
        },
        position: { x: 400, y: 200 },
        track_id: "final_test",
        is_milestone: true,
      },
      {
        id: "resource",
        type: "resource",
        asset_id: "pdf_1",
        data: {
          title: "参考资源",
        },
        position: { x: 600, y: 100 },
        track_id: "resource",
        is_milestone: false,
      },
    ],
    flow_edges: [
      {
        id: "e1",
        source: "start",
        target: "content_1",
        label: "继续",
        condition: "default",
      },
      {
        id: "e2",
        source: "content_1",
        target: "test_1",
        label: "开始测验",
        condition: "default",
      },
      {
        id: "e3",
        source: "test_1",
        target: "content_2",
        label: "通过",
        condition: "success",
      },
      {
        id: "e4",
        source: "test_1",
        target: "content_1",
        label: "失败",
        condition: "fail",
      },
      {
        id: "e5",
        source: "content_2",
        target: "final_test",
        label: "开始最终测验",
        condition: "default",
      },
      {
        id: "e6",
        source: "final_test",
        target: "resource",
        label: "完成",
        condition: "success",
      },
    ],
  };
}

/**
 * 生成一个使用 blob:// 协议的示例（编辑态）
 */
export function createEditorStateFLF(): FLFManifest {
  return {
    flf_version: "1.0",
    lesson_id: "L-DRAFT-001",
    settings: {
      status: "draft",
    },
    assets_manifest: [
      {
        id: "uploaded_video",
        type: "video",
        src: "blob://abc123def456", // 前端临时上传
      },
      {
        id: "uploaded_quiz",
        type: "quiz_dsl",
        src: "blob://xyz789", // 前端临时上传
      },
    ],
    flow_nodes: [
      {
        id: "node_1",
        type: "learn",
        asset_id: "uploaded_video",
        data: {
          title: "新内容",
          markdown: "待编辑的内容...",
        },
        position: { x: 0, y: 0 },
      },
      {
        id: "node_2",
        type: "test",
        asset_id: "uploaded_quiz",
        position: { x: 300, y: 0 },
      },
    ],
    flow_edges: [
      {
        id: "edge_1",
        source: "node_1",
        target: "node_2",
        condition: "default",
      },
    ],
  };
}
