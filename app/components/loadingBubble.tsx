const LoadingBubble = () => {
    return (
        <div className="bubble-wrapper assistant-wrapper">
            <div className="avatar assistant-avatar">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" fill="white" />
                </svg>
            </div>
            <div className="bubble assistant loading-bubble">
                <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    )
}

export default LoadingBubble