'use client';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { useState, useEffect } from 'react';

// Create Styles for PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#FAF9F6',
    fontFamily: 'Helvetica',
    border: '10px double #F26522',
    height: '100%',
  },
  container: {
    border: '3px solid #1E293B',
    padding: 30,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 16,
    color: '#F26522',
    textAlign: 'center',
    marginBottom: 30,
    letterSpacing: 2,
  },
  awardText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 15,
  },
  studentName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
    marginVertical: 15,
    borderBottom: '2px solid #E2E8F0',
    paddingBottom: 10,
    width: '80%',
  },
  reasonText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginHorizontal: 40,
    lineHeight: 1.5,
    marginBottom: 40,
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 40,
  },
  signatureBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '40%',
  },
  signatureLine: {
    borderTop: '1px solid #94A3B8',
    width: '100%',
    marginVertical: 5,
  },
  signatureText: {
    fontSize: 10,
    color: '#64748B',
  },
  logoPlaceholder: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F26522',
    marginBottom: 20,
  }
});

// PDF Document Component
const CertificateDocument = ({ studentName, courseTitle, completionDate }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.container}>
        <Text style={styles.logoPlaceholder}>HORIZON ACADEMY</Text>
        <Text style={styles.title}>Certificate of Completion</Text>
        <Text style={styles.subtitle}>Let Your Tongue Be Your Weapon</Text>
        
        <Text style={styles.awardText}>This is proudly presented to</Text>
        <Text style={styles.studentName}>{studentName}</Text>
        
        <Text style={styles.reasonText}>
          for successfully completing all required coursework, examinations, and spoken language exercises for the program
          "{courseTitle}" with outstanding performance.
        </Text>
        
        <View style={styles.footer}>
          <View style={styles.signatureBlock}>
            <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{completionDate}</Text>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureText}>Date of Issuance</Text>
          </View>
          <View style={styles.signatureBlock}>
            <Text style={{ fontSize: 12, fontStyle: 'italic', fontFamily: 'Courier' }}>Gech Marie</Text>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureText}>Founder & Director</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

export default function CertificateDownload({ studentName, courseTitle, completionDate }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <button className="btn btn-outline btn-sm mt-2" disabled>Loading PDF...</button>;
  }

  return (
    <PDFDownloadLink
      document={<CertificateDocument studentName={studentName} courseTitle={courseTitle} completionDate={completionDate} />}
      fileName={`Certificate_${courseTitle.replace(/\s+/g, '_')}.pdf`}
      className="btn btn-outline btn-sm mt-2"
      style={{ display: 'inline-block' }}
    >
      {({ blob, url, loading, error }) =>
        loading ? 'Preparing PDF...' : 'Download Certificate 🎓'
      }
    </PDFDownloadLink>
  );
}
