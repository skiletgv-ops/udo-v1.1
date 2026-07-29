import { jsPDF } from 'jspdf';
import { GutachtenReport } from '../types';

export function exportGutachtenAsDguvPdf(report: GutachtenReport): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let currentY = margin;

  // Helper for adding new page with header
  const checkPageBreak = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - margin - 15) {
      doc.addPage();
      currentY = margin + 12;
      drawFooter();
      drawPageHeader();
    }
  };

  const drawPageHeader = () => {
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('DGUV FORMULAR S2k • OFFIZIELLES UNFALLVERSICHERUNGS-GUTACHTEN', margin, 10);
    doc.setFont('Helvetica', 'normal');
    doc.text(`Aktenzeichen: ${report.patient.caseId} | Pat: ${report.patient.lastName}, ${report.patient.firstName}`, pageWidth - margin, 10, { align: 'right' });
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.line(margin, 12, pageWidth - margin, 12);
  };

  const drawFooter = () => {
    const pageNum = doc.internal.pages.length - 1;
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
    doc.text('Deutsche Gesetzliche Unfallversicherung (DGUV) • Formular AWMF-S2k Norm', margin, pageHeight - 7);
    doc.text(`Seite ${pageNum}`, pageWidth - margin, pageHeight - 7, { align: 'right' });
  };

  // 1. DGUV HEADER BANNER
  doc.setFillColor(15, 23, 42); // Deep navy Slate-900
  doc.rect(margin, currentY, contentWidth, 22, 'F');

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text('DEUTSCHE GESETZLICHE UNFALLVERSICHERUNG (DGUV)', margin + 5, currentY + 8);

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(45, 212, 191); // Teal accent
  doc.text('DGUV-Formular S2k • Sanitäts- & Sozialgerichtliches Fachgutachten', margin + 5, currentY + 16);

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(`QES eIDAS Signiert • ID: ${report.id}`, pageWidth - margin - 5, currentY + 12, { align: 'right' });

  currentY += 26;

  // 2. PATIENT & CASE META BOX (GRID)
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.rect(margin, currentY, contentWidth, 32, 'FD');

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);

  // Row 1
  doc.text('VERSICHERTER / PATIENT:', margin + 4, currentY + 7);
  doc.setFont('Helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${report.patient.lastName}, ${report.patient.firstName}`, margin + 45, currentY + 7);

  doc.setFont('Helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('GEBURTSDATUM:', margin + 110, currentY + 7);
  doc.setFont('Helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(`${report.patient.birthDate}`, margin + 142, currentY + 7);

  // Row 2
  doc.setFont('Helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('VERSICHERTEN-NR:', margin + 4, currentY + 14);
  doc.setFont('Helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(`${report.patient.insuranceNumber}`, margin + 45, currentY + 14);

  doc.setFont('Helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('AKTENZEICHEN:', margin + 110, currentY + 14);
  doc.setFont('Helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${report.patient.caseId}`, margin + 142, currentY + 14);

  // Row 3
  doc.setFont('Helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('KOSTENTRÄGER / BG:', margin + 4, currentY + 21);
  doc.setFont('Helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(`${report.patient.commissioningEntity || 'BG Bau / Unfallkasse Berlin'}`, margin + 45, currentY + 21);

  doc.setFont('Helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('GUTACHTEN-DATUM:', margin + 110, currentY + 21);
  doc.setFont('Helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(`${report.generatedAt}`, margin + 142, currentY + 21);

  // Row 4
  doc.setFont('Helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('DIAGNOSE / LEITLINIE:', margin + 4, currentY + 28);
  doc.setFont('Helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('AWMF S2k 033/050 • Neuroforaminale Stenose L4/L5 & L5/S1', margin + 45, currentY + 28);

  currentY += 38;

  // 3. REPORT SECTIONS
  report.sections.forEach((section) => {
    checkPageBreak(25);

    // Section Header Bar
    doc.setFillColor(226, 232, 240);
    doc.rect(margin, currentY, contentWidth, 7, 'F');
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(`${section.number}. ${section.title.toUpperCase()}`, margin + 3, currentY + 5);

    currentY += 10;

    // Section Body Text
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);

    const splitText = doc.splitTextToSize(section.content, contentWidth - 4);
    
    splitText.forEach((line: string) => {
      checkPageBreak(5);
      doc.text(line, margin + 2, currentY);
      currentY += 4.5;
    });

    // Citations if any
    if (section.citations && section.citations.length > 0) {
      checkPageBreak(12);
      currentY += 2;
      doc.setFillColor(241, 245, 249);
      doc.setDrawColor(226, 232, 240);
      const citHeight = section.citations.length * 4.5 + 5;
      doc.rect(margin + 2, currentY, contentWidth - 4, citHeight, 'FD');

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      doc.text('DGUV BEWEISMITTEL & EVIDENZNACHWEISE:', margin + 5, currentY + 4);

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      let citY = currentY + 8;
      section.citations.forEach((c) => {
        doc.text(`• ${c.docName} (Datum: ${c.date}, Seite ${c.page})`, margin + 5, citY);
        citY += 4.5;
      });
      currentY += citHeight + 4;
    } else {
      currentY += 4;
    }
  });

  // 4. OFFICIAL DGUV STAMP & QES SIGNATURE BLOCK
  checkPageBreak(40);
  currentY += 6;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(148, 163, 184);
  doc.rect(margin, currentY, contentWidth, 32, 'FD');

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('AMTLICHE DGUV SIGNATUR & QUALIFIZIERTES ELEKTRONISCHES SIEGEL (QES)', margin + 4, currentY + 6);

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text(`Gutachter: ${report.doctorSignature.name}`, margin + 4, currentY + 12);
  doc.text(`Qualifikation: ${report.doctorSignature.title}`, margin + 4, currentY + 17);
  doc.text(`Zulassungsnummer (D-Arzt / G-Nr): ${report.doctorSignature.licenseNumber}`, margin + 4, currentY + 22);

  // Signature Hash Box right
  doc.setFillColor(226, 232, 240);
  doc.rect(margin + 105, currentY + 4, 70, 22, 'F');
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('eIDAS QES VERIFIZIERT (BSI-CERT)', margin + 108, currentY + 9);
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Hash: ${report.doctorSignature.hash}`, margin + 108, currentY + 14);
  doc.text(`Zeitstempel: ${report.doctorSignature.date}`, margin + 108, currentY + 19);

  drawFooter();
  drawPageHeader();

  // Save the PDF document
  doc.save(`DGUV_Normgutachten_${report.patient.lastName}_${report.patient.caseId}.pdf`);
}
