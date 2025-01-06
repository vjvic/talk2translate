import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPEN_API_KEY,
});

export const POST = async (request: Request) => {
  const { language, text } = await request.json();

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You will provided with a sentence your task are to:
           - detect a language of the sentence 
           - translate it to ${language} 
           - pls do not return anything other than translated sentence
           - only return the tranlated word or sentence
           - just the translated word 
           `,
        },
        {
          role: "user",
          content: text,
        },
      ],
    });

    const message = completion.choices?.[0]?.message?.content || "No response";

    console.log(message);

    return NextResponse.json({
      text: message,
    });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch completion." },
      { status: 500 }
    );
  }
};
