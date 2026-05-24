import { connectDB } from "@/lib/db";
import Question from "@/models/Question";
import Note from "@/models/Note";
import Prediction from "@/models/Prediction";
import { predictProbableQuestions } from "@/lib/gemini";

const EXAM_TYPES = ["loksewa", "tsc", "provincial", "banking", "security"] as const;
const SUBJECTS = ["Nepali", "English", "General Knowledge", "Mathematics", "Science", "Social Studies"];

export async function generatePredictions() {
  await connectDB();
  let totalPredictions = 0;

  for (const examType of EXAM_TYPES) {
    for (const subject of SUBJECTS) {
      const [recentQuestions, notes] = await Promise.all([
        Question.find({ examType, subject: { $regex: subject, $options: "i" }, isPublished: true })
          .sort({ year: -1 })
          .limit(15)
          .lean(),
        Note.find({ examType, subject: { $regex: subject, $options: "i" }, isPublished: true })
          .limit(5)
          .lean(),
      ]);

      if (recentQuestions.length < 3 && notes.length < 2) continue;

      const questionTexts = recentQuestions.map((q) => q.question);
      const noteTexts = notes.map((n) => `${n.title}: ${n.content.slice(0, 200)}`);

      try {
        const predictions = await predictProbableQuestions(examType, subject, questionTexts, noteTexts);

        if (predictions.length > 0) {
          await Prediction.create({
            examType,
            subject,
            predictions,
            sourceData: {
              recentQuestions: recentQuestions.length,
              notesAnalyzed: notes.length,
            },
          });
          totalPredictions += predictions.length;
        }
      } catch (error) {
        console.error(`Prediction failed for ${examType}/${subject}:`, error);
      }
    }
  }

  console.log(`Generated ${totalPredictions} predictions total.`);
  return { totalPredictions };
}

generatePredictions().catch(console.error);
