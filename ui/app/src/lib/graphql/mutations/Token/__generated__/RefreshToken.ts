/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RefreshToken
// ====================================================

export interface RefreshToken_refreshToken {
  __typename: "Refresh";
  payload: any;
  refreshExpiresIn: number;
  refreshToken: string;
  token: string;
}

export interface RefreshToken {
  refreshToken: RefreshToken_refreshToken | null;
}

export interface RefreshTokenVariables {
  refreshToken: string;
}
