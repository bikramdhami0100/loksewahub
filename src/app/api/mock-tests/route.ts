import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import MockTest from "@/models/MockTest";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const examType = searchParams.get("examType") || "";
    const subject = searchParams.get("subject") || "";
    const difficulty = searchParams.get("difficulty") || "";

    const filter: Record<string, unknown> = { isPublished: true };
    if (examType) filter.examType = examType;
    if (subject) filter.subject = subject;
    if (difficulty) filter.difficulty = difficulty;

    const [tests, total] = await Promise.all([
      MockTest.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("questions.questionId", "question type difficulty")
        .lean(),
      MockTest.countDocuments(filter),
    ]);

    return NextResponse.json({
      data: tests,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("GET /api/mock-tests error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const body = await req.json();
    const test = await MockTest.create({ ...body, createdBy: session.user.id });
    return NextResponse.json({ data: test }, { status: 201 });
  } catch (error) {
    console.error("POST /api/mock-tests error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
