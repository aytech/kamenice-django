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
  query GenerateStatement($fromDate: String!, $toDate: String!, $foreigners: Boolean) {
    guestsReport(fromDate: $fromDate, toDate: $toDate, foreigners: $foreigners) {
      message
      status
    }
  }
`