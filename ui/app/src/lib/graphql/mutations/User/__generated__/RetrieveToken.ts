/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RetrieveToken
// ====================================================

export interface RetrieveToken_tokenAuth {
  __typename: "ObtainJSONWebToken";
  token: string;
}

export interface RetrieveToken {
  /**
   * Obtain JSON Web Token mutation
   */
  tokenAuth: RetrieveToken_tokenAuth | null;
}

export interface RetrieveTokenVariables {
  username: string;
  password: string;
}
