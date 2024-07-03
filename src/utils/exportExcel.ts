import * as XLSX from "xlsx";

export const ExportToExcel = (data: any, fileName: string) => {
  // Convert data to a worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Create a new workbook and append the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

  // Create a binary string representation of the workbook
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  // Create a Blob from the binary string
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

  // Create a link element and click it to trigger the download
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${fileName}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
