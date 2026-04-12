export async function POST(req, res) {
    const { dbConnect } = await import("../../../lib/mongodb");
    const data = await req.json();
    console.log(data);
    dbConnect();
    return new Response(JSON.stringify({ message: "created" }), {
        status: 201,
    });
}
