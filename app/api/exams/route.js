import { dbConnect } from "../../../lib/mongodb";
import Question from "../../../models/QuestionModel";
import ExamModel from "../../../models/ExamModel";

function normalizeQuestions(rawQuestions) {
    if (!rawQuestions) return [];

    // Some clients accidentally send `questions` as a JSON string (or as a single-element array containing that string).
    if (typeof rawQuestions === "string") {
        try {
            return JSON.parse(rawQuestions);
        } catch {
            return [];
        }
    }

    if (Array.isArray(rawQuestions)) {
        if (rawQuestions.length === 1 && typeof rawQuestions[0] === "string") {
            try {
                return JSON.parse(rawQuestions[0]);
            } catch {
                return [];
            }
        }
        return rawQuestions;
    }

    return [];
}

export async function POST(request) {
    const examData = await request.json();
    const { userId, config, questions: rawQuestions } = examData ?? {};

    const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    await dbConnect();

    const questionsArray = normalizeQuestions(rawQuestions);
    const questionDocs = questionsArray.filter(Boolean).map((q) => ({
        text: q?.text,
        choices:
            Array.isArray(q?.choices) ?
                q.choices.map((c) => ({
                    text: c?.text,
                    isCorrect: Boolean(c?.isCorrect),
                }))
            :   [],
    }));

    try {
        const createdQuestions =
            questionDocs.length > 0 ?
                await Question.insertMany(questionDocs)
            :   [];

        const newExam = {
            userId,
            joinCode,
            ...(config ?? {}),
            questions: createdQuestions.map((q) => q._id),
            password: "1234",
        };

        await ExamModel.create(newExam);
        return Response.json({ message: "created", joinCode }, { status: 201 });
    } catch (error) {
        return Response.json(
            { message: error?.message || "failed" },
            { status: 401 },
        );
    }
}
export async function GET(req) {
    dbConnect();
    const { searchParams } = new URL(req.url);
    const joinCode = searchParams.get("joinCode");
    if (!joinCode) {
        return Response.json(
            { message: "joinCode is required" },
            { status: 400 },
        );
    }

    try {
        const exam = await ExamModel.findOne({ joinCode }).populate(
            "questions",
        );
        if (!exam) {
            return Response.json(
                { message: "Exam not found" },
                { status: 404 },
            );
        }
        const safe = exam.toObject({ virtuals: false });
        safe.questions = (safe.questions || []).map((q) => ({
            _id: q._id,
            text: q.text,
            choices: (q.choices || []).map((c) => ({ text: c.text })),
        }));
        return Response.json(safe, { status: 200 });
    } catch (error) {
        return Response.json(
            { message: error?.message || "Failed to fetch exam" },
            { status: 500 },
        );
    }
}
