import { gql } from "@apollo/client"

export const CREATE_GUEST = gql`
  mutation CreateGuest($data: GuestInput!) {
    createGuest(data: $data) {
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

export const UPDATE_GUEST = gql`
  mutation UpdateGuest($data: GuestInput!) {
    updateGuest(data: $data) {
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

export const DELETE_GUEST = gql`
  mutation DeleteGuest($guestId: ID!) {
    deleteGuest(guestId: $guestId) {
      guest {
        id
      }
    }
  }
`