/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: App
// ====================================================

export interface App_appUser {
  __typename: "AppUser";
  color: string;
  id: number;
  name: string | null;
  surname: string | null;
  username: string;
}

export interface App_discountOptions {
  __typename: "Options";
  label: string;
  value: string;
}

export interface App_selectedSuite {
  __typename: "SelectedSuite";
  number: number | null;
  numberBeds: number;
  priceBase: string | null;
  priceChild: string | null;
  priceExtra: string | null;
  priceInfant: string | null;
  title: string | null;
}

export interface App {
  appUser: App_appUser | null;
  discountOptions: App_discountOptions[];
  guestDrawerOpen: boolean;
  pageTitle: string;
  reservationModalOpen: boolean;
  selectedPage: string;
  selectedSuite: App_selectedSuite | null;
}
