import { gql } from 'apollo-boost'

export const CREATE_GUEST = gql`
  mutation CreateGuest($data: GuestInput!) {
    createGuest(data: $data) {
      guest {
        addressMunicipality
        addressPsc
        addressStreet
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