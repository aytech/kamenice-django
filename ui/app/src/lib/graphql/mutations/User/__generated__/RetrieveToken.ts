/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RetrieveToken
// ====================================================

export interface RetrieveToken_tokenAuth_user {
  __typename: "UserType";
  /**
   * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
   */
  username: string;
}

export interface RetrieveToken_tokenAuth {
  __typename: "ObtainJSONWebToken";
  user: RetrieveToken_tokenAuth_user | null;
}

export interface RetrieveToken {
  tokenAuth: RetrieveToken_tokenAuth | null;
}

export interface RetrieveTokenVariables {
  username: string;
  password: string;
}
