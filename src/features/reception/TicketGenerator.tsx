import * as React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Image, Font } from '@react-pdf/renderer';
import QRCode from 'qrcode';

// Registrar fuentes para mejor estética
Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Roboto',
    color: '#333',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: '#002D4C',
    paddingBottom: 10,
    marginBottom: 20,
  },
  logoContainer: {
    flexDirection: 'column',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'black',
    color: '#002D4C',
  },
  logoSubtext: {
    fontSize: 8,
    color: '#FF4F00',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  folioContainer: {
    textAlign: 'right',
  },
  folioLabel: {
    fontSize: 8,
    color: '#666',
  },
  folioValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 15,
  },
  sectionHeader: {
    fontSize: 9,
    fontWeight: 'bold',
    backgroundColor: '#f0f4f8',
    padding: 4,
    color: '#002D4C',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  label: {
    width: 100,
    fontWeight: 'bold',
    color: '#555',
  },
  value: {
    flex: 1,
  },
  qrContainer: {
    marginTop: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  qrImage: {
    width: 80,
    height: 80,
  },
  terms: {
    fontSize: 7,
    color: '#777',
    marginTop: 20,
    lineHeight: 1.4,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  signatureContainer: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  signatureLine: {
    width: 150,
    borderTopWidth: 1,
    borderTopColor: '#333',
    textAlign: 'center',
    paddingTop: 5,
    fontSize: 8,
  }
});

interface TicketData {
  id: string;
  folio: number;
  cliente: {
    nombre: string;
    telefono: string;
    email?: string;
  };
  equipo: {
    tipo: string;
    marca: string;
    modelo?: string;
    serie?: string;
    estadoFisico: string;
  };
  orden: {
    fallaReportada: string;
    costoEstimado: number;
    anticipo: number;
    metodoPago?: string;
    fechaEntrada: string;
    fechaPromesa?: string;
  };
}

export const OrderTicket = ({ data, qrCodeUrl }: { data: TicketData; qrCodeUrl: string }) => (
  <Document>
    <Page size="A5" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>GAMA</Text>
          <Text style={styles.logoSubtext}>Centro de Reparación</Text>
        </View>
        <View style={styles.folioContainer}>
          <Text style={styles.folioLabel}>ORDEN DE SERVICIO</Text>
          <Text style={styles.folioValue}>#GMA-{data.folio}</Text>
          <Text style={{ fontSize: 7, marginTop: 2 }}>{new Date(data.orden.fechaEntrada).toLocaleString()}</Text>
        </View>
      </View>

      {/* Cliente */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Datos del Cliente</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Nombre:</Text>
          <Text style={styles.value}>{data.cliente.nombre}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Teléfono:</Text>
          <Text style={styles.value}>{data.cliente.telefono}</Text>
        </View>
      </View>

      {/* Equipo */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Información del Equipo</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Equipo:</Text>
          <Text style={styles.value}>{data.equipo.tipo} {data.equipo.marca} {data.equipo.modelo}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>No. Serie:</Text>
          <Text style={styles.value}>{data.equipo.serie || 'N/A'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Estado Físico:</Text>
          <Text style={styles.value}>{data.equipo.estadoFisico}</Text>
        </View>
      </View>

      {/* Servicio */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Detalles del Servicio</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Falla:</Text>
          <Text style={styles.value}>{data.orden.fallaReportada}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Presupuesto:</Text>
          <Text style={styles.value}>${data.orden.costoEstimado.toFixed(2)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Anticipo:</Text>
          <Text style={styles.value}>${data.orden.anticipo.toFixed(2)} ({data.orden.metodoPago || 'Efectivo'})</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Entrega:</Text>
          <Text style={[styles.value, { color: '#FF4F00', fontWeight: 'bold' }]}>
            {data.orden.fechaPromesa ? new Date(data.orden.fechaPromesa).toLocaleDateString() : 'Por confirmar'}
          </Text>
        </View>
      </View>

      {/* QR y Seguimiento */}
      <View style={styles.qrContainer}>
        <View style={{ flex: 1, paddingRight: 20 }}>
          <Text style={{ fontSize: 8, fontWeight: 'bold', marginBottom: 2 }}>Escanea para seguimiento:</Text>
          <Text style={{ fontSize: 7, color: '#666' }}>
            Consulta el estatus de tu reparación en tiempo real escaneando el código QR o ingresando a gama-reparaciones.mx/seguimiento
          </Text>
        </View>
        {qrCodeUrl && <Image src={qrCodeUrl} style={styles.qrImage} />}
      </View>

      {/* Legal */}
      <View style={styles.terms}>
        <Text>CONDICIONES: 1. Presentar este ticket para recoger su equipo. 2. Después de 30 días de la fecha de entrega, la empresa no se hace responsable por equipos olvidados. 3. Toda revisión genera un cargo por diagnóstico incluso si no se autoriza la reparación. 4. Dispositivos mojados o golpeados no tienen garantía de encendido tras la intervención.</Text>
      </View>

      {/* Firmas */}
      <View style={styles.signatureContainer}>
        <Text style={styles.signatureLine}>Firma Cliente</Text>
        <Text style={styles.signatureLine}>GAMA - Recepción</Text>
      </View>
    </Page>
  </Document>
);

export async function generateQRCode(orderId: string) {
  try {
    const url = `https://gama-reparaciones.com/seguimiento/${orderId}`;
    const qrDataUrl = await QRCode.toDataURL(url);
    return qrDataUrl;
  } catch (err) {
    console.error(err);
    return '';
  }
}
