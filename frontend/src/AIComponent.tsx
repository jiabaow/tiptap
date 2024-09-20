import React, { useState } from 'react';
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

    const getAnswer = async () => {
        try {
            const completion = await openai.chat.completions.create({
                model: 'gpt-4o-mini', // Use the correct model name
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
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a question..."
                        onBlur={() => updateAttributes({ question: input })}
                    />
                    <button onClick={getAnswer}>Get Answer</button>
                    <div className="answer">{response}</div>
                </div>
            ) : (
                <div>
                    <div className="question">Question: {question}</div>
                    <div className="answer">Answer: {answer}</div>
                </div>
            )}
            <NodeViewContent />
        </NodeViewWrapper>
    );
};

export default AIComponent;
