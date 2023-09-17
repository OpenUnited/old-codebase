export interface CAPABILITY_CHILDREN_TYPE {
  productId?: number;
  capabilityId?: number;
}

export type TaskType = {
  id?: number,
  title?: any,
  status: string
}

export type TagType = {
  id: number;
  name: string;
}

export const PARTNER_TYPES = ["", "Creator", "Service Provider", "Supporter"];
export const USER_TYPES = ["", "Admin", "Contributor", "Watcher"];
export const TASK_CLAIM_TYPES = ["Claimed", "Not Ready", "Ready", "Done"];
export const TASK_TYPES = ["Draft", "Blocked", "Available", "Claimed", "Done", "In Review"];
export const TASK_PRIORITIES = ["High", "Medium", "Low"];
export const TASK_LIST_TYPES_FOR_GUEST = [
  {id: 2, name: "Available"},
  {id: 3, name: "Claimed"},
  {id: 4, name: "Done"},
];
export const TASK_LIST_TYPES_FOR_CONTRIBUTOR = [
  {id: 1, name: "Blocked"},
  {id: 2, name: "Available"},
  {id: 3, name: "Claimed"},
  {id: 4, name: "Done"},
  {id: 5, name: "In Review"}
];
export const TASK_LIST_TYPES = [
  {id: 0, name: "Draft"},
  {id: 1, name: "Blocked"},
  {id: 2, name: "Available"},
  {id: 3, name: "Claimed"},
  {id: 4, name: "Done"},
  {id: 5, name: "In Review"},
];
export const INITIATIVE_TYPES = ["Active", "Completed"];
export const USER_ROLES = ["User", "Product Admin", "Product Manager", "Contributor", "Super Admin"];
export const MANAGER_ROLES = ["Product Admin", "Product Manager", "Super Admin"];
export const ADMIN_ROLES = ["Product Admin", "Super Admin"];
export const IDEA_TYPES = [
  {id: 0, name:  "Product Tweak"},
  {id: 1, name:  "New Feature"},
  {id: 2, name:  "New Capability"},
  {id: 3, name:  "Non-Functional Improvement"},
  {id: 4, name:  "Other"}
];
