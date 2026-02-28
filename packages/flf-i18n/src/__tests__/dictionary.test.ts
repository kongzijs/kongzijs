import { describe, it, expect } from "vitest";
import { enUS } from "../locales/en";
import { zhCN } from "../locales/zh";

describe("FLF i18n dictionaries", () => {
    it("enUS has required editor keys including sessionPersistenceDesc", () => {
        expect(enUS.editor.sessionPersistenceDesc).toBe(
            "This node triggers session persistence."
        );
        expect(enUS.editor.lessonConfig).toBe("Lesson Configuration");
    });

    it("zhCN has required editor keys including sessionPersistenceDesc", () => {
        expect(zhCN.editor.sessionPersistenceDesc).toBe("此节点会触发会话持久化。");
        expect(zhCN.editor.lessonConfig).toBe("课程配置");
    });
});
