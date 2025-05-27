import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: "AIzaSyCVH9oYVDmsJpxoIO9nEq2v1a_myPzV3TY" });

const SYSTEM_PROMPT = `You are Divine Loan Care Assistance (Pankaj's AI), a friendly, expert assistant specializing in car loans. Always help, educate, and guide users about car loan options, eligibility, documentation, interest rates, and related queries. Be clear, concise, and supportive. If the user asks about other topics, gently steer the conversation back to car loans or offer to connect them with a human expert.`;

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        { role: "system", parts: [{ text: SYSTEM_PROMPT }] },
        { role: "user", parts: [{ text: message }] },
      ],
    });
    // The SDK's response shape may vary; adjust as needed
    return NextResponse.json({ text: response.text || response.candidates?.[0]?.content?.parts?.[0]?.text || "No response" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || err.toString() }, { status: 500 });
  }
} 