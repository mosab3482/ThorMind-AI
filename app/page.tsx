import Image from "next/image"
import ThorMindLogo from "./assets/thorMindLogo.png"
import { useChat } from "ai/react"
import { message } from "ai"
import Bubble from "./components/bubble"
import LoadingBubble from "./components/loadingBubble"
import PromptSuggestionsRow from "./components/promptSuggestionRow"
const Home = () => {
    const { append, isLoading, messages, handleInputChange, input, handleSubmit } = useChat()
    const noMessages = !messages || messages.length === 0

    const handlePrompt = (promptText) => {
        const msg: message = {
            id: crypto.randomUUID(),
            content: promptText,
            role: "user"
        }
        append(msg)
    }
    return (
        <main>
            <Image src={ThorMindLogo} alt="ThorMind Logo" width={100} height={100} />
            <section className={noMessages ? "" : "populated"}>
                {noMessages ? (
                    <>
                        <p className="starter-text">...</p>
                        <br />
                        <PromptSuggestionsRow onPromptClick={handlePrompt} />
                    </>
                ) : (
                    <>
                        {messages.map((message, index) => <Bubble key={`message-${index}`} message={message} />)}
                        {isLoading && <LoadingBubble />}

                    </>
                )}
            </section>
            <form onSubmit={handleSubmit}>
                <input className="question-box" onChange={handleInputChange} value={input} placeholder="Ask me ..." />
            </form>
        </main>
    )
}

export default Home