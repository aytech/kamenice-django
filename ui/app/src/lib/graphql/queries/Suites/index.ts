import { gql } from "@apollo/client";

export const SUITES = gql`
  query Suites {
    suites {
      discountSet {
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
    discountTypes {
      name
      value
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
      discountSet {
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
      priceMeal
      priceMunicipality
      priceTotal
      purpose
      roommates {
        age
        id
      }
      suite {
        id
        numberBeds
        numberBedsExtra
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