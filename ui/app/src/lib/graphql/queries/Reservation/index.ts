import { gql } from "@apollo/client";

export const CALCULATE_PRICE = gql`
  query CalculateReservationPrice($data: PriceInput!) {
    price(data: $data) {
      accommodation
      meal
      municipality
      total
    }
  }
`