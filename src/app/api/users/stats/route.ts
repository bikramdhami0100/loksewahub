import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { auth } from "@/lib/auth";
import User from "@/models/User";
import Bookmark from "@/models/Bookmark";
import Attempt from "@/models/Attempt";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const userId = session.user.id;

    const bookmarked = await Bookmark.countDocuments({ user: userId });

    const attempts = await Attempt.find({ user: userId, status: "completed" }).lean();
    const questionsAttempted = attempts.reduce((sum, a) => sum + (a.correctAnswers + a.incorrectAnswers), 0);
    const totalCorrect = attempts.reduce((sum, a) => sum + a.correctAnswers, 0);
    const accuracy = questionsAttempted > 0 ? Math.round((totalCorrect / questionsAttempted) * 100) : 0;
    const testsTaken = attempts.length;

    const recentActivity = attempts
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map((a) => ({
        title: `Completed mock test - Score: ${a.percentage}%`,
        date: new Date(a.createdAt).toLocaleDateString(),
      }));

    return NextResponse.json({
      data: { bookmarked, questionsAttempted, accuracy, testsTaken, recentActivity },
    });
  } catch (error) {
    console.error("GET /api/users/stats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
