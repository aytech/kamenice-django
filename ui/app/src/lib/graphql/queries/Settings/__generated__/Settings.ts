/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DiscountSettingsType } from "./../../../globalTypes";

// ====================================================
// GraphQL query operation: Settings
// ====================================================

export interface Settings_settings_discountSettingsSet {
  __typename: "DiscountSettings";
  type: DiscountSettingsType;
  value: number;
}

export interface Settings_settings {
  __typename: "Settings";
  discountSettingsSet: Settings_settings_discountSettingsSet[];
  id: string;
  municipalityFee: any | null;
  priceBreakfast: any | null;
  priceHalfboard: any | null;
  userAvatar: string | null;
  userColor: string | null;
  userName: string | null;
}

export interface Settings_discountSettingsTypes {
  __typename: "DiscountSettingsOption";
  label: string;
  value: string;
}

export interface Settings {
  settings: Settings_settings | null;
  discountSettingsTypes: (Settings_discountSettingsTypes | null)[] | null;
}
