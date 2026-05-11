/**
 * MediStock — Export Utility
 * CSV & PDF generation dengan desain dokumen profesional
 * Mendukung mode Preview (blob URL) dan Download langsung
 */
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ============================================================
// Brand & Design Tokens
// ============================================================
const BRAND = {
  primaryGreen: [37, 110, 95],    // #256e5f — sama persis dengan --primary-color
  primaryBlue:  [37,  99, 235],
  primaryRed:   [239, 68, 68],
  primaryAmber: [217, 119, 6],
  dark:         [15,  23, 42],
  muted:        [100, 116, 139],
  light:        [241, 245, 249],
  white:        [255, 255, 255],
  lightGreen:   [236, 253, 245],
  lightBlue:    [239, 246, 255],
  lightRed:     [254, 242, 242],
  lightAmber:   [255, 251, 235],
};

function today() {
  return new Date().toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}
function todayShort() { return new Date().toISOString().slice(0, 10); }

// ============================================================
// PDF Builder — Kop Surat & Footer
// ============================================================

/**
 * Menggambar header kop surat profesional.
 * Mengembalikan posisi Y untuk mulai menaruh konten.
 */
function drawHeader(doc, { title, accentColor = BRAND.primaryGreen, isLandscape = false }) {
  const pageW = isLandscape ? 297 : 210;

  // Accent bar atas
  doc.setFillColor(...accentColor);
  doc.rect(0, 0, pageW, 4, 'F');

  // Logo teks — MEDI (gelap) + STOCK (warna aksen)
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...BRAND.dark);
  doc.text('MEDI', 14, 20);
  const mediW = doc.getTextWidth('MEDI');
  doc.setTextColor(...accentColor);
  doc.text('STOCK', 14 + mediW + 0.3, 20);

  // Tagline
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...BRAND.muted);
  doc.text('Sistem Manajemen Inventaris Farmasi Terpadu', 14, 26.5);

  // Garis pemisah
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.25);
  doc.line(14, 31, pageW - 14, 31);

  // Judul laporan + tanggal (kanan atas)
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...BRAND.dark);
  doc.text(title, pageW - 14, 20, { align: 'right' });

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...BRAND.muted);
  doc.text(`Dicetak: ${today()}`, pageW - 14, 27, { align: 'right' });

  return 38; // Y start untuk konten
}

/** Menambahkan footer nomor halaman di semua halaman */
function addFooter(doc, isLandscape = false) {
  const pageCount = doc.getNumberOfPages();
  const pageW = isLandscape ? 297 : 210;
  const pageH = isLandscape ? 210 : 297;

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFillColor(...BRAND.primaryGreen);
    doc.rect(0, pageH - 2.5, pageW, 2.5, 'F');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...BRAND.muted);
    doc.text('MediStock — Dokumen Resmi', 14, pageH - 5.5);
    doc.text(`Halaman ${i} dari ${pageCount}`, pageW - 14, pageH - 5.5, { align: 'right' });
  }
}

// ============================================================
// PDF Builders — mengembalikan doc object (DRY)
// ============================================================

function _buildItemsPDF(items) {
  const doc = new jsPDF();
  const startY = drawHeader(doc, { title: 'Laporan Data Master Barang', accentColor: BRAND.primaryGreen });

  doc.setFontSize(8);
  doc.setTextColor(...BRAND.muted);
  doc.text(`Total Item: ${items.length}`, 14, startY + 2);

  autoTable(doc, {
    head: [['No', 'SKU', 'Nama Item', 'Kategori', 'Stok', 'H. Beli', 'H. Jual', 'Min Stok']],
    body: items.map((item, i) => [
      i + 1,
      item.sku || '-',
      item.name || '-',
      item.category || '-',
      item.total_stock ?? 0,
      `Rp ${(item.base_price || 0).toLocaleString('id-ID')}`,
      `Rp ${(item.sell_price || 0).toLocaleString('id-ID')}`,
      item.min_stock ?? 0,
    ]),
    startY: startY + 8,
    styles: { fontSize: 7.5, cellPadding: 2.8, lineColor: [226, 232, 240], lineWidth: 0.2 },
    headStyles: { fillColor: BRAND.primaryGreen, textColor: BRAND.white, fontStyle: 'bold', fontSize: 8 },
    alternateRowStyles: { fillColor: BRAND.lightGreen },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 24 },
      4: { halign: 'center' },
      5: { halign: 'right' },
      6: { halign: 'right' },
      7: { halign: 'center' },
    },
    margin: { left: 14, right: 14 },
  });

  addFooter(doc);
  return doc;
}

