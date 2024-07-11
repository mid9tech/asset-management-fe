import ExcelJS from "exceljs";

export const ExportToExcel = async (data) => {
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
    data.forEach((item) => {
      worksheet.addRow(item);
    });
  }

  // Create a binary string representation of the workbook
  const buffer = await workbook.xlsx.writeBuffer();

  // Get the current date to format the file name
  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getFullYear()}`;
  const fileName = `report-asset-${formattedDate}.xlsx`;

  // Check if the File System Access API is available
  if ('showSaveFilePicker' in window) {
    try {
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: fileName,
        types: [
          {
            description: 'Excel Files',
            accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] },
          },
        ],
      });

      const writable = await fileHandle.createWritable();
      await writable.write(buffer);
      await writable.close();
    } catch (error) {
      console.error('Error saving file:', error);
    }
  } else {
    // Fallback for browsers that don't support the File System Access API
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
