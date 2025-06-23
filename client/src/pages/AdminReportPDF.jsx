import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Simple PDF styling
const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 12, fontFamily: 'Helvetica' },
  section: { marginBottom: 16 },
  heading: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  table: { display: 'table', width: 'auto', marginBottom: 8 },
  row: { flexDirection: 'row' },
  cell: { flex: 1, padding: 4, border: '1px solid #eee' },
  bold: { fontWeight: 'bold' }
});

const AdminReportPDF = ({
  orgDetails,
  selectedClasses,
  dateRange,
  selectedMetrics,
  compareMode,
  mockCourses,
  mockStudents,
  mockLectures,
  mockHeatmap
}) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.heading}>Admin Institutional Report</Text>
      {/* Organization Details */}
      {orgDetails && (
        <View style={styles.section}>
          <Text>Organization: {orgDetails.name}</Text>
          <Text>Email: {orgDetails.email}</Text>
          <Text>Address: {orgDetails.address}</Text>
        </View>
      )}
      <View style={styles.section}>
        <Text>
          Classes: {selectedClasses?.join(', ')} | Date Range: {dateRange} days | Metrics: {selectedMetrics?.join(', ')}
        </Text>
        <Text>Compare Mode: {compareMode ? 'ON' : 'OFF'}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.bold}>Key Metrics</Text>
        <Text>Avg. Score: 82%</Text>
        <Text>Confusion Rate: 18%</Text>
        <Text>Active Students: 124</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.bold}>Top Performing Courses</Text>
        {mockCourses &&
          mockCourses
            .sort((a, b) => b.avgScore - a.avgScore)
            .slice(0, 2)
            .map((c, i) => (
              <Text key={i}>{c.name}: {c.avgScore}%</Text>
            ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.bold}>Bottom Performing Courses</Text>
        {mockCourses &&
          mockCourses
            .sort((a, b) => a.avgScore - b.avgScore)
            .slice(0, 2)
            .map((c, i) => (
              <Text key={i}>{c.name}: {c.avgScore}%</Text>
            ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.bold}>Student Performance Matrix</Text>
        <View style={styles.table}>
          <View style={[styles.row, { backgroundColor: '#eee' }]}>
            <Text style={styles.cell}>Name</Text>
            <Text style={styles.cell}>Trend</Text>
            <Text style={styles.cell}>Last Intervention</Text>
          </View>
          {mockStudents &&
            mockStudents.map((stu, idx) => (
              <View style={styles.row} key={idx}>
                <Text style={styles.cell}>{stu.name}</Text>
                <Text style={styles.cell}>{stu.trend}</Text>
                <Text style={styles.cell}>{stu.lastIntervention}</Text>
              </View>
            ))}
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.bold}>Lecture Effectiveness</Text>
        {mockLectures &&
          mockLectures.map((lec, idx) => (
            <Text key={idx}>{lec.title}: {lec.effectiveness}%</Text>
          ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.bold}>Rewatch Heatmap</Text>
        {mockHeatmap &&
          mockHeatmap.map((vid, idx) => (
            <Text key={idx}>
              {vid.video}: {vid.timestamps.map(t => `${t}min`).join(', ')}
            </Text>
          ))}
      </View>
    </Page>
  </Document>
);

export default AdminReportPDF;