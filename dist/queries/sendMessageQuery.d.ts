export type MessageRequest = {
    chatflowid: string;
    apiHost?: string;
    body?: any;
};
export declare const sendMessageQuery: ({ chatflowid, apiHost, body }: MessageRequest) => Promise<{
    data?: any;
    error?: Error | undefined;
}>;
export declare const isStreamAvailableQuery: ({ chatflowid, apiHost }: MessageRequest) => Promise<{
    data?: any;
    error?: Error | undefined;
}>;
//# sourceMappingURL=sendMessageQuery.d.ts.map