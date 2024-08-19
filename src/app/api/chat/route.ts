import { getContext } from "@/lib/context";
import { db } from "@/lib/db";
import { chats, messages as _messages } from "@/lib/db/schema";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
const genAI = new GoogleGenerativeAI(process.env.API_KEY!);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req: Request, res: Response) {
  try {
    const { messages, chatId } = await req.json();
    const _chats = await db.select().from(chats).where(eq(chats.id, chatId));
    if (_chats.length != 1) {
      return NextResponse.json({ error: "chat not found" }, { status: 404 });
    }
    const fileKey = _chats[0].fileKey;
    const lastMessage = messages[messages.length - 1];
    const context = await getContext(lastMessage.content, fileKey);

    const prompt = `
        AI assistant is a brand new, powerful, human-like artificial intelligence.
        The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
        AI is a well-behaved and well-mannered individual.
        AI is always friendly, kind, and inspiring, and is eager to provide vivid and thoughtful responses to the user.
        START CONTEXT BLOCK
        ${context}
        END OF CONTEXT BLOCK
        User: ${lastMessage.content}
        `;

    // Use the Google Gemini model to generate content
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

    const aiResponse = result.response.text();

    // Save user message into the database

    await db.insert(_messages).values({
      chatId,
      content: lastMessage.content,
      role: "user",
    });

    // Save AI response into the database
    await db.insert(_messages).values({
      chatId,
      content: aiResponse,
      role: "system",
    });

    // Return AI-generated response

    return NextResponse.json({ message: aiResponse });
  } catch (error) {
    console.error("Error in chat processing:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
