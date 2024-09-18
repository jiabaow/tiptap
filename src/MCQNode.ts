import { Node, mergeAttributes, textblockTypeInputRule } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import MCQComponent from './MCQComponent';

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

const MCQ_REGEX = /\{r [^\n]+, echo=FALSE\}\nquestion\("([^"]+)"(?:,\s*((?:\n?\s*answer\("([^"]+)"(?:,\s*correct\s*=\s*TRUE)?\))+))?\)/;
const MCQ_SHORTCUT_REGEX = /^\?{3}\s*$/; // ??? opens a MCQ block

function parseMarkdownMCQ(match: RegExpMatchArray) {
    const [fullMatch, questionText, answersBlock = ''] = match;
    const answerRegex = /answer\("([^"]+)"(?:,\s*correct\s*=\s*TRUE)?\)/g;

    const answers: Answer[] = [];
    let answerMatch;
    while ((answerMatch = answerRegex.exec(answersBlock)) !== null) {
        answers.push({ text: answerMatch[1], correct: !!answerMatch[2] });
    }

    return { questionText, answers };
}

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
                renderHTML: attributes => ({
                    'data-question-text': attributes.questionText,
                }),
            },
            answers: {
                default: [] as Answer[],
                parseHTML: element => JSON.parse(element.getAttribute('data-answers') || '[]'),
                renderHTML: attributes => ({
                    'data-answers': JSON.stringify(attributes.answers),
                }),
            },
            mode: {
                default: 'edit',
                parseHTML: element => element.getAttribute('data-mode'),
                renderHTML: attributes => ({
                    'data-mode': attributes.mode,
                }),
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
                    ({ commands }) => commands.insertContent({
                        type: this.name,
                        attrs: options,
                    }),
        };
    },

    addInputRules() {
        return [
            textblockTypeInputRule({
                find: MCQ_SHORTCUT_REGEX,
                type: this.type,
                getAttributes: () => ({
                    questionText: 'What number is the letter A in the English alphabet?',
                    answers: [
                        { text: '8', correct: false },
                        { text: '14', correct: false },
                        { text: '1', correct: true },
                        { text: '23', correct: false },
                    ],
                    mode: 'edit'
                }),
            }),
            textblockTypeInputRule({
                find: MCQ_REGEX,
                type: this.type,
                getAttributes: match => parseMarkdownMCQ(match),
            }),
        ];
    },
});
