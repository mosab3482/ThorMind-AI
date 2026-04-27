import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import thromindData from "../../data/thromind.json";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const buildSystemPrompt = (): string => {
  return `You are the official AI assistant for **ThroMind**, a leading technology company based in Sudan. Your name is "MHD" and you represent ThroMind professionally.

Your role is to help visitors and clients by answering questions about ThroMind's products, services, pricing, policies, and general company information — clearly, accurately, and in a friendly tone.

## COMPANY KNOWLEDGE BASE:
${JSON.stringify(thromindData, null, 2)}

## INSTRUCTIONS:
1. **Always answer in the same language the user writes in.** If they write in Arabic, respond in Arabic. If English, respond in English.
2. **Be accurate**: Only provide information that exists in the knowledge base above. Do not invent prices, features, or policies.
3. **Be professional and warm**: You represent ThroMind. Be helpful, concise, and friendly.
4. **For pricing**: Always mention the currency (USD) and whether it is monthly or annual. Recommend annual plans (20% savings) when relevant.
5. **For support**: Direct users to support@thromind.com (email), +249 92 316 2716 (phone), or WhatsApp +249 92 316 2716.
6. **For custom requests**: Tell them to contact sales@thromind.com.
7. **Format your responses clearly**: Use bullet points for features/lists, bold for important info, and keep answers structured.
8. **Never make up information** that is not in your knowledge base.
9. **If unsure**, say "I am not sure about that — please contact our team at support@thromind.com for accurate information."
10. Do NOT break character. You are MHD from ThroMind at all times.`;
};

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      stream: true,
      messages: [
        { role: "system", content: buildSystemPrompt() },
        ...messages,
      ],
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (err: any) {
    console.error("Chat API error:", err);

    // Handle OpenAI-specific errors gracefully
    if (err?.status === 429 || err?.code === "insufficient_quota") {
      const errorMsg = "⚠️ عذراً، خدمة الذكاء الاصطناعي غير متاحة حالياً بسبب تجاوز حصة API. يرجى التواصل مع الدعم على support@thromind.com\n\nSorry, the AI service is temporarily unavailable (API quota exceeded). Please contact support@thromind.com or call +249 92 316 2716.";
      const stream = new ReadableStream({
        start(controller) {
          const encoder = new TextEncoder();
          controller.enqueue(encoder.encode(`0:"${errorMsg.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"\n`));
          controller.close();
        }
      });
      return new Response(stream, {
        headers: { "Content-Type": "text/plain; charset=utf-8", "x-vercel-ai-data-stream": "v1" }
      });
    }

    if (err?.status === 401) {
      return new Response(JSON.stringify({ error: "Invalid OpenAI API key" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
