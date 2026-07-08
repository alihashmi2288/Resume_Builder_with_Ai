import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Downloads the specified DOM element as a high-quality A4 PDF.
 * Implements off-screen sandbox rendering to guarantee identical layout on desktop and mobile.
 * 
 * @param elementId The HTML ID of the resume preview element
 * @param fileName The output filename
 */
export const downloadAsPdf = async (elementId: string, fileName: string = 'resume.pdf') => {
  const originalElement = document.getElementById(elementId);
  if (!originalElement) {
    console.error(`Element with id "${elementId}" not found.`);
    return;
  }

  // 1. Create a modern visual loading overlay in the DOM
  const overlay = document.createElement('div');
  overlay.id = 'pdf-loading-overlay';
  overlay.style.position = 'fixed';
  overlay.style.inset = '0';
  overlay.style.backgroundColor = 'rgba(15, 23, 42, 0.75)'; // Slate 900 with opacity
  overlay.style.backdropFilter = 'blur(4px)';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.zIndex = '99999';
  overlay.style.color = '#f8fafc';
  overlay.style.fontFamily = 'system-ui, -apple-system, sans-serif';

  overlay.innerHTML = `
    <div style="padding: 32px; background: #1e293b; border: 1px solid #334155; border-radius: 16px; text-align: center; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); max-width: 320px; width: 90%;">
      <div style="position: relative; width: 56px; height: 56px; margin: 0 auto 20px;">
        <!-- Circular spinner -->
        <div style="box-sizing: border-box; display: block; position: absolute; width: 56px; height: 56px; border: 4px solid #10b981; border-radius: 50%; animation: loader-rotate 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite; border-color: #10b981 transparent transparent transparent;"></div>
      </div>
      <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600; color: #f8fafc;">Generating PDF...</h3>
      <p style="margin: 0; font-size: 14px; color: #94a3b8; line-height: 1.5;">Preparing resume structure and generating print layout. This will only take a moment.</p>
      
      <style>
        @keyframes loader-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    </div>
  `;
  document.body.appendChild(overlay);

  try {
    // 2. Setup offscreen container with exact A4 dimensions (794px width)
    const sandboxContainer = document.createElement('div');
    sandboxContainer.style.position = 'absolute';
    sandboxContainer.style.left = '-9999px';
    sandboxContainer.style.top = '0';
    sandboxContainer.style.width = '794px';
    sandboxContainer.style.background = '#ffffff';
    sandboxContainer.style.boxSizing = 'border-box';
    document.body.appendChild(sandboxContainer);

    // 3. Clone original element and force standard desktop styling on it
    const clone = originalElement.cloneNode(true) as HTMLElement;
    clone.style.width = '794px';
    clone.style.transform = 'none';
    clone.style.transition = 'none';
    clone.style.margin = '0';
    clone.style.boxShadow = 'none';
    
    // Hide visual helper lines (like edit page break guide lines) in the downloaded PDF
    const breakGuides = clone.querySelectorAll('.page-break-guide');
    breakGuides.forEach(el => (el as HTMLElement).style.display = 'none');

    sandboxContainer.appendChild(clone);

    // 4. Give the DOM a moment to reflow and load cached images/fonts
    await new Promise(resolve => setTimeout(resolve, 300));

    // 5. Render canvas using html2canvas (scale 2 for high density print quality)
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      allowTaint: true
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    
    // 6. Create jsPDF in portrait A4 size (dimensions: 595.28pt x 841.89pt)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Proportional dimensions on PDF page
    const imgWidth = pdfWidth;
    const imgHeight = pdfWidth * (canvasHeight / canvasWidth);

    let heightLeft = imgHeight;
    let position = 0;

    // Page 1
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;

    // Slicing remaining canvas height across additional pages
    while (heightLeft > 0) {
      position = -pdfHeight * pdf.getNumberOfPages();
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;
    }

    // 7. Save document
    pdf.save(fileName);

    // Cleanup offscreen container
    document.body.removeChild(sandboxContainer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("An error occurred while generating your PDF. Please try again.");
  } finally {
    // 8. Always remove loading overlay
    const overlayToRemove = document.getElementById('pdf-loading-overlay');
    if (overlayToRemove) {
      document.body.removeChild(overlayToRemove);
    }
  }
};
