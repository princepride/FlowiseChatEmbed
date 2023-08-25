import { ShortTextInput } from './ShortTextInput'
import { SendButton } from '@/components/SendButton'
import { isMobile } from '@/utils/isMobileSignal'
import { onMount } from 'solid-js'
import { LanguageSelector } from './LanguageSelector'

type Props = {
    placeholder?: string
    backgroundColor?: string
    textColor?: string
    sendButtonColor?: string
    userInput?: string
    setUserInput: (value:string) => void
    onSubmit: (value: string) => void
    fileList?: string[]
    setFileList: (value: string[]) => void
    filenameList?: string[]
    setFilenameList: (value: string[]) => void
    setLanguage: (value:string) => void
}

const defaultBackgroundColor = '#ffffff'
const defaultTextColor = '#303235'

export const TextInput = (props: Props) => {
    // const [inputValue, setInputValue] = createSignal(props.defaultValue ?? '')
    let inputRef: HTMLInputElement | HTMLTextAreaElement | undefined

    const handleInput = (inputValue: string) => {props.setUserInput(inputValue)}

    const checkIfInputIsValid = () => props.userInput !== ''

    const submit = () => {
        if (checkIfInputIsValid()) props.onSubmit(props.userInput || '')
        props.setUserInput('')
    }

    const handleLanguageChange = (newLanguage: string) => {
        props.setLanguage(newLanguage);
    }

    const submitWhenEnter = (e: KeyboardEvent) => {
        if (e.key === 'Enter') submit()
    }

    const handleDragOver = (event: Event) => {
        event.preventDefault();
    }

    const handleDrop = (event: Event) => {
        event.preventDefault();
        const dragEvent = event as DragEvent;
        const file = dragEvent.dataTransfer?.files[0];
        if (file) {
            const filename = file.name;
            const filePath = URL.createObjectURL(file);
            const currentFileList = props.fileList || [];
            const updatedFileList = [...currentFileList, filePath];
            props.setFileList(updatedFileList);

            const currentFilenameList = props.filenameList || [];
            const updatedFilenameList = [...currentFilenameList, filename];
            props.setFilenameList(updatedFilenameList);
            // setInputValue(filePath + ' - ' + fileName);
            props.setUserInput(props.userInput+"${"+filename+"}");
        }
    }

    onMount(() => {
        if (!isMobile() && inputRef) {
            inputRef.focus();
            inputRef.addEventListener('dragover', handleDragOver);
            inputRef.addEventListener('drop', handleDrop);
        }
    })

    return (
        <div
        class={'flex items-end justify-between pr-2 chatbot-input w-full'}
        data-testid='input'
        style={{
            'border-top': '1px solid #eeeeee',
            width: '90%',
            position: 'absolute',
            bottom: '40px',
            margin: 'auto',
            "z-index": 1000,
            "background-color": props.backgroundColor ?? defaultBackgroundColor,
            color: props.textColor ?? defaultTextColor
        }}
        onKeyDown={submitWhenEnter}
    >
        <LanguageSelector defaultLanguage="Chinese" onLanguageChange={handleLanguageChange} />
            
        <ShortTextInput
            // ref={inputRef as HTMLInputElement}
            ref={inputRef as HTMLTextAreaElement}
            id = "short-text-input"
            onInput={handleInput}
            value={props.userInput}
            placeholder={props.placeholder ?? 'Type your question'}
        />
        <SendButton sendButtonColor={props.sendButtonColor} type='button' isDisabled={props.userInput === ''} class='my-2 ml-2' on:click={submit}>
            <span style={{ 'font-family': 'Poppins, sans-serif' }}>Send</span>
        </SendButton>
    </div>
    )
}