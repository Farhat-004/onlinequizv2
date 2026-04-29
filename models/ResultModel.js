import mongoose from "mongoose";

const ResultSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    examTittle: { type: String, required: true },
    examinerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    examId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exam",
        required: true,
    },
    score: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    correctCount: { type: Number, required: false },
    totalQuestions: { type: Number, required: false },
    answers: [
        {
            questionId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Question",
                required: true,
            },
            selectedIndex: { type: Number, required: false },
            correct: { type: Boolean, required: true },
        },
    ],
    submittedAt: { type: Date, required: false },
});

ResultSchema.index({ studentId: 1, examId: 1 }, { unique: true });

const Result = mongoose.models.Result || mongoose.model("Result", ResultSchema);
export default Result;
