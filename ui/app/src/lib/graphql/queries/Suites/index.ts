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

export const SUITES_WITH_RESERVATIONS = gql`
  query SuitesWithReservations {
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
    reservationMeals {
      label
      value
    }
    reservationTypes {
      label
      value
    }
    timelineGroups @client {
      number
      title
    }
  }
`