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
    participantName: { type: String, required: false, trim: true },
    participantId: { type: String, required: false, trim: true },
    score: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    correctCount: { type: Number, required: false },
    totalQuestions: { type: Number, required: false },
    integrity: {
        riskLevel: {
            type: String,
            enum: ["none", "low", "medium", "high"],
            default: "none",
        },
        tabSwitches: { type: Number, default: 0 },
        focusLosses: { type: Number, default: 0 },
        fullscreenExits: { type: Number, default: 0 },
        clipboardEvents: { type: Number, default: 0 },
        contextMenuEvents: { type: Number, default: 0 },
        suspiciousShortcuts: { type: Number, default: 0 },
        events: [{ type: { type: String }, at: { type: Date } }],
    },
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
