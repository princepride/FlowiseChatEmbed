//import { createSignal } from 'solid-js';

//const buttonStyle = {
//    fontSize: '1rem', // 或者你想要的字体大小
//    padding: '0.25rem 0.5rem', // 垂直和水平填充以适应文本大小
//    boxShadow: '0px 2px 5px 0px rgba(0,0,0,0.1)', // 阴影效果
//    borderRadius: '5px', // 圆角矩形
//}

//type Props = {
//    filename: string;
//    filePath: string;
//    removeFile: () => void;
//}

//export const FileButton = (props: Props) => {
//    const [showPreview, setShowPreview] = createSignal(false);

//    return (
//        <>
//            <button 
//                onClick={() => setShowPreview(true)}
//                class="p-2 h-8 w-auto text-lg bg-white rounded shadow hover:bg-gray-200 transition-colors"
//            >
//                {props.filename}
//                <span 
//                    style={{ position: 'absolute', top: 0, right: 0 }} 
//                    onClick={(e) => { 
//                        e.stopPropagation(); // Prevent event from triggering the preview
//                        props.removeFile(); 
//                    }}
//                >
//                    X
//                </span>
//            </button>
//            {showPreview() && (
//                <div>
//                    <button onClick={() => setShowPreview(false)}>
//                        Close Preview
//                    </button>
//                    <iframe src={props.filePath} style={{ width: '100%', height: '80vh' }}></iframe>
//                </div>
//            )}
//        </>
//    );
//};

import { createSignal } from 'solid-js';

type Props = {
    filename: string;
    filePath: string;
    removeFile: () => void;
    setFilePreviewPath: (value:string) => void;
    userInput: string;
    setUserInput: (value:string) => void;
}

export const FileButton = (props: Props) => {
    // const [showPreview, setShowPreview] = createSignal(false);

    return (
        <div class="relative inline-block h-8 w-40 bg-white rounded shadow hover:bg-gray-200 transition-colors overflow-hidden">
            <button 
                onClick={() => props.setFilePreviewPath(props.filePath)}
                class="absolute left-0 top-0 h-full w-full text-lg px-2 border-slate-200 border-2"
                title={props.filename} // add title for overflow text
            >
                {props.filename}
            </button>
            <div 
                class="absolute top-0 right-0 flex items-center justify-center h-4 w-4 bg-gray-400 rounded-full cursor-pointer"
                onClick={(e) => { 
                    e.stopPropagation(); // Prevent event from triggering the preview
                    const newInput = props.userInput.replace(new RegExp(`\\$\{${props.filename}\}`, 'g'), '');
                    props.setUserInput(newInput);
                    props.removeFile(); 
                    props.setFilePreviewPath('');
                }}
            >
                <span class="text-white">X</span>
            </div>
        </div>
    );
};