import OpenAI from "openai"
import { OpenAIStream, StreamingTextResponse } from "ai"
import { DataAPIClient } from "@datastax/astra-db-ts"


const {
    ASTRA_DB_NAMESPACE,
    ASTRA_DB_COLLECTION,
    ASTRA_DB_API_ENDPOINT,
    ASTRA_DB_APPLICATION_TOKEN,
    OPENAI_API_KEY,
} = process.env;


const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT, { namespace: ASTRA_DB_NAMESPACE });

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        const lastMessage = messages[messages.length - 1]?.content
        let docContext = ""
        const embedding = await openai.embeddings.create({
            modle: "text-embedding-3-small",
            input: lastMessage,
            encoding_format: "float",
        })
        try {
            const collection = await db.collection(ASTRA_DB_COLLECTION)
            const cursor = collection.find(null, {
                sort: {
                    $vector: embedding.data[0].embedding,
                }, limit: 10
            })
            const document = await cursor.toArray()
            const docMap = document?.map(doc => doc.text)
            docContext = JSON.stringify(docMap)

        } catch (err) {
            console.log(err)
            docContext = ""
        }
        const template = {
            role: "system",
            content: `
            ....`
        }
        const response = await openai.chat.completions.create({
            modle: "gpt-4",
            stream: true,
            messages: [template, ...messages]
        })

        const stream = OpenAIStream(response)
        return new StreamingTextResponse(stream)

    } catch (err) {
        console.log(err)
    }
}