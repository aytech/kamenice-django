import { gql } from "@apollo/client";

export const STATEMENTS = gql`
  query Statements {
    guestsReportFiles {
      created
      driveId
      id
      name
      pathDocx
      pathPdf
    }
  }
`

export const GENERATE_STATEMENT = gql`
  query GenerateStatement($fromDate: String!, $toDate: String!) {
    guestsReport(fromDate: $fromDate, toDate: $toDate) {
      message
      status
    }
  }
`