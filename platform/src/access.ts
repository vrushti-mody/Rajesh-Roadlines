import type { Access, FieldAccess } from "payload";

type Role = "admin" | "editor" | "ops";
const roleOf = (user: unknown): Role | null => ((user as { role?: Role } | null)?.role ?? null);

/** Any signed-in RRPL staff member. */
export const staff: Access = ({ req }) => !!req.user;
export const admin: Access = ({ req }) => roleOf(req.user) === "admin";
/** Admins and editors manage website content (branches, updates, lanes, hazmat list). */
export const editors: Access = ({ req }) => ["admin", "editor"].includes(roleOf(req.user) ?? "");
/** Admins and ops handle enquiries and complaints. */
export const ops: Access = ({ req }) => ["admin", "ops"].includes(roleOf(req.user) ?? "");
export const anyone: Access = () => true;
export const nobody: Access = () => false;
export const adminField: FieldAccess = ({ req }) => roleOf(req.user) === "admin";

/** Public sees published documents only; staff see drafts too. */
export const publishedOrStaff: Access = ({ req }) => (req.user ? true : { _status: { equals: "published" } });
