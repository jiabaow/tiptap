import React, { useState } from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';

interface Answer {
    text: string;
    correct: boolean;
}

interface MCQComponentProps {
    node: {
        attrs: {
            questionText: string;
            answers: Answer[];
            mode: 'edit' | 'view';
        };
    };
    updateAttributes: (attributes: any) => void;
    extension: any;
}

const MCQComponent: React.FC<MCQComponentProps> = ({ node, updateAttributes }) => {
    const { questionText, answers, mode } = node.attrs;
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

    const handleAnswerChange = (index: number) => {
        setSelectedAnswer(answers[index].text);
    };

    const handleQuestionTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateAttributes({ questionText: e.target.value });
    };

    const handleAnswerTextChange = (index: number, text: string) => {
        const newAnswers = answers.map((answer, i) => {
            if (i === index) {
                return { ...answer, text };
            }
            return answer;
        });
        updateAttributes({ answers: newAnswers });
    };

    const handleAnswerCorrectChange = (index: number, correct: boolean) => {
        const newAnswers = answers.map((answer, i) => {
            if (i === index) {
                return { ...answer, correct };
            }
            return answer;
        });
        updateAttributes({ answers: newAnswers });
    };

    const addAnswer = () => {
        const newAnswers = [...answers, { text: '', correct: false }];
        updateAttributes({ answers: newAnswers });
    };

    const removeAnswer = (index: number) => {
        const newAnswers = answers.filter((_, i) => i !== index);
        updateAttributes({ answers: newAnswers });
    };

    return (
        <NodeViewWrapper className="mcq-node">
            {mode === 'edit' ? (
                <div className="mcq-edit">
                    <input
                        type="text"
                        value={questionText}
                        onChange={handleQuestionTextChange}
                        placeholder="Question"
                    />
                    {answers.map((answer, index) => (
                        <div key={index}>
                            <input
                                type="text"
                                value={answer.text}
                                onChange={(e) => handleAnswerTextChange(index, e.target.value)}
                                placeholder={`Answer ${index + 1}`}
                            />
                            <input
                                type="checkbox"
                                checked={answer.correct}
                                onChange={(e) => handleAnswerCorrectChange(index, e.target.checked)}
                            />
                            <button onClick={() => removeAnswer(index)}>
                                Remove
                            </button>
                        </div>
                    ))}
                    <button onClick={addAnswer}>
                        Add Answer
                    </button>
                </div>
            ) : (
                <div className="mcq-view">
                    <p>{questionText}</p>
                    {answers.map((answer, index) => (
                        <div key={index}>
                            <input
                                type="radio"
                                name="mcq"
                                value={answer.text}
                                checked={selectedAnswer === answer.text}
                                onChange={() => handleAnswerChange(index)}
                                disabled={mode !== 'view'}
                            />
                            <label>{answer.text}</label>
                        </div>
                    ))}
                </div>
            )}
            <NodeViewContent/>
        </NodeViewWrapper>
    );
};

export default MCQComponent;
