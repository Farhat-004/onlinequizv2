import { randomBytes } from "crypto";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongodb";
import { verifyPassword } from "@/lib/password";
import ExamModel from "@/models/ExamModel";
import QuestionModel from "@/models/QuestionModel";

type ChoiceInput = {
  text?: unknown;
  isCorrect?: unknown;
};

type QuestionInput = {
  text?: unknown;
  choices?: ChoiceInput[];
};

type ExamBody = {
  config?: {
    title?: unknown;
    password?: unknown;
    durationMinutes?: unknown;
    marksPerQues?: unknown;
    startTime?: unknown;
    endTime?: unknown;
  };
  questions?: QuestionInput[];
};

type ExamRecord = Record<string, unknown> & {
  questions?: unknown[];
};

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asPositiveNumber(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function sessionValue(session: unknown, key: string): string | null {
  const record = session as Record<string, unknown> | null;
  const value = record?.[key];
  return typeof value === "string" && value.length > 0 ? value : null;
}

function sessionUserId(session: unknown): string | null {
  const record = session as { userId?: unknown; user?: { id?: unknown } } | null;
  return asString(record?.userId) || asString(record?.user?.id) || null;
}

async function createJoinCode(): Promise<string> {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const code = randomBytes(4).toString("hex").toUpperCase();
    const existing = await ExamModel.exists({ joinCode: code });
    if (!existing) return code;
  }
  throw new Error("Unable to generate unique join code");
}

function serializeExam(exam: ExamRecord) {
  const questions = Array.isArray(exam.questions) ? exam.questions : [];
  const marksPerQues = Number(exam.marksPerQues) || 0;

  return {
    _id: String(exam._id),
    userId: String(exam.userId),
    joinCode: String(exam.joinCode),
    title: String(exam.title ?? ""),
    durationMinutes: Number(exam.durationMinutes) || 0,
    startTime: exam.startTime ? new Date(String(exam.startTime)).toISOString() : null,
    endTime: exam.endTime ? new Date(String(exam.endTime)).toISOString() : null,
    marksPerQues,
    totalMarks: questions.length * marksPerQues,
    questions: questions.map((rawQuestion) => {
      const question = rawQuestion as Record<string, unknown>;
      const choices = Array.isArray(question.choices) ? question.choices : [];

      return {
        _id: String(question._id),
        text: String(question.text ?? ""),
        choices: choices.map((rawChoice) => {
          const choice = rawChoice as Record<string, unknown>;
          return { text: String(choice.text ?? "") };
        }),
      };
    }),
  };
}

export async function POST(request: Request) {
  const session = await auth();
  const userId = sessionValue(session, "userId");
  const role = sessionValue(session, "role");

  if (!userId) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (role !== "teacher") {
    return Response.json({ message: "Only teachers can create exams" }, { status: 403 });
  }

  let body: ExamBody;
  try {
    body = (await request.json()) as ExamBody;
  } catch {
    return Response.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const title = asString(body.config?.title);
  const password = asString(body.config?.password);
  const durationMinutes = asPositiveNumber(body.config?.durationMinutes);
  const marksPerQues = asPositiveNumber(body.config?.marksPerQues);
  const startTime = new Date(asString(body.config?.startTime));
  const endTime = new Date(asString(body.config?.endTime));
  const questions = Array.isArray(body.questions) ? body.questions : [];

  if (!title || !password || !durationMinutes || !marksPerQues) {
    return Response.json({ message: "Missing required exam fields" }, { status: 400 });
  }
  if (!Number.isFinite(startTime.getTime()) || !Number.isFinite(endTime.getTime())) {
    return Response.json({ message: "Invalid exam start or end time" }, { status: 400 });
  }
  if (endTime <= startTime) {
    return Response.json({ message: "End time must be after start time" }, { status: 400 });
  }
  if (questions.length === 0) {
    return Response.json({ message: "At least one question is required" }, { status: 400 });
  }

  let questionDocs: { text: string; choices: { text: string; isCorrect: boolean }[] }[];
  try {
    questionDocs = questions.map((question, index) => {
      const text = asString(question.text);
      const choices = Array.isArray(question.choices) ? question.choices : [];
      const normalizedChoices = choices.map((choice) => ({
        text: asString(choice.text),
        isCorrect: Boolean(choice.isCorrect),
      }));
      const correctCount = normalizedChoices.filter((choice) => choice.isCorrect).length;

      if (!text) throw new Error(`Question ${index + 1} is missing text`);
      if (normalizedChoices.length < 2) throw new Error(`Question ${index + 1} needs at least two choices`);
      if (normalizedChoices.some((choice) => !choice.text)) {
        throw new Error(`Question ${index + 1} has an empty choice`);
      }
      if (correctCount !== 1) throw new Error(`Question ${index + 1} must have exactly one correct answer`);

      return { text, choices: normalizedChoices };
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid questions";
    return Response.json({ message }, { status: 400 });
  }

  await dbConnect();

  try {
    const createdQuestions = await QuestionModel.insertMany(questionDocs);
    const joinCode = await createJoinCode();
    const totalMarks = createdQuestions.length * marksPerQues;

    await ExamModel.create({
      userId,
      joinCode,
      title,
      password,
      durationMinutes,
      marksPerQues,
      totalMarks,
      startTime,
      endTime,
      questions: createdQuestions.map((question) => question._id),
    });

    return Response.json({ message: "created", joinCode, password, totalMarks }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create exam";
    return Response.json({ message }, { status: 400 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const joinCode = asString(searchParams.get("joinCode"));
  const password = asString(searchParams.get("password"));

  if (!joinCode) {
    return Response.json({ message: "joinCode is required" }, { status: 400 });
  }

  await dbConnect();

  try {
    const exam = (await ExamModel.findOne({ joinCode }).populate("questions").lean()) as ExamRecord | null;
    if (!exam) {
      return Response.json({ message: "Exam not found" }, { status: 404 });
    }

    const storedPassword = asString((exam as { password?: unknown }).password);
    if (storedPassword) {
      const validPassword = storedPassword.startsWith("scrypt:")
        ? verifyPassword(password, storedPassword)
        : password === storedPassword;
      if (!validPassword) {
        return Response.json({ message: "Invalid password" }, { status: 401 });
      }
    }

    return Response.json(serializeExam(exam), { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch exam";
    return Response.json({ message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await auth();
  const userId = sessionUserId(session);
  const role = sessionValue(session, "role");

  if (!userId) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (role !== "teacher") {
    return Response.json({ message: "Only teachers can cancel exams" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const examId = asString(searchParams.get("examId"));
  if (!examId) {
    return Response.json({ message: "examId is required" }, { status: 400 });
  }

  await dbConnect();

  const exam = (await ExamModel.findOne({ _id: examId, userId }).lean()) as ExamRecord | null;
  if (!exam) {
    return Response.json({ message: "Exam not found" }, { status: 404 });
  }

  const startMs = new Date(String(exam.startTime)).getTime();
  if (!Number.isFinite(startMs) || startMs <= Date.now()) {
    return Response.json({ message: "Only exams that have not started can be cancelled" }, { status: 409 });
  }

  const questionIds = Array.isArray(exam.questions) ? exam.questions : [];
  await ExamModel.deleteOne({ _id: examId, userId });
  if (questionIds.length > 0) {
    await QuestionModel.deleteMany({ _id: { $in: questionIds } });
  }

  return Response.json({ message: "cancelled" }, { status: 200 });
}
