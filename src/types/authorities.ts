export function isRoleAuthorized(
  userRole: string,
  authorizedRoles: string[]
): boolean {
  return authorizedRoles.includes(userRole);
}
