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
});
const Result = mongoose.models.Result || mongoose.model("Result", ResultSchema);
export default Result;
