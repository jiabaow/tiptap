import {Node, mergeAttributes, textblockTypeInputRule} from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import AIComponent from './AIComponent';

export interface AIOptions {
    HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        ai: {
            /**
             * Set an AI block from AI
             */
            setAI: (options: { question: string; answer: string }) => ReturnType;
        }
    }
}

const AI_SHORTCUT_REGEX = /^\?\/$/; // ?/ opens an AI block

export const AINode = Node.create<AIOptions>({
    name: 'ai',

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
            question: {
                default: 'Ask me anything...',
                parseHTML: element => element.getAttribute('data-question'),
                renderHTML: attributes => ({
                    'data-question': attributes.question,
                }),
            },
            answer: {
                default: '',
                parseHTML: element => element.getAttribute('data-answer'),
                renderHTML: attributes => ({
                    'data-answer': attributes.answer,
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
        return [{ tag: 'div[data-type="ai"]' }];
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { 'data-type': 'ai' }), 0];
    },

    addNodeView() {
        return ReactNodeViewRenderer(AIComponent);
    },

    addCommands() {
        return {
            setAI:
                (options: { question: string; answer: string }) =>
                    ({ commands }) => commands.insertContent({
                        type: this.name,
                        attrs: options,
                    }),
        };
    },

    addInputRules() {
        return [
            textblockTypeInputRule({
                find: AI_SHORTCUT_REGEX,
                type: this.type,
                getAttributes: () => ({
                    question: 'Ask me anything...',
                    answer: '',
                    mode: 'edit'
                }),
            }),
        ];
    },
});
