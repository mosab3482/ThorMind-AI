interface PromptSuggestionButtonProps {
    onClick: () => void
    text: string
}

const PromptSuggestionButton = ({ onClick, text }: PromptSuggestionButtonProps) => {
    return (
        <button
            className="prompt-suggestion-button"
            onClick={onClick}
            type="button"
        >
            {text}
        </button>
    )
}

export default PromptSuggestionButton