import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Question from "@/models/Question";
import Note from "@/models/Note";
import { predictProbableQuestions } from "@/lib/gemini";
import Prediction from "@/models/Prediction";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { examType, subject } = await req.json();

    if (!examType || !subject) {
      return NextResponse.json({ error: "examType and subject are required" }, { status: 400 });
    }

    const [recentQuestions, notes] = await Promise.all([
      Question.find({ examType, isPublished: true })
        .sort({ year: -1 })
        .limit(20)
        .lean(),
      Note.find({ examType, subject, isPublished: true })
        .limit(10)
        .lean(),
    ]);

    const questionTexts = recentQuestions.map((q) => q.question);
    const noteTexts = notes.map((n) => `${n.title}: ${n.content.slice(0, 200)}`);

    const predictions = await predictProbableQuestions(examType, subject, questionTexts, noteTexts);

    const prediction = await Prediction.create({
      examType,
      subject,
      predictions,
      generatedBy: session.user.id,
      sourceData: {
        recentQuestions: recentQuestions.length,
        notesAnalyzed: notes.length,
      },
    });

    return NextResponse.json(prediction, { status: 201 });
  } catch (error) {
    console.error("POST /api/ai/predict error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
