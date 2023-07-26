type Props = {
    placeholder?: string;
    backgroundColor?: string;
    textColor?: string;
    sendButtonColor?: string;
    userInput?: string;
    setUserInput: (value: string) => void;
    onSubmit: (value: string) => void;
    fileList?: string[];
    setFileList: (value: string[]) => void;
    filenameList?: string[];
    setFilenameList: (value: string[]) => void;
    setLanguage: (value: string) => void;
};
export declare const TextInput: (props: Props) => import("solid-js").JSX.Element;
export {};
//# sourceMappingURL=TextInput.d.ts.map