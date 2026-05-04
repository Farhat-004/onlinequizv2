import { auth } from "../../../auth";
import { dbConnect } from "../../../lib/mongodb";
import ExamModel from "../../../models/ExamModel";
import ResultModel from "../../../models/ResultModel";

function asObjectIdString(v) {
    if (!v) return null;
    if (typeof v === "string") return v;
    if (typeof v === "object" && typeof v.toString === "function")
        return v.toString();
    return null;
}

export async function POST(request) {
    const session = await auth();
    const studentId = asObjectIdString(
        session?.userId || session?.user?.id || session?.user?._id,
    );
    if (!studentId) {
        return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const joinCode = body?.joinCode;
    const answers =
        body?.answers && typeof body.answers === "object" ? body.answers : {};

    if (!joinCode) {
        return Response.json(
            { message: "joinCode is required" },
            { status: 400 },
        );
    }

    await dbConnect();

    const exam = await ExamModel.findOne({ joinCode }).populate("questions");
    if (!exam) {
        return Response.json({ message: "Exam not found" }, { status: 404 });
    }

    const existing = await ResultModel.findOne({
        studentId,
        examId: exam._id,
    }).lean();
    if (existing) {
        return Response.json(
            {
                message: "already_submitted",
                resultId: asObjectIdString(existing?._id),
                score: existing.score,
                totalMarks: existing.totalMarks,
                correctCount: existing.correctCount,
                totalQuestions: existing.totalQuestions,
                perQuestion: [],
            },
            { status: 200 },
        );
    }

    const questions = Array.isArray(exam.questions) ? exam.questions : [];
    const totalQuestions = questions.length;

    const marksPerQues =
        typeof exam.marksPerQues === "number" ? exam.marksPerQues
        : typeof exam.totalMarks === "number" && totalQuestions > 0 ?
            exam.totalMarks / totalQuestions
        :   1;

    const totalMarks =
        typeof exam.totalMarks === "number" ?
            exam.totalMarks
        :   Math.round(marksPerQues * totalQuestions);

    const perQuestion = questions.map((q) => {
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

    return Response.json(
        {
            message: "submitted",
            resultId: asObjectIdString(resultDoc?._id),
            score,
            totalMarks,
            correctCount,
            totalQuestions,
            perQuestion,
        },
        { status: 201 },
    );
}

export async function GET(req) {
    const session = await auth();
    const studentId = asObjectIdString(
        session?.userId || session?.user?.id || session?.user?._id,
    );
    if (!studentId) {
        return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const joinCode = searchParams.get("joinCode");
    if (!joinCode) {
        return Response.json(
            { message: "joinCode is required" },
            { status: 400 },
        );
    }

    await dbConnect();
    const exam = await ExamModel.findOne({ joinCode }).lean();
    if (!exam) {
        return Response.json({ message: "Exam not found" }, { status: 404 });
    }

    const existing = await ResultModel.findOne({
        studentId,
        examId: exam._id,
    }).lean();

    if (!existing) {
        return Response.json({ submitted: false }, { status: 200 });
    }

    return Response.json(
        {
            submitted: true,
            message: "already_submitted",
            resultId: asObjectIdString(existing?._id),
            score: existing.score,
            totalMarks: existing.totalMarks,
            correctCount: existing.correctCount,
            totalQuestions: existing.totalQuestions,
        },
        { status: 200 },
    );
}
