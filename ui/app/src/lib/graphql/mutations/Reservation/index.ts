import { gql } from "@apollo/client";

export const CREATE_RESERVATION = gql`
  mutation CreateReservation($data: ReservationInput!) {
    createReservation(data: $data) {
      reservation {
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
          number
          title
        }
        toDate
        type
      }
    }
  }
`

export const DELETE_RESERVATION = gql`
  mutation DeleteReservation($reservationId: ID!) {
    deleteReservation(reservationId: $reservationId) {
      reservation {
        id
      }
    }
  }
`

export const UPDATE_RESERVATION = gql`
  mutation UpdateReservation($data: ReservationInput!) {
    updateReservation(data: $data) {
      reservation {
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
          number
          title
        }
        toDate
        type
      }
    }
  }
`

export const SEND_CONFIRMATION = gql`
  mutation SendConfirmation($reservationId: ID!) {
    sendConfirmation(reservationId: $reservationId) {
      reservation {
        id
      }
    }
  }
`