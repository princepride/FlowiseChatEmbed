//import { splitProps } from 'solid-js'
//import { JSX } from 'solid-js/jsx-runtime'

//type ShortTextInputProps = {
//    ref: HTMLInputElement | undefined
//    onInput: (value: string) => void
//} & Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'onInput'>

//export const ShortTextInput = (props: ShortTextInputProps) => {
//    const [local, others] = splitProps(props, ['ref', 'onInput'])

//    return (
//        <input
//            ref={props.ref}
//            class='focus:outline-none bg-transparent px-4 py-4 flex-1 w-full text-input'
//            type='text'
//            style={{ 'font-size': '16px' }}
//            onInput={(e) => local.onInput(e.currentTarget.value)}
//            {...others}
//        />
//    )
//}

//import { splitProps } from 'solid-js'
//import { JSX } from 'solid-js/jsx-runtime'
//import { onMount, onCleanup } from 'solid-js'

//type ShortTextInputProps = {
//    ref: HTMLTextAreaElement | undefined
//    onInput: (value: string) => void
//} & Omit<JSX.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onInput'>

//export const ShortTextInput = (props: ShortTextInputProps) => {
//    const [local, others] = splitProps(props, ['ref', 'onInput'])

//    // 创建一个引用来引用textarea元素
//    let textareaRef: HTMLTextAreaElement | undefined

//    const adjustHeight = () => {
//        if (textareaRef) {
//            textareaRef.style.height = 'auto'
//            textareaRef.style.height = `${textareaRef.scrollHeight}px`
//        }
//    }

//    // 在挂载后和输入时调整高度
//    onMount(adjustHeight)
//    local.onInput = (value: string) => {
//        props.onInput(value)
//        adjustHeight()
//    }

//    return (
//        <textarea
//            rows = "1"
//            ref={el => textareaRef = el}
//            class='focus:outline-none bg-transparent px-4 py-4 flex-1 w-full text-input'
//            style={{ 'font-size': '16px', 'overflow-y': 'hidden', 'resize': 'none' }}  // 设置overflow-y为hidden以隐藏滚动条
//            onInput={(e) => local.onInput(e.currentTarget.value)}
//            {...others}
//        />
//    )
//}

import { splitProps } from 'solid-js'
import { JSX } from 'solid-js/jsx-runtime'
import { onMount } from 'solid-js'

type ShortTextInputProps = {
    ref: HTMLTextAreaElement | undefined
    onInput: (value: string) => void
} & Omit<JSX.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onInput'>

export const ShortTextInput = (props: ShortTextInputProps) => {
    const [local, others] = splitProps(props, ['ref', 'onInput'])

    // 创建一个引用来引用textarea元素
    let textareaRef: HTMLTextAreaElement | undefined

    const adjustHeight = () => {
        if (textareaRef) {
            textareaRef.style.height = 'auto'
            textareaRef.style.height = `${textareaRef.scrollHeight}px`
        }
    }

    // 在挂载后和输入时调整高度
    onMount(adjustHeight)

    const handleInput = (e: Event) => {
        const value = (e.currentTarget as HTMLTextAreaElement).value
        props.onInput(value)
        adjustHeight()
    }

    return (
        <textarea
            rows="1"
            ref={el => textareaRef = el}
            class='focus:outline-none bg-transparent px-4 py-4 flex-1 w-full text-input'
            style={{ 'font-size': '16px', 'overflow-y': 'hidden', 'resize': 'none' }}  // 设置overflow-y为hidden以隐藏滚动条
            onInput={handleInput}
            {...others}
        />
    )
}