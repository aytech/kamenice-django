/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: TokenAuth
// ====================================================

export interface TokenAuth_tokenAuth_user {
  __typename: "User";
  color: string;
  id: string;
  name: string | null;
  surname: string | null;
  username: string;
}

export interface TokenAuth_tokenAuth {
  __typename: "ObtainJSONWebToken";
  payload: any;
  refreshExpiresIn: number;
  refreshToken: string;
  token: string;
  user: TokenAuth_tokenAuth_user | null;
}

export interface TokenAuth {
  tokenAuth: TokenAuth_tokenAuth | null;
}

export interface TokenAuthVariables {
  username: string;
  password: string;
}
