import client from "@libs/graphQl/apolloClient";
import { GET_REPORT } from "./query/report.query";

export interface ReportInputInterface {
  page: number;
  limit: number;
  sortOrder: string;
  sort: "asc" | "desc";
}

export const GetReportService = async (reportInput: ReportInputInterface) => {
  try {
    const result = await client.query({
      query: GET_REPORT,
      variables: { reportInput: reportInput },
    });
    return result.data.getReport;
  } catch (error) {
    console.log(error);
    return null;
  }
};
