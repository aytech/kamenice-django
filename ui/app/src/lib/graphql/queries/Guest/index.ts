import { gql } from 'apollo-boost'

export const GUEST = gql`
  query Guest($id: Int!) {
    guest(guestId: $id) {
      id
      name
      surname
    }
  }
`