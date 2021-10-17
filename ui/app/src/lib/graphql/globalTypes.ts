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
export enum DiscountType {
  CHILD = "CHILD",
  EXTRA_BED = "EXTRA_BED",
  INFANT = "INFANT",
  THREE_NIGHTS = "THREE_NIGHTS",
}

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

export interface ContactInput {
  message?: string | null;
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

export interface PriceInput {
  guests: (number | null)[];
  meal?: string | null;
  numberDays: number;
  suiteId: number;
}

export interface ReservationGuestInput {
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
  hash?: string | null;
}

export interface ReservationInput {
  expired?: string | null;
  fromDate?: string | null;
  guestId?: number | null;
  id?: string | null;
  meal?: string | null;
  notes?: string | null;
  payingGuestId?: number | null;
  priceAccommodation?: any | null;
  priceExtra?: any | null;
  priceMeal?: any | null;
  priceMunicipality?: any | null;
  priceTotal?: any | null;
  purpose?: string | null;
  roommateIds?: (number | null)[] | null;
  suiteId?: number | null;
  toDate?: string | null;
  type?: string | null;
}

export interface SuiteDiscountInput {
  type: string;
  value: number;
}

export interface SuiteInput {
  discounts?: (SuiteDiscountInput | null)[] | null;
  id?: string | null;
  number?: number | null;
  numberBeds?: number | null;
  numberBedsExtra?: number | null;
  priceBase?: any | null;
  title?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
