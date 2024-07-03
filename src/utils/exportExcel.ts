import ExcelJS from "exceljs";

export const ExportToExcel = async (data: any, fileName: string) => {
  // Create a new workbook and add a worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Report");

  // Assuming `data` is an array of objects with consistent keys
  if (data.length > 0) {
    // Add headers
    const headers = Object.keys(data[0]);
    worksheet.columns = headers.map((header) => ({
      header,
      key: header,
      width: 15, // Adjust the width as necessary
    }));

    // Add rows
    data.forEach((item: any) => {
      worksheet.addRow(item);
    });
  }

  // Create a binary string representation of the workbook
  const buffer = await workbook.xlsx.writeBuffer();

  // Create a Blob from the buffer
  const blob = new Blob([buffer], { type: "application/octet-stream" });

  // Create a link element and click it to trigger the download
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${fileName}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
