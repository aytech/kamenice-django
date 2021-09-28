import { gql } from "@apollo/client";

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