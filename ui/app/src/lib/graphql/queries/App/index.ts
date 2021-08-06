import { gql } from "@apollo/client";

export const HOME_PAGE = gql`
  query HomePage {
    guests {
      id
      name
      surname
    }
    whoami {
      username
    }
  }
`