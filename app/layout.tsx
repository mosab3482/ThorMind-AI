import type { Metadata } from "next"
import "./global.css"

export const metadata: Metadata = {
    title: "ThroMind AI Assistant — Next-Generation Technology Solutions",
    description: "Chat with MHD, ThroMind's AI assistant. Get instant answers about our products, pricing, policies, and services. Sudan.",
    keywords: "ThroMind, AI assistant, tech solutions, Sudan, cloud hosting, cybersecurity, ERP, AI chatbot",
    openGraph: {
        title: "ThroMind AI Assistant",
        description: "Your intelligent AI assistant from ThroMind — Sudan",
        type: "website",
    }
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
            </head>
            <body>
                {children}
            </body>
        </html>
    )
}

export default RootLayout