"use client";

import { useMemo } from "react";
import DashboardRoleSwitcher from "@/components/DashboardRoleSwitcher";
import ExamSection from "./TeacherExamSection";

type UserInfo = { name: string; email: string; image?: string; role: "teacher" | "student" };

export type TeacherExam = {
  _id: any;
  title: string;
  joinCode: string;
  totalMarks?: number;
  durationMinutes: number;
  startTime: string | Date;
  endTime: string | Date;
  participants: number;
};

export default function TeacherDashboard({
  hasBothRoles,
  user,
  upcoming,
  ongoing,
  past,
}: {
  hasBothRoles: boolean;
  user: UserInfo;
  upcoming: TeacherExam[];
  ongoing: TeacherExam[];
  past: TeacherExam[];
}) {
  const stats = useMemo(() => {
    const total = upcoming.length + ongoing.length + past.length;
    const participants = [...upcoming, ...ongoing, ...past].reduce(
      (s, e) => s + (Number(e.participants) || 0),
      0,
    );
    return { total, participants };
  }, [upcoming, ongoing, past]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <DashboardRoleSwitcher hasBothRoles={hasBothRoles} />
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm text-gray-600">Dashboard</div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name}</h1>
            <div className="text-sm text-gray-600">{user.email}</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border rounded-lg p-4">
              <div className="text-xs text-gray-500">Total exams</div>
              <div className="text-xl font-semibold text-gray-900">{stats.total}</div>
            </div>
            <div className="bg-white border rounded-lg p-4">
              <div className="text-xs text-gray-500">Total participants</div>
              <div className="text-xl font-semibold text-gray-900">{stats.participants}</div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6">
          <ExamSection title="Ongoing (today)" empty="No ongoing exams right now." exams={ongoing} />
          <ExamSection title="Upcoming" empty="No upcoming exams." exams={upcoming} />
          <ExamSection title="Past exams" empty="No past exams yet." exams={past} />
        </div>
      </div>
    </div>
  );
}

