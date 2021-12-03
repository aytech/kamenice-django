/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ReservationDragInput } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: DragReservation
// ====================================================

export interface DragReservation_dragReservation_reservation_suite {
  __typename: "Suite";
  id: string;
  number: number | null;
  title: string;
}

export interface DragReservation_dragReservation_reservation {
  __typename: "Reservation";
  fromDate: any;
  id: string;
  suite: DragReservation_dragReservation_reservation_suite;
  toDate: any;
}

export interface DragReservation_dragReservation {
  __typename: "DragReservation";
  reservation: DragReservation_dragReservation_reservation | null;
}

export interface DragReservation {
  dragReservation: DragReservation_dragReservation | null;
}

export interface DragReservationVariables {
  data: ReservationDragInput;
}
