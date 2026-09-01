export const PRIVACY_NOTICE_VERSION = "equipe-2026-08-31";

export type AccountRole = "admin" | "curator" | "member";
export type AuthFormState = {
  kind: "idle" | "error" | "success";
  message: string;
};

export function isAccountRole(value: unknown): value is AccountRole {
  return value === "admin" || value === "curator" || value === "member";
}

export function canAccessAdmin(role: unknown, active: unknown): boolean {
  return role === "admin" && active === true;
}

export function validEmail(value: string): boolean {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function validNewPassword(value: string): boolean {
  return value.length >= 12 && new TextEncoder().encode(value).length <= 72;
}

export const roleLabels: Record<AccountRole, string> = {
  admin: "Administrador",
  curator: "Curadora",
  member: "Usuária",
};
