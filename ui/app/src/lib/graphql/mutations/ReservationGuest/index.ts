import { gql } from "@apollo/client";

export const CREATE_RESERVATON_GUEST = gql`
  mutation CreateReservationGuest($data: ReservationGuestInput!) {
    createReservationGuest(data: $data) {
      guest {
        addressMunicipality
        addressPsc
        addressStreet
        age
        citizenship
        email
        gender
        identity
        id
        name
        phoneNumber
        surname
        visaNumber
      }
    }
  }
`

export const UPDATE_RESERVATON_GUEST = gql`
  mutation UpdateReservationGuest($data: ReservationGuestInput!) {
    updateReservationGuest(data: $data) {
      guest {
        addressMunicipality
        addressPsc
        addressStreet
        age
        citizenship
        email
        gender
        identity
        id
        name
        phoneNumber
        surname
        visaNumber
      }
    }
  }
`

export const DELETE_RESERVATON_GUEST = gql`
  mutation DeleteReservationGuest($data: ReservationGuestInput!) {
    deleteReservationGuest(data: $data) {
      guest {
        name
        surname
      }
    }
  }
`