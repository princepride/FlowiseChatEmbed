type BotProps = {
    chatflowid: string;
    apiHost?: string;
};
export declare const init: (props: BotProps) => void;
type Chatbot = {
    init: typeof init;
};
export declare const parseChatbot: () => {
    init: (props: BotProps) => void;
};
export declare const injectChatbotInWindow: (bot: Chatbot) => void;
export {};
//# sourceMappingURL=window.d.ts.map