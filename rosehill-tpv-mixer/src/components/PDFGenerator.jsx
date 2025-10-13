import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import colorsData from '../data/colors.json';
import './PDFGenerator.css';

const PDFGenerator = ({ svgRef, selectedColors, percentages }) => {
  const generatePDF = async () => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);

      // Load all logos first
      const loadImage = (src) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            resolve({
              data: canvas.toDataURL('image/png'),
              width: img.width,
              height: img.height
            });
          };
          img.onerror = () => resolve(null);
          img.src = src;
        });
      };

      const surfaceDesignsLogo = await loadImage('/SURFACEDESIGNS_LOGO.jpg');

      // Header section with Surface Designs logo centered
      let yPos = 20;

      // Function to calculate dimensions while maintaining aspect ratio
      const calculateLogoDimensions = (logoInfo, maxWidth, maxHeight) => {
        if (!logoInfo) return null;

        const aspectRatio = logoInfo.width / logoInfo.height;
        let width = maxWidth;
        let height = width / aspectRatio;

        if (height > maxHeight) {
          height = maxHeight;
          width = height * aspectRatio;
        }

        return { width, height };
      };

      // Surface Designs Logo - centered
      if (surfaceDesignsLogo) {
        const maxLogoHeight = 30;
        const maxLogoWidth = 80;
        const dims = calculateLogoDimensions(surfaceDesignsLogo, maxLogoWidth, maxLogoHeight);
        if (dims) {
          const logoX = (pageWidth - dims.width) / 2;
          pdf.addImage(surfaceDesignsLogo.data, 'PNG', logoX, yPos, dims.width, dims.height);
        }
      }

      // Main title
      yPos = 55;
      pdf.setFontSize(18);
      pdf.setTextColor(39, 52, 118);
      pdf.text('Rosehill TPV® Colour Mix', pageWidth / 2, yPos, { align: 'center' });

      // Capture SVG visualization
      yPos += 15;
      if (svgRef && svgRef.current) {
        const svgElement = svgRef.current.parentElement;
        const canvas = await html2canvas(svgElement, {
          scale: 2,
          logging: false,
          useCORS: true,
          backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/png');

        // Calculate dimensions while maintaining aspect ratio
        const canvasAspectRatio = canvas.width / canvas.height;
        const maxWidth = 140; // Max width in mm
        const maxHeight = 100; // Max height in mm

        let imgWidth = maxWidth;
        let imgHeight = imgWidth / canvasAspectRatio;

        // If height exceeds max, constrain by height instead
        if (imgHeight > maxHeight) {
          imgHeight = maxHeight;
          imgWidth = imgHeight * canvasAspectRatio;
        }

        const imgX = (pageWidth - imgWidth) / 2;
        const canvasYPos = yPos; // Store canvas Y position before adding image
        pdf.addImage(imgData, 'PNG', imgX, yPos, imgWidth, imgHeight);

        // Add diagonal watermark over canvas
        pdf.saveGraphicsState();

        // Calculate center of canvas for watermark positioning
        const watermarkX = pageWidth / 2; // Center horizontally on page (where canvas is centered)
        const watermarkY = canvasYPos + (imgHeight / 2); // Center vertically on canvas

        // Set rotation and position
        const angle = 45;
        pdf.setTextColor(255, 255, 255); // White text
        pdf.setFontSize(52);
        pdf.setFont(undefined, 'bold');

        // Apply opacity and draw text
        pdf.setGState(new pdf.GState({ opacity: 0.35 }));
        pdf.text('Rosehill TPV', watermarkX, watermarkY, {
          align: 'center',
          angle: angle
        });

        pdf.restoreGraphicsState();

        yPos += imgHeight + 5;
      } else {
        yPos += 85;
      }

      // Date below visualization
      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      const date = new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
      pdf.text(`Date: ${date}`, pageWidth / 2, yPos, { align: 'center' });

      // Your Mix section
      yPos += 15;
      pdf.setFontSize(12);
      pdf.setTextColor(39, 52, 118);
      pdf.setFont(undefined, 'bold');
      pdf.text('Your Mix', margin, yPos);
      pdf.setFont(undefined, 'normal');

      yPos += 8;
      pdf.setFontSize(10);
      pdf.setTextColor(60, 60, 60);

      // Color breakdown with circles
      const activeColors = Object.entries(selectedColors)
        .filter(([_, count]) => count > 0)
        .map(([colorId, count]) => ({
          colorId,
          count,
          color: colorsData.colors.find(c => c.id === colorId),
          percentage: percentages[colorId] || '0'
        }))
        .filter(item => item.color);

      activeColors.forEach((item, index) => {
        const lineY = yPos + (index * 7);

        // Draw color circle
        const circleRadius = 2.5;
        const circleX = margin + 3;
        pdf.setFillColor(
          parseInt(item.color.hex.slice(1, 3), 16),
          parseInt(item.color.hex.slice(3, 5), 16),
          parseInt(item.color.hex.slice(5, 7), 16)
        );
        pdf.circle(circleX, lineY - 1, circleRadius, 'F');

        // Add text
        const partsText = item.count === 1 ? 'Part' : 'Parts';
        const text = `${item.count} ${partsText} Rosehill TPV® ${item.color.id} ${item.color.name} (${item.percentage}%)`;
        pdf.text(text, margin + 10, lineY);
      });

      // Add extra space if few colors
      if (activeColors.length > 0) {
        yPos += (activeColors.length * 7) + 20;
      } else {
        yPos += 20;
      }

      // Disclaimer at bottom (without project details section)
      const bottomMargin = 30;
      yPos = pageHeight - bottomMargin;

      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      const disclaimer = colorsData.settings.colorDisclaimer;
      const disclaimerLines = pdf.splitTextToSize(disclaimer, contentWidth);

      // Position disclaimer lines from bottom up
      const disclaimerHeight = disclaimerLines.length * 4;
      yPos = pageHeight - bottomMargin - disclaimerHeight;

      disclaimerLines.forEach((line, index) => {
        pdf.text(line, margin, yPos + (index * 4));
      });

      // Contact information at bottom
      yPos = pageHeight - 15;
      pdf.setFontSize(9);
      pdf.setTextColor(60, 60, 60);
      const contactInfo = `${colorsData.settings.phone} | ${colorsData.settings.website}`;
      pdf.text(contactInfo, pageWidth / 2, yPos, { align: 'center' });

      // Save the PDF
      const fileName = `rosehill-tpv-colour-mix-${Date.now()}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <button
      id="third-btn"
      className="pdf-button"
      onClick={generatePDF}
    >
      Generate PDF
    </button>
  );
};

export default PDFGenerator;