type SessionUser = {
  id: string;
  firstName: string;
  accessToken: string;
  isSuperUser: boolean;
  lastName: string;
  refreshToken: string;
  status: string;
  username: string;
};

type SessionRole = {
  name: string;
  permissions: string[];
};

type SessionAccess = {
  additionalPermissions: any[];
  roles: SessionRole[];
};

export interface Session {
  expires: string;
  access: string;
  user: SessionUser;
}
