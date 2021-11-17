/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Settings
// ====================================================

export interface Settings_settings {
  __typename: "Settings";
  id: string;
  municipalityFee: any | null;
  priceBreakfast: any | null;
  priceBreakfastChild: any | null;
  priceHalfboard: any | null;
  priceHalfboardChild: any | null;
  userAvatar: string | null;
  userColor: string | null;
  userName: string | null;
}

export interface Settings {
  settings: Settings_settings | null;
}
