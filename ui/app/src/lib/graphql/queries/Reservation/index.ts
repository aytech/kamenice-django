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

export const RESERVATIONS = gql`
  query Reservations($startDate: String!, $endDate: String!) {
    reservations(startDate: $startDate, endDate: $endDate) {
      expired
      extraSuites {
        id
      }
      fromDate
      guest {
        email
        id
        name
        surname
      }
      id
      meal
      notes
      payingGuest {
        id
      }
      priceSet {
        accommodation
        meal
        municipality
        suite {
          id
          priceBase
        }
        total
      }
      purpose
      roommateSet {
        entity {
          id
          name
          surname
        }
        fromDate
      }
      suite {
        id
        numberBeds
        numberBedsExtra
        priceBase
      }
      toDate
      type
    }
  }
`