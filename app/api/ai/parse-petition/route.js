import { NextResponse } from "next/server";
import { parseCitizenPrompt } from "@/lib/services/aiService";

export async function POST(request) {
  try {
    const body = await request.json();
    const { prompt, language } = body;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json(
        { success: false, error: "Please enter your RTI query or concern." },
        { status: 400 }
      );
    }

    const analysis = await parseCitizenPrompt(prompt, { language });

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("AI Parse Petition Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to analyze petition with AI." },
      { status: 500 }
    );
  }
}
