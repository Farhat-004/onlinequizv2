import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongodb";
import ExamModel from "@/models/ExamModel";
import ResultModel from "@/models/ResultModel";
import "@/models/UserModel";

type SessionShape = {
  userId?: unknown;
  role?: unknown;
  user?: { id?: unknown };
};

type ResultRecord = {
  _id?: unknown;
  studentId?: {
    name?: unknown;
    email?: unknown;
    image?: unknown;
  } | null;
  score?: unknown;
  totalMarks?: unknown;
  submittedAt?: unknown;
};

function asString(v: unknown): string | null {
  return typeof v === "string" && v.length > 0 ? v : null;
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ examId: string }> },
) {
  const session = await auth();
  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const s = session as SessionShape;
  const userId = asString(s.userId) ?? asString(s.user?.id);
  const role = asString(s.role);
  if (!userId || role !== "teacher") {
    return Response.json({ message: "Forbidden" }, { status: 403 });
  }

  const { examId } = await ctx.params;
  if (!examId) {
    return Response.json({ message: "examId is required" }, { status: 400 });
  }

  await dbConnect();

  const exam = await ExamModel.findOne({ _id: examId, userId }).lean();
  if (!exam) {
    return Response.json({ message: "Exam not found" }, { status: 404 });
  }
  const questionCount = Array.isArray((exam as { questions?: unknown[] }).questions)
    ? (exam as { questions: unknown[] }).questions.length
    : 0;
  const marksPerQues = Number((exam as { marksPerQues?: unknown }).marksPerQues) || 0;
  const examTotalMarks = questionCount * marksPerQues;

  const results = (await ResultModel.find({ examId })
    .populate("studentId", "name email image")
    .sort({ submittedAt: -1 })
    .lean()) as ResultRecord[];

  const mapped = results.map((r) => {
    const totalMarks = examTotalMarks || Number(r.totalMarks) || 0;
    const score = Number(r.score) || 0;
    const percent = totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0;
    const student = r.studentId;
    return {
      _id: String(r._id),
      student: student
        ? {
            name: typeof student.name === "string" ? student.name : "",
            email: typeof student.email === "string" ? student.email : "",
            image: typeof student.image === "string" ? student.image : "",
          }
        : null,
      score,
      totalMarks,
      percent,
      submittedAt: r.submittedAt ? new Date(String(r.submittedAt)).toISOString() : null,
    };
  });

  return Response.json({ results: mapped }, { status: 200 });
}

