/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteGuest
// ====================================================

export interface DeleteGuest_deleteGuest_guest {
  __typename: "Guest";
  id: string;
}

export interface DeleteGuest_deleteGuest {
  __typename: "DeleteGuest";
  guest: DeleteGuest_deleteGuest_guest | null;
}

export interface DeleteGuest {
  deleteGuest: DeleteGuest_deleteGuest | null;
}

export interface DeleteGuestVariables {
  guestId: string;
}
