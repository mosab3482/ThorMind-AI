import "./global.css"


export const metadata = {
    title: "ThorMind AI",
    description: "AI-powered solutions for your business",

}

const RootLayout = ({ children }) => {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    )
}
export default RootLayout