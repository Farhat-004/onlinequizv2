import mongoose from "mongoose";

const ExamSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    joinCode: { type: String, required: true },
    totalMarks: { type: Number },
    marksPerQues: { type: Number },
    title: { type: String, required: true },
    password: { type: String, required: false },
    durationMinutes: { type: Number, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
});

const Exam = mongoose.models.Exam || mongoose.model("Exam", ExamSchema);
export default Exam;
