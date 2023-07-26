import { createSignal, createEffect, For, onMount, onCleanup  } from 'solid-js'
import { sendMessageQuery, isStreamAvailableQuery } from '@/queries/sendMessageQuery'
import { TextInput, FileButtonsSlider, FilePreview } from './inputs/textInput'
import { GuestBubble } from './bubbles/GuestBubble'
import { BotBubble } from './bubbles/BotBubble'
import { LoadingBubble } from './bubbles/LoadingBubble'
import { SourceBubble } from './bubbles/SourceBubble'
import { BotMessageTheme, TextInputTheme, UserMessageTheme } from '@/features/bubble/types'
import { Badge } from './Badge'
import socketIOClient from 'socket.io-client'
import { Popup } from '@/features/popup'

type messageType = 'apiMessage' | 'userMessage' | 'usermessagewaiting'

type SourceType = {
    pageContent: string;
    metadata: {
        source: string;
      // other properties...
    };
};

export type MessageType = {
    message: string
    type: messageType,
    sourceDocuments?: any
}

export type BotProps = {
    chatflowid: string
    apiHost?: string
    welcomeMessage?: string
    botMessage?: BotMessageTheme
    userMessage?: UserMessageTheme
    textInput?: TextInputTheme
    poweredByTextColor?: string
    badgeBackgroundColor?: string
}

const defaultWelcomeMessage = 'Hi there! How can I help?'
const socket = socketIOClient('http://127.0.0.1:8080')

