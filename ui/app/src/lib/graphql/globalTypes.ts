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
export enum DiscountSuiteType {
  CHILD_DISCOUNT = "CHILD_DISCOUNT",
  EXTRA_BED_DISCOUNT = "EXTRA_BED_DISCOUNT",
  FIFTH_MORE_BED = "FIFTH_MORE_BED",
  INFANT_DISCOUNT = "INFANT_DISCOUNT",
  THIRD_FOURTH_BED = "THIRD_FOURTH_BED",
  THREE_NIGHTS_DISCOUNT = "THREE_NIGHTS_DISCOUNT",
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
  INQUIRY = "INQUIRY",
  NONBINDING = "NONBINDING",
}

export interface ConfirmationInput {
  note?: string | null;
  reservationId?: string | null;
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
  suiteId?: number | null;
}

export interface ReservationDragInput {
  extraSuitesIds?: (number | null)[] | null;
  fromDate?: string | null;
  id?: string | null;
  suiteId?: string | null;
  toDate?: string | null;
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
  extraSuitesIds?: (number | null)[] | null;
  fromDate?: string | null;
  guestId?: number | null;
  id?: string | null;
  meal?: string | null;
  notes?: string | null;
  numberDays?: number | null;
  payingGuestId?: number | null;
  price?: ReservationPrice | null;
  purpose?: string | null;
  roommates?: (ReservationRoommate | null)[] | null;
  suiteId?: string | null;
  toDate?: string | null;
  type?: string | null;
}

export interface ReservationPrice {
  accommodation?: string | null;
  meal?: string | null;
  municipality?: string | null;
  suiteId?: string | null;
  total?: string | null;
}

export interface ReservationRoommate {
  id: string;
  fromDate?: string | null;
  toDate?: string | null;
}

export interface SettingsInput {
  defaultArrivalTime?: string | null;
  defaultDepartureTime?: string | null;
  id?: string | null;
  municipalityFee?: string | null;
  priceBreakfast?: string | null;
  priceBreakfastChild?: string | null;
  priceHalfboard?: string | null;
  priceHalfboardChild?: string | null;
  userAvatar?: string | null;
  userColor?: string | null;
  userName?: string | null;
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
  priceBase?: string | null;
  title?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
