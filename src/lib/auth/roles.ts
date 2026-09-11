export const PUBLIC_REGISTRATION_ROLES = ["STUDENT", "DEVELOPER"] as const;

export type PublicRegistrationRole = (typeof PUBLIC_REGISTRATION_ROLES)[number];
export type AppRole = PublicRegistrationRole | "ADMIN";

export function isPublicRegistrationRole(value: unknown): value is PublicRegistrationRole {
  return (
    typeof value === "string" &&
    PUBLIC_REGISTRATION_ROLES.includes(value as PublicRegistrationRole)
  );
}
