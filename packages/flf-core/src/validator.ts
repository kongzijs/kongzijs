/**
 * FLF 验证器 (RFC 0017)
 * 验证 FLF 清单是否符合规范
 */

import {
  AssetType,
  FlowNodeType,
} from "./types";
import { parseAssetSrc } from "./asset-protocol";

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * 验证 FLF 清单
 */
export function validateFLFManifest(manifest: any): ValidationResult {
  const errors: ValidationError[] = [];

  // 验证顶级结构
  if (!manifest || typeof manifest !== "object") {
    return {
      valid: false,
      errors: [{ field: "root", message: "Manifest must be an object" }],
    };
  }

  // 验证 flf_version
  if (manifest.flf_version !== "1.0") {
    errors.push({
      field: "flf_version",
      message: `Invalid FLF version. Expected "1.0", got "${manifest.flf_version}"`,
      value: manifest.flf_version,
    });
  }

  // 验证 lesson_id
  if (!manifest.lesson_id || typeof manifest.lesson_id !== "string") {
    errors.push({
      field: "lesson_id",
      message: "lesson_id must be a non-empty string",
      value: manifest.lesson_id,
    });
  }

  // 验证 settings
  if (!manifest.settings || typeof manifest.settings !== "object") {
    errors.push({
      field: "settings",
      message: "settings must be an object",
      value: manifest.settings,
    });
  } else {
    const settings = manifest.settings;
    if (
      settings.level_required !== undefined &&
      (typeof settings.level_required !== "number" ||
        settings.level_required < 0)
    ) {
      errors.push({
        field: "settings.level_required",
        message: "level_required must be a non-negative number",
        value: settings.level_required,
      });
    }
    if (
      settings.total_credits !== undefined &&
      (typeof settings.total_credits !== "number" ||
        settings.total_credits < 0)
    ) {
      errors.push({
        field: "settings.total_credits",
        message: "total_credits must be a non-negative number",
        value: settings.total_credits,
      });
    }
    if (
      settings.access_control &&
      !["public", "private", "protected"].includes(settings.access_control)
    ) {
      errors.push({
        field: "settings.access_control",
        message:
          'access_control must be one of: "public", "private", "protected"',
        value: settings.access_control,
      });
    }
    if (
      settings.difficulty &&
      !["beginner", "intermediate", "advanced"].includes(settings.difficulty)
    ) {
      errors.push({
        field: "settings.difficulty",
        message:
          'difficulty must be one of: "beginner", "intermediate", "advanced"',
        value: settings.difficulty,
      });
    }
    if (
      settings.status &&
      !["draft", "review", "published"].includes(settings.status)
    ) {
      errors.push({
        field: "settings.status",
        message: 'status must be one of: "draft", "review", "published"',
        value: settings.status,
      });
    }
  }

  // 验证 assets_manifest
  if (!Array.isArray(manifest.assets_manifest)) {
    errors.push({
      field: "assets_manifest",
      message: "assets_manifest must be an array",
      value: manifest.assets_manifest,
    });
  } else {
    const assetIds = new Set<string>();
    manifest.assets_manifest.forEach((asset: any, index: number) => {
      const prefix = `assets_manifest[${index}]`;
      const assetErrors = validateAssetManifestEntry(asset, prefix);
      errors.push(...assetErrors);

      // 检查重复的 asset id
      if (asset.id) {
        if (assetIds.has(asset.id)) {
          errors.push({
            field: `${prefix}.id`,
            message: `Duplicate asset id: ${asset.id}`,
            value: asset.id,
          });
        }
        assetIds.add(asset.id);
      }
    });
  }

  // 验证 flow_nodes
  if (!Array.isArray(manifest.flow_nodes)) {
    errors.push({
      field: "flow_nodes",
      message: "flow_nodes must be an array",
      value: manifest.flow_nodes,
    });
  } else {
    const nodeIds = new Set<string>();
    manifest.flow_nodes.forEach((node: any, index: number) => {
      const prefix = `flow_nodes[${index}]`;
      const nodeErrors = validateFlowNode(node, prefix);
      errors.push(...nodeErrors);

      // 检查重复的 node id
      if (node.id) {
        if (nodeIds.has(node.id)) {
          errors.push({
            field: `${prefix}.id`,
            message: `Duplicate node id: ${node.id}`,
            value: node.id,
          });
        }
        nodeIds.add(node.id);
      }
    });
  }

  // 验证 flow_edges
  if (!Array.isArray(manifest.flow_edges)) {
    errors.push({
      field: "flow_edges",
      message: "flow_edges must be an array",
      value: manifest.flow_edges,
    });
    } else {
      const nodeIds = new Set<string>(
        manifest.flow_nodes?.map((n: any) => n.id).filter(Boolean) || []
      );
      manifest.flow_edges.forEach((edge: any, index: number) => {
        const prefix = `flow_edges[${index}]`;
        const edgeErrors = validateFlowEdge(edge, prefix, nodeIds);
        errors.push(...edgeErrors);
      });
    }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 验证资产清单条目
 */
function validateAssetManifestEntry(
  asset: any,
  prefix: string
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!asset || typeof asset !== "object") {
    return [
      {
        field: prefix,
        message: "Asset entry must be an object",
        value: asset,
      },
    ];
  }

  // 验证 id
  if (!asset.id || typeof asset.id !== "string") {
    errors.push({
      field: `${prefix}.id`,
      message: "Asset id must be a non-empty string",
      value: asset.id,
    });
  }

  // 验证 type
  const validTypes: AssetType[] = ["video", "audio", "image", "pdf", "quiz_dsl"];
  if (!asset.type || !validTypes.includes(asset.type)) {
    errors.push({
      field: `${prefix}.type`,
      message: `Asset type must be one of: ${validTypes.join(", ")}`,
      value: asset.type,
    });
  }

  // 验证 src
  if (!asset.src || typeof asset.src !== "string") {
    errors.push({
      field: `${prefix}.src`,
      message: "Asset src must be a non-empty string",
      value: asset.src,
    });
  } else {
    // 验证协议化路径格式
    try {
      parseAssetSrc(asset.src);
    } catch (e: any) {
      errors.push({
        field: `${prefix}.src`,
        message: `Invalid asset src format: ${e.message}`,
        value: asset.src,
      });
    }
  }

  // hash 是可选的，但如果存在必须是字符串
  if (asset.hash !== undefined && typeof asset.hash !== "string") {
    errors.push({
      field: `${prefix}.hash`,
      message: "Asset hash must be a string if provided",
      value: asset.hash,
    });
  }

  return errors;
}

