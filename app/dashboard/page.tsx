"use server";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { dbConnect } from "@/lib/mongodb";
import ExamModel from "@/models/ExamModel";
import ResultModel from "@/models/ResultModel";
import TeacherDashboard from "@/components/dashboard/TeacherDashboard";
import StudentDashboard from "@/components/dashboard/StudentDashboard";
import type { TeacherExam } from "@/components/dashboard/TeacherDashboard";

type SessionShape = {
  userId?: unknown;
  role?: unknown;
  hasBothRoles?: unknown;
  user?: {
    id?: unknown;
    name?: unknown;
    email?: unknown;
    image?: unknown;
  };
};

type StudentResultRecord = {
  _id?: unknown;
  examId?: unknown;
  examTittle?: unknown;
  submittedAt?: unknown;
  score?: unknown;
  totalMarks?: unknown;
};

function asString(v: unknown): string | null {
  return typeof v === "string" && v.length > 0 ? v : null;
}

function getRoleFromSession(session: unknown): "teacher" | "student" {
  const s = session as SessionShape | null;
  const role = asString(s?.role);
  return role === "teacher" ? "teacher" : "student";
}

function getHasBothRoles(session: unknown): boolean {
  const s = session as SessionShape | null;
  return Boolean(s?.hasBothRoles);
}

function getSessionUser(session: unknown) {
  const s = session as SessionShape | null;
  return {
    id: asString(s?.userId) ?? asString(s?.user?.id),
    name: asString(s?.user?.name),
    email: asString(s?.user?.email),
    image: asString(s?.user?.image),
  };
}

function iso(v: unknown): string {
  if (!v) return "";
  const d = v instanceof Date ? v : new Date(String(v));
  return Number.isFinite(d.getTime()) ? d.toISOString() : "";
}

function asTeacherExamDto(e: Record<string, unknown>, participants: number): TeacherExam {
  const questionCount = Array.isArray(e["questions"]) ? e["questions"].length : 0;
  const marksPerQues =
    typeof e["marksPerQues"] === "number" ? e["marksPerQues"] : Number(e["marksPerQues"]) || 0;
  const calculatedTotalMarks = questionCount * marksPerQues;
  const password = asString(e["password"]);

  return {
    _id: String(e["_id"]),
    title: String(e["title"] ?? ""),
    joinCode: String(e["joinCode"] ?? ""),
    password: password && !password.startsWith("scrypt:") ? password : undefined,
    totalMarks: calculatedTotalMarks || Number(e["totalMarks"]) || 0,
    marksPerQues,
    questionCount,
    durationMinutes:
      typeof e["durationMinutes"] === "number"
        ? e["durationMinutes"]
        : Number(e["durationMinutes"]) || 0,
    startTime: iso(e["startTime"]),
    endTime: iso(e["endTime"]),
    participants: Number(participants) || 0,
    canCancel: new Date(String(e["startTime"])).getTime() > Date.now(),
  };
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/signin");

  const sessionUser = getSessionUser(session);
  const userId = sessionUser.id;
  if (!userId) redirect("/signin");

  await dbConnect();
  const now = new Date();

  const role = getRoleFromSession(session);
  const hasBothRoles = getHasBothRoles(session);

  if (role === "teacher") {
    const exams = await ExamModel.find({ userId }).sort({ startTime: -1 }).lean();
    const examIds = exams.map((e) => e._id);
    const counts = await ResultModel.aggregate([
      { $match: { examId: { $in: examIds } } },
      { $group: { _id: "$examId", participants: { $sum: 1 } } },
    ]);
    const countMap = new Map<string, number>(
      counts.map((c) => [String(c._id), Number(c.participants) || 0]),
    );

    // Convert Mongo ObjectId / BSON values into plain serializable props for Client Components.
    const enriched: TeacherExam[] = exams.map((e) => {
      const id = String((e as { _id?: unknown })?._id);
      return asTeacherExamDto(e as unknown as Record<string, unknown>, countMap.get(id) ?? 0);
    });

    const upcoming = enriched.filter((e) => new Date(e.startTime) > now);
    const ongoing = enriched.filter(
      (e) => new Date(e.startTime) <= now && new Date(e.endTime) >= now,
    );
    const past = enriched.filter((e) => new Date(e.endTime) < now);

    return (
      <TeacherDashboard
        hasBothRoles={hasBothRoles}
        user={{
          name: sessionUser.name ?? "Teacher",
          email: sessionUser.email ?? "",
          image: sessionUser.image ?? "",
          role,
        }}
        upcoming={upcoming}
        ongoing={ongoing}
        past={past}
      />
    );
  }

  // student
  const results = await ResultModel.find({ studentId: userId })
    .populate("examId")
    .sort({ submittedAt: -1 })
    .lean();

  const items = (results as StudentResultRecord[]).map((r) => {
    const totalMarks = Number(r.totalMarks) || 0;
    const score = Number(r.score) || 0;
    const percent = totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0;
    const exam = r.examId as Record<string, unknown> | null;
    return {
      _id: String(r._id),
      examId: exam?._id ? String(exam._id) : String(r.examId),
      title: asString(exam?.title) ?? asString(r.examTittle) ?? "Exam",
      submittedAt: r.submittedAt ? new Date(String(r.submittedAt)).toISOString() : null,
      score,
      totalMarks,
      percent,
    };
  });

  const avg =
    items.length > 0
      ? Math.round(items.reduce((sum, i) => sum + i.percent, 0) / items.length)
      : 0;

  return (
    <StudentDashboard
      hasBothRoles={hasBothRoles}
      user={{
        name: sessionUser.name ?? "Student",
        email: sessionUser.email ?? "",
        image: sessionUser.image ?? "",
        role,
      }}
      averagePercent={avg}
      pastExams={items}
    />
  );
}

