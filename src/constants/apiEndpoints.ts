export enum ApiEndPoints {
  CREATE_USER = '/users/create',
  GET_USER = '/users',
  UPDATE_USER = '/users/update',
  AUTH_SESSION = '/auth/session',
  LOGOUT = '/auth/logout',

  GET_GROUPS = '/groups/get_groups_for_user',
  CREATE_GROUP = '/groups/create',
  ADD_USER_GROUP = '/groups/add',
  DELETE_GROUP = '/groups/delete',
  GET_GROUP_USERS = '/groups/get_users_in_group',
  UPDATE_GROUP = '/groups/update_group',
}
