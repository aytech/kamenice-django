import { gql } from "@apollo/client";

export const CREATE_RESERVATION = gql`
  mutation CreateReservation($data: ReservationInput!) {
    createReservation(data: $data) {
      reservation {
        id
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
        id
      }
    }
  }
`