import { FileButton } from './FileButton'

type Props = {
    fileList?: string[]
    setFileList: (value: string[]) => void
    filenameList?: string[]
    setFilenameList: (value: string[]) => void
    setFilePreviewPath:(value:string) => void
    userInput:string
    setUserInput:(value:string) => void
}

export const FileButtonsSlider = (props: Props) => {
    return (
        <div 
        class={"flex space-x-2 overflow-x-auto mb-4"}
        style={{
            'border-top': '1px solid #eeeeee',
            width: '90%',
            position: 'absolute',
            bottom: '100px',
            margin: 'auto',
            "z-index": 1000,
        }}
        >
            {props.fileList?.map((filePath, index) => (
                <FileButton
                    filename={(props.filenameList || [])[index]}
                    filePath={filePath}
                    removeFile={() => {
                        const newFileList = [...props.fileList || []];
                        newFileList.splice(index, 1);
                        props.setFileList(newFileList);
        
                        const newFilenameList = [...props.filenameList || []];
                        console.log("delete", newFilenameList[index])
                        newFilenameList.splice(index, 1);
                        props.setFilenameList(newFilenameList);
                    }}
                    setFilePreviewPath={props.setFilePreviewPath}
                    userInput={props.userInput}
                    setUserInput={props.setUserInput}
                />
            ))}
        </div>
    )
}