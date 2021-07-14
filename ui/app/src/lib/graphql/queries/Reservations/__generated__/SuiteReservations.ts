/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ReservationType } from "./../../../globalTypes";

// ====================================================
// GraphQL query operation: SuiteReservations
// ====================================================

export interface SuiteReservations_suiteReservations_guest {
  __typename: "Guest";
  id: string;
  name: string;
  surname: string;
}

export interface SuiteReservations_suiteReservations_roommates {
  __typename: "Guest";
  id: string;
  name: string;
  surname: string;
}

export interface SuiteReservations_suiteReservations {
  __typename: "Reservation";
  fromYear: number;
  fromMonth: number;
  fromDay: number;
  fromHour: number | null;
  fromMinute: number | null;
  guest: SuiteReservations_suiteReservations_guest;
  id: string;
  roommates: SuiteReservations_suiteReservations_roommates[];
  toYear: number;
  toMonth: number;
  toDay: number;
  toHour: number | null;
  toMinute: number | null;
  type: ReservationType;
}

export interface SuiteReservations {
  suiteReservations: (SuiteReservations_suiteReservations | null)[] | null;
}

export interface SuiteReservationsVariables {
  suiteId: number;
}
