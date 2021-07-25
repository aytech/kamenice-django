/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

/**
 * An enumeration.
 */
export enum GuestAge {
  ADULT = "ADULT",
  CHILD = "CHILD",
  INFANT = "INFANT",
  YOUNG = "YOUNG",
}

/**
 * An enumeration.
 */
export enum GuestGender {
  F = "F",
  M = "M",
}

/**
 * An enumeration.
 */
export enum ReservationMeal {
  BREAKFAST = "BREAKFAST",
  HALFBOARD = "HALFBOARD",
  NOMEAL = "NOMEAL",
}

/**
 * An enumeration.
 */
export enum ReservationType {
  ACCOMMODATED = "ACCOMMODATED",
  BINDING = "BINDING",
  INHABITED = "INHABITED",
  NONBINDING = "NONBINDING",
}

export interface GuestInput {
  age?: string | null;
  addressMunicipality?: string | null;
  addressPsc?: number | null;
  addressStreet?: string | null;
  citizenship?: string | null;
  email?: string | null;
  gender?: string | null;
  id?: string | null;
  identity?: string | null;
  name?: string | null;
  phoneNumber?: string | null;
  surname?: string | null;
  visaNumber?: string | null;
}

export interface ReservationInput {
  fromDate?: string | null;
  guest?: number | null;
  id?: string | null;
  meal?: string | null;
  notes?: string | null;
  purpose?: string | null;
  roommates?: (number | null)[] | null;
  suite?: number | null;
  toDate?: string | null;
  type?: string | null;
}

export interface SuiteInput {
  id?: string | null;
  number?: number | null;
  title?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