function _buildLedgerPDF(transactions) {
  const doc = new jsPDF({ orientation: 'landscape' });
  const startY = drawHeader(doc, {
    title: 'Laporan Kartu Stok & Mutasi',
    accentColor: BRAND.primaryBlue,
    isLandscape: true,
  });

  const rows = [];
  let idx = 1;
  for (const trx of transactions) {
    if (trx.items && trx.items.length > 0) {
      trx.items.forEach(item => {
        rows.push([
          idx++,
          new Date(trx.date).toLocaleString('id-ID'),
          trx.type,
          item.item?.name || '-',
          item.qty,
          item.batch?.batch_number || '-',
          `Rp ${(trx.total_amount || 0).toLocaleString('id-ID')}`,
          trx.notes || '-',
        ]);
      });
    } else {
      rows.push([
        idx++,
        new Date(trx.date).toLocaleString('id-ID'),
        trx.type, '-', 0, '-',
        `Rp ${(trx.total_amount || 0).toLocaleString('id-ID')}`,
        trx.notes || '-',
      ]);
    }
  }

  doc.setFontSize(8);
  doc.setTextColor(...BRAND.muted);
  doc.text(`Total Transaksi: ${transactions.length}`, 14, startY + 2);

  autoTable(doc, {
    head: [['No', 'Tanggal', 'Tipe', 'Item', 'Qty', 'Batch', 'Total Nilai', 'Catatan']],
    body: rows,
    startY: startY + 8,
    styles: { fontSize: 7.5, cellPadding: 2.5, lineColor: [226, 232, 240], lineWidth: 0.2 },
    headStyles: { fillColor: BRAND.primaryBlue, textColor: BRAND.white, fontStyle: 'bold', fontSize: 8 },
    alternateRowStyles: { fillColor: BRAND.lightBlue },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      2: { halign: 'center', cellWidth: 14 },
      4: { halign: 'center', cellWidth: 12 },
      6: { halign: 'right' },
    },
    didDrawCell: (data) => {
      if (data.section === 'body' && data.column.index === 2) {
        const val = String(data.cell.raw);
        if (val === 'IN') doc.setTextColor(5, 150, 105);
        else if (val === 'OUT') doc.setTextColor(220, 38, 38);
        else doc.setTextColor(...BRAND.dark);
      }
    },
    margin: { left: 14, right: 14 },
  });

  addFooter(doc, true);
  return doc;
}

