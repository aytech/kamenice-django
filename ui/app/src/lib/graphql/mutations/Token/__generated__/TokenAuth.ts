/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: TokenAuth
// ====================================================

export interface TokenAuth_tokenAuth {
  __typename: "ObtainJSONWebToken";
  payload: any;
  refreshExpiresIn: number;
  refreshToken: string;
  token: string;
}

export interface TokenAuth {
  tokenAuth: TokenAuth_tokenAuth | null;
}

export interface TokenAuthVariables {
  username: string;
  password: string;
}
