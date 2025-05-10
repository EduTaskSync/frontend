// shape of the 'groups' property of the backend response object
export interface GroupsObj {
  groupMembers: number;
  groupId: string;
  groupName: string;
  imgUrl: string;
  groupIsHidden: boolean;
  projectCount: number;
  isRequestUserAdmin: boolean;
  createdAt: Date;
}

// wrapper for the shape of the overall response object
export interface GroupListResponse {
  groups: GroupsObj[];
}

// request and response object shapes for creating new group
export interface NewGroupObj {
  groupName: string;
  groupDetails: string;
  imgUrl: string;
}

export interface NewGroupResponse {
  groupId: string;
}

export interface DeleteGroupObj {
  groupId: string;
}

export interface DeleteGroupResponse {
  groupId: string;
}

export interface GroupMember {
  userId: string;
  role: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
}

export interface GetGroupMembersResponse {
  users: GroupMember[];
}

export interface UpdatedGroup {
  groupId: string;
  groupName: string;
  imgUrl: string;
  groupDetails: string;
  groupIsHidden: boolean;
}

export interface AddGroupMemberObj {
  groupId: string;
  email: string;
}

export interface SearchEmailObj {
  email: string;
  limit?: number;
}

export interface GroupDetailsResponse {
  groupMembers: number;
  groupId: string;
  groupName: string;
  groupCreationDate: string;
  groupDescription: string;
  imgUrl: string;
}

export interface EditUserGroup {
  groupId: string;
  groupIsHidden: boolean;
}
