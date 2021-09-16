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
        email
        id
        name
        surname
      }
      meal
      notes
      priceAccommodation
      priceExtra
      priceMeal
      priceMunicipality
      priceTotal
      purpose
      suite {
        id
      }
      toDate
      type
    }
  }
`