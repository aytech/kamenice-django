/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ReservationType } from "./../../../globalTypes";

// ====================================================
// GraphQL query operation: Reservations
// ====================================================

export interface Reservations_reservations_guest {
  __typename: "Guest";
  id: string;
  name: string;
  surname: string;
}

export interface Reservations_reservations_roommates {
  __typename: "Guest";
  id: string;
  name: string;
  surname: string;
}

export interface Reservations_reservations {
  __typename: "Reservation";
  id: string;
  fromYear: number;
  fromMonth: number;
  fromDay: number;
  fromHour: number | null;
  fromMinute: number | null;
  guest: Reservations_reservations_guest;
  roommates: Reservations_reservations_roommates[];
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

export interface ReservationsVariables {
  suiteId: number;
}
