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
      expired
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
      priceAccommodation
      priceExtra
      priceMeal
      priceMunicipality
      priceTotal
      purpose
      roommates {
        id
      }
      suite {
        id
      }
      toDate
      type
    }
    timelineGroups @client {
      number
      title
    }
  }
`