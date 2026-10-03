export const printResume = (elementId: string) => {
  const originalElement = document.getElementById(elementId);
  if (!originalElement) {
    console.error(`Element with id "${elementId}" not found.`);
    return;
  }

  // Create a hidden iframe
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!iframeDoc) {
    console.error('Failed to access iframe document.');
    return;
  }

  // Clone the element
  const clone = originalElement.cloneNode(true) as HTMLElement;
  
  // Hide break guides and other visual helpers inside the print version
  const breakGuides = clone.querySelectorAll('.page-break-guide');
  breakGuides.forEach(el => (el as HTMLElement).style.display = 'none');
  
  // Ensure the clone has proper A4 size styling for print
  clone.style.width = '100%';
  clone.style.transform = 'none';
  clone.style.margin = '0';
  clone.style.boxShadow = 'none';
  clone.style.left = '0';
  clone.style.marginLeft = '0';

  // Write HTML structure
  iframeDoc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print Resume</title>
        <meta charset="utf-8">
        <style>
          @page {
            size: A4 portrait;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
            background: #ffffff;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          /* Custom styles for layout, custom fonts, etc. */
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Fira+Mono:wght@400;700&family=Lora:ital,wght@0,400..700;1,400..700&display=swap');
        </style>
      </head>
      <body>
        <div id="print-container"></div>
      </body>
    </html>
  `);

  // Copy document stylesheet links to preserve Tailwind and other styles
  Array.from(document.querySelectorAll('link[rel="stylesheet"], style')).forEach(style => {
    iframeDoc.head.appendChild(style.cloneNode(true));
  });

  // Inject clone
  const container = iframeDoc.getElementById('print-container');
  if (container) {
    container.appendChild(clone);
  }

  // Close the stream
  iframeDoc.close();

  // Wait for styles/fonts to load, then trigger print
  iframe.contentWindow?.focus();
  
  // Give it a brief timeout to render and load fonts
  setTimeout(() => {
    iframe.contentWindow?.print();
    // Cleanup iframe after print dialog closes
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  }, 500);
};
