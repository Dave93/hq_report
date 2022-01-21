import { PermissionResponse } from "./permissions_response";

export interface RoleResponse {
  id: number;

  name: string;

  permissions: PermissionResponse[];

  active: boolean;
}
