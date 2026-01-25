/**
 * FLF 协议化路径解析工具 (RFC 0017)
 * 处理 src 字段的不同协议前缀：https://, local://, asset://, blob://
 */

export type AssetProtocol = "https" | "local" | "asset" | "blob";

export interface ParsedAssetSrc {
  protocol: AssetProtocol;
  path: string;
  // 对于 asset:// 协议，提取 UUID
  uuid?: string;
  // 对于 https:// 协议，提取完整 URL
  url?: string;
}

/**
 * 解析协议化路径
 * @param src 协议化路径字符串
 * @returns 解析后的协议和路径信息
 * @example
 * parseAssetSrc("https://example.com/video.mp4") // { protocol: "https", url: "https://example.com/video.mp4", path: "example.com/video.mp4" }
 * parseAssetSrc("local://quizzes/final.quiz") // { protocol: "local", path: "quizzes/final.quiz" }
 * parseAssetSrc("asset://550e8400-e29b-41d4-a716-446655440000") // { protocol: "asset", uuid: "550e8400-e29b-41d4-a716-446655440000", path: "550e8400-e29b-41d4-a716-446655440000" }
 * parseAssetSrc("blob://abc123") // { protocol: "blob", path: "abc123" }
 */
export function parseAssetSrc(src: string): ParsedAssetSrc {
  if (!src || typeof src !== "string") {
    throw new Error("Asset src must be a non-empty string");
  }

  // HTTPS/HTTP 协议
  if (src.startsWith("https://") || src.startsWith("http://")) {
    return {
      protocol: "https",
      url: src,
      path: src.replace(/^https?:\/\//, ""),
    };
  }

  // Local 协议 (包内相对路径)
  if (src.startsWith("local://")) {
    return {
      protocol: "local",
      path: src.replace(/^local:\/\//, ""),
    };
  }

  // Asset 协议 (数据库 UUID)
  if (src.startsWith("asset://")) {
    const uuid = src.replace(/^asset:\/\//, "");
    // 验证 UUID 格式 (简化版)
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(uuid)) {
      throw new Error(
        `Invalid UUID format in asset:// protocol: ${uuid}. Expected format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
      );
    }
    return {
      protocol: "asset",
      uuid,
      path: uuid,
    };
  }

  // Blob 协议 (前端临时上传)
  if (src.startsWith("blob://")) {
    return {
      protocol: "blob",
      path: src.replace(/^blob:\/\//, ""),
    };
  }

  // 默认情况：假设是相对路径或未指定协议
  // 为了向后兼容，允许不带协议前缀的路径
  return {
    protocol: "local",
    path: src,
  };
}

/**
 * 构建协议化路径
 * @param protocol 协议类型
 * @param path 路径或 UUID
 * @returns 协议化路径字符串
 * @example
 * buildAssetSrc("https", "example.com/video.mp4") // "https://example.com/video.mp4"
 * buildAssetSrc("local", "quizzes/final.quiz") // "local://quizzes/final.quiz"
 * buildAssetSrc("asset", "550e8400-e29b-41d4-a716-446655440000") // "asset://550e8400-e29b-41d4-a716-446655440000"
 */
export function buildAssetSrc(
  protocol: AssetProtocol,
  path: string
): string {
  if (!path || typeof path !== "string") {
    throw new Error("Path must be a non-empty string");
  }

  switch (protocol) {
    case "https":
      // 如果已经是完整 URL，直接返回
      if (path.startsWith("http://") || path.startsWith("https://")) {
        return path;
      }
      return `https://${path}`;
    case "local":
      return `local://${path}`;
    case "asset":
      // 验证 UUID 格式
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(path)) {
        throw new Error(
          `Invalid UUID format for asset protocol: ${path}. Expected format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
        );
      }
      return `asset://${path}`;
    case "blob":
      return `blob://${path}`;
    default:
      throw new Error(`Unsupported protocol: ${protocol}`);
  }
}

/**
 * 检查路径是否为特定协议
 */
export function isProtocol(src: string, protocol: AssetProtocol): boolean {
  try {
    const parsed = parseAssetSrc(src);
    return parsed.protocol === protocol;
  } catch {
    return false;
  }
}

/**
 * 从协议化路径中提取 UUID（仅适用于 asset:// 协议）
 */
export function extractUuidFromAssetSrc(src: string): string | null {
  try {
    const parsed = parseAssetSrc(src);
    return parsed.uuid || null;
  } catch {
    return null;
  }
}
