import { NextRequest, NextResponse } from "next/server";
import { tutorResponse } from "@/lib/gemini";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { question, context, language } = await req.json();
    if (!question) {
      return NextResponse.json({ error: "question is required" }, { status: 400 });
    }

    const answer = await tutorResponse(question, context || "", language || "en");
    return NextResponse.json({ answer });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    console.error("POST /api/ai/tutor error:", msg);

    if (msg === "QUOTA_EXCEEDED") {
      return NextResponse.json(
        { error: "AI service quota exceeded. Using offline mode.", offline: true },
        { status: 200 }
      );
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
