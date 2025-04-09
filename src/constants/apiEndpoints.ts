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

  
  CREATE_PROJECT = '/projects/create',
  CREATE_TASK = '/projects/create_task',
  MOVE_TASK = '/projects/move_task',
  CREATE_COLUMN = '/projects/create_column',
  GET_PROJECTS_COLUMN = '/projects/get_projects_column',
  GET_COLUMN_TASK = '/projects/get_column_tasks',
  UPDATE_COLUMN = '/projects/update_column',
  REORDER_COLUMN = '/projects/reorder_columns',
  DELETE_COLUMN = '/projects/delete_column',
  
}
