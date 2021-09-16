/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteRoommate
// ====================================================

export interface DeleteRoommate_deleteRoommate_roommate {
  __typename: "Roommate";
  id: string;
}

export interface DeleteRoommate_deleteRoommate {
  __typename: "DeleteRoommate";
  roommate: DeleteRoommate_deleteRoommate_roommate | null;
}

export interface DeleteRoommate {
  deleteRoommate: DeleteRoommate_deleteRoommate | null;
}

export interface DeleteRoommateVariables {
  roommateId: string;
}
