import { PermissionResponse } from "./permissions_response";
import { RoleResponse } from "./role_response";
import { UserStatus } from "./user_status";

export interface User {
  id: string;

  username: string;

  firstName: string;

  lastName: string;

  roles?: RoleResponse[];

  permissions?: PermissionResponse[];

  isSuperUser: boolean;

  status: UserStatus;
}
