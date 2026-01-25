/**
 * 协议化路径解析工具测试
 */

import { describe, it, expect } from "vitest";
import {
  parseAssetSrc,
  buildAssetSrc,
  isProtocol,
  extractUuidFromAssetSrc,
} from "../asset-protocol";

describe("parseAssetSrc", () => {
  it("应该正确解析 https:// 协议", () => {
    const result = parseAssetSrc("https://example.com/video.mp4");
    expect(result.protocol).toBe("https");
    expect(result.url).toBe("https://example.com/video.mp4");
    expect(result.path).toBe("example.com/video.mp4");
  });

  it("应该正确解析 http:// 协议", () => {
    const result = parseAssetSrc("http://example.com/video.mp4");
    expect(result.protocol).toBe("https");
    expect(result.url).toBe("http://example.com/video.mp4");
  });

  it("应该正确解析 local:// 协议", () => {
    const result = parseAssetSrc("local://quizzes/final.quiz");
    expect(result.protocol).toBe("local");
    expect(result.path).toBe("quizzes/final.quiz");
  });

  it("应该正确解析 asset:// 协议", () => {
    const uuid = "550e8400-e29b-41d4-a716-446655440000";
    const result = parseAssetSrc(`asset://${uuid}`);
    expect(result.protocol).toBe("asset");
    expect(result.uuid).toBe(uuid);
    expect(result.path).toBe(uuid);
  });

  it("应该拒绝无效的 UUID 格式", () => {
    expect(() => parseAssetSrc("asset://invalid-uuid")).toThrow();
  });

  it("应该正确解析 blob:// 协议", () => {
    const result = parseAssetSrc("blob://abc123");
    expect(result.protocol).toBe("blob");
    expect(result.path).toBe("abc123");
  });

  it("应该将不带协议前缀的路径默认为 local", () => {
    const result = parseAssetSrc("relative/path/file.mp4");
    expect(result.protocol).toBe("local");
    expect(result.path).toBe("relative/path/file.mp4");
  });

  it("应该拒绝空字符串", () => {
    expect(() => parseAssetSrc("")).toThrow();
  });
});

describe("buildAssetSrc", () => {
  it("应该构建 https:// 协议路径", () => {
    const result = buildAssetSrc("https", "example.com/video.mp4");
    expect(result).toBe("https://example.com/video.mp4");
  });

  it("应该保持完整的 https URL", () => {
    const result = buildAssetSrc("https", "https://example.com/video.mp4");
    expect(result).toBe("https://example.com/video.mp4");
  });

  it("应该构建 local:// 协议路径", () => {
    const result = buildAssetSrc("local", "quizzes/final.quiz");
    expect(result).toBe("local://quizzes/final.quiz");
  });

  it("应该构建 asset:// 协议路径", () => {
    const uuid = "550e8400-e29b-41d4-a716-446655440000";
    const result = buildAssetSrc("asset", uuid);
    expect(result).toBe(`asset://${uuid}`);
  });

  it("应该拒绝无效的 UUID 格式", () => {
    expect(() => buildAssetSrc("asset", "invalid-uuid")).toThrow();
  });

  it("应该构建 blob:// 协议路径", () => {
    const result = buildAssetSrc("blob", "abc123");
    expect(result).toBe("blob://abc123");
  });
});

describe("isProtocol", () => {
  it("应该正确识别 https 协议", () => {
    expect(isProtocol("https://example.com/video.mp4", "https")).toBe(true);
    expect(isProtocol("local://file", "https")).toBe(false);
  });

  it("应该正确识别 local 协议", () => {
    expect(isProtocol("local://file", "local")).toBe(true);
    expect(isProtocol("https://example.com", "local")).toBe(false);
  });

  it("应该正确识别 asset 协议", () => {
    const uuid = "550e8400-e29b-41d4-a716-446655440000";
    expect(isProtocol(`asset://${uuid}`, "asset")).toBe(true);
    expect(isProtocol("local://file", "asset")).toBe(false);
  });

  it("应该正确识别 blob 协议", () => {
    expect(isProtocol("blob://abc123", "blob")).toBe(true);
    expect(isProtocol("local://file", "blob")).toBe(false);
  });
});

describe("extractUuidFromAssetSrc", () => {
  it("应该从 asset:// 协议中提取 UUID", () => {
    const uuid = "550e8400-e29b-41d4-a716-446655440000";
    const result = extractUuidFromAssetSrc(`asset://${uuid}`);
    expect(result).toBe(uuid);
  });

  it("应该从非 asset:// 协议返回 null", () => {
    expect(extractUuidFromAssetSrc("local://file")).toBeNull();
    expect(extractUuidFromAssetSrc("https://example.com")).toBeNull();
  });

  it("应该从无效格式返回 null", () => {
    expect(extractUuidFromAssetSrc("asset://invalid")).toBeNull();
  });
});
