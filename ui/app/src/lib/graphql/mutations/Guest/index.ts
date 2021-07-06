import { gql } from 'apollo-boost'

export const CREATE_GUEST = gql`
  mutation CreateGuest($data: GuestInput!) {
    createGuest(data: $data) {
      guest {
        id
        name
        surname
      }
    }
  }
`