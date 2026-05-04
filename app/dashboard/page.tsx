"use server";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { dbConnect } from "@/lib/mongodb";
import ExamModel from "@/models/ExamModel";
import ResultModel from "@/models/ResultModel";
import TeacherDashboard from "@/components/dashboard/TeacherDashboard";
import StudentDashboard from "@/components/dashboard/StudentDashboard";

function asString(v: unknown): string | null {
  return typeof v === "string" && v.length > 0 ? v : null;
}

function getRoleFromSession(session: unknown): "teacher" | "student" {
  const s = session as Record<string, unknown> | null;
  const role = asString(s?.role);
  return role === "teacher" ? "teacher" : "student";
}

function getHasBothRoles(session: unknown): boolean {
  const s = session as Record<string, unknown> | null;
  return Boolean(s?.hasBothRoles);
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/signin");

  const userId = asString((session as any)?.userId) ?? asString((session as any)?.user?.id);
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

    const enriched = exams.map((e) => ({
      ...e,
      participants: countMap.get(String(e._id)) ?? 0,
    }));

    const upcoming = enriched.filter((e) => new Date(e.startTime) > now);
    const ongoing = enriched.filter(
      (e) => new Date(e.startTime) <= now && new Date(e.endTime) >= now,
    );
    const past = enriched.filter((e) => new Date(e.endTime) < now);

    return (
      <TeacherDashboard
        hasBothRoles={hasBothRoles}
        user={{
          name: (session as any)?.user?.name ?? "Teacher",
          email: (session as any)?.user?.email ?? "",
          image: (session as any)?.user?.image ?? "",
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

  const items = results.map((r: any) => {
    const totalMarks = Number(r.totalMarks) || 0;
    const score = Number(r.score) || 0;
    const percent = totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0;
    const exam = r.examId as any;
    return {
      _id: String(r._id),
      examId: exam?._id ? String(exam._id) : String(r.examId),
      title: exam?.title ?? r.examTittle ?? "Exam",
      submittedAt: r.submittedAt ? new Date(r.submittedAt).toISOString() : null,
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
        name: (session as any)?.user?.name ?? "Student",
        email: (session as any)?.user?.email ?? "",
        image: (session as any)?.user?.image ?? "",
        role,
      }}
      averagePercent={avg}
      pastExams={items}
    />
  );
}

