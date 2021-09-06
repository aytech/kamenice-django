import { gql } from "@apollo/client";

export const SUITES = gql`
  query Suites {
    suites {
      id
      number
      numberBeds
      priceBase
      priceChild
      priceExtra
      priceInfant
      title
    }
  }
`

export const SUITES_WITH_RESERVATIONS = gql`
  query SuitesWithReservations {
    guests {
      id
      name
      surname
    }
    suites {
      id
      number
      numberBeds
      priceBase
      priceChild
      priceExtra
      priceInfant
      title
    }
    reservations {
      fromDate
      id
      guest {
        id
        name
        surname
      }
      meal
      notes
      price
      purpose
      roommates {
        age
        id
        name
        surname
      }
      suite {
        id
      }
      toDate
      type
    }
  }
`