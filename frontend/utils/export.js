/**
 * Export utility — CSV & PDF generation
 */
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ==========================================
// CSV Utilities
// ==========================================

function downloadCSV(csvContent, filename) {
  const BOM = '\uFEFF'; // UTF-8 BOM
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeCSV(value) {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportItemsToCSV(items) {
  const headers = ['SKU', 'Nama', 'Kategori', 'Stok', 'Harga Beli', 'Harga Jual', 'Stok Minimum'];
  const rows = items.map(item => [
    escapeCSV(item.sku),
    escapeCSV(item.name),
    escapeCSV(item.category),
    item.total_stock ?? 0,
    item.base_price ?? 0,
    item.sell_price ?? 0,
    item.min_stock ?? 0,
  ].join(','));

  const csv = [headers.join(','), ...rows].join('\n');
  const date = new Date().toISOString().slice(0, 10);
  downloadCSV(csv, `MediStock_DataMaster_${date}.csv`);
}

export function downloadImportTemplateCSV() {
  const headers = ['SKU', 'Nama', 'Kategori', 'Stok Minimum', 'Harga Beli', 'Harga Jual'];
  const examples = [
    ['CONTOH-01', 'Paracetamol 500mg (HAPUS BARIS INI)', 'Obat Bebas', '50', '2000', '3500'],
    ['CONTOH-02', 'Amoxicillin 500mg (HAPUS BARIS INI)', 'Obat Resep', '20', '5000', '7500'],
    ['CONTOH-03', 'Masker Medis N95 (HAPUS BARIS INI)', 'Alkes', '100', '15000', '25000']
  ];
  const rows = examples.map(row => row.map(escapeCSV).join(','));
  const csv = [headers.join(','), ...rows].join('\n');
  downloadCSV(csv, `Template_Import_MediStock.csv`);
}

export function exportLedgerToCSV(transactions) {
  const headers = ['Tanggal', 'Tipe', 'Nama Barang', 'Qty', 'Batch', 'Harga', 'Total Nilai', 'Catatan'];
  const rows = [];

  for (const trx of transactions) {
    if (trx.items && trx.items.length > 0) {
      for (const item of trx.items) {
        rows.push([
          escapeCSV(new Date(trx.date).toLocaleString('id-ID')),
          escapeCSV(trx.type),
          escapeCSV(item.item?.name || '-'),
          item.qty,
          escapeCSV(item.batch?.batch_number || '-'),
          item.price,
          trx.total_amount,
          escapeCSV(trx.notes || '-'),
        ].join(','));
      }
    } else {
      rows.push([
        escapeCSV(new Date(trx.date).toLocaleString('id-ID')),
        escapeCSV(trx.type),
        '-', 0, '-', 0,
        trx.total_amount,
        escapeCSV(trx.notes || '-'),
      ].join(','));
    }
  }

  const csv = [headers.join(','), ...rows].join('\n');
  const date = new Date().toISOString().slice(0, 10);
  downloadCSV(csv, `MediStock_KartuStok_${date}.csv`);
}

export function exportAlertsToCSV(alerts, type = 'low_stock') {
  const date = new Date().toISOString().slice(0, 10);

  if (type === 'low_stock') {
    const headers = ['Nama Item', 'SKU', 'Kategori', 'Stok Saat Ini', 'Stok Minimum', 'Severity'];
    const rows = (alerts.low_stock || []).map(a => [
      escapeCSV(a.item_name),
      escapeCSV(a.sku),
      escapeCSV(a.category),
      a.current_qty,
      a.min_stock,
      escapeCSV(a.severity),
    ].join(','));
    downloadCSV([headers.join(','), ...rows].join('\n'), `MediStock_StokRendah_${date}.csv`);
  } else {
    const headers = ['Nama Item', 'SKU', 'Kategori', 'Batch', 'Qty', 'Tanggal Kedaluwarsa', 'Sisa Hari', 'Severity'];
    const items = [...(alerts.expiring || []), ...(alerts.expired || [])];
    const rows = items.map(a => [
      escapeCSV(a.item_name),
      escapeCSV(a.sku),
      escapeCSV(a.category),
      escapeCSV(a.batch_number),
      a.quantity,
      escapeCSV(a.expiry_date),
      a.days_left,
      escapeCSV(a.severity),
    ].join(','));
    downloadCSV([headers.join(','), ...rows].join('\n'), `MediStock_Kedaluwarsa_${date}.csv`);
  }
}

// ==========================================
// PDF Utilities
// ==========================================

function addPDFHeader(doc, title) {
  doc.setFontSize(18);
  doc.setTextColor(20, 83, 45); // Dark green matching MediStock primary
  doc.text('MediStock', 14, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // Slate muted
  doc.text('Sistem Manajemen Inventaris Farmasi Terpadu', 14, 28);
  
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42); // Slate dark
  doc.text(title, 14, 40);
  
  const dateStr = new Date().toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  doc.setFontSize(9);
  doc.text(`Tanggal Cetak: ${dateStr}`, 14, 46);
}

export function exportItemsToPDF(items) {
  const doc = new jsPDF();
  addPDFHeader(doc, 'Laporan Data Master Barang');

  const tableColumn = ["SKU", "Nama Item", "Kategori", "Stok", "H. Beli", "H. Jual"];
  const tableRows = [];

  items.forEach(item => {
    tableRows.push([
      item.sku,
      item.name,
      item.category,
      item.total_stock ?? 0,
      `Rp ${item.base_price?.toLocaleString('id-ID') || 0}`,
      `Rp ${item.sell_price?.toLocaleString('id-ID') || 0}`
    ]);
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 55,
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [20, 83, 45], textColor: 255 },
    alternateRowStyles: { fillColor: [241, 245, 249] }
  });

  const date = new Date().toISOString().slice(0, 10);
  doc.save(`MediStock_DataMaster_${date}.pdf`);
}

export function exportLedgerToPDF(transactions) {
  const doc = new jsPDF({ orientation: 'landscape' });
  addPDFHeader(doc, 'Laporan Kartu Stok & Mutasi');

  const tableColumn = ["Tanggal", "Tipe", "Item", "Qty", "Batch", "Total Nilai", "Catatan"];
  const tableRows = [];

  transactions.forEach(trx => {
    if (trx.items && trx.items.length > 0) {
      trx.items.forEach(item => {
        tableRows.push([
          new Date(trx.date).toLocaleString('id-ID'),
          trx.type,
          item.item?.name || '-',
          item.qty,
          item.batch?.batch_number || '-',
          `Rp ${trx.total_amount?.toLocaleString('id-ID') || 0}`,
          trx.notes || '-'
        ]);
      });
    } else {
      tableRows.push([
        new Date(trx.date).toLocaleString('id-ID'),
        trx.type,
        '-', '0', '-',
        `Rp ${trx.total_amount?.toLocaleString('id-ID') || 0}`,
        trx.notes || '-'
      ]);
    }
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 55,
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [37, 99, 235], textColor: 255 }, // Blue for ledger
    alternateRowStyles: { fillColor: [241, 245, 249] }
  });

  const date = new Date().toISOString().slice(0, 10);
  doc.save(`MediStock_KartuStok_${date}.pdf`);
}

