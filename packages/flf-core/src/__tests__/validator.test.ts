/**
 * FLF 验证器测试
 */

import { describe, it, expect } from "vitest";
import { validateFLFManifest } from "../validator";
import {
  createExampleFLF,
  createMinimalFLF,
  createComplexFLF,
} from "../examples";

describe("validateFLFManifest", () => {
  it("应该验证有效的示例 FLF", () => {
    const manifest = createExampleFLF();
    const result = validateFLFManifest(manifest);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("应该验证最小化的 FLF", () => {
    const manifest = createMinimalFLF("L-001");
    const result = validateFLFManifest(manifest);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("应该验证复杂的 FLF", () => {
    const manifest = createComplexFLF();
    const result = validateFLFManifest(manifest);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("应该拒绝非对象", () => {
    const result = validateFLFManifest(null);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("应该拒绝无效的 flf_version", () => {
    const manifest = createExampleFLF();
    manifest.flf_version = "2.0" as any;
    const result = validateFLFManifest(manifest);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === "flf_version")).toBe(true);
  });

  it("应该拒绝缺失的 lesson_id", () => {
    const manifest = createExampleFLF();
    delete (manifest as any).lesson_id;
    const result = validateFLFManifest(manifest);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === "lesson_id")).toBe(true);
  });

  it("应该拒绝无效的 settings", () => {
    const manifest = createExampleFLF();
    manifest.settings = null as any;
    const result = validateFLFManifest(manifest);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === "settings")).toBe(true);
  });

  it("应该拒绝无效的 level_required", () => {
    const manifest = createExampleFLF();
    manifest.settings.level_required = -1;
    const result = validateFLFManifest(manifest);
    expect(result.valid).toBe(false);
    expect(
      result.errors.some((e) => e.field === "settings.level_required")
    ).toBe(true);
  });

  it("应该拒绝无效的 access_control", () => {
    const manifest = createExampleFLF();
    manifest.settings.access_control = "invalid" as any;
    const result = validateFLFManifest(manifest);
    expect(result.valid).toBe(false);
    expect(
      result.errors.some((e) => e.field === "settings.access_control")
    ).toBe(true);
  });

  it("应该拒绝重复的 asset id", () => {
    const manifest = createExampleFLF();
    manifest.assets_manifest.push({
      id: manifest.assets_manifest[0].id,
      type: "video",
      src: "https://example.com/other.mp4",
    });
    const result = validateFLFManifest(manifest);
    expect(result.valid).toBe(false);
    expect(
      result.errors.some((e) => e.message.includes("Duplicate asset id"))
    ).toBe(true);
  });

  it("应该拒绝无效的 asset type", () => {
    const manifest = createExampleFLF();
    manifest.assets_manifest[0].type = "invalid" as any;
    const result = validateFLFManifest(manifest);
    expect(result.valid).toBe(false);
    expect(
      result.errors.some((e) => e.field.includes("type"))
    ).toBe(true);
  });

  it("应该拒绝无效的 asset src", () => {
    const manifest = createExampleFLF();
    manifest.assets_manifest[0].src = "";
    const result = validateFLFManifest(manifest);
    expect(result.valid).toBe(false);
    expect(
      result.errors.some((e) => e.field.includes("src"))
    ).toBe(true);
  });

  it("应该拒绝重复的 node id", () => {
    const manifest = createExampleFLF();
    manifest.flow_nodes.push({
      ...manifest.flow_nodes[0],
      id: manifest.flow_nodes[0].id,
    });
    const result = validateFLFManifest(manifest);
    expect(result.valid).toBe(false);
    expect(
      result.errors.some((e) => e.message.includes("Duplicate node id"))
    ).toBe(true);
  });

  it("应该拒绝无效的 node type", () => {
    const manifest = createExampleFLF();
    manifest.flow_nodes[0].type = "invalid" as any;
    const result = validateFLFManifest(manifest);
    expect(result.valid).toBe(false);
    expect(
      result.errors.some((e) => e.field.includes("type"))
    ).toBe(true);
  });

  it("应该拒绝无效的 passing_score", () => {
    const manifest = createExampleFLF();
    const testNode = manifest.flow_nodes.find((n) => n.type === "test");
    if (testNode && testNode.rules) {
      testNode.rules.passing_score = 1.5; // 超出范围
    }
    const result = validateFLFManifest(manifest);
    expect(result.valid).toBe(false);
    expect(
      result.errors.some((e) => e.field.includes("passing_score"))
    ).toBe(true);
  });

  it("应该拒绝引用不存在节点的 edge", () => {
    const manifest = createExampleFLF();
    manifest.flow_edges.push({
      id: "invalid_edge",
      source: "non_existent_node",
      target: manifest.flow_nodes[0].id,
    });
    const result = validateFLFManifest(manifest);
    expect(result.valid).toBe(false);
    expect(
      result.errors.some((e) =>
        e.message.includes("does not exist in flow_nodes")
      )
    ).toBe(true);
  });

  it("应该拒绝无效的 edge condition", () => {
    const manifest = createExampleFLF();
    manifest.flow_edges[0].condition = "invalid" as any;
    const result = validateFLFManifest(manifest);
    expect(result.valid).toBe(false);
    expect(
      result.errors.some((e) => e.field.includes("condition"))
    ).toBe(true);
  });
});
