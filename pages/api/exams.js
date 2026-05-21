import { dbConnect } from "@/lib/mongodb";
import Question from "@/models/QuestionModel";
import ExamModel from "@/models/ExamModel";

function normalizeQuestions(rawQuestions) {
    if (!rawQuestions) return [];

    if (typeof rawQuestions === "string") {
        try {
            const parsed = JSON.parse(rawQuestions);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }

    if (Array.isArray(rawQuestions)) {
        if (rawQuestions.length === 1 && typeof rawQuestions[0] === "string") {
            try {
                const parsed = JSON.parse(rawQuestions[0]);
                return Array.isArray(parsed) ? parsed : [];
            } catch {
                return [];
            }
        }
        return rawQuestions;
    }

    return [];
}

export default async function handler(req, res) {
    if (req.method === "POST") {
        const examData = req.body ?? {};
        const { userId, config, questions: rawQuestions } = examData ?? {};

        const joinCode = Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase();

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
            return res.status(201).json({ message: "created", joinCode });
        } catch (error) {
            return res
                .status(401)
                .json({ message: error?.message || "failed" });
        }
    }

    if (req.method === "GET") {
        await dbConnect();
        const { joinCode, password } = req.query;
        if (!joinCode) {
            return res.status(400).json({ message: "joinCode is required" });
        }

        try {
            const exam = await ExamModel.findOne({ joinCode }).populate(
                "questions",
            );
            if (!exam)
                return res.status(404).json({ message: "Exam not found" });
            if (exam.password && String(exam.password).length > 0) {
                if (!password || String(password) !== String(exam.password)) {
                    return res
                        .status(401)
                        .json({ message: "Invalid password" });
                }
            }
            const safe = exam.toObject({ virtuals: false });
            safe.questions = (safe.questions || []).map((q) => ({
                _id: q._id,
                text: q.text,
                choices: (q.choices || []).map((c) => ({ text: c.text })),
            }));
            delete safe.password;
            return res.status(200).json(safe);
        } catch (error) {
            return res
                .status(500)
                .json({ message: error?.message || "Failed to fetch exam" });
        }
    }

    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