export function exportAlertsToPDF(alerts, type = 'low_stock') {
  const doc = new jsPDF();
  
  if (type === 'low_stock') {
    addPDFHeader(doc, 'Laporan Peringatan Stok Rendah');
    const tableColumn = ["SKU", "Nama Item", "Kategori", "Sisa Stok", "Min Stok", "Severity"];
    const tableRows = (alerts.low_stock || []).map(a => [
      a.sku,
      a.item_name,
      a.category,
      a.current_qty,
      a.min_stock,
      a.severity.toUpperCase()
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 55,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [239, 68, 68], textColor: 255 }, // Red for alerts
      alternateRowStyles: { fillColor: [254, 242, 242] }
    });
    
    doc.save(`MediStock_StokRendah_${new Date().toISOString().slice(0, 10)}.pdf`);
    
  } else {
    addPDFHeader(doc, 'Laporan Peringatan Kedaluwarsa');
    const tableColumn = ["SKU", "Item", "Batch", "Qty", "Kedaluwarsa", "Sisa Hari"];
    const items = [...(alerts.expiring || []), ...(alerts.expired || [])];
    const tableRows = items.map(a => [
      a.sku,
      a.item_name,
      a.batch_number,
      a.quantity,
      a.expiry_date,
      a.days_left
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 55,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [217, 119, 6], textColor: 255 }, // Amber for expiring
      alternateRowStyles: { fillColor: [255, 251, 235] }
    });
    
    doc.save(`MediStock_Kedaluwarsa_${new Date().toISOString().slice(0, 10)}.pdf`);
  }
}
