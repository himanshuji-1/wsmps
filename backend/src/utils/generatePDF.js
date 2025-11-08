import PDFDocument from 'pdfkit';
import User from '../models/User.js';
export default async function generatePrescriptionPDF({ prescription, symptom, doctorId }) {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      const patient = await User.findById(prescription.patientId);
      const doctor = await User.findById(doctorId);
      doc.fontSize(16).text('Prescription', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Patient: ${patient?.name || 'Patient'}`);
      doc.text(`Age: ${symptom.age || 'N/A'}`);
      doc.text(`Doctor: Dr. ${doctor?.name || 'Doctor'}`);
      doc.text(`Date: ${new Date(prescription.createdAt).toLocaleString()}`);
      doc.moveDown();
      doc.text('Medicines:', { underline: true });
      prescription.medicines.forEach((m, i) => {
        doc.moveDown(0.2);
        doc.fontSize(11).text(`${i+1}. ${m.name} — ${m.dose || ''}`);
        if (m.notes) doc.text(`   Notes: ${m.notes}`);
      });
      doc.moveDown();
      doc.text('Signature: ______________________');
      doc.end();
    } catch (e) { reject(e); }
  });
}