export const Bot = (props: BotProps & { class?: string }) => {
    let chatContainer: HTMLDivElement | undefined
    let bottomSpacer: HTMLDivElement | undefined
    let botContainer: HTMLDivElement | undefined

    const [userInput, setUserInput] = createSignal('')
    const [loading, setLoading] = createSignal(false)
    const [sourcePopupOpen, setSourcePopupOpen] = createSignal(false)
    const [sourcePopupSrc, setSourcePopupSrc] = createSignal({})
    const [fileList, setFileList] = createSignal<string[]>([]);
    const [filenameList, setFilenameList] = createSignal<string[]>([]);
    const [filePreviewPath, setFilePreviewPath] = createSignal('')
    const [modalVisible, setModalVisible] = createSignal<boolean>(false);
    const [feedbackText, setFeedbackText] = createSignal<string>("");
    const [feedbackURLs, setFeedbackURLs] = createSignal<any[]>([]);
    const [pageContent, setPageContent] = createSignal<string>("");
    const [source, setSource] = createSignal<string>("");
    const [language, setLanguage] = createSignal<string>("Chinese");
    const [messages, setMessages] = createSignal<MessageType[]>([
        {
            message: props.welcomeMessage ?? defaultWelcomeMessage,
            type: 'apiMessage'
        },
    ], { equals: false })

    onMount(() => {
        if (!bottomSpacer) return
        setTimeout(() => {
            chatContainer?.scrollTo(0, chatContainer.scrollHeight)
        }, 50)
    })

    const scrollToBottom = () => {
        setTimeout(() => {
            chatContainer?.scrollTo(0, chatContainer.scrollHeight)
        }, 50)
    }

    const updateLastMessage = (text: string) => {  
        setLoading(false)
        setMessages(data => {
            const updated = data.map((item, i) => {
                if (i === data.length - 1) {
                    return {...item, message: text };
                }
                return item;
            });
            return [...updated];
        });
    }

    const saveData = async () => {
        console.log("triggle save data")
        const formData = new FormData();
        formData.append('response', messages()[messages().length - 1].message)
        const response = await fetch(`${props.apiHost}/api/v1/save_data/${props.chatflowid}`, {
            method: 'POST',
            body: formData,
        });
        console.log(response)
    }

    // 定义处理函数
    const handleFeedbackClick = () => {
        setModalVisible(true);
    };

    const handleCancelButton = () => {
        setFeedbackText("");
        setFeedbackURLs([]);
        setPageContent("");
        setSource("");
        setModalVisible(false);
    }

    const handlePageContentChange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        setPageContent(target.value);
    }

    const handleSourceChange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        setSource(target.value);
    }

    const handleFeedbackTextChange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        setFeedbackText(target.value);
    }

    const addFeedBackURLs = () => {
        setFeedbackURLs([...feedbackURLs(),{"pageContent":pageContent(),"metadata":{"source":source()}}])
        setSource("");
        setPageContent("");
    }

    const handleConfirmButton = async () => {
        if(feedbackURLs().length == 0 && feedbackText() == "") {
            setPageContent("");
            setSource("");
        }
        else {
            const formData = new FormData();
            formData.append('feedback',feedbackText());
            formData.append('feedback_source_list',JSON.stringify(feedbackURLs()))
            const response = await fetch(`${props.apiHost}/api/v1/feedback/${props.chatflowid}`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if(data) {
                if (typeof data === 'object' && data.message) {
                    alert(data.message)
                    setFeedbackText("");
                    setFeedbackURLs([]);
                    setPageContent("");
                    setSource("");
                    setModalVisible(false);
                }
            }
        }
    }

    // Handle form submission
    const handleSubmit = async (value: string) => {
        setUserInput(value)

        if (value.trim() === '') {
            return
        }

        setLoading(true)
        setMessages((prevMessages) => [...prevMessages, { message: value, type: 'userMessage' }])
        scrollToBottom()

        // Create a new FormData object.
        const formData = new FormData();

        // For each filePath in the fileList, fetch the file and append it to formData.
        const currentFileList = fileList();
        for (let i = 0; i < currentFileList.length; i++) {
            const fileBlob = await fetch(currentFileList[i]).then(r => r.blob());
            const file = new File([fileBlob], filenameList()[i], { type: fileBlob.type });
            formData.append('file', file);
        }
        setFileList([]);
        setFilenameList([])
        // Append the question, history and other data to formData.
        formData.append('question', value);
        let history = JSON.stringify(messages().filter((msg) => msg.message !== props.welcomeMessage ?? defaultWelcomeMessage))
        formData.append('history', history);
        formData.append('language',language());

        // socket.emit("send_message", { "question":value });

        const response = await fetch(`${props.apiHost}/api/v1/prediction/${props.chatflowid}`, {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();

        if (data) {
            if (typeof data === 'object' && data.text && data.sourceDocuments) {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { message: "", sourceDocuments: data.sourceDocuments, type: 'apiMessage' }
                ])

            } else {
                setMessages((prevMessages) => [...prevMessages, { message: "", type: 'apiMessage' }])
            }
            setUserInput('')
            socket.emit("send_message", { "question":data.text });
            //scrollToBottom()
        }

    }

    // Auto scroll chat to bottom
    createEffect(() => {
        if (messages()) scrollToBottom()
    })

    // eslint-disable-next-line solid/reactivity
    createEffect(async() => {
        socket.on('connect', () => {
            console.log('connect socket')
        })

        socket.on('token', updateLastMessage)

        socket.on('save_data', saveData)

        // eslint-disable-next-line solid/reactivity
        onCleanup (() => {
            setUserInput('')
            setLoading(false)
            setMessages([
                {
                    message: props.welcomeMessage ?? defaultWelcomeMessage,
                    type: 'apiMessage'
                }
            ])
            if (socket) {
                socket.close()
            }
        })
    })

    // Create an effect that listens for changes to fileList.
    createEffect(() => {
        const currentFileList = fileList();
        console.log(currentFileList);
    });

    return (
        <>
            <div ref={botContainer} class={'relative flex w-full h-full text-base overflow-hidden bg-cover bg-center flex-col items-center chatbot-container ' + props.class}>
            {
                modalVisible() && <div class="bg-gray-500 bg-opacity-50 h-full w-full absolute" style={{"z-index":1200}} onClick = {handleCancelButton}>
                    <div class=" bg-white p-4 rounded-md mt-40 mx-4 flex-col" onClick={event => event.stopPropagation()}>
                        <textarea rows="4" class="border mb-2 w-96" value={feedbackText()} onChange={handleFeedbackTextChange}/>
                        <div class="flex space-x-2 overflow-x-auto mb-2">
                            <For each={[...feedbackURLs()]}>
                                {(src) => (
                                    <SourceBubble
                                        pageContent={src.pageContent}
                                        metadata={src.metadata}
                                        onSourceClick={() => {
                                            window.open(src.metadata.source, '_blank');
                                            // setSourcePopupSrc(src);
                                            // setSourcePopupOpen(true);
                                        }}                                        
                                    />
                                )}
                            </For>
                        </div>
                        <div class="flex justify-between mb-4">
                            <div>
                                <input class="w-72" type="text" placeholder='page content' value={pageContent()} onInput={handlePageContentChange}></input>
                                <input class="w-72" type="text" placeholder='metadata source' value={source()} onInput={handleSourceChange}></input>
                            </div>
                            <button class="bg-blue-500 text-white px-6 rounded-lg text-lg"  onClick={addFeedBackURLs}>ADD</button>
                        </div>
                        <div class="flex justify-center">
                            <button class="border py-1 px-4 rounded-lg mr-24 bg-blue-500 text-white text-lg" onClick={handleConfirmButton}>CONFIRM</button>
                            <button class="border py-1 px-4 rounded-lg bg-blue-500 text-white text-lg" onClick = {handleCancelButton}>CANCEL</button>
                        </div>
                    </div>
                </div>
            }
                <div class="flex w-full h-full justify-center">
                    <div style={{ "padding-bottom": '100px' }} ref={chatContainer} class="overflow-y-scroll w-full min-h-full px-3 pt-10 relative scrollable-container chatbot-chat-view scroll-smooth">
                        <For each={[...messages()]}>
                            {(message, index) => (
                                <>
                                    {message.type === 'userMessage' && (
                                        <GuestBubble
                                            message={message.message}
                                            backgroundColor={props.userMessage?.backgroundColor}
                                            textColor={props.userMessage?.textColor}
                                            showAvatar={props.userMessage?.showAvatar}
                                            avatarSrc={props.userMessage?.avatarSrc}
                                        />
                                    )}
                                    {message.type === 'apiMessage' && (
                                        <BotBubble
                                            message={message.message}
                                            backgroundColor={props.botMessage?.backgroundColor}
                                            textColor={props.botMessage?.textColor}
                                            showAvatar={props.botMessage?.showAvatar}
                                            avatarSrc={props.botMessage?.avatarSrc}
                                        />
                                    )}
                                    {message.type === 'userMessage' && loading() && index() === messages().length - 1 && (
                                        <LoadingBubble />
                                    )}
                                    {message.type === 'apiMessage' && index() === messages().length - 1 && index() !== 0 && (
                                        <div class="flex justify-end items-start">
                                            <button class="border py-1 px-2 rounded-sm mr-12" onClick={handleFeedbackClick}>Feedback</button>
                                        </div>
                                    )}
                                    {message.sourceDocuments && message.sourceDocuments.length && 
                                    <div style={{ display: 'flex', "flex-direction": 'row', width: '100%' }}>
                                        <For each={[...message.sourceDocuments]}>
                                            {(src) => (
                                                <SourceBubble
                                                    pageContent={src.pageContent}
                                                    metadata={src.metadata}
                                                    onSourceClick={() => {
                                                        window.open(src.metadata.source, '_blank');
                                                        // setSourcePopupSrc(src);
                                                        // setSourcePopupOpen(true);
                                                    }}                                        
                                                />
                                            )}
                                        </For>
                                    </div>}
                                </>
                            )}
                        </For>
                    </div>
                    {filePreviewPath() !== '' &&
                    <FilePreview 
                        filePreviewPath={filePreviewPath()}
                        setFilePreviewPath = {setFilePreviewPath}
                    />}
                    <FileButtonsSlider 
                        fileList = {fileList()}
                        setFileList={setFileList}
                        filenameList = {filenameList()}
                        setFilenameList = {setFilenameList}
                        setFilePreviewPath = {setFilePreviewPath}
                        userInput={userInput()}
                        setUserInput = {setUserInput}
                    />
                    <TextInput
                        backgroundColor={props.textInput?.backgroundColor}
                        textColor={props.textInput?.textColor}
                        placeholder={props.textInput?.placeholder}
                        sendButtonColor={props.textInput?.sendButtonColor}
                        userInput={userInput()}
                        setUserInput = {setUserInput}
                        onSubmit={handleSubmit}
                        fileList = {fileList()}
                        setFileList={setFileList}
                        filenameList = {filenameList()}
                        setFilenameList = {setFilenameList}
                        setLanguage = {setLanguage}
                    />
                </div>
                <Badge badgeBackgroundColor={props.badgeBackgroundColor} poweredByTextColor={props.poweredByTextColor} botContainer={botContainer} />
                <BottomSpacer ref={bottomSpacer} />
            </div>
            {sourcePopupOpen() && <Popup isOpen={sourcePopupOpen()} value={sourcePopupSrc()} onClose={() => setSourcePopupOpen(false)}/>}
        </>
    )
}

type BottomSpacerProps = {
    ref: HTMLDivElement | undefined
}
const BottomSpacer = (props: BottomSpacerProps) => {
    return <div ref={props.ref} class="w-full h-32" />
}