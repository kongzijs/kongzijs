import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import LessonBuilder from "../LessonBuilder";
import { FLFTransformer } from "@kongzijs/flf-core";

// Mock crypto for UUID generation
Object.defineProperty(global, "crypto", {
    value: {
        randomUUID: () =>
            "test-uuid-" + Math.random().toString(36).substring(7),
    },
});

// Mock dependencies
vi.mock("@borgtj/react", () => ({
    Button: ({ children, onClick, title, ...props }: any) => (
        <button onClick={onClick} title={title} {...props}>
            {children}
        </button>
    ),
    Input: ({ value, onChange, placeholder, className, ...props }: any) => (
        <input
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={className}
            {...props}
        />
    ),
    Textarea: ({ value, onChange, ...props }: any) => (
        <textarea value={value} onChange={onChange} {...props} />
    ),
    Label: ({ children, ...props }: any) => (
        <label {...props}>{children}</label>
    ),
    Separator: () => <div data-testid="separator" />,
}));

vi.mock("@borgtj/react", () => ({
    Separator: () => <div data-testid="separator" />,
    // Mocking other used components to simple divs to avoid rendering issues
    Card: ({ children }: any) => <div>{children}</div>,
    CardHeader: ({ children }: any) => <div>{children}</div>,
    CardTitle: ({ children }: any) => <div>{children}</div>,
    CardDescription: ({ children }: any) => <div>{children}</div>,
    CardContent: ({ children }: any) => <div>{children}</div>,
    ScrollArea: ({ children }: any) => <div>{children}</div>,
    Select: ({ children, value, onValueChange }: any) => (
        <div
            data-testid="select"
            data-value={value}
            onClick={() => onValueChange && onValueChange(value)}
        >
            {children}
        </div>
    ),
    SelectTrigger: ({ children }: any) => <div>{children}</div>,
    SelectValue: ({ placeholder }: any) => <span>{placeholder}</span>,
    SelectContent: ({ children }: any) => <div>{children}</div>,
    SelectItem: ({ children, value }: any) => (
        <div data-value={value}>{children}</div>
    ),
    Settings2: () => <span>SettingsIcon</span>,
    BookOpen: () => <span>BookIcon</span>,
    Zap: () => <span>ZapIcon</span>,
    Trash2: () => <span>TrashIcon</span>,
    ArrowUp: () => <span>UpIcon</span>,
    ArrowDown: () => <span>DownIcon</span>,
    FileText: () => <span>FileIcon</span>,
    Save: () => <span>SaveIcon</span>,
}));

// Mock Lucide icons that are imported directly
vi.mock("lucide-react", () => ({
    Save: () => <span>SaveIcon</span>,
    BookOpen: () => <span>BookIcon</span>,
    Zap: () => <span>ZapIcon</span>,
    Trash2: () => <span>TrashIcon</span>,
    ArrowUp: () => <span>UpIcon</span>,
    ArrowDown: () => <span>DownIcon</span>,
    FileText: () => <span>FileIcon</span>,
    Settings2: () => <span>SettingsIcon</span>,
    Target: () => <span>TargetIcon</span>,
}));

vi.mock("sonner", () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

vi.mock("@xyflow/react", () => ({
    // We don't need real ReactFlow for this test as we test the "2-pane" view which relies on internal state
    // but the component might still render some RF types or logic.
    // However, LessonBuilder uses standard HTML/Tailwind for the layout now (per code view).
    // It imports Node/Edge types but doesn't seem to render <ReactFlow> component in the code I saw?
    // Let me re-check the code...
    // Line 29 imports Node, Edge.
    // The return statement (lines 391+) renders standard divs.
    // It seems RFC 0024 removed the Canvas.
    // So masking @xyflow/react types is enough.
}));

// Mock FLF Core
vi.mock("@kongzijs/flf-core", () => ({
    FLFTransformer: {
        toReactFlow: vi.fn().mockReturnValue({ nodes: [], edges: [] }),
        toQuizDSL: vi.fn().mockReturnValue({
            quiz: {
                id: "quiz-1",
                title: "Quiz",
                questions: [],
            },
        }),
        // Key: Return questions WITHOUT description to test the workaround recovery
        fromQuizDSL: vi.fn().mockImplementation((dsl) => {
            return dsl.quiz.questions.map((q: any) => ({
                id: q.id,
                text: q.text,
                type: q.type,
                options: q.options,
                // description intentionally missing/empty to simulate core library issue
                description: "",
            }));
        }),
        fromReactFlow: vi.fn().mockImplementation((id, settings, nodes) => {
            // Mock implementation to return a manifest-like object based on nodes
            return {
                id,
                settings,
                type: "lesson",
                nodes: nodes.map((n: any) => ({
                    id: n.id,
                    ...n.data,
                })), // Simplified
            };
        }),
    },
}));

// Mock QuizEditor
const mockSave = vi.fn();
const mockGetEditorInstance = vi.fn(() => ({
    save: mockSave,
    load: vi.fn().mockResolvedValue(undefined), // Add load mock
}));

vi.mock("@quizerjs/react", () => ({
    QuizEditor: React.forwardRef((props: any, ref: any) => {
        React.useImperativeHandle(ref, () => ({
            getEditorInstance: mockGetEditorInstance,
        }));

        return (
            <div data-testid="quiz-editor">
                QuizEditor Mock
                <button
                    data-testid="trigger-change"
                    onClick={() =>
                        props.onChange &&
                        props.onChange({
                            quiz: {
                                id: "quiz-changed",
                                questions: [
                                    {
                                        id: "q1",
                                        text: "Question 1",
                                        type: "multiple_choice",
                                        options: [],
                                    },
                                ],
                            },
                        })
                    }
                >
                    Trigger Change
                </button>
            </div>
        );
    }),
}));

describe("LessonBuilder Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders the component", () => {
        render(
            <LessonBuilder
                lessonId={1}
                onSave={vi.fn()}
                initialManifest={undefined}
            />,
        );
        expect(screen.getByText("Lesson Structure")).toBeInTheDocument();
    });

    it("adds a new test chapter and activates it", async () => {
        render(<LessonBuilder lessonId={1} onSave={vi.fn()} />);

        const addTestBtn = screen.getByTitle("Add Test Chapter");
        fireEvent.click(addTestBtn);

        expect(screen.getByTestId("quiz-editor")).toBeInTheDocument();
        expect(
            screen.getByPlaceholderText("未命名章节 (Enter title...)"),
        ).toBeInTheDocument();
    });

    it("recovers description from raw Editor.js data (RFC 0031) on save", async () => {
        // Setup raw data return with description
        mockSave.mockResolvedValue({
            blocks: [
                {
                    type: "quiz-single-choice",
                    data: {
                        question: {
                            id: "q1",
                            text: "Question 1",
                            description: "Recovered Description",
                            type: "multiple_choice",
                            options: [],
                        },
                    },
                },
            ],
        });

        const onSaveMock = vi.fn().mockResolvedValue({ success: true });

        render(<LessonBuilder lessonId={1} onSave={onSaveMock} />);

        // 1. Add Test Node
        const addTestBtn = screen.getByTitle("Add Test Chapter");
        fireEvent.click(addTestBtn);

        // 2. Trigger Change
        // This simulates the QuizEditor emitting a change, which triggers the handleQuizChange callback
        const triggerBtn = screen.getByTestId("trigger-change");
        fireEvent.click(triggerBtn);

        // Wait via expectation for the side effect (mockSave called)
        await waitFor(() => expect(mockSave).toHaveBeenCalled());

        // 3. Save Lesson
        const saveBtn = screen.getByText("保存 (Save)");
        fireEvent.click(saveBtn);

        // 4. VerifyFLFTransformer fromReactFlow called with correct data
        await waitFor(() => expect(onSaveMock).toHaveBeenCalled());

        const transformerMock = FLFTransformer.fromReactFlow as any;
        expect(transformerMock).toHaveBeenCalled();

        // Inspect the nodes passed to the transformer
        const lastCall =
            transformerMock.mock.calls[transformerMock.mock.calls.length - 1];
        const nodesArg = lastCall[2]; // 3rd arg is nodes
        const testNode = nodesArg.find((n: any) => n.type === "testNode");

        expect(testNode).toBeDefined();
        // The main goal: verify description is present despite fromQuizDSL stripping it
        expect(testNode.data.questions[0].description).toBe(
            "Recovered Description",
        );
    });
});
