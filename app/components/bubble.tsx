import type { Message } from "ai/react"

interface BubbleProps {
    message: Message
}

const Bubble = ({ message }: BubbleProps) => {
    const { content, role } = message
    const isUser = role === "user"

    return (
        <div className={`bubble-wrapper ${isUser ? "user-wrapper" : "assistant-wrapper"}`}>
            {!isUser && (
                <div className="avatar assistant-avatar">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" fill="white" />
                    </svg>
                </div>
            )}
            <div className={`bubble ${isUser ? "user" : "assistant"}`}>
                <p className="bubble-text">{content}</p>
            </div>
            {isUser && (
                <div className="avatar user-avatar">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" fill="white" />
                    </svg>
                </div>
            )}
        </div>
    )
}

export default Bubble