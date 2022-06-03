/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SettingsInput } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateSettings
// ====================================================

export interface UpdateSettings_updateSettings_settings {
  __typename: "Settings";
  defaultArrivalTime: any;
  defaultDepartureTime: any;
  id: string;
  municipalityFee: any | null;
  priceBreakfastChild: any | null;
  priceBreakfast: any | null;
  priceHalfboard: any | null;
  priceHalfboardChild: any | null;
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
