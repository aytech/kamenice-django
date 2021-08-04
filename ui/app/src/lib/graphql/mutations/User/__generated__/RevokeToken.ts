/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RevokeToken
// ====================================================

export interface RevokeToken_revokeToken {
  __typename: "Revoke";
  revoked: number;
}

export interface RevokeToken {
  revokeToken: RevokeToken_revokeToken | null;
}

export interface RevokeTokenVariables {
  refreshToken: string;
}
