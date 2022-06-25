import { gql } from "@apollo/client";

export const SUITES = gql`
  query Suites {
    suites {
      discountSuiteSet {
        type
        value
      }
      id
      number
      numberBeds
      numberBedsExtra
      priceBase
      title
    }
    discountSuiteTypes {
      name
      value
    }
  }
`

export const RESERVATIONS_META = gql`
  query ReservationsMeta {
    guests {
      id
      name
      surname
    }
    suites {
      discountSuiteSet {
        type
        value
      }
      id
      number
      numberBeds
      numberBedsExtra
      priceBase
      title
    }
    reservationMeals {
      label
      value
    }
    reservationTypes {
      label
      value
    }
  }
`