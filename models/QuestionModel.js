import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    choices: [
        {
            text: { type: String, required: true },
            isCorrect: { type: Boolean, required: true },
        },
    ],
});

const Question =
    mongoose.models.Question || mongoose.model("Question", QuestionSchema);
export default Question;
