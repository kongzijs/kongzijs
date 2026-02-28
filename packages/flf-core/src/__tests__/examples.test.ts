/**
 * 示例数据生成器测试
 */

import { describe, it, expect } from "vitest";
import {
    createExampleFLF,
    createMinimalFLF,
    createComplexFLF,
    createEditorStateFLF,
} from "../examples";
import { validateFLFManifest } from "../validator";

describe("示例数据生成器", () => {
    it("createExampleFLF 应该生成有效的 FLF", () => {
        const manifest = createExampleFLF();
        const result = validateFLFManifest(manifest);
        expect(result.valid).toBe(true);
        expect(manifest.flow_nodes.length).toBeGreaterThan(0);
        expect(manifest.flow_edges.length).toBeGreaterThan(0);
    });

    it("createMinimalFLF 应该生成有效的 FLF", () => {
        const manifest = createMinimalFLF("L-MIN-001");
        const result = validateFLFManifest(manifest);
        expect(result.valid).toBe(true);
        expect(manifest.lesson_id).toBe("L-MIN-001");
        expect(manifest.flow_nodes).toHaveLength(0);
    });

    it("createComplexFLF 应该生成有效的复杂 FLF", () => {
        const manifest = createComplexFLF();
        const result = validateFLFManifest(manifest);
        expect(result.valid).toBe(true);
        expect(manifest.flow_nodes.length).toBeGreaterThan(2);
        expect(manifest.assets_manifest.length).toBeGreaterThan(2);
    });

    it("createEditorStateFLF 应该生成包含 blob:// 协议的 FLF", () => {
        const manifest = createEditorStateFLF();
        const result = validateFLFManifest(manifest);
        expect(result.valid).toBe(true);
        expect(
            manifest.assets_manifest.some((a) => a.src.startsWith("blob://")),
        ).toBe(true);
    });

    it("所有示例应该包含必需的字段", () => {
        const examples = [
            createExampleFLF(),
            createMinimalFLF("L-TEST"),
            createComplexFLF(),
            createEditorStateFLF(),
        ];

        examples.forEach((manifest) => {
            expect(manifest.flf_version).toBe("1.0");
            expect(manifest.lesson_id).toBeTruthy();
            expect(manifest.settings).toBeDefined();
            expect(Array.isArray(manifest.assets_manifest)).toBe(true);
            expect(Array.isArray(manifest.flow_nodes)).toBe(true);
            expect(Array.isArray(manifest.flow_edges)).toBe(true);
        });
    });
});
