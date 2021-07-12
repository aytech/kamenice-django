import { gql } from "@apollo/client";

export const GUEST = gql`
  query Guest($id: Int!) {
    guest(guestId: $id) {
      id
      name
      surname
    }
  }
`