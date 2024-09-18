import { Node, mergeAttributes, textblockTypeInputRule } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import MCQComponent from './MCQComponent';

//https://bookdown.org/yihui/rmarkdown/learnr-quiz.html

interface Answer {
    text: string;
    correct: boolean;
}

export interface MCQOptions {
    HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        mcq: {
            /**
             * Set an MCQ (Multiple Choice Question)
             */
            setMCQ: (options: { questionText: string; answers: Answer[] }) => ReturnType;
        }
    }
}
const MCQ_REGEX = /{r \[^\n]+, echo=FALSE\}\nquestion\("([^"]+)"\s*,\s*((?:answer\("([^"]+)",?\s*(correct\s*=\s*TRUE)?\s*\)[,\s]*)*)\)\n/;

export const MCQ = Node.create<MCQOptions>({
    name: 'mcq',

    group: 'block',

    content: 'inline*',

    selectable: true,

    addOptions() {
        return {
            HTMLAttributes: {},
        };
    },

    addAttributes() {
        return {
            questionText: {
                default: 'Your question?',
                parseHTML: element => element.getAttribute('data-question-text'),
                renderHTML: attributes => {
                    return {
                        'data-question-text': attributes.questionText,
                    };
                },
            },
            answers: {
                default: [] as Answer[],
                parseHTML: element => JSON.parse(element.getAttribute('data-answers') || '[]'),
                renderHTML: attributes => {
                    return {
                        'data-answers': JSON.stringify(attributes.answers),
                    };
                },
            },
            mode: {
                default: 'author',
            },
        };
    },

    parseHTML() {
        return [{ tag: 'div[data-type="mcq"]' }];
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { 'data-type': 'mcq' }), 0];
    },

    addNodeView() {
        return ReactNodeViewRenderer(MCQComponent);
    },

    addCommands() {
        return {
            setMCQ:
                (options: { questionText: string; answers: Answer[] }) =>
                    ({ commands }) => {
                        return commands.insertContent({
                            type: this.name,
                            attrs: options,
                        });
                    },
        };
    },

    addInputRules() {
        return [
            textblockTypeInputRule({
                find: MCQ_REGEX,
                type: this.type,
                getAttributes: match => {
                    const [fullMatch, questionText, answersBlock] = match;
                    const answers = Array.from(answersBlock.matchAll(/answer\("([^"]+)",?\s*correct\s*=\s*TRUE?\)/g)).map((match) => {
                        return {
                            text: match[1],
                            correct: match[4] !== undefined
                        };
                    });
                    return { questionText, answers };
                },
            }),
        ];
    },
});
