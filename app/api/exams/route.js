import { dbConnect } from "../../../lib/mongodb";
import Question from "../../../models/QuestionModel";
import ExamModel from "../../../models/ExamModel";
export async function POST(req, res) {
    const { dbConnect } = await import("../../../lib/mongodb");
    const examData = await req.json();
    const { userId, config, questions } = examData;
    const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    dbConnect();
    const newExam = { userId, joinCode, ...config, questions };

    try {
        await ExamModel.create(newExam);
        return new Response(JSON.stringify({ message: "created", joinCode }), {
            status: 201,
        });
    } catch (error) {
        console.log(error.message);
        return new Response(
            JSON.stringify({ message: error.message || "failed" }),
            {
                status: 401,
            },
        );
    }
}
// export async function GET(req,res) {
//     dbConnect();
//     const getquestions=let;
// }
