/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RoommateInput, RoommateAge, RoommateGender } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: CreateRoommate
// ====================================================

export interface CreateRoommate_createRoommate_roommate {
  __typename: "Roommate";
  age: RoommateAge | null;
  gender: RoommateGender | null;
  identity: string | null;
  id: string;
  name: string;
  surname: string;
}

export interface CreateRoommate_createRoommate {
  __typename: "CreateRoommate";
  roommate: CreateRoommate_createRoommate_roommate | null;
}

export interface CreateRoommate {
  createRoommate: CreateRoommate_createRoommate | null;
}

export interface CreateRoommateVariables {
  data: RoommateInput;
}
