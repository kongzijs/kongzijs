import { useState } from "react";
import { LessonBuilder } from "@kongzijs/lesson-builder";
import {
  FLFManifest,
  createExampleFLF,
  createMinimalFLF,
  createComplexFLF,
  createEditorStateFLF,
  validateFLFManifest,
} from "@kongzijs/flf-core";
import { Toaster, toast } from "sonner";
import "./App.css";

// 示例数据选项
const EXAMPLE_OPTIONS = [
  { name: "Simple Example", value: "simple", fn: createExampleFLF },
  { name: "Minimal Example", value: "minimal", fn: () => createMinimalFLF("L-DEMO-001") },
  { name: "Complex Example", value: "complex", fn: createComplexFLF },
  { name: "Editor State", value: "editor", fn: createEditorStateFLF },
] as const;

function App() {
  const [lessonId] = useState(1);
  const [exampleType, setExampleType] = useState<typeof EXAMPLE_OPTIONS[number]["value"]>("simple");
  const [initialManifest, setInitialManifest] = useState<FLFManifest | undefined>(() => {
    // 使用简单示例作为初始值
    return createExampleFLF();
  });

  const handleExampleChange = (type: typeof EXAMPLE_OPTIONS[number]["value"]) => {
    const option = EXAMPLE_OPTIONS.find((opt) => opt.value === type);
    if (option) {
      const newManifest = option.fn();
      setInitialManifest(newManifest);
      setExampleType(type);
      toast.success(`Loaded ${option.name}`, {
        description: `Loaded ${newManifest.flow_nodes.length} nodes`,
      });
    }
  };

  const handleSave = async (
    lessonId: number,
    manifest: FLFManifest
  ): Promise<{ success: boolean; versionId?: string }> => {
    try {
      // 验证 FLF 清单
      const validation = validateFLFManifest(manifest);
      
      if (!validation.valid) {
        console.error("FLF 验证失败:", validation.errors);
        toast.error("FLF 验证失败", {
          description: validation.errors.map(e => `${e.field}: ${e.message}`).join(", "),
        });
        return { success: false };
      }

      // 模拟保存到服务器
      console.log("保存课程:", lessonId, manifest);
      
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const versionId = `v-${Date.now()}`;
      toast.success("课程保存成功", {
        description: `版本 ID: ${versionId}`,
      });
      
      return { success: true, versionId };
    } catch (error) {
      console.error("保存失败:", error);
      toast.error("保存失败", {
        description: error instanceof Error ? error.message : "未知错误",
      });
      return { success: false };
    }
  };

  return (
    <div className="app">
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '0.75rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          },
        }}
      />
      <header className="app-header">
        <div>
          <h1>FLF Lesson Builder</h1>
          <p>课程 ID: {lessonId}</p>
        </div>
        <div className="example-selector">
          <span className="example-label">示例数据</span>
          <div className="example-buttons">
            {EXAMPLE_OPTIONS.map((option) => (
              <button
                key={option.value}
                className={`example-button ${exampleType === option.value ? 'active' : ''}`}
                onClick={() => handleExampleChange(option.value)}
              >
                {option.name}
              </button>
            ))}
          </div>
        </div>
      </header>
      <main className="app-main">
        <LessonBuilder
          key={exampleType}
          initialManifest={initialManifest}
          lessonId={lessonId}
          onSave={handleSave}
        />
      </main>
    </div>
  );
}

export default App;
