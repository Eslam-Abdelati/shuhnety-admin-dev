/**
 * Export data to Excel using HTML Table technique (No dependencies required)
 * This avoids polyfill issues with libraries like xlsx in Vite.
 */
export const exportToExcel = (data, fileName, columns) => {
  // 1. Create HTML Table structure with styles
  let html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>Sheet1</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .header-section { text-align: center; margin-bottom: 30px; border-bottom: 2pt solid #2563eb; padding-bottom: 10px; }
        .company-name { color: #2563eb; font-size: 24pt; font-weight: bold; }
        .report-title { color: #64748b; font-size: 14pt; margin-top: 5px; }
        .meta-info { color: #94a3b8; font-size: 10pt; text-align: left; margin-bottom: 20px; }
        
        table { border-collapse: collapse; width: 100%; margin-top: 20px; }
        .th-header {
          background-color: #2563eb;
          color: #ffffff;
          font-weight: bold;
          text-align: center;
          padding: 12px;
          border: 1pt solid #1e40af;
          font-size: 11pt;
        }
        .td-cell {
          padding: 10px;
          border: 1pt solid #e2e8f0;
          text-align: right;
          font-size: 10pt;
          color: #334155;
        }
        .row-even { background-color: #f8fafc; }
        .footer { margin-top: 30px; font-size: 9pt; color: #94a3b8; text-align: center; border-top: 1pt solid #e2e8f0; padding-top: 10px; }
      </style>
    </head>
    <body dir="rtl">
      <div class="header-section">
        <div class="company-name">شحنتي - SHUHNETY</div>
        <div class="report-title">${fileName.replace(/_/g, ' ')}</div>
      </div>

      <table>
        <thead>
          <tr>
            ${columns.map(col => `<th class="th-header">${col.header}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${data.map((item, index) => `
            <tr class="${index % 2 === 0 ? 'row-even' : ''}">
              ${columns.map(col => `<td class="td-cell">${item[col.key] || '—'}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="footer">
        هذا التقرير تم استخراجه آلياً من نظام إدارة شحنتي. جميع الحقوق محفوظة © ${new Date().getFullYear()}
      </div>
    </body>
    </html>
  `;

  // 2. Create Blob and Download
  const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}.xls`; // Note: .xls format for HTML tables
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
