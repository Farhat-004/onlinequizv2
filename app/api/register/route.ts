import User from "../../../models/UserModel";
import { hashPassword } from "@/lib/password";

export async function POST(req: Request) {
    const { dbConnect } = await import("../../../lib/mongodb");
    const userData = await req.json();
    dbConnect();
    const rawRole = userData.role || "user";
    const email = typeof userData.email === "string" ? userData.email.trim().toLowerCase() : userData.email;
    const password = typeof userData.password === "string" ? hashPassword(userData.password) : userData.password;
    const newUser =
        rawRole === "both" ?
            {
                name: userData.name,
                email,
                password,
                roles: ["teacher", "student"],
                activeRole: "teacher",
                role: "teacher",
            }
        :   {
                name: userData.name,
                email,
                password,
                role: rawRole,
            };

    try {
        const response = await User.create(newUser);
        return new Response(
            JSON.stringify({ message: "User created", user: response }),
            {
                status: 201,
            },
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: error.message || "failed" }),
            {
                status: 401,
            },
        );
    }
}
