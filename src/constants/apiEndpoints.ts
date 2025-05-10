export enum ApiEndPoints {
  //? user details
  CREATE_USER = '/users/create',
  GET_USER = '/users',
  SEARCH_USER_EMAIL = '/users/search',
  UPDATE_USER = '/users/update',
  AUTH_SESSION = '/auth/session',
  LOGOUT = '/auth/logout',
  //? groups
  GET_GROUPS = '/groups/get_groups_for_user',
  CREATE_GROUP = '/groups/create',
  INVITE_GROUP_MEMBER = '/groups/add',
  PROMOTE_GROUP_MEMBER = '/groups/promote',
  REMOVE_GROUP_MEMBER = '/groups/remove',
  DELETE_GROUP = '/groups/delete',
  GET_GROUP_USERS = '/groups/get_users_in_group',
  GET_GROUP_DETAILS = '/groups/get_group_details',
  GET_GROUP_PROJECTS_SUMMARY = '/groups/get_group_projects',
  UPDATE_GROUP = '/groups/update_group',
  EDIT_USER_GROUP = '/groups/patch_user_group',
  //? projects
  CREATE_PROJECT = '/projects/create',
  DELETE_PROJECT = '/projects/delete_project',

  //? kanban endpoints
  KANBAN_CREATE_COLUMN = '/projects/create_column',
  KANBAN_GET_COLUMNS = '/projects/get_project_columns',
  KANBAN_UPDATE_COLUMN = '/projects/update_column',
  KANBAN_REORDER_COLUMNS = '/projects/reorder_columns',
  KANBAN_DELETE_COLUMN = '/projects/delete_column',
  //? tasks
  KANBAN_CREATE_TASK = '/projects/create_task',
  KANBAN_DELETE_TASK = '/projects/delete_task',
  KANBAN_UPDATE_TASK = '/projects/modify_task',

  KANBAN_MOVE_TASK = '/projects/move_task',
  KANBAN_GET_COLUMN_TASKS = '/projects/get_column_tasks',

  GET_ASIGNED_TASKS = '/projects/get_user_assigned_tasks',
}
