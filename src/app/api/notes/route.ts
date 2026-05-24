import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Note from "@/models/Note";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const subject = searchParams.get("subject") || "";
    const examType = searchParams.get("examType") || "";
    const search = searchParams.get("search") || "";

    const filter: Record<string, unknown> = { isPublished: true };
    if (subject) filter.subject = subject;
    if (examType) filter.examType = examType;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const [notes, total] = await Promise.all([
      Note.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("uploadedBy", "name email")
        .lean(),
      Note.countDocuments(filter),
    ]);

    return NextResponse.json({
      data: notes,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("GET /api/notes error:", error);
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
    const note = await Note.create({ ...body, uploadedBy: session.user.id });
    return NextResponse.json({ data: note }, { status: 201 });
  } catch (error) {
    console.error("POST /api/notes error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