function _buildAlertsPDF(alerts, type = 'low_stock') {
  const doc = new jsPDF();

  if (type === 'low_stock') {
    const startY = drawHeader(doc, {
      title: 'Laporan Peringatan Stok Rendah',
      accentColor: BRAND.primaryRed,
    });

    const data = alerts.low_stock || [];

    // Summary box
    doc.setFillColor(...BRAND.lightRed);
    doc.roundedRect(14, startY, 182, 14, 2, 2, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(220, 38, 38);
    doc.text(`⚠  ${data.length} item membutuhkan restok segera`, 19, startY + 5.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...BRAND.muted);
    doc.text('Daftar di bawah menampilkan semua barang dengan stok di bawah batas minimum.', 19, startY + 10.5);

    autoTable(doc, {
      head: [['No', 'SKU', 'Nama Item', 'Kategori', 'Sisa Stok', 'Min Stok', 'Kekurangan', 'Status']],
      body: data.map((a, i) => [
        i + 1,
        a.sku || '-',
        a.item_name || '-',
        a.category || '-',
        a.current_qty,
        a.min_stock,
        Math.max(0, a.min_stock - a.current_qty),
        (a.severity === 'critical' ? 'KRITIS' : 'PERHATIAN'),
      ]),
      startY: startY + 20,
      styles: { fontSize: 8, cellPadding: 3, lineColor: [226, 232, 240], lineWidth: 0.2 },
      headStyles: { fillColor: BRAND.primaryRed, textColor: BRAND.white, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: BRAND.lightRed },
      columnStyles: {
        0: { cellWidth: 8, halign: 'center' },
        4: { halign: 'center' },
        5: { halign: 'center' },
        6: { halign: 'center' },
        7: { halign: 'center' },
      },
      didDrawCell: (data) => {
        if (data.section === 'body' && data.column.index === 7) {
          const val = String(data.cell.raw);
          if (val === 'KRITIS') doc.setTextColor(220, 38, 38);
          else doc.setTextColor(217, 119, 6);
        }
      },
      margin: { left: 14, right: 14 },
    });

  } else {
    const startY = drawHeader(doc, {
      title: 'Laporan Peringatan Kedaluwarsa',
      accentColor: BRAND.primaryAmber,
    });

    const data = [...(alerts.expiring || []), ...(alerts.expired || [])];

    // Summary box
    doc.setFillColor(...BRAND.lightAmber);
    doc.roundedRect(14, startY, 182, 14, 2, 2, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(217, 119, 6);
    doc.text(`⏰  ${data.length} item mendekati atau sudah kedaluwarsa`, 19, startY + 5.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...BRAND.muted);
    doc.text('Lakukan pemeriksaan dan tindak lanjut segera untuk mencegah kerugian.', 19, startY + 10.5);

    autoTable(doc, {
      head: [['No', 'SKU', 'Nama Item', 'Batch', 'Qty', 'Tanggal Exp.', 'Sisa Hari', 'Status']],
      body: data.map((a, i) => [
        i + 1,
        a.sku || '-',
        a.item_name || '-',
        a.batch_number || '-',
        a.quantity,
        a.expiry_date || '-',
        a.days_left,
        (a.severity === 'critical' ? 'KRITIS' : 'PERHATIAN'),
      ]),
      startY: startY + 20,
      styles: { fontSize: 8, cellPadding: 3, lineColor: [226, 232, 240], lineWidth: 0.2 },
      headStyles: { fillColor: BRAND.primaryAmber, textColor: BRAND.white, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: BRAND.lightAmber },
      columnStyles: {
        0: { cellWidth: 8, halign: 'center' },
        4: { halign: 'center' },
        6: { halign: 'center' },
        7: { halign: 'center' },
      },
      margin: { left: 14, right: 14 },
    });
  }

  addFooter(doc);
  return doc;
}

// ============================================================
// Public API — Download
// ============================================================

export function exportItemsToPDF(items) {
  _buildItemsPDF(items).save(`MediStock_DataMaster_${todayShort()}.pdf`);
}
export function exportLedgerToPDF(transactions) {
  _buildLedgerPDF(transactions).save(`MediStock_KartuStok_${todayShort()}.pdf`);
}
export function exportAlertsToPDF(alerts, type = 'low_stock') {
  const filename = type === 'low_stock'
    ? `MediStock_StokRendah_${todayShort()}.pdf`
    : `MediStock_Kedaluwarsa_${todayShort()}.pdf`;
  _buildAlertsPDF(alerts, type).save(filename);
}

// ============================================================
// Public API — Preview (kembalikan blob URL untuk iframe)
// ============================================================

export function previewItemsPDF(items) {
  return _buildItemsPDF(items).output('bloburl');
}
export function previewLedgerPDF(transactions) {
  return _buildLedgerPDF(transactions).output('bloburl');
}
export function previewAlertsPDF(alerts, type = 'low_stock') {
  return _buildAlertsPDF(alerts, type).output('bloburl');
}

// ============================================================
// CSV Utilities
// ============================================================

function downloadCSV(csvContent, filename) {
  const BOM = '\uFEFF';
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

function csvMeta(title) {
  const d = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
  return `"MediStock — ${title}"\n"Dicetak: ${d}"\n\n`;
}

export function exportItemsToCSV(items) {
  const headers = ['No', 'SKU', 'Nama', 'Kategori', 'Stok', 'Harga Beli', 'Harga Jual', 'Stok Minimum'];
  const rows = items.map((item, i) => [
    i + 1,
    escapeCSV(item.sku),
    escapeCSV(item.name),
    escapeCSV(item.category),
    item.total_stock ?? 0,
    item.base_price ?? 0,
    item.sell_price ?? 0,
    item.min_stock ?? 0,
  ].join(','));
  const csv = csvMeta('Laporan Data Master Barang') + [headers.join(','), ...rows].join('\n');
  downloadCSV(csv, `MediStock_DataMaster_${todayShort()}.csv`);
}

export function downloadImportTemplateCSV() {
  const headers = ['SKU', 'Nama', 'Kategori', 'Stok Minimum', 'Harga Beli', 'Harga Jual'];
  const notes = `"# PETUNJUK: Hapus baris CONTOH sebelum mengimpor file ini."\n"# Kategori valid: Obat Bebas | Obat Resep | Alkes"\n\n`;
  const examples = [
    ['CONTOH-01', 'Paracetamol 500mg (HAPUS)', 'Obat Bebas', '50', '2000', '3500'],
    ['CONTOH-02', 'Amoxicillin 500mg (HAPUS)', 'Obat Resep', '20', '5000', '7500'],
    ['CONTOH-03', 'Masker Medis N95 (HAPUS)', 'Alkes', '100', '15000', '25000'],
  ];
  const rows = examples.map(r => r.map(escapeCSV).join(','));
  downloadCSV(notes + [headers.join(','), ...rows].join('\n'), 'Template_Import_MediStock.csv');
}

export function exportLedgerToCSV(transactions) {
  const headers = ['No', 'Tanggal', 'Tipe', 'Nama Barang', 'Qty', 'Batch', 'Harga Satuan', 'Total Nilai', 'Catatan'];
  const rows = [];
  let idx = 1;
  for (const trx of transactions) {
    if (trx.items && trx.items.length > 0) {
      for (const item of trx.items) {
        rows.push([
          idx++,
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
      rows.push([idx++, escapeCSV(new Date(trx.date).toLocaleString('id-ID')), escapeCSV(trx.type), '-', 0, '-', 0, trx.total_amount, '-'].join(','));
    }
  }
  const csv = csvMeta('Laporan Kartu Stok & Mutasi') + [headers.join(','), ...rows].join('\n');
  downloadCSV(csv, `MediStock_KartuStok_${todayShort()}.csv`);
}

export function exportAlertsToCSV(alerts, type = 'low_stock') {
  if (type === 'low_stock') {
    const headers = ['No', 'Nama Item', 'SKU', 'Kategori', 'Stok Saat Ini', 'Stok Minimum', 'Kekurangan', 'Severity'];
    const rows = (alerts.low_stock || []).map((a, i) => [
      i + 1, escapeCSV(a.item_name), escapeCSV(a.sku), escapeCSV(a.category),
      a.current_qty, a.min_stock, Math.max(0, a.min_stock - a.current_qty), escapeCSV(a.severity),
    ].join(','));
    downloadCSV(csvMeta('Peringatan Stok Rendah') + [headers.join(','), ...rows].join('\n'), `MediStock_StokRendah_${todayShort()}.csv`);
  } else {
    const headers = ['No', 'Nama Item', 'SKU', 'Kategori', 'Batch', 'Qty', 'Tanggal Kedaluwarsa', 'Sisa Hari', 'Severity'];
    const items = [...(alerts.expiring || []), ...(alerts.expired || [])];
    const rows = items.map((a, i) => [
      i + 1, escapeCSV(a.item_name), escapeCSV(a.sku), escapeCSV(a.category),
      escapeCSV(a.batch_number), a.quantity, escapeCSV(a.expiry_date), a.days_left, escapeCSV(a.severity),
    ].join(','));
    downloadCSV(csvMeta('Peringatan Kedaluwarsa') + [headers.join(','), ...rows].join('\n'), `MediStock_Kedaluwarsa_${todayShort()}.csv`);
  }
}
