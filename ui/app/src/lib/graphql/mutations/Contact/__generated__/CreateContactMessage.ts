/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ContactInput } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: CreateContactMessage
// ====================================================

export interface CreateContactMessage_createContactMessage_contact {
  __typename: "Contact";
  message: string;
}

export interface CreateContactMessage_createContactMessage {
  __typename: "CreateContactMessage";
  contact: CreateContactMessage_createContactMessage_contact | null;
}

export interface CreateContactMessage {
  createContactMessage: CreateContactMessage_createContactMessage | null;
}

export interface CreateContactMessageVariables {
  data: ContactInput;
}
