/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PriceInput } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: CalculatePrice
// ====================================================

export interface CalculatePrice_calculateReservationPrice_price {
  __typename: "Price";
  accommodation: number;
  meal: number;
  municipality: number;
  total: number;
}

export interface CalculatePrice_calculateReservationPrice {
  __typename: "CalculateReservationPrice";
  price: CalculatePrice_calculateReservationPrice_price | null;
}

export interface CalculatePrice {
  calculateReservationPrice: CalculatePrice_calculateReservationPrice | null;
}

export interface CalculatePriceVariables {
  data: PriceInput;
}
