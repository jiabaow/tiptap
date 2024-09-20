import React, {useEffect, useRef, useState} from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY!,
    dangerouslyAllowBrowser: true
});

interface AIComponentProps {
    node: {
        attrs: {
            question: string;
            answer: string;
            mode: 'edit' | 'view';
        };
    };
    updateAttributes: (attributes: { question?: string; answer?: string }) => void;
}

const AIComponent: React.FC<AIComponentProps> = ({ node, updateAttributes }) => {
    const { question, answer, mode } = node.attrs;
    const [input, setInput] = useState(question);
    const [response, setResponse] = useState(answer);

    const questionTextareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = (el: HTMLTextAreaElement | null) => {
        if (el) {
            el.style.height = 'auto';
            el.style.height = `${el.scrollHeight}px`;
        }
    }

    useEffect(() => {
        adjustHeight(questionTextareaRef.current);
    }, [input]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
        adjustHeight(e.target);
        updateAttributes({ question: e.target.value });
    };

    const getAnswer = async () => {
        try {
            const completion = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    { role: 'user', content: input },
                ],
            });

            const result = completion?.choices?.[0]?.message?.content?.trim() ?? 'No response received';
            setResponse(result);
            updateAttributes({ question: input, answer: result });
        } catch (error) {
            console.error('Error fetching AI response:', error);
            setResponse('Error: Unable to fetch response');
        }
    };

    return (
        <NodeViewWrapper className="ai">
            {mode === 'edit' ? (
                <div>
                    <textarea
                        ref={questionTextareaRef}
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Ask a question..."
                        style={{width: '100%', resize: 'none', overflow: 'hidden', minHeight: '2em'}}
                    />
                    <button onClick={getAnswer}>Get Answer</button>
                    <div className="answer"> Answer: {response}</div>
                </div>
            ) : (
                <div>
                    <div className="question">Question: {question}</div>
                    <div className="answer">Answer: {answer}</div>
                </div>
            )}
            <NodeViewContent/>
        </NodeViewWrapper>
    );
};

export default AIComponent;
