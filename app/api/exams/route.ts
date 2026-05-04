import { dbConnect } from "@/lib/mongodb";
import Question from "@/models/QuestionModel";
import ExamModel from "@/models/ExamModel";

type AnyRecord = Record<string, any>;

function normalizeQuestions(rawQuestions: unknown): AnyRecord[] {
  if (!rawQuestions) return [];

  if (typeof rawQuestions === "string") {
    try {
      const parsed = JSON.parse(rawQuestions);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  if (Array.isArray(rawQuestions)) {
    if (rawQuestions.length === 1 && typeof rawQuestions[0] === "string") {
      try {
        const parsed = JSON.parse(rawQuestions[0]);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return rawQuestions as AnyRecord[];
  }

  return [];
}

export async function POST(request: Request) {
  const examData = (await request.json().catch(() => ({}))) as AnyRecord;
  const { userId, config, questions: rawQuestions } = examData ?? {};

  const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();

  await dbConnect();

  const questionsArray = normalizeQuestions(rawQuestions);
  const questionDocs = questionsArray.filter(Boolean).map((q) => ({
    text: q?.text,
    choices: Array.isArray(q?.choices)
      ? q.choices.map((c: AnyRecord) => ({
          text: c?.text,
          isCorrect: Boolean(c?.isCorrect),
        }))
      : [],
  }));

  try {
    const createdQuestions = questionDocs.length > 0 ? await Question.insertMany(questionDocs) : [];

    const newExam = {
      userId,
      joinCode,
      ...(config ?? {}),
      questions: createdQuestions.map((q: AnyRecord) => q._id),
      password: "1234",
    };

    await ExamModel.create(newExam);
    return Response.json({ message: "created", joinCode }, { status: 201 });
  } catch (error: any) {
    return Response.json({ message: error?.message || "failed" }, { status: 401 });
  }
}

export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const joinCode = searchParams.get("joinCode");
  const password = searchParams.get("password");
  if (!joinCode) {
    return Response.json({ message: "joinCode is required" }, { status: 400 });
  }

  try {
    const exam = await ExamModel.findOne({ joinCode }).populate("questions");
    if (!exam) {
      return Response.json({ message: "Exam not found" }, { status: 404 });
    }
    // If an exam has a password set, require it to fetch questions.
    if (exam.password && String(exam.password).length > 0) {
      if (!password || String(password) !== String(exam.password)) {
        return Response.json({ message: "Invalid password" }, { status: 401 });
      }
    }
    const safe = exam.toObject({ virtuals: false }) as AnyRecord;
    safe.questions = (safe.questions || []).map((q: AnyRecord) => ({
      _id: q._id,
      text: q.text,
      choices: (q.choices || []).map((c: AnyRecord) => ({ text: c.text })),
    }));
    // Never leak exam password to clients.
    delete safe.password;
    return Response.json(safe, { status: 200 });
  } catch (error: any) {
    return Response.json({ message: error?.message || "Failed to fetch exam" }, { status: 500 });
  }
}

