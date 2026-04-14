import User from "../../../models/UserModel";

export async function POST(req, res) {
    const { dbConnect } = await import("../../../lib/mongodb");
    const userData = await req.json();
    console.log("Received user data:", userData);
    dbConnect();
    const newUser = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role || "user",
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
        console.log(error.message);
        return new Response(
            JSON.stringify({ message: error.message || "failed" }),
            {
                status: 401,
            },
        );
    }
}
