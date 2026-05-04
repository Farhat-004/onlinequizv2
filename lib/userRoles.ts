import client from "@/lib/db";
import { ObjectId } from "mongodb";

export type AppRole = "teacher" | "student";

export function normalizeRolesFromDoc(
  doc: { role?: unknown; roles?: unknown } | null | undefined,
): AppRole[] {
  if (!doc) return ["student"];
  const raw = doc.roles;
  if (Array.isArray(raw)) {
    const list = raw.filter((r): r is AppRole => r === "teacher" || r === "student");
    const unique = [...new Set(list)];
    if (unique.length > 0) return unique;
  }
  const single = doc.role;
  if (single === "teacher" || single === "student") return [single];
  return ["student"];
}

export function pickActiveRole(roles: AppRole[], stored: unknown): AppRole {
  if (stored === "teacher" || stored === "student") {
    if (roles.includes(stored)) return stored;
  }
  return roles[0] ?? "student";
}

export async function getUserRoleStateFromDb(id: string | null | undefined): Promise<{
  roles: AppRole[];
  activeRole: AppRole;
  hasBothRoles: boolean;
}> {
  if (!id) {
    return { roles: ["student"], activeRole: "student", hasBothRoles: false };
  }
  try {
    const db = (await client).db();
    const _id = ObjectId.isValid(id) ? new ObjectId(id) : null;
    if (!_id) {
      return { roles: ["student"], activeRole: "student", hasBothRoles: false };
    }
    const user = await db.collection("users").findOne(
      { _id },
      { projection: { role: 1, roles: 1, activeRole: 1 } },
    );
    const roles = normalizeRolesFromDoc(user as { role?: unknown; roles?: unknown } | null);
    const activeRole = pickActiveRole(roles, (user as { activeRole?: unknown } | null)?.activeRole);
    return { roles, activeRole, hasBothRoles: roles.length > 1 };
  } catch {
    return { roles: ["student"], activeRole: "student", hasBothRoles: false };
  }
}

export function canTeach(roles: AppRole[]): boolean {
  return roles.includes("teacher");
}
