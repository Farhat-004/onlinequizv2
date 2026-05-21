import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongodb";
import ExamModel from "@/models/ExamModel";
import ResultModel from "@/models/ResultModel";

function asObjectIdString(v: unknown): string | null {
    if (!v) return null;
    if (typeof v === "string") return v;
    if (typeof v === "object" && typeof (v as any).toString === "function")
        return (v as any).toString();
    return null;
}

export async function POST(request: NextRequest) {
    const session = await auth();
    const studentId = asObjectIdString(
        (session as any)?.userId || (session as any)?.user?.id || (session as any)?.user?._id,
    );
    if (!studentId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const joinCode = (body as any)?.joinCode;
    const answers =
        (body as any)?.answers && typeof (body as any).answers === "object" ? (body as any).answers : {};

    if (!joinCode) {
        return NextResponse.json(
            { message: "joinCode is required" },
            { status: 400 },
        );
    }

    await dbConnect();

    const exam = await ExamModel.findOne({ joinCode }).populate("questions");
    if (!exam) {
        return NextResponse.json({ message: "Exam not found" }, { status: 404 });
    }

    const existing = await ResultModel.findOne({
        studentId,
        examId: exam._id,
    }).lean();
    if (existing) {
        return NextResponse.json(
            {
                message: "already_submitted",
                resultId: asObjectIdString((existing as any)?._id),
                score: (existing as any).score,
                totalMarks: (existing as any).totalMarks,
                correctCount: (existing as any).correctCount,
                totalQuestions: (existing as any).totalQuestions,
                perQuestion: [],
            },
            { status: 200 },
        );
    }

    const questions = Array.isArray((exam as any).questions) ? (exam as any).questions : [];
    const totalQuestions = questions.length;

    const marksPerQues =
        typeof (exam as any).marksPerQues === "number" ? (exam as any).marksPerQues
        : typeof (exam as any).totalMarks === "number" && totalQuestions > 0 ?
            (exam as any).totalMarks / totalQuestions
        :   1;

    const totalMarks =
        typeof (exam as any).totalMarks === "number" ?
            (exam as any).totalMarks
        :   Math.round(marksPerQues * totalQuestions);

    const perQuestion = questions.map((q: any) => {
        const qid = asObjectIdString(q?._id);
        const selectedRaw = qid ? answers[qid] : null;
        const selectedIndex =
            Number.isInteger(selectedRaw) ? Number(selectedRaw) : null;

        const correctIndex =
            Array.isArray(q?.choices) ?
                q.choices.findIndex((c: any) => Boolean(c?.isCorrect))
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

    const correctCount = perQuestion.filter((pq: any) => pq.correct).length;
    const score = Math.round(correctCount * marksPerQues);

    const resultDoc = await ResultModel.create({
        studentId,
        examTittle: (exam as any).title,
        examinerId: (exam as any).userId,
        examId: (exam as any)._id,
        score,
        totalMarks,
        correctCount,
        totalQuestions,
        answers: perQuestion.map((pq: any) => ({
            questionId: pq.questionId,
            selectedIndex: pq.selectedIndex,
            correct: pq.correct,
        })),
        submittedAt: new Date(),
    });

    return NextResponse.json(
        {
            message: "submitted",
            resultId: asObjectIdString((resultDoc as any)?._id),
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
    const studentId = asObjectIdString(
        (session as any)?.userId || (session as any)?.user?.id || (session as any)?.user?._id,
    );
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
    const exam = await ExamModel.findOne({ joinCode }).lean();
    if (!exam) {
        return NextResponse.json({ message: "Exam not found" }, { status: 404 });
    }

    const existing = await ResultModel.findOne({
        studentId,
        examId: (exam as any)._id,
    }).lean();

    if (!existing) {
        return NextResponse.json({ submitted: false }, { status: 200 });
    }

    return NextResponse.json(
        {
            submitted: true,
            message: "already_submitted",
            resultId: asObjectIdString((existing as any)?._id),
            score: (existing as any).score,
            totalMarks: (existing as any).totalMarks,
            correctCount: (existing as any).correctCount,
            totalQuestions: (existing as any).totalQuestions,
        },
        { status: 200 },
    );
}
