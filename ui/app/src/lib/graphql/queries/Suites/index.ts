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
  query SuitesWithReservations($startDate: String!, $endDate: String!) {
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