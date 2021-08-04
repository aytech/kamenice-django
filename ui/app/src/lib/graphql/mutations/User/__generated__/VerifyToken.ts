/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: VerifyToken
// ====================================================

export interface VerifyToken_verifyToken {
  __typename: "Verify";
  payload: any;
}

export interface VerifyToken {
  verifyToken: VerifyToken_verifyToken | null;
}

export interface VerifyTokenVariables {
  token: string;
}
