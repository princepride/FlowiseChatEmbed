type Props = {
    filePreviewPath: string;
    setFilePreviewPath: (value:string) => void;
}

export const FilePreview = (props: Props) => {
    return (
        <div
            style={{
                "z-index":1000,
                bottom:'200px',
                position: 'absolute',
                height:'20vh'
            }}
        >
            <button onClick={() => props.setFilePreviewPath('')}>
                Close Preview
            </button>
            <iframe src={props.filePreviewPath}  ></iframe>
        </div>
    )
}