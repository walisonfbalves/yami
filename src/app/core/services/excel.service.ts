
import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  async generateAnalyticsReport(data: any) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Relatório Vendas');

    const titleRow = sheet.addRow(['RELATÓRIO DE PERFORMANCE YAMI']);
    titleRow.font = { name: 'Arial', family: 4, size: 16, bold: true };
    sheet.mergeCells('A1:D1');
    
    sheet.addRow(['Gerado em:', new Date().toLocaleString()]);
    sheet.addRow([]);

    const summaryHeaderRow = sheet.addRow(['RESUMO DO PERÍODO']);
    summaryHeaderRow.font = { bold: true, size: 12 };
    sheet.mergeCells(`A${summaryHeaderRow.number}:D${summaryHeaderRow.number}`);

    const kpiHeaderRow = sheet.addRow(['Faturamento Total', 'Total de Pedidos', 'Ticket Médio', 'Novos Clientes']);
    kpiHeaderRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    kpiHeaderRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1C1917' }
    };

    const kpiValueRow = sheet.addRow([
      data.totalRevenue,
      data.totalOrders,
      data.avgTicket,
      data.customerGrowth.total
    ]);
    
    kpiValueRow.getCell(1).numFmt = '"R$"#,##0.00;[Red]\-"R$"#,##0.00';
    kpiValueRow.getCell(3).numFmt = '"R$"#,##0.00;[Red]\-"R$"#,##0.00';
    kpiValueRow.font = { size: 12 };

    sheet.addRow([]);

    const detailsTitleRow = sheet.addRow(['DETALHAMENTO DIÁRIO DE VENDAS']);
    detailsTitleRow.font = { bold: true, size: 12 };
    sheet.mergeCells(`A${detailsTitleRow.number}:C${detailsTitleRow.number}`);

    const tableHeaderRow = sheet.addRow(['Data', 'Pedidos', 'Receita (R$)']);
    tableHeaderRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    tableHeaderRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF059669' }
    };
    
    if (data.hourlyVolume && data.hourlyVolume.hours) {
       const labels = data.revenueChart.labels;
       const revenues = data.revenueChart.data;
       const orders = data.revenueChart.data.map((r: number) => Math.floor(r / data.avgTicket));

       labels.forEach((label: string, index: number) => {
           const revenue = revenues[index] || 0;
           const orderCount = orders[index] || 0;
           
           const row = sheet.addRow([label, orderCount, revenue]);
           row.getCell(3).numFmt = '"R$"#,##0.00;[Red]\-"R$"#,##0.00';
       });
    }

    sheet.getColumn(1).width = 20;
    sheet.getColumn(2).width = 15;
    sheet.getColumn(3).width = 20;
    sheet.getColumn(4).width = 20;

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `Relatorio_Yami_${new Date().toISOString().slice(0,10)}.xlsx`);
  }
}
