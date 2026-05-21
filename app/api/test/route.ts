import { NextResponse } from "next/server";

export async function POST() {
    return NextResponse.json({ message: "test" }, { status: 200 });
}
