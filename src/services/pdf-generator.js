import jsPDF from 'jspdf';
import QRCode from 'qrcode';

export const generateTicketPDF = async (ticket) => {
  // Crear nuevo documento PDF
  const doc = new jsPDF();
  
  // Configuración de colores
  const primaryColor = [0, 0, 0]; // Negro
  const accentColor = [59, 130, 246]; // Azul
  const grayColor = [107, 114, 128]; // Gris
  const lightGrayColor = [229, 231, 235]; // Gris claro
  const successColor = [34, 197, 94]; // Verde
  
  // Configuración de fuentes
  doc.setFont('helvetica');
  
  // Fondo principal - blanco limpio
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 210, 297, 'F');
  
  // Borde principal con esquinas redondeadas simuladas
  doc.setDrawColor(...lightGrayColor);
  doc.setLineWidth(1);
  doc.rect(10, 10, 190, 277);
  
  // Header con logo y título
  doc.setFillColor(...accentColor);
  doc.rect(15, 15, 180, 40, 'F');
  
  // Logo circular en el header
  doc.setFillColor(255, 255, 255);
  doc.circle(35, 35, 12, 'F');
  doc.setFillColor(...accentColor);
  doc.circle(35, 35, 8, 'F');
  doc.setFillColor(255, 255, 255);
  doc.circle(35, 35, 4, 'F');
  
  // Título principal
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text('ENTRADA OFICIAL', 105, 35, { align: 'center' });
  
  // Información del evento - diseño moderno
  doc.setFillColor(255, 255, 255);
  doc.rect(15, 65, 180, 60, 'F');
  doc.setDrawColor(...lightGrayColor);
  doc.rect(15, 65, 180, 60);
  
  // Título del evento
  doc.setFontSize(18);
  doc.setTextColor(...primaryColor);
  const eventTitle = ticket.event?.title || 'Evento no disponible';
  doc.text(eventTitle, 25, 85);
  
  // Fecha del evento
  doc.setFontSize(12);
  doc.setTextColor(...grayColor);
  const eventDate = ticket.event?.date ? new Date(ticket.event.date).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : 'Fecha no disponible';
  doc.text(eventDate, 25, 100);
  
  // Ubicación
  const location = ticket.event?.location || 'Ubicación no disponible';
  doc.text(location, 25, 115);
  
  // Generar QR real con mejor diseño
  const qrData = JSON.stringify({
    ticketId: ticket.id,
    eventId: ticket.event?.id,
    eventTitle: ticket.event?.title,
    customerName: `${ticket.customerInfo?.firstName} ${ticket.customerInfo?.lastName}`,
    purchaseDate: ticket.purchaseDate
  });
  
  const qrCodeDataURL = await QRCode.toDataURL(qrData, {
    width: 100,
    margin: 2,
    color: {
      dark: '#3B82F6',
      light: '#FFFFFF'
    }
  });
  
  // Agregar QR al PDF con borde azul
  doc.setFillColor(255, 255, 255);
  doc.rect(140, 70, 50, 50, 'F');
  doc.setDrawColor(...accentColor);
  doc.setLineWidth(2);
  doc.rect(140, 70, 50, 50);
  doc.addImage(qrCodeDataURL, 'PNG', 142, 72, 46, 46);
  
  // Sección principal de información del ticket
  doc.setFillColor(248, 250, 252);
  doc.rect(15, 135, 180, 80, 'F');
  doc.setDrawColor(...lightGrayColor);
  doc.rect(15, 135, 180, 80);
  
  // Información del cliente - formato limpio
  doc.setFontSize(14);
  doc.setTextColor(...primaryColor);
  doc.text('INFORMACIÓN DEL CLIENTE', 25, 155);
  
  doc.setFontSize(12);
  doc.setTextColor(...grayColor);
  const customerName = `${ticket.customerInfo?.firstName || ''} ${ticket.customerInfo?.lastName || ''}`;
  doc.text(customerName, 25, 170);
  
  const customerEmail = ticket.customerInfo?.email || 'No disponible';
  doc.text(customerEmail, 25, 180);
  
  const customerPhone = ticket.customerInfo?.phone || 'No disponible';
  doc.text(customerPhone, 25, 190);
  
  // Información de pago - formato limpio
  doc.setFontSize(14);
  doc.setTextColor(...primaryColor);
  doc.text('INFORMACIÓN DE PAGO', 25, 210);
  
  doc.setFontSize(12);
  doc.setTextColor(...grayColor);
  doc.text('Precio total:', 25, 225);
  
  doc.setFontSize(16);
  doc.setTextColor(...successColor);
  doc.text(`$${ticket.totalPrice?.toLocaleString() || '0'}`, 100, 225);
  
  // Fecha de compra
  doc.setFontSize(10);
  doc.setTextColor(...grayColor);
  const purchaseDate = ticket.purchaseDate ? new Date(ticket.purchaseDate).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : 'No disponible';
  doc.text(`Comprado: ${purchaseDate}`, 25, 235);
  
  // ID del ticket
  doc.setFontSize(8);
  doc.setTextColor(...grayColor);
  doc.text(`ID: ${ticket.id}`, 25, 245);
  
  // Instrucciones importantes con diseño mejorado
  doc.setFillColor(254, 242, 242);
  doc.rect(15, 225, 180, 40, 'F');
  doc.setDrawColor(239, 68, 68);
  doc.rect(15, 225, 180, 40);
  
  doc.setFontSize(12);
  doc.setTextColor(127, 29, 29);
  doc.text('INSTRUCCIONES IMPORTANTES', 25, 240);
  
  doc.setFontSize(10);
  doc.setTextColor(127, 29, 29);
  doc.text('• Presenta este documento en la entrada del evento', 25, 250);
  doc.text('• Llega 30 minutos antes del inicio', 25, 255);
  doc.text('• Trae tu documento de identidad', 25, 260);
  
  // Pie de página
  doc.setFontSize(8);
  doc.setTextColor(...grayColor);
  doc.text('Este documento es tu entrada oficial para el evento.', 105, 275, { align: 'center' });
  doc.text('Consérvalo en un lugar seguro.', 105, 280, { align: 'center' });
  
  // Elementos decorativos sutiles
  // Líneas decorativas en las esquinas
  doc.setDrawColor(...accentColor);
  doc.setLineWidth(1);
  doc.line(15, 15, 25, 15);
  doc.line(15, 15, 15, 25);
  doc.line(195, 15, 185, 15);
  doc.line(195, 15, 195, 25);
  doc.line(15, 282, 25, 282);
  doc.line(15, 282, 15, 272);
  doc.line(195, 282, 185, 282);
  doc.line(195, 282, 195, 272);
  
  return doc;
};

export const downloadTicketAsPDF = async (ticket) => {
  try {
    const doc = await generateTicketPDF(ticket);
    const eventTitle = ticket.event?.title?.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '-') || 'evento';
    const fileName = `entrada-${eventTitle}-${ticket.id}.pdf`;
    doc.save(fileName);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}; 