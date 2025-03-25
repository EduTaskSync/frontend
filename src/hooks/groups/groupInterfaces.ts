// object shape for a group member inside the 'groups' property of response
export interface GroupMember {
  userId: string;
  userRole: string;
  userFirstName: string;
  userLastName: string;
}

// shape of the 'groups' property of the backend response object
export interface GroupsObj {
  groupMembers: GroupMember[];
  groupId: string;
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
