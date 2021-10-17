import { gql } from "@apollo/client";

export const CREATE_RESERVATION = gql`
  mutation CreateReservation($data: ReservationInput!) {
    createReservation(data: $data) {
      reservation {
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
          age
          id
        }
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
          age
          id
        }
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

export const CALCULATE_PRICE = gql`
  mutation CalculatePrice($data: PriceInput!) {
    calculateReservationPrice(data: $data) {
      price {
        accommodation
        meal
        municipality
        total
      }
    }
  }
`