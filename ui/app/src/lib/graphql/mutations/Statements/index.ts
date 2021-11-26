import { gql } from "@apollo/client"

export const DELETE_STATEMENT = gql`
  mutation DeleteStatement($fileId: String!) {
    deleteDriveFile(fileId: $fileId) {
      file {
        name
      }
    }
  }
`