/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SettingsInput, DiscountSettingsType } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateSettings
// ====================================================

export interface UpdateSettings_updateSettings_settings_discountSettingsSet {
  __typename: "DiscountSettings";
  type: DiscountSettingsType;
  value: number;
}

export interface UpdateSettings_updateSettings_settings {
  __typename: "Settings";
  discountSettingsSet: UpdateSettings_updateSettings_settings_discountSettingsSet[];
  id: string;
  municipalityFee: any | null;
  priceBreakfast: any | null;
  priceHalfboard: any | null;
  userAvatar: string | null;
  userColor: string | null;
  userName: string | null;
}

export interface UpdateSettings_updateSettings {
  __typename: "UpdateSettings";
  settings: UpdateSettings_updateSettings_settings | null;
}

export interface UpdateSettings {
  updateSettings: UpdateSettings_updateSettings | null;
}

export interface UpdateSettingsVariables {
  data: SettingsInput;
}
