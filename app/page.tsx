"use client"
import Image from "next/image"
import { useChat } from "ai/react"
import type { Message } from "ai/react"
import Bubble from "./components/bubble"
import LoadingBubble from "./components/loadingBubble"
import PromptSuggestionsRow from "./components/promptSuggestionRow"
import thromindLogo from "./assets/thromindLogo.png"

const Home = () => {
    const { append, isLoading, messages, handleInputChange, input, handleSubmit } = useChat()
    const noMessages = !messages || messages.length === 0

    const handlePrompt = (promptText: string) => {
        const msg: Message = {
            id: crypto.randomUUID(),
            content: promptText,
            role: "user"
        }
        append(msg)
    }

    return (
        <main>
            <header className="header">
                <div className="header-inner">
                    <div className="logo-area">
                        <Image src={thromindLogo} alt="ThroMind Logo" width={180} height={50} className="logo" priority />
                    </div>
                    <div className="header-info">
                        <span className="status-dot"></span>
                        <span className="status-text">AI Assistant Online</span>
                    </div>
                </div>
            </header>

            <div className="chat-wrapper">
                <section className={`chat-section ${noMessages ? "" : "populated"}`}>
                    {noMessages ? (
                        <div className="welcome-screen">
                            <div className="welcome-icon">
                                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="64" height="64" rx="16" fill="url(#grad1)" />
                                    <path d="M20 24h24M20 32h16M20 40h20" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                                    <defs>
                                        <linearGradient id="grad1" x1="0" y1="0" x2="64" y2="64">
                                            <stop offset="0%" stopColor="#0066ff" />
                                            <stop offset="100%" stopColor="#00d4ff" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                            <h1 className="welcome-title">مرحباً بك في ThroMind AI</h1>
                            <p className="welcome-subtitle">
                                أنا MHD، مساعدك الذكي من ThroMind 🚀<br />
                                اسألني عن منتجاتنا، الأسعار، السياسات، أو أي شيء آخر!
                            </p>
                            <p className="welcome-subtitle-en">
                                I&apos;m MHD, your intelligent assistant from ThroMind.<br />
                                Ask me about our products, pricing, policies, or anything else!
                            </p>
                            <PromptSuggestionsRow onPromptClick={handlePrompt} />
                        </div>
                    ) : (
                        <div className="messages-container">
                            {messages.map((message, index) => (
                                <Bubble key={`message-${index}`} message={message} />
                            ))}
                            {isLoading && <LoadingBubble />}
                        </div>
                    )}
                </section>
            </div>

            <div className="input-area">
                <form onSubmit={handleSubmit} className="input-form">
                    <input
                        className="question-box"
                        onChange={handleInputChange}
                        value={input}
                        placeholder="اسألني عن ThroMind... / Ask me about ThroMind..."
                        disabled={isLoading}
                    />
                    <button type="submit" className="send-btn" disabled={isLoading || !input.trim()}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </form>
                <p className="footer-note">ThroMind AI Assistant — Sudan · support@thromind.com</p>
            </div>
        </main>
    )
}

export default Home