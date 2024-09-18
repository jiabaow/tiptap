import React, {useEffect, useRef, useState} from 'react';
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
}

const MCQComponent: React.FC<MCQComponentProps> = ({ node, updateAttributes }) => {
    const { questionText, answers, mode } = node.attrs;
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState<boolean>(false);

    const questionTextareaRef = useRef<HTMLTextAreaElement>(null);
    const answerTextareaRefs = useRef<Array<HTMLTextAreaElement | null>>([]);

    const adjustHeight = (el: HTMLTextAreaElement | null) => {
        if (el) {
            el.style.height = 'auto';
            el.style.height = `${el.scrollHeight}px`;
        }
    }

    useEffect(() => {
        adjustHeight(questionTextareaRef.current);
    }, [questionText]);

    useEffect(() => {
        answers.forEach((_, index) => adjustHeight(answerTextareaRefs.current[index]));
    }, [answers]);

    const handleAnswerChange = (index: number) => {
        setSelectedAnswer(answers[index].text);
    };

    const handleQuestionTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        updateAttributes({ questionText: e.target.value });
        adjustHeight(e.target);
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

    const handleAnswerTextAreaChange = (index: number, e: React.ChangeEvent<HTMLTextAreaElement>) => {
        handleAnswerTextChange(index, e.target.value);
        adjustHeight(e.target);
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

    const handleSubmit = () => {
        setSubmitted(true);
    }

    const isSelectedAnswerCorrect = () => {
        const answer = answers.find(answer => answer.text === selectedAnswer);
        return answer?.correct;
    };

    return (
        <NodeViewWrapper className="mcq-node">
            {mode === 'edit' ? (
                <div className="mcq-edit">
                    <textarea
                        ref={questionTextareaRef}
                        value={questionText}
                        onChange={handleQuestionTextChange}
                        placeholder="Question"
                        style={{width: '100%', resize: 'none', overflow: 'hidden'}}
                    />
                    {answers.map((answer, index) => (
                        <div key={index}>
                            <textarea
                                ref={(el) => answerTextareaRefs.current[index] = el}
                                value={answer.text}
                                onChange={(e) => handleAnswerTextAreaChange(index, e)}
                                placeholder={`Answer ${index + 1}`}
                                style={{width: '75%', resize: 'none', overflow: 'hidden'}}
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
                                disabled={submitted}
                            />
                            <label style={{ marginLeft: 8 }}>{answer.text}</label>
                            {submitted && selectedAnswer === answer.text && (
                                <span
                                    style={{
                                        marginLeft: 8,
                                        color: isSelectedAnswerCorrect() ? 'green' : 'red',
                                    }}
                                >
                                  {isSelectedAnswerCorrect() ? 'Correct' : 'Incorrect'}
                                </span>
                            )}
                        </div>
                    ))}
                    {!submitted && (
                        <button type="button" onClick={handleSubmit}>Submit</button>
                    )}
                </div>
            )}
            <NodeViewContent/>
        </NodeViewWrapper>
    );
};

export default MCQComponent;
