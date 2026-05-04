import { time } from "console";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: ["teacher", "student", "admin", "user"],
            default: "user",
        },
        roles: {
            type: [{ type: String, enum: ["teacher", "student"] }],
            default: undefined,
        },
        activeRole: {
            type: String,
            enum: ["teacher", "student"],
            required: false,
        },
        institute: { type: String, required: false },
        image: String,
    },
    { timestamps: true },
);
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