/**
 * 验证流程节点
 */
function validateFlowNode(
  node: any,
  prefix: string
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!node || typeof node !== "object") {
    return [
      {
        field: prefix,
        message: "Flow node must be an object",
        value: node,
      },
    ];
  }

  // 验证 id
  if (!node.id || typeof node.id !== "string") {
    errors.push({
      field: `${prefix}.id`,
      message: "Node id must be a non-empty string",
      value: node.id,
    });
  }

  // 验证 type
  const validTypes: FlowNodeType[] = ["learn", "test", "resource"];
  if (!node.type || !validTypes.includes(node.type)) {
    errors.push({
      field: `${prefix}.type`,
      message: `Node type must be one of: ${validTypes.join(", ")}`,
      value: node.type,
    });
  }

  // 验证 asset_id（如果存在）
  if (node.asset_id !== undefined && typeof node.asset_id !== "string") {
    errors.push({
      field: `${prefix}.asset_id`,
      message: "asset_id must be a string if provided",
      value: node.asset_id,
    });
  }

  // 验证 rules（如果存在）
  if (node.rules !== undefined) {
    if (typeof node.rules !== "object") {
      errors.push({
        field: `${prefix}.rules`,
        message: "rules must be an object if provided",
        value: node.rules,
      });
    } else {
      const rules = node.rules;
      if (
        rules.passing_score !== undefined &&
        (typeof rules.passing_score !== "number" ||
          rules.passing_score < 0 ||
          rules.passing_score > 1)
      ) {
        errors.push({
          field: `${prefix}.rules.passing_score`,
          message: "passing_score must be a number between 0 and 1",
          value: rules.passing_score,
        });
      }
      if (
        rules.min_view_time !== undefined &&
        (typeof rules.min_view_time !== "number" ||
          rules.min_view_time < 0)
      ) {
        errors.push({
          field: `${prefix}.rules.min_view_time`,
          message: "min_view_time must be a non-negative number",
          value: rules.min_view_time,
        });
      }
    }
  }

  // 验证 position（如果存在）
  if (node.position !== undefined) {
    if (typeof node.position !== "object") {
      errors.push({
        field: `${prefix}.position`,
        message: "position must be an object if provided",
        value: node.position,
      });
    } else {
      if (
        typeof node.position.x !== "number" ||
        typeof node.position.y !== "number"
      ) {
        errors.push({
          field: `${prefix}.position`,
          message: "position must have numeric x and y properties",
          value: node.position,
        });
      }
    }
  }

  return errors;
}

/**
 * 验证流程边
 */
function validateFlowEdge(
  edge: any,
  prefix: string,
  nodeIds: Set<string>
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!edge || typeof edge !== "object") {
    return [
      {
        field: prefix,
        message: "Flow edge must be an object",
        value: edge,
      },
    ];
  }

  // 验证 id
  if (!edge.id || typeof edge.id !== "string") {
    errors.push({
      field: `${prefix}.id`,
      message: "Edge id must be a non-empty string",
      value: edge.id,
    });
  }

  // 验证 source
  if (!edge.source || typeof edge.source !== "string") {
    errors.push({
      field: `${prefix}.source`,
      message: "Edge source must be a non-empty string",
      value: edge.source,
    });
  } else if (!nodeIds.has(edge.source)) {
    errors.push({
      field: `${prefix}.source`,
      message: `Edge source node "${edge.source}" does not exist in flow_nodes`,
      value: edge.source,
    });
  }

  // 验证 target
  if (!edge.target || typeof edge.target !== "string") {
    errors.push({
      field: `${prefix}.target`,
      message: "Edge target must be a non-empty string",
      value: edge.target,
    });
  } else if (!nodeIds.has(edge.target)) {
    errors.push({
      field: `${prefix}.target`,
      message: `Edge target node "${edge.target}" does not exist in flow_nodes`,
      value: edge.target,
    });
  }

  // 验证 condition（如果存在）
  if (
    edge.condition !== undefined &&
    !["success", "fail", "default"].includes(edge.condition)
  ) {
    errors.push({
      field: `${prefix}.condition`,
      message: 'condition must be one of: "success", "fail", "default"',
      value: edge.condition,
    });
  }

  return errors;
}
