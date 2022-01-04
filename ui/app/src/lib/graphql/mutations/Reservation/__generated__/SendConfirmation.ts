/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ConfirmationInput } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: SendConfirmation
// ====================================================

export interface SendConfirmation_sendConfirmation_reservation_guest {
  __typename: "Guest";
  email: string | null;
}

export interface SendConfirmation_sendConfirmation_reservation {
  __typename: "Reservation";
  guest: SendConfirmation_sendConfirmation_reservation_guest;
  id: string;
}

export interface SendConfirmation_sendConfirmation {
  __typename: "SendConfirmationEmail";
  reservation: SendConfirmation_sendConfirmation_reservation | null;
}

export interface SendConfirmation {
  sendConfirmation: SendConfirmation_sendConfirmation | null;
}

export interface SendConfirmationVariables {
  data: ConfirmationInput;
}
