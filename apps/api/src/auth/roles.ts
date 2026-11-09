export const STAFF_ROLES = ['superadmin', 'admin', 'support'] as const;
export type StaffRole = (typeof STAFF_ROLES)[number];
export type AppRole = StaffRole | 'customer';
