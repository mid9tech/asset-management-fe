import { GetReportService } from "@services/report";
import { ExportToExcel } from "@utils/exportExcel";

export default function ExportButton() {
  async function handleExport() {
    const data = await GetReportService({
      page: 1,
      limit: undefined,
    });

    const cleanedData = data?.data.map(({ __typename, ...rest }: any) => rest);

    ExportToExcel(cleanedData);
  }

  return (
    <button
      onClick={handleExport}
      className="bg-red-600 text-white rounded px-4 py-1 cursor-pointer"
    >
      Export
    </button>
  );
}
