import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongodb";
import { verifyPassword } from "@/lib/password";
import ExamModel from "@/models/ExamModel";
import ResultModel from "@/models/ResultModel";
import "@/models/QuestionModel";

type SessionShape = {
    userId?: unknown;
    user?: { id?: unknown; _id?: unknown };
};

type QuestionShape = {
    _id?: unknown;
    choices?: { isCorrect?: unknown }[];
};

type ExamShape = {
    _id?: unknown;
    userId?: unknown;
    title?: unknown;
    password?: unknown;
    startTime?: unknown;
    endTime?: unknown;
    marksPerQues?: unknown;
    totalMarks?: unknown;
    questions?: QuestionShape[];
};

type ResultShape = {
    _id?: unknown;
    score?: unknown;
    totalMarks?: unknown;
    correctCount?: unknown;
    totalQuestions?: unknown;
};

type AnswerResult = {
    questionId: string | null;
    selectedIndex: number | null;
    correctIndex: number;
    correct: boolean;
};

function asObjectIdString(v: unknown): string | null {
    if (!v) return null;
    if (typeof v === "string" && v.length > 0) return v;
    if (typeof v === "object" && "toString" in v) {
        const value = v.toString();
        return value && value !== "[object Object]" ? value : null;
    }
    return null;
}

function getSessionUserId(session: unknown): string | null {
    const s = session as SessionShape | null;
    return asObjectIdString(s?.userId || s?.user?.id || s?.user?._id);
}

function examTotalMarks(exam: ExamShape): number {
    const questions = Array.isArray(exam.questions) ? exam.questions : [];
    const marksPerQues = Number(exam.marksPerQues) || 0;
    return Math.round(questions.length * marksPerQues);
}

function serializeExistingResult(existing: ResultShape, totalMarks?: number) {
    return {
        message: "already_submitted",
        resultId: asObjectIdString(existing._id),
        score: Number(existing.score) || 0,
        totalMarks: totalMarks || Number(existing.totalMarks) || 0,
        correctCount: Number(existing.correctCount) || 0,
        totalQuestions: Number(existing.totalQuestions) || 0,
        perQuestion: [],
    };
}

export async function POST(request: NextRequest) {
    const session = await auth();
    const studentId = getSessionUserId(session);
    if (!studentId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const bodyRecord = body as Record<string, unknown>;
    const joinCode = bodyRecord.joinCode;
    const password = typeof bodyRecord.password === "string" ? bodyRecord.password : "";
    const answers =
        bodyRecord.answers && typeof bodyRecord.answers === "object" ?
            (bodyRecord.answers as Record<string, unknown>)
        :   {};

    if (!joinCode) {
        return NextResponse.json(
            { message: "joinCode is required" },
            { status: 400 },
        );
    }

    await dbConnect();

    const exam = (await ExamModel.findOne({ joinCode }).populate("questions")) as ExamShape | null;
    if (!exam) {
        return NextResponse.json({ message: "Exam not found" }, { status: 404 });
    }
    const storedPassword = typeof exam.password === "string" ? exam.password : "";
    if (storedPassword) {
        const passwordOk =
            storedPassword.startsWith("scrypt:") ?
                verifyPassword(password, storedPassword)
            :   password === storedPassword;
        if (!passwordOk) {
            return NextResponse.json({ message: "Invalid password" }, { status: 401 });
        }
    }

    const now = Date.now();
    const startMs = new Date(String(exam.startTime)).getTime();
    const endMs = new Date(String(exam.endTime)).getTime();
    if (Number.isFinite(startMs) && now < startMs) {
        return NextResponse.json({ message: "Exam has not started yet" }, { status: 403 });
    }
    if (Number.isFinite(endMs) && now > endMs) {
        return NextResponse.json({ message: "Exam has already ended" }, { status: 403 });
    }

    const existing = (await ResultModel.findOne({
        studentId,
        examId: exam._id,
    }).lean()) as ResultShape | null;
    if (existing) {
        return NextResponse.json(serializeExistingResult(existing, examTotalMarks(exam)), { status: 200 });
    }

    const questions = Array.isArray(exam.questions) ? exam.questions : [];
    const totalQuestions = questions.length;

    const marksPerQues =
        typeof exam.marksPerQues === "number" ? exam.marksPerQues
        : typeof exam.totalMarks === "number" && totalQuestions > 0 ?
            exam.totalMarks / totalQuestions
        :   1;

    const totalMarks = Math.round(marksPerQues * totalQuestions);

    const perQuestion: AnswerResult[] = questions.map((q) => {
        const qid = asObjectIdString(q?._id);
        const selectedRaw = qid ? answers[qid] : null;
        const selectedIndex =
            Number.isInteger(selectedRaw) ? Number(selectedRaw) : null;

        const correctIndex =
            Array.isArray(q?.choices) ?
                q.choices.findIndex((c) => Boolean(c?.isCorrect))
            :   -1;

        const boundedSelected =
            (
                selectedIndex !== null &&
                selectedIndex >= 0 &&
                selectedIndex < (q?.choices?.length || 0)
            ) ?
                selectedIndex
            :   null;

        const correct =
            boundedSelected !== null && boundedSelected === correctIndex;
        return {
            questionId: qid,
            selectedIndex: boundedSelected,
            correctIndex,
            correct,
        };
    });

    const correctCount = perQuestion.filter((pq) => pq.correct).length;
    const score = Math.round(correctCount * marksPerQues);

    const resultDoc = await ResultModel.create({
        studentId,
        examTittle: exam.title,
        examinerId: exam.userId,
        examId: exam._id,
        score,
        totalMarks,
        correctCount,
        totalQuestions,
        answers: perQuestion.map((pq) => ({
            questionId: pq.questionId,
            selectedIndex: pq.selectedIndex,
            correct: pq.correct,
        })),
        submittedAt: new Date(),
    });

    return NextResponse.json(
        {
            message: "submitted",
            resultId: asObjectIdString((resultDoc as { _id?: unknown })?._id),
            score,
            totalMarks,
            correctCount,
            totalQuestions,
            perQuestion,
        },
        { status: 201 },
    );
}

export async function GET(req: NextRequest) {
    const session = await auth();
    const studentId = getSessionUserId(session);
    if (!studentId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const joinCode = searchParams.get("joinCode");
    if (!joinCode) {
        return NextResponse.json(
            { message: "joinCode is required" },
            { status: 400 },
        );
    }

    await dbConnect();
    const exam = (await ExamModel.findOne({ joinCode }).lean()) as ExamShape | null;
    if (!exam) {
        return NextResponse.json({ message: "Exam not found" }, { status: 404 });
    }

    const existing = (await ResultModel.findOne({
        studentId,
        examId: exam._id,
    }).lean()) as ResultShape | null;

    if (!existing) {
        return NextResponse.json({ submitted: false }, { status: 200 });
    }

    return NextResponse.json(
        {
            submitted: true,
            message: "already_submitted",
            resultId: asObjectIdString(existing._id),
            score: Number(existing.score) || 0,
            totalMarks: Number(existing.totalMarks) || 0,
            correctCount: Number(existing.correctCount) || 0,
            totalQuestions: Number(existing.totalQuestions) || 0,
        },
        { status: 200 },
    );
}
