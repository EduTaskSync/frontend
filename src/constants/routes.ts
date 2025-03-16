export enum routes {
  landingPage = '/',
  login = '/app/login',
  signup = '/app/signup',
  profile = '/app/profile',
  dashboard = '/app/dashboard',
  groups = '/app/groups',
  calendar = '/app/calendar',
  projectDetail = '/app/groups/:groupId',
}

export const routePageNames = {
  [routes.landingPage]: 'Home',
  [routes.login]: 'Login',
  [routes.signup]: 'Signup',
  [routes.profile]: 'Profile',
  [routes.dashboard]: 'Dashboard',
  [routes.groups]: 'Groups',
  [routes.calendar]: 'Calendar',
  [routes.projectDetail]: 'Project Detail',
};
