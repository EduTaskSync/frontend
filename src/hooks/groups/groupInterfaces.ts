// shape of the 'groups' property of the backend response object
export interface GroupsObj {
  groupMembers: number;
  groupId: string;
  groupDescription: string;
  groupCreationDate: string;
  groupName: string;
  imgUrl: string;
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
}

export interface AddGroupMemberObj {
  groupId: string;
  email: string;
}

export interface SearchEmailObj {
  email: string;
  limit?: number;
}
