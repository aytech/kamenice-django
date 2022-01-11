/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PriceInput } from "./../../../globalTypes";

// ====================================================
// GraphQL query operation: CalculateReservationPrice
// ====================================================

export interface CalculateReservationPrice_price {
  __typename: "PriceOutput";
  accommodation: number;
  meal: number;
  municipality: number;
  total: number;
}

export interface CalculateReservationPrice {
  price: CalculateReservationPrice_price | null;
}

export interface CalculateReservationPriceVariables {
  data: PriceInput;
}
