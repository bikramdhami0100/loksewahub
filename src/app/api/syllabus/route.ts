import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Syllabus from "@/models/Syllabus";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const examType = searchParams.get("examType") || "";
    const search = searchParams.get("search") || "";

    const filter: Record<string, unknown> = { isActive: true };
    if (examType) filter.examType = examType;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { organization: { $regex: search, $options: "i" } },
      ];
    }

    const [syllabus, total] = await Promise.all([
      Syllabus.find(filter)
        .sort({ title: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Syllabus.countDocuments(filter),
    ]);

    return NextResponse.json({
      data: syllabus,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("GET /api/syllabus error:", error);
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
    const syllabus = await Syllabus.create({ ...body, uploadedBy: session.user.id });
    return NextResponse.json({ data: syllabus }, { status: 201 });
  } catch (error) {
    console.error("POST /api/syllabus error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
