export enum ApiEndPoints {
  CREATE_USER = '/users/create',
  GET_USER = '/users',
  SEARCH_USER_EMAIL = '/users/search',
  UPDATE_USER = '/users/update',
  AUTH_SESSION = '/auth/session',
  LOGOUT = '/auth/logout',
  // groups
  GET_GROUPS = '/groups/get_groups_for_user',
  CREATE_GROUP = '/groups/create',
  INVITE_GROUP_MEMBER = '/groups/add',
  DELETE_GROUP = '/groups/delete',
  GET_GROUP_USERS = '/groups/get_users_in_group',
  GET_GROUP_DETAILS = '/groups/get_group_details',
  GET_GROUP_PROJECTS_SUMMARY = '/groups/get_group_projects',
  UPDATE_GROUP = '/groups/update_group',
  //projects
  CREATE_PROJECT = '/projects/create',
  CREATE_PROJECT_TASK = '/projects/create_task',
  DELETE_PROJECT = '/projects/delete_project',
  //kanban endpoints
  KANBAN_CREATE_COLUMN = '/projects/create_column',
  KANBAN_GET_COLUMNS = '/projects/get_project_columns',
  KANBAN_UPDATE_COLUMN = '/projects/update_column',
  KANBAN_REORDER_COLUMNS = '/projects/reorder_columns',
  KANBAN_DELETE_COLUMN = '/projects/delete-column',
}
