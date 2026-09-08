export const PRIVACY_NOTICE_VERSION = "equipe-2026-08-31";

export type AccountRole = "superadmin" | "admin" | "curator" | "member";
export type AuthFormState = {
  kind: "idle" | "error" | "success";
  message: string;
};

export function isAccountRole(value: unknown): value is AccountRole {
  return (
    value === "superadmin" ||
    value === "admin" ||
    value === "curator" ||
    value === "member"
  );
}

export function canAccessAdmin(role: unknown, active: unknown): boolean {
  return (role === "superadmin" || role === "admin") && active === true;
}

export function validEmail(value: string): boolean {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function safeAuthDestination(
  value: unknown,
  fallback = "/meu-perfil",
): string {
  return typeof value === "string" &&
    value.startsWith("/") &&
    !value.startsWith("//") &&
    value.length <= 500
    ? value
    : fallback;
}

export const PASSWORD_MIN_LENGTH = 6;

export function validNewPassword(value: string): boolean {
  return (
    value.length >= PASSWORD_MIN_LENGTH &&
    new TextEncoder().encode(value).length <= 72 &&
    /\p{L}/u.test(value) &&
    /\p{N}/u.test(value)
  );
}

export const roleLabels: Record<AccountRole, string> = {
  superadmin: "Superadministrador",
  admin: "Administrador",
  curator: "Curadora",
  member: "Membro",
};

export const MEMBER_PRIVACY_NOTICE_VERSION = "membros-2026-09-03";

export function validDisplayName(value: string): boolean {
  const normalized = value.trim();
  return normalized.length >= 2 && normalized.length <= 80;
}
