import { connectDB } from "@/lib/db";
import GovernmentSource from "@/models/GovernmentSource";
import Notice from "@/models/Notice";
import Note from "@/models/Note";
import Syllabus from "@/models/Syllabus";
import Question from "@/models/Question";
import CurrentAffair from "@/models/CurrentAffair";
import MockTest from "@/models/MockTest";
import User from "@/models/User";

async function seed() {
  await connectDB();
  console.log("Connected to MongoDB");

  // Clear existing data
  await Promise.all([
    GovernmentSource.deleteMany({}),
    Notice.deleteMany({}),
    Note.deleteMany({}),
    Syllabus.deleteMany({}),
    Question.deleteMany({}),
    CurrentAffair.deleteMany({}),
    MockTest.deleteMany({}),
  ]);
  console.log("Cleared existing data");

  // Get or create admin user
  let admin = await User.findOne({ role: "admin" });
  if (!admin) {
    admin = await User.create({
      name: "Admin",
      email: "admin@loksewahub.com",
      provider: "google",
      providerId: "admin",
      role: "admin",
    });
  }

  // 1. Seed Government Sources
  const sources = [
    { name: "Loksewa Aayog (PSC)", url: "https://psc.gov.np", type: "exam-authority" as const, category: "PSC" },
    { name: "Teacher Service Commission", url: "https://tsc.gov.np", type: "exam-authority" as const, category: "TSC" },
    { name: "Koshi Province PSC", url: "https://psc.koshi.gov.np", type: "exam-authority" as const, category: "Provincial" },
    { name: "Madhesh Province PSC", url: "https://ppsc.madhesh.gov.np", type: "exam-authority" as const, category: "Provincial" },
    { name: "Bagmati Province PSC", url: "https://spsc.bagamati.gov.np", type: "exam-authority" as const, category: "Provincial" },
    { name: "Gandaki Province PSC", url: "https://ppsc.gandaki.gov.np", type: "exam-authority" as const, category: "Provincial" },
    { name: "Lumbini Province PSC", url: "https://ppsc.lumbini.gov.np", type: "exam-authority" as const, category: "Provincial" },
    { name: "Karnali Province PSC", url: "https://ppsc.karnali.gov.np", type: "exam-authority" as const, category: "Provincial" },
    { name: "Sudurpashchim Province PSC", url: "https://psc.sudurpashchim.gov.np", type: "exam-authority" as const, category: "Provincial" },
    { name: "Nepal Rastra Bank", url: "https://nrb.org.np", type: "ministry" as const, category: "Banking" },
    { name: "Ministry of Finance", url: "https://mof.gov.np", type: "ministry" as const, category: "Ministry" },
    { name: "Nepal Police", url: "https://nepalpolice.gov.np", type: "security" as const, category: "Security" },
    { name: "Armed Police Force", url: "https://apf.gov.np", type: "security" as const, category: "Security" },
    { name: "Nepali Army", url: "https://nepalarmy.mil.np", type: "security" as const, category: "Security" },
    { name: "Gorkhapatra Online", url: "https://gorkhapatraonline.com", type: "news" as const, category: "News" },
    { name: "Rising Nepal", url: "https://risingnepaldaily.com", type: "news" as const, category: "News" },
  ];
  await GovernmentSource.insertMany(sources);
  console.log(`Seeded ${sources.length} government sources`);

  // 2. Seed Notices
  const notices = [
    { title: "Loksewa Aayog: General Administration Officer Vacancy 2081", category: "vacancy", organization: "Loksewa Aayog", source: "Gorkhapatra", originalUrl: "https://psc.gov.np/notice/1", publishedDate: new Date("2026-05-15"), description: "Application open for General Administration Officer position" },
    { title: "TSC: Secondary Level Teacher Result 2080", category: "result", organization: "Teacher Service Commission", source: "TSC Official", originalUrl: "https://tsc.gov.np/result/1", publishedDate: new Date("2026-05-10"), description: "Secondary level teacher exam results published" },
    { title: "Nepal Rastra Bank: Assistant Level Exam Schedule", category: "exam-schedule", organization: "Nepal Rastra Bank", source: "NRB Website", originalUrl: "https://nrb.org.np/exam/1", publishedDate: new Date("2026-05-08"), description: "Exam schedule for assistant level positions" },
    { title: "PSC: Section Officer Interview Program", category: "interview", organization: "Public Service Commission", source: "PSC Website", originalUrl: "https://psc.gov.np/interview/1", publishedDate: new Date("2026-05-05"), description: "Interview schedule for section officer" },
    { title: "Loksewa Aayog: Nayab Subba Admit Card 2081", category: "admit-card", organization: "Loksewa Aayog", source: "Loksewa Aayog", originalUrl: "https://psc.gov.np/admit/1", publishedDate: new Date("2026-05-01"), description: "Admit card available for Nayab Subba exam" },
    { title: "Engineering Service Syllabus Update 2081", category: "syllabus", organization: "PSC", source: "PSC Website", originalUrl: "https://psc.gov.np/syllabus/1", publishedDate: new Date("2026-04-28"), description: "Updated syllabus for engineering service" },
    { title: "Bagmati Province: Local Level Vacancy Notice", category: "vacancy", organization: "Bagmati Province PSC", source: "Provincial PSC", originalUrl: "https://spsc.bagamati.gov.np/notice/1", publishedDate: new Date("2026-04-25"), description: "Various local level positions in Bagmati Province" },
    { title: "Nepal Police: Constable Recruitment Notice", category: "vacancy", organization: "Nepal Police HQ", source: "Nepal Police", originalUrl: "https://nepalpolice.gov.np/notice/1", publishedDate: new Date("2026-04-20"), description: "Recruitment for police constable positions" },
    { title: "Finance Service: Officer Level Exam Result", category: "result", organization: "Loksewa Aayog", source: "Gorkhapatra", originalUrl: "https://psc.gov.np/result/2", publishedDate: new Date("2026-04-15"), description: "Finance service officer exam results" },
    { title: "Health Service Commission: Doctor Vacancy", category: "vacancy", organization: "Health Service Commission", source: "Gorkhapatra", originalUrl: "https://hsc.gov.np/notice/1", publishedDate: new Date("2026-04-10"), description: "Specialist doctor positions in government hospitals" },
    { title: "TSC: Primary Level Teacher Vacancy", category: "vacancy", organization: "Teacher Service Commission", source: "TSC Official", originalUrl: "https://tsc.gov.np/vacancy/1", publishedDate: new Date("2026-04-05"), description: "Primary level teacher recruitment notice" },
    { title: "Nepal Bank Ltd: Officer Interview Schedule", category: "interview", organization: "Nepal Bank Ltd", source: "NBL Website", originalUrl: "https://nepalbank.com.np/interview/1", publishedDate: new Date("2026-04-01"), description: "Interview schedule for officer level" },
    { title: "APF: Inspector Exam Schedule 2081", category: "exam-schedule", organization: "Armed Police Force", source: "APF Website", originalUrl: "https://apf.gov.np/exam/1", publishedDate: new Date("2026-03-28"), description: "Armed Police Force inspector exam schedule" },
    { title: "Agriculture Service: Syllabus Update", category: "syllabus", organization: "Agriculture Service Commission", source: "PSC Website", originalUrl: "https://psc.gov.np/syllabus/2", publishedDate: new Date("2026-03-20"), description: "Updated syllabus for agriculture service" },
  ];
  await Notice.insertMany(notices);
  console.log(`Seeded ${notices.length} notices`);

  // 3. Seed Notes
  const notes = [
    { title: "Nepali Grammar and Composition", subject: "nepali", examType: "loksewa", description: "Comprehensive notes on Nepali grammar rules and essay writing", content: "Nepali grammar notes covering sandhi, samasa, karak, and composition techniques...", isPublished: true, uploadedBy: admin._id, downloadCount: 1234 },
    { title: "English Vocabulary for Government Exams", subject: "english", examType: "loksewa", description: "Important English vocabulary with meanings for competitive exams", content: "Top 500 vocabulary words frequently asked in Loksewa exams...", isPublished: true, uploadedBy: admin._id, downloadCount: 2345 },
    { title: "Arithmetic and Mathematics Fundamentals", subject: "math", examType: "banking", description: "Basic to advanced mathematics for Loksewa and banking exams", content: "Topics: Ratio, Percentage, Time & Work, Profit & Loss, Data Interpretation...", isPublished: true, uploadedBy: admin._id, downloadCount: 3456 },
    { title: "General Knowledge of Nepal", subject: "gk", examType: "loksewa", description: "Complete GK covering Nepali history, geography, and current affairs", content: "Nepal history from unification to present, geography, constitutional development...", isPublished: true, uploadedBy: admin._id, downloadCount: 4567 },
    { title: "Social Studies for TSC", subject: "social", examType: "tsc", description: "Social studies notes for TSC and Loksewa exams", content: "Nepali society, culture, social transformation, and development...", isPublished: true, uploadedBy: admin._id, downloadCount: 1567 },
    { title: "Economics for Banking Exams", subject: "economics", examType: "banking", description: "Micro and macro economics for banking examinations", content: "Banking terminology, monetary policy, fiscal policy, Nepal economy...", isPublished: true, uploadedBy: admin._id, downloadCount: 2678 },
    { title: "Constitution and Law Notes", subject: "law", examType: "loksewa", description: "Nepal constitution, legal provisions, and administrative law", content: "Constitution of Nepal 2072, legal provisions, administrative law principles...", isPublished: true, uploadedBy: admin._id, downloadCount: 1876 },
    { title: "Accounting Principles", subject: "accounting", examType: "loksewa", description: "Fundamental accounting principles for government exams", content: "Double-entry system, trial balance, final accounts, government accounting...", isPublished: true, uploadedBy: admin._id, downloadCount: 987 },
    { title: "Public Administration", subject: "management", examType: "loksewa", description: "Public administration and management for Loksewa exams", content: "Administrative theories, Nepal's administrative system, governance...", isPublished: true, uploadedBy: admin._id, downloadCount: 2134 },
    { title: "Science and Technology", subject: "science", examType: "tsc", description: "General science and technology for competitive exams", content: "Physics, chemistry, biology basics, IT developments in Nepal...", isPublished: true, uploadedBy: admin._id, downloadCount: 3210 },
  ];
  await Note.insertMany(notes);
  console.log(`Seeded ${notes.length} notes`);

  // 4. Seed Syllabus
  const syllabus = [
    { title: "General Administration Service Syllabus", examType: "loksewa", organization: "Loksewa Aayog", description: "Complete syllabus for General Administration Officer", topics: [{ name: "Nepali Language", subtopics: ["Grammar", "Composition"], weightage: 20 }, { name: "English", subtopics: ["Grammar", "Comprehension"], weightage: 15 }, { name: "General Knowledge", subtopics: ["Nepal History", "Geography"], weightage: 25 }, { name: "Public Administration", subtopics: ["Theories", "Nepal Context"], weightage: 25 }, { name: "Mathematics", subtopics: ["Arithmetic", "Statistics"], weightage: 15 }], isActive: true, uploadedBy: admin._id },
    { title: "Secondary Level Teacher Syllabus", examType: "tsc", organization: "Teacher Service Commission", description: "Syllabus for secondary level TSC exam", topics: [{ name: "Teaching Methodology", subtopics: ["Pedagogy", "Assessment"], weightage: 20 }, { name: "Subject Knowledge", subtopics: ["Major Subject"], weightage: 50 }, { name: "Nepali Language", subtopics: ["Grammar"], weightage: 15 }, { name: "General Knowledge", subtopics: ["Current Affairs"], weightage: 15 }], isActive: true, uploadedBy: admin._id },
    { title: "Bank Assistant Level Syllabus", examType: "banking", organization: "Nepal Rastra Bank", description: "Syllabus for assistant level banking exam", topics: [{ name: "English", subtopics: ["Grammar", "Vocabulary"], weightage: 15 }, { name: "Nepali", subtopics: ["Grammar"], weightage: 10 }, { name: "Quantitative Aptitude", subtopics: ["Arithmetic", "Data Interpretation"], weightage: 25 }, { name: "General Awareness", subtopics: ["Banking", "Economy"], weightage: 25 }, { name: "Computer Knowledge", subtopics: ["Basics", "MS Office"], weightage: 10 }, { name: "Reasoning", subtopics: ["Logical", "Analytical"], weightage: 15 }], isActive: true, uploadedBy: admin._id },
  ];
  await Syllabus.insertMany(syllabus);
  console.log(`Seeded ${syllabus.length} syllabus entries`);

  // 5. Seed Questions
  const questions = [
    { question: "नेपालको संविधान २०७२ कहिले जारी भएको हो?", type: "mcq", subject: "gk", examType: "loksewa", year: 2080, difficulty: "easy", options: ["२०७२ असोज ३", "२०७२ वैशाख १", "२०७२ माघ १", "२०७२ जेठ १"], correctAnswer: "a", isPublished: true, uploadedBy: admin._id, tags: ["constitution", "nepal"] },
    { question: "What is the capital of Province 1?", type: "mcq", subject: "gk", examType: "loksewa", year: 2080, difficulty: "easy", options: ["Biratnagar", "Dharan", "Itahari", "Damak"], correctAnswer: "a", isPublished: true, uploadedBy: admin._id, tags: ["province", "geography"] },
    { question: "नेपाल राष्ट्र बैंकको स्थापना कहिले भएको हो?", type: "mcq", subject: "economics", examType: "banking", year: 2080, difficulty: "medium", options: ["२०१३ साल", "२०१२ साल", "२०१४ साल", "२०१५ साल"], correctAnswer: "a", isPublished: true, uploadedBy: admin._id, tags: ["banking", "nrb"] },
    { question: "What is the principle of checks and balances?", type: "short-answer", subject: "law", examType: "loksewa", year: 2079, difficulty: "medium", correctAnswer: "A system that ensures no branch of government becomes too powerful by allowing each branch to limit the powers of the others.", explanation: "This is a fundamental principle of democratic governance.", isPublished: true, uploadedBy: admin._id, tags: ["constitution", "governance"] },
    { question: "Explain the role of Public Service Commission in Nepal.", type: "descriptive", subject: "gk", examType: "loksewa", year: 2079, difficulty: "hard", isPublished: true, uploadedBy: admin._id, tags: ["psc", "governance"] },
    { question: "If a train travels 360 km in 4 hours, what is its speed?", type: "mcq", subject: "math", examType: "loksewa", year: 2080, difficulty: "easy", options: ["80 km/h", "90 km/h", "100 km/h", "70 km/h"], correctAnswer: "b", isPublished: true, uploadedBy: admin._id, tags: ["speed", "arithmetic"] },
    { question: "What is the currency of Nepal?", type: "one-liner", subject: "gk", examType: "loksewa", year: 2080, difficulty: "easy", correctAnswer: "Nepalese Rupee (Rs.)", isPublished: true, uploadedBy: admin._id, tags: ["currency", "nepal"] },
    { question: "Who is the current Governor of Nepal Rastra Bank?", type: "mcq", subject: "economics", examType: "banking", year: 2081, difficulty: "medium", options: ["Mahavir Prasad Adhikari", "Chiranjibi Nepal", "Prakash Sharan Mahat", "Bamdev Gautam"], correctAnswer: "a", isPublished: true, uploadedBy: admin._id, tags: ["nrb", "governor"] },
    { question: "संघीय संसदमा कति सदस्य हुन्छन्?", type: "mcq", subject: "gk", examType: "loksewa", year: 2080, difficulty: "medium", options: ["२७५", "३३४", "३००", "३५०"], correctAnswer: "b", isPublished: true, uploadedBy: admin._id, tags: ["parliament", "federal"] },
    { question: "What is Gross Domestic Product (GDP)?", type: "short-answer", subject: "economics", examType: "banking", year: 2080, difficulty: "easy", correctAnswer: "The total monetary value of all finished goods and services produced within a country's borders in a specific time period.", isPublished: true, uploadedBy: admin._id, tags: ["gdp", "economy"] },
  ];
  await Question.insertMany(questions);
  console.log(`Seeded ${questions.length} questions`);

  // 6. Seed Current Affairs
  const currentAffairs = [
    { title: "Nepal Budget 2082/83 Presented in Parliament", content: "Finance Minister presented the annual budget of Rs. 1.79 trillion for fiscal year 2082/83 in the federal parliament. The budget prioritizes infrastructure development, education, and healthcare.", category: "economy", summary: "Finance Minister presented the annual budget of Rs. 1.79 trillion for fiscal year 2082/83.", date: new Date("2026-05-15"), source: "Gorkhapatra", sourceUrl: "https://gorkhapatraonline.com", isPublished: true, tags: ["budget", "economy"] },
    { title: "New Ambassador Appointed to India", content: "Government appoints new Nepali ambassador to India. The new ambassador will focus on strengthening bilateral ties.", category: "appointment", summary: "Government appoints new Nepali ambassador to India.", date: new Date("2026-05-12"), source: "Rising Nepal", sourceUrl: "https://risingnepaldaily.com", isPublished: true, tags: ["diplomacy", "appointment"] },
    { title: "Sagarmatha (Everest) Spring Season Climbers", content: "Record number of climbers summit Mount Everest this spring season. Over 600 climbers successfully reached the peak.", category: "sports", summary: "Record number of climbers summit Mount Everest this spring season.", date: new Date("2026-05-10"), source: "Gorkhapatra", sourceUrl: "https://gorkhapatraonline.com", isPublished: true, tags: ["everest", "sports"] },
    { title: "Nepal and China Sign Trade Agreement", content: "Nepal and China signed a new bilateral trade agreement to boost economic cooperation between the two nations.", category: "international", summary: "Nepal and China signed a new bilateral trade agreement to boost economic cooperation.", date: new Date("2026-05-08"), source: "RSS", sourceUrl: "https://gorkhapatraonline.com", isPublished: true, tags: ["china", "trade"] },
    { title: "Cabinet Decision: New Ministry Formation", content: "Cabinet decides to form a new ministry for technology and innovation to drive digital transformation.", category: "politics", summary: "Cabinet decides to form a new ministry for technology and innovation.", date: new Date("2026-05-05"), source: "Gorkhapatra", sourceUrl: "https://gorkhapatraonline.com", isPublished: true, tags: ["cabinet", "politics"] },
    { title: "Nepal's GDP Growth Projected at 5.2%", content: "Asian Development Bank projects Nepal's GDP growth at 5.2% for current fiscal year, driven by agriculture and services.", category: "economy", summary: "Asian Development Bank projects Nepal's GDP growth at 5.2% for current fiscal year.", date: new Date("2026-05-01"), source: "Rising Nepal", sourceUrl: "https://risingnepaldaily.com", isPublished: true, tags: ["gdp", "economy"] },
    { title: "Earthquake Aftershocks in Far-Western Nepal", content: "Series of mild aftershocks recorded in far-western districts. No major damage reported so far.", category: "disaster", summary: "Series of mild aftershocks recorded in far-western districts.", date: new Date("2026-04-28"), source: "RSS", sourceUrl: "https://gorkhapatraonline.com", isPublished: true, tags: ["earthquake", "disaster"] },
    { title: "Pashupatinath Temple Gets New Head Priest", content: "New chief priest appointed at Pashupatinath Temple. The appointment was made by the temple trust committee.", category: "appointment", summary: "New chief priest appointed at Pashupatinath Temple.", date: new Date("2026-04-25"), source: "Gorkhapatra", sourceUrl: "https://gorkhapatraonline.com", isPublished: true, tags: ["religion", "appointment"] },
    { title: "Nepal Wins Silver in SAFF Championship", content: "Nepal national football team wins silver medal in SAFF Championship after a hard-fought tournament.", category: "sports", summary: "Nepal national football team wins silver medal in SAFF Championship.", date: new Date("2026-04-20"), source: "Rising Nepal", sourceUrl: "https://risingnepaldaily.com", isPublished: true, tags: ["football", "saff"] },
    { title: "New Medical College Established in Karnali", content: "Government announces establishment of a new medical college in Karnali Province to improve healthcare access.", category: "politics", summary: "Government announces establishment of a new medical college in Karnali Province.", date: new Date("2026-04-15"), source: "Gorkhapatra", sourceUrl: "https://gorkhapatraonline.com", isPublished: true, tags: ["health", "education"] },
    { title: "Nepal Telecom Launches 5G Services", content: "Nepal Telecom officially launches 5G services in major cities across the country.", category: "science", summary: "Nepal Telecom officially launches 5G services in major cities.", date: new Date("2026-04-10"), source: "RSS", sourceUrl: "https://gorkhapatraonline.com", isPublished: true, tags: ["technology", "telecom"] },
    { title: "National Poet Madhav Prasad Ghimire Honored", content: "National poet Madhav Prasad Ghimire honored with lifetime achievement award for his contribution to Nepali literature.", category: "award", summary: "National poet Madhav Prasad Ghimire honored with lifetime achievement award.", date: new Date("2026-04-05"), source: "Gorkhapatra", sourceUrl: "https://gorkhapatraonline.com", isPublished: true, tags: ["literature", "award"] },
  ];
  await CurrentAffair.insertMany(currentAffairs);
  console.log(`Seeded ${currentAffairs.length} current affairs`);

  // 7. Seed Mock Tests
  const questionIds = await Question.find({ type: "mcq" }).limit(5).lean();
  const mockTests = [
    { title: "Loksewa General Knowledge Mock Test 1", examType: "loksewa", subject: "gk", description: "Test your general knowledge for Loksewa exams", questions: questionIds.map((q) => ({ questionId: q._id, marks: 1, negativeMarks: 0.25 })), duration: 30, totalMarks: questionIds.length, passingMarks: 40, negativeMarking: true, difficulty: "medium", isPublished: true, isFree: true, createdBy: admin._id },
    { title: "Banking Awareness Practice Test", examType: "banking", subject: "economics", description: "Practice test for banking and financial awareness", questions: questionIds.slice(0, 3).map((q) => ({ questionId: q._id, marks: 1, negativeMarks: 0.25 })), duration: 20, totalMarks: 3, passingMarks: 40, negativeMarking: true, difficulty: "easy", isPublished: true, isFree: true, createdBy: admin._id },
    { title: "TSC Teaching License Mock Test", examType: "tsc", subject: "social", description: "Mock test for teaching license exam preparation", questions: questionIds.slice(0, 4).map((q) => ({ questionId: q._id, marks: 2, negativeMarks: 0.5 })), duration: 45, totalMarks: 8, passingMarks: 40, negativeMarking: true, difficulty: "hard", isPublished: true, isFree: true, createdBy: admin._id },
  ];
  await MockTest.insertMany(mockTests);
  console.log(`Seeded ${mockTests.length} mock tests`);

  console.log("\n✅ Seeding complete!");
  console.log(`  - ${sources.length} Government Sources`);
  console.log(`  - ${notices.length} Notices`);
  console.log(`  - ${notes.length} Notes`);
  console.log(`  - ${syllabus.length} Syllabus Entries`);
  console.log(`  - ${questions.length} Questions`);
  console.log(`  - ${currentAffairs.length} Current Affairs`);
  console.log(`  - ${mockTests.length} Mock Tests`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
