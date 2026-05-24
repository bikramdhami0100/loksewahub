import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const MODEL = "gemini-2.0-flash";

export interface AIPrediction {
  question: string;
  confidence: number;
  reason: string;
  subject?: string;
  examType?: string;
}

export interface AIQuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const cache = new Map<string, { data: string; ts: number }>();
const CACHE_TTL = 5 * 60 * 1000;

let lastRequestTime = 0;
const MIN_INTERVAL = 2000;

function isQuotaError(error: unknown): boolean {
  if (error && typeof error === "object" && "status" in error) {
    return (error as { status: number }).status === 429;
  }
  if (error instanceof Error && error.message.includes("429")) return true;
  return false;
}

async function rateLimitedGenerate(prompt: string): Promise<string> {
  const now = Date.now();
  const wait = Math.max(0, MIN_INTERVAL - (now - lastRequestTime));
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));

  const model = genAI.getGenerativeModel({ model: MODEL });
  const result = await model.generateContent(prompt);
  lastRequestTime = Date.now();
  const response = result.response;
  return response.text();
}

export async function generateContent(prompt: string): Promise<string> {
  try {
    return await rateLimitedGenerate(prompt);
  } catch (error) {
    console.error("Gemini API error:", error);
    if (isQuotaError(error)) {
      throw new Error("QUOTA_EXCEEDED");
    }
    throw new Error("Failed to generate AI content");
  }
}

export async function predictProbableQuestions(
  examType: string,
  subject: string,
  recentQuestions: string[],
  notes: string[]
): Promise<AIPrediction[]> {
  const prompt = `You are a Nepali government exam expert. Based on the following data, predict the most probable questions that will appear in upcoming ${examType} exams for ${subject}.

Recent questions asked:
${recentQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")}

Key topics from study materials:
${notes.map((n, i) => `${i + 1}. ${n}`).join("\n")}

Return a JSON array of exactly 10 objects with these fields:
- question: string (the predicted question)
- confidence: number (0-100 percentage)
- reason: string (why this question is likely to appear)
- subject: string

Return ONLY the JSON array, no other text.`;

  const text = await generateContent(prompt);
  try {
    const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    return JSON.parse(cleaned) as AIPrediction[];
  } catch {
    return [];
  }
}

export async function generateQuestionsFromNotes(
  notesText: string,
  count: number = 10
): Promise<AIQuizQuestion[]> {
  const prompt = `Based on the following study notes, generate ${count} multiple choice questions.

Notes:
${notesText.slice(0, 3000)}

Return a JSON array of exactly ${count} objects with these fields:
- question: string
- options: string[] (exactly 4 options)
- correctAnswer: number (0-indexed index of correct option)
- explanation: string

Return ONLY the JSON array, no other text.`;

  const text = await generateContent(prompt);
  try {
    const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    return JSON.parse(cleaned) as AIQuizQuestion[];
  } catch {
    return [];
  }
}

export async function generateCurrentAffairsMCQ(
  currentAffairs: string[]
): Promise<AIQuizQuestion[]> {
  const prompt = `Based on the following Nepal current affairs, generate 10 multiple choice questions for exam preparation.

Current Affairs:
${currentAffairs.map((ca, i) => `${i + 1}. ${ca}`).join("\n")}

Return a JSON array of exactly 10 objects with these fields:
- question: string
- options: string[] (exactly 4 options)
- correctAnswer: number (0-indexed index of correct option)
- explanation: string

Return ONLY the JSON array, no other text.`;

  const text = await generateContent(prompt);
  try {
    const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    return JSON.parse(cleaned) as AIQuizQuestion[];
  } catch {
    return [];
  }
}

export async function explainConcept(
  concept: string,
  language: "en" | "ne" = "en"
): Promise<string> {
  const lang = language === "ne" ? "Nepali (नेपाली)" : "English";
  const prompt = `Explain the following concept in simple ${lang} for a Nepali student preparing for government exams. Use simple language and relatable examples.

Concept: ${concept}

Format the response with clear headings and bullet points where appropriate.`;

  return generateContent(prompt);
}

export async function summarizeNotice(noticeText: string): Promise<string> {
  const prompt = `Summarize the following Nepal government notice. Extract key information including:
1. Organization name
2. Notice type (vacancy, result, exam schedule, etc.)
3. Key dates (published date, deadline, exam date)
4. Number of positions (if applicable)
5. Eligibility criteria
6. How to apply

Notice text:
${noticeText.slice(0, 4000)}

Provide a concise, well-structured summary.`;

  return generateContent(prompt);
}

const fallbackResponses: Record<string, { en: string; ne: string }> = {
  default: {
    en: "I'm currently in offline mode due to high demand. Here are some quick tips:\n\n1. **Loksewa preparation** - Focus on the syllabus, practice past questions, and stay updated with current affairs.\n2. **General Knowledge** - Read the daily newspaper, focus on Nepal's history, geography, and constitution.\n3. **Subject-specific** - Review your optional subject thoroughly using the official curriculum.\n\nPlease try again later for AI-powered detailed answers!",
    ne: "म हाल उच्च मागको कारण अफलाइन मोडमा छु। यहाँ केही द्रुत सुझावहरू छन्:\n\n१. **लोकसेवा तयारी** - पाठ्यक्रममा ध्यान दिनुहोस्, विगतका प्रश्नहरू अभ्यास गर्नुहोस्, र समसामयिक घटनाहरूसँग अद्यावधिक रहनुहोस्।\n२. **सामान्य ज्ञान** - दैनिक पत्रपत्रिका पढ्नुहोस्, नेपालको इतिहास, भूगोल र संविधानमा ध्यान दिनुहोस्।\n३. **विषयगत** - आधिकारिक पाठ्यक्रम प्रयोग गरेर आफ्नो वैकल्पिक विषय राम्रोसँग समीक्षा गर्नुहोस्।\n\nकृपया एआई-संचालित विस्तृत जवाफहरूको लागि पछि पुन: प्रयास गर्नुहोस्!",
  },
};

function getCachedOrGenerate(question: string, language: "en" | "ne"): string | null {
  const normalized = question.toLowerCase().trim();
  for (const [key, value] of Object.entries(fallbackResponses)) {
    if (normalized.includes(key)) {
      return language === "ne" ? value.ne : value.en;
    }
  }
  return null;
}

export async function tutorResponse(
  question: string,
  context: string,
  language: "en" | "ne" = "en"
): Promise<string> {
  const cacheKey = `${language}:${question.toLowerCase().trim()}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return cached.data;
  }

  try {
    const lang = language === "ne" ? "Nepali" : "English";
    const prompt = `You are an expert tutor helping a Nepali student prepare for government exams. Answer the following question in ${lang}.

Student's question: ${question}

Relevant context: ${context.slice(0, 2000)}

Provide a clear, helpful answer with examples where possible.`;

    const answer = await generateContent(prompt);
    cache.set(cacheKey, { data: answer, ts: Date.now() });
    return answer;
  } catch (error) {
    if (isQuotaError(error)) {
      const fallback = getCachedOrGenerate(question, language);
      if (fallback) return fallback;
      return language === "ne"
        ? "माफ गर्नुहोस्, हाल AI सेवा अत्यधिक मागको कारण उपलब्ध छैन। कृपया केही समय पछि पुन: प्रयास गर्नुहोस् र हाम्रो सामान्य अध्ययन सुझावहरू प्रयोग गर्नुहोस्।"
        : "Sorry, the AI service is currently unavailable due to high demand. Please try again later and use our general study tips in the meantime.";
    }
    throw error;
  }
}
