import { auth } from "@/auth";
import client from "@/lib/db";
import { getUserRoleStateFromDb, type AppRole } from "@/lib/userRoles";
import { ObjectId } from "mongodb";

function asString(v: unknown): string | null {
  return typeof v === "string" && v.length > 0 ? v : null;
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId =
    asString((session as unknown as Record<string, unknown>).userId) ??
    asString((session as { user?: { id?: string } }).user?.id);
  if (!userId) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const activeRole = (body as { activeRole?: unknown })?.activeRole;
  if (activeRole !== "teacher" && activeRole !== "student") {
    return Response.json({ message: "activeRole must be teacher or student" }, { status: 400 });
  }

  const state = await getUserRoleStateFromDb(userId);
  if (!state.roles.includes(activeRole as AppRole)) {
    return Response.json({ message: "Role not allowed for this account" }, { status: 403 });
  }

  const _id = ObjectId.isValid(userId) ? new ObjectId(userId) : null;
  if (!_id) {
    return Response.json({ message: "Invalid user" }, { status: 400 });
  }

  try {
    const db = (await client).db();
    await db.collection("users").updateOne({ _id }, { $set: { activeRole } });
  } catch {
    return Response.json({ message: "Update failed" }, { status: 500 });
  }

  return Response.json({ ok: true, activeRole });
}
