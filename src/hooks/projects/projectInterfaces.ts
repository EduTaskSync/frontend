// shape of the 'projects' property of the backend response object
export interface ProjectsObj {
  projectMembers: number;
  projectId: string;
  projectDescription: string;
  projectCreationDate: string;
  projectName: string;
  imgUrl: string;
}

// wrapper for the shape of the overall response object
export interface ProjectListResponse {
  projects: ProjectsObj[];
}

// request and response object shapes for creating new groject
export interface NewProjectObj {
  projectName: string;
  projectDetails: string;
  imgUrl: string;
}

export interface NewProjectResponse {
  projectId: string;
}

export interface DeleteProjectObj {
  projectId: string;
}

export interface DeleteProjectResponse {
  projectId: string;
}

export interface ProjectMember {
  userId: string;
  role: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
}

export interface GetProjectMembersResponse {
  users: ProjectMember[];
}

export interface UpdatedProject {
  projectId: string;
  projectName: string;
  imgUrl: string;
  projectDetails: string;
}
