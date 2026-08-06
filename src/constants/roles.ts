export const GLOBAL_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;

export type GlobalRoleType = typeof GLOBAL_ROLES[keyof typeof GLOBAL_ROLES];

export const TEAM_ROLES = {
  ADMIN: 'TEAM_ADMIN',
  MEMBER: 'TEAM_MEMBER',
} as const;

export type TeamRoleType = typeof TEAM_ROLES[keyof typeof TEAM_ROLES];

export const CONNECTION_ROLES = {
  ADMIN: 'ADMIN',
  WRITE: 'WRITE',
  READ: 'READ',
} as const;

export type ConnectionRoleType = typeof CONNECTION_ROLES[keyof typeof CONNECTION_ROLES];
