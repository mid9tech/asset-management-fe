import { gql } from "@apollo/client";

export const GET_REPORT = gql`
  query Report($reportInput: ReportInput!) {
    getReport(reportInput: $reportInput) {
      page
      limit
      total
      totalPages
      data {
        category_name
        total
        assigned
        available
        not_available
        waiting_for_recycling
        recycled
      }
    }
  }
`;
