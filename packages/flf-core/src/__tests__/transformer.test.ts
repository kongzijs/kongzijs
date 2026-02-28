import { describe, it, expect } from "vitest";
import { FLFTransformer } from "../transformer";

describe("FLFTransformer", () => {
    describe("toQuizDSL", () => {
        it("should convert FLF questions to QuizDSL with options", () => {
            const questions = [
                {
                    id: "q1",
                    type: "multiple_choice",
                    text: "Question 1",
                    points: 1,
                    options: [
                        { id: "o1", text: "Option 1", is_correct: true },
                        { id: "o2", text: "Option 2", is_correct: false },
                    ],
                },
            ];
            const options = { id: "quiz-123", title: "My Quiz" };

            const result = FLFTransformer.toQuizDSL(questions, options);

            expect(result.version).toBe("1.0");
            expect(result.quiz.id).toBe("quiz-123");
            expect(result.quiz.title).toBe("My Quiz");
            expect(result.quiz.questions).toHaveLength(1);
            expect(result.quiz.questions[0].id).toBe("q1");
            expect(result.quiz.questions[0].options[0].isCorrect).toBe(true);
        });

        it("should handle empty questions array", () => {
            const result = FLFTransformer.toQuizDSL([], {
                id: "quiz-empty",
                title: "Empty Quiz",
            });

            expect(result.quiz.questions).toHaveLength(0);
        });
    });

    describe("fromQuizDSL", () => {
        it("should convert QuizDSL back to FLF questions", () => {
            const dsl = {
                version: "1.0",
                quiz: {
                    id: "quiz-1",
                    title: "Quiz",
                    questions: [
                        {
                            id: "q1",
                            type: "multiple_choice",
                            text: "Question 1",
                            points: 1,
                            options: [
                                { id: "o1", text: "Option 1", isCorrect: true },
                                {
                                    id: "o2",
                                    text: "Option 2",
                                    isCorrect: false,
                                },
                            ],
                        },
                    ],
                },
            };

            const result = FLFTransformer.fromQuizDSL(dsl);

            expect(result).toHaveLength(1);
            expect(result[0].id).toBe("q1");
            expect(result[0].options[0].is_correct).toBe(true);
        });

        it("should handle nested sections in DSL (new format)", () => {
            const dsl = {
                version: "1.0",
                quiz: {
                    id: "quiz-sections",
                    title: "Section Quiz",
                    sections: [
                        {
                            title: "Section 1",
                            questions: [
                                {
                                    id: "q1",
                                    type: "text",
                                    text: "Q1",
                                    points: 1,
                                },
                            ],
                        },
                        {
                            title: "Section 2",
                            questions: [
                                {
                                    id: "q2",
                                    type: "text",
                                    text: "Q2",
                                    points: 1,
                                },
                            ],
                        },
                    ],
                },
            };

            const result = FLFTransformer.fromQuizDSL(dsl);

            expect(result).toHaveLength(2);
            expect(result[0].id).toBe("q1");
            expect(result[1].id).toBe("q2");
        });
    });
});
