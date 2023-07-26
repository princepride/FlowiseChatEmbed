import { createSignal } from 'solid-js'

type LanguageSelectorProps = {
    defaultLanguage?: string
    onLanguageChange: (newLanguage: string) => void
}

export const LanguageSelector = (props: LanguageSelectorProps) => {
    const [selectedLanguage, setSelectedLanguage] = createSignal(props.defaultLanguage || '中文')

    const handleLanguageChange = (event: Event) => {
        const target = event.target as HTMLSelectElement
        const newLanguage = target.value
        setSelectedLanguage(newLanguage)
        props.onLanguageChange(newLanguage)
    }

    return (
        <div style={{"margin-bottom":"15px"}}>
            <select value={selectedLanguage()} onInput={handleLanguageChange}>
                <option value='Chinese'>中文</option>
                <option value='English'>English</option>
                <option value='Indonesian'>Indonesia</option>
                <option value='German'>Deutsch</option>
                <option value='French'>Français</option>
                <option value='Japanese'>日本語</option>
                <option value='Korean'>한국어</option>
                <option value='Italian'>Italiano</option>
                <option value='Russian'>Русский</option>
            </select>
        </div>
    )
}