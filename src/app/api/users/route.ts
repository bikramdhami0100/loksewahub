import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Notice from "@/models/Notice";
import Note from "@/models/Note";
import MockTest from "@/models/MockTest";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const adminView = searchParams.get("admin") === "true";

    if (adminView) {
      const [totalUsers, totalNotices, totalNotes, activeTests, recentUsers] = await Promise.all([
        User.countDocuments(),
        Notice.countDocuments(),
        Note.countDocuments({ isPublished: true }),
        MockTest.countDocuments({ isPublished: true }),
        User.find().sort({ createdAt: -1 }).limit(5).select("name email role").lean(),
      ]);
      return NextResponse.json({
        data: { totalUsers, totalNotices, totalNotes, activeTests, recentUsers },
      });
    }

    const [users, total] = await Promise.all([
      User.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select("-__v")
        .lean(),
      User.countDocuments(),
    ]);

    return NextResponse.json({
      data: users,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("GET /api/users error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const body = await req.json();
    const allowed = ["name", "preferredLanguage", "emailNotifications"];
    const updates: Record<string, unknown> = {};
    for (const key of allowed) {
      if (body[key] !== undefined) updates[key] = body[key];
    }
    const user = await User.findByIdAndUpdate(session.user.id, updates, { new: true }).select("-__v");
    return NextResponse.json({ data: user });
  } catch (error) {
    console.error("PATCH /api/users error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
