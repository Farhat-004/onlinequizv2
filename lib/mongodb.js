import mongoose from "mongoose";

export async function dbConnect() {
    try {
        const uri =
            process.env.MONGODB_CONNECTION_STRING ?? process.env.MONGODB_URI;

        if (!uri) {
            throw new Error(
                'Missing MongoDB connection string. Set "MONGODB_URI" (used by Auth.js) and/or "MONGODB_CONNECTION_STRING" (used by Mongoose).',
            );
        }

        const conn = await mongoose.connect(String(uri));
        return conn;
    } catch (err) {
        console.error(err);
    }
}
