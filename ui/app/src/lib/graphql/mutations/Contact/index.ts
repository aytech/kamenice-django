import { gql } from "@apollo/client";

export const CONTACT_MESSAGE = gql`
  mutation CreateContactMessage($data: ContactInput!) {
    createContactMessage(data: $data) {
      contact {
        message
      }
    }
  }
`