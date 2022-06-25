/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DiscountSuiteType } from "./../../../globalTypes";

// ====================================================
// GraphQL query operation: ReservationsMeta
// ====================================================

export interface ReservationsMeta_guests {
  __typename: "Guest";
  id: string;
  name: string;
  surname: string;
}

export interface ReservationsMeta_suites_discountSuiteSet {
  __typename: "DiscountSuite";
  type: DiscountSuiteType;
  value: number;
}

export interface ReservationsMeta_suites {
  __typename: "Suite";
  discountSuiteSet: ReservationsMeta_suites_discountSuiteSet[];
  id: string;
  number: number | null;
  numberBeds: number;
  numberBedsExtra: number;
  priceBase: any;
  title: string;
}

export interface ReservationsMeta_reservationMeals {
  __typename: "ReservationTypeOption";
  label: string;
  value: string;
}

export interface ReservationsMeta_reservationTypes {
  __typename: "ReservationTypeOption";
  label: string;
  value: string;
}

export interface ReservationsMeta {
  guests: (ReservationsMeta_guests | null)[] | null;
  suites: (ReservationsMeta_suites | null)[] | null;
  reservationMeals: (ReservationsMeta_reservationMeals | null)[] | null;
  reservationTypes: (ReservationsMeta_reservationTypes | null)[] | null;
}
