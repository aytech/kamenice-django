/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ReservationType } from "./../../../globalTypes";

// ====================================================
// GraphQL query operation: Reservations
// ====================================================

export interface Reservations_reservations_suite {
  __typename: "Suite";
  id: string;
  title: string;
  number: number | null;
}

export interface Reservations_reservations {
  __typename: "Reservation";
  fromYear: number;
  fromMonth: number;
  fromDay: number;
  fromHour: number | null;
  fromMinute: number | null;
  id: string;
  suite: Reservations_reservations_suite;
  toYear: number;
  toMonth: number;
  toDay: number;
  toHour: number | null;
  toMinute: number | null;
  type: ReservationType;
}

export interface Reservations {
  reservations: (Reservations_reservations | null)[] | null;
}
