/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DiscountSettingsType } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: TokenAuth
// ====================================================

export interface TokenAuth_tokenAuth_settings_discountSettingsSet {
  __typename: "DiscountSettings";
  type: DiscountSettingsType;
  value: number;
}

export interface TokenAuth_tokenAuth_settings {
  __typename: "Settings";
  discountSettingsSet: TokenAuth_tokenAuth_settings_discountSettingsSet[];
  id: string;
  municipalityFee: any | null;
  priceBreakfast: any | null;
  priceHalfboard: any | null;
  userAvatar: string | null;
  userColor: string | null;
  userName: string | null;
}

export interface TokenAuth_tokenAuth {
  __typename: "ObtainJSONWebToken";
  payload: any;
  refreshExpiresIn: number;
  refreshToken: string;
  token: string;
  settings: TokenAuth_tokenAuth_settings | null;
}

export interface TokenAuth {
  tokenAuth: TokenAuth_tokenAuth | null;
}

export interface TokenAuthVariables {
  username: string;
  password: string;
}
