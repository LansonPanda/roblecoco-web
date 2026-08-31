export const ADMIN_EMAIL = "admin@roblecoco.com";

export function isAdminEmail(email?: string | null) {
  return email?.toLowerCase() === ADMIN_EMAIL;
}
