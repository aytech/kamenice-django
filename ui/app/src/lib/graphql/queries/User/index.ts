import { gql } from "@apollo/client";

export const USER = gql`
  query Whoami {
    whoami {
      username
    }
  }
`