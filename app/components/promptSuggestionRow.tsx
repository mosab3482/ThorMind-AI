import PromptSuggestionButton from "./PromptSuggestionButton"

interface PromptSuggestionRowProps {
    onPromptClick: (prompt: string) => void
}

const PromptSuggestionRow = ({ onPromptClick }: PromptSuggestionRowProps) => {
    const prompts = [
        "ما هي منتجات MHDTech؟",
        "What are MHDTech's pricing plans?",
        "كم تكلف خدمة MHDChat AI؟",
        "Do you offer a free trial?",
        "ما هي سياسة الاسترداد؟",
        "How secure is my data with MHDTech?",
    ]

    return (
        <div className="prompt-suggestion-row">
            {prompts.map((prompt, index) => (
                <PromptSuggestionButton
                    key={`suggestion-${index}`}
                    text={prompt}
                    onClick={() => onPromptClick(prompt)}
                />
            ))}
        </div>
    )
}

export default PromptSuggestionRow