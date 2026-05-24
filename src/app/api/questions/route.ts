import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Question from "@/models/Question";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const subject = searchParams.get("subject") || "";
    const examType = searchParams.get("examType") || "";
    const difficulty = searchParams.get("difficulty") || "";
    const search = searchParams.get("search") || "";

    const filter: Record<string, unknown> = { isPublished: true };
    if (subject) filter.subject = subject;
    if (examType) filter.examType = examType;
    if (difficulty) filter.difficulty = difficulty;
    if (search) {
      filter.$or = [
        { question: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    const [questions, total] = await Promise.all([
      Question.find(filter)
        .sort({ year: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Question.countDocuments(filter),
    ]);

    return NextResponse.json({
      data: questions,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("GET /api/questions error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const body = await req.json();
    const questions = Array.isArray(body)
      ? await Question.insertMany(
          body.map((q: Record<string, unknown>) => ({ ...q, uploadedBy: session.user.id }))
        )
      : await Question.create({ ...body, uploadedBy: session.user.id });
    return NextResponse.json({ data: questions }, { status: 201 });
  } catch (error) {
    console.error("POST /api/questions error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
