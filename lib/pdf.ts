
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export const downloadAsPdf = async (elementId: string, fileName: string = 'resume.pdf') => {
  const resumeElement = document.getElementById(elementId);
  if (!resumeElement) {
    console.error(`Element with id "${elementId}" not found.`);
    return;
  }

  try {
    const canvas = await html2canvas(resumeElement, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
    });
    
    const imgData = canvas.toDataURL('image/png');
    
    // A4 dimensions in points: 595.28 x 841.89
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    });
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const canvasAspectRatio = canvasWidth / canvasHeight;
    const pdfAspectRatio = pdfWidth / pdfHeight;

    let finalCanvasWidth, finalCanvasHeight;

    // Fit canvas to PDF page
    if (canvasAspectRatio > pdfAspectRatio) {
      finalCanvasWidth = pdfWidth;
      finalCanvasHeight = pdfWidth / canvasAspectRatio;
    } else {
      finalCanvasHeight = pdfHeight;
      finalCanvasWidth = pdfHeight * canvasAspectRatio;
    }

    const x = (pdfWidth - finalCanvasWidth) / 2;
    const y = 0; // Start from top

    pdf.addImage(imgData, 'PNG', x, y, finalCanvasWidth, finalCanvasHeight);
    pdf.save(fileName);

  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};
