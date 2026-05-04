import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongodb";
import ExamModel from "@/models/ExamModel";
import ResultModel from "@/models/ResultModel";

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

  const userId = asString((session as any)?.userId) ?? asString((session as any)?.user?.id);
  const role = asString((session as any)?.role);
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

  const results = await ResultModel.find({ examId })
    .populate("studentId", "name email image")
    .sort({ submittedAt: -1 })
    .lean();

  const mapped = results.map((r: any) => {
    const totalMarks = Number(r.totalMarks) || 0;
    const score = Number(r.score) || 0;
    const percent = totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0;
    const s = r.studentId as any;
    return {
      _id: String(r._id),
      student: s
        ? {
            name: s.name,
            email: s.email,
            image: s.image,
          }
        : null,
      score,
      totalMarks,
      percent,
      submittedAt: r.submittedAt ? new Date(r.submittedAt).toISOString() : null,
    };
  });

  return Response.json({ results: mapped }, { status: 200 });
}

