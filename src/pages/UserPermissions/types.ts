import { LucideIcon } from 'lucide-react';

export interface PermissionLevels {
  level: number;
  label: string;
  icon: string;
  color: string;
  bg: string;
}

export interface SubModule {
  id: string;
  label: string;
}

export interface SystemModule {
  id: string;
  label: string;
  icon: string;
  subItems?: SubModule[];
}

export interface UserPermissionsData {
  [moduleId: string]: number[];
}

export interface User {
  id: number;
  name: string;
  position: string;
  email: string;
  avatar: string;
  isDev: boolean;
  permissions: UserPermissionsData;
}
