import User from "../../../models/UserModel";
import { hashPassword } from "@/lib/password";

export async function POST(req: Request) {
    const { dbConnect } = await import("../../../lib/mongodb");
    const userData = await req.json().catch(() => null);
    if (!userData || typeof userData !== "object") {
        return Response.json({ message: "Invalid JSON" }, { status: 400 });
    }

    const data = userData as Record<string, unknown>;
    const name = typeof data.name === "string" ? data.name.trim() : "";
    const email = typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
    const rawPassword = typeof data.password === "string" ? data.password : "";
    const rawRole = data.role === "both" || data.role === "teacher" || data.role === "student" ? data.role : "";

    if (!name || !email || !rawPassword || !rawRole) {
        return Response.json({ message: "Name, email, password, and role are required" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return Response.json({ message: "Invalid email address" }, { status: 400 });
    }
    if (rawPassword.length < 8) {
        return Response.json({ message: "Password must be at least 8 characters" }, { status: 400 });
    }

    await dbConnect();
    const password = hashPassword(rawPassword);
    const newUser =
        rawRole === "both" ?
            {
                name,
                email,
                password,
                roles: ["teacher", "student"],
                activeRole: "teacher",
                role: "teacher",
            }
        :   {
                name,
                email,
                password,
                role: rawRole,
                roles: [rawRole],
                activeRole: rawRole,
            };

    try {
        await User.create(newUser);
        return Response.json({ message: "User created" }, { status: 201 });
    } catch (error) {
        const message =
            error instanceof Error && error.message.includes("E11000") ?
                "Email already in use"
            :   "Registration failed";
        return Response.json({ message }, { status: 400 });
    }
}
