import { NextRequest, NextResponse } from "next/server";
import { generateQuestionsFromNotes, generateCurrentAffairsMCQ } from "@/lib/gemini";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { text, type } = await req.json();
    if (!text || !type) {
      return NextResponse.json({ error: "text and type are required" }, { status: 400 });
    }

    let questions;
    if (type === "current-affairs") {
      const texts = Array.isArray(text) ? text : [text];
      questions = await generateCurrentAffairsMCQ(texts);
    } else {
      questions = await generateQuestionsFromNotes(text, 10);
    }

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("POST /api/ai/quiz error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
