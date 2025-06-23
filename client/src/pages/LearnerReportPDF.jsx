import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 12, fontFamily: 'Helvetica' },
  section: { marginBottom: 16 },
  heading: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  label: { fontWeight: 'bold' },
  tag: { backgroundColor: '#DBEAFE', color: '#2563EB', borderRadius: 8, padding: '2 8', marginRight: 4, fontSize: 10 },
  bar: { height: 8, backgroundColor: '#2563EB', borderRadius: 4, marginVertical: 2 },
  star: { color: '#FACC15', fontSize: 14, marginRight: 2 }
});

const LearnerReportPDF = ({
  userDetails,
  dateRange,
  focusScore,
  peakHours,
  strugglePoints,
  interventions
}) => (
  <Document>
    <Page style={styles.page}>
      {/* User Details */}
      <View style={styles.section}>
        <Text style={styles.heading}>Student Details</Text>
        <Text><Text style={styles.label}>Name:</Text> {userDetails.name}</Text>
        <Text><Text style={styles.label}>Email:</Text> {userDetails.email}</Text>
        <Text><Text style={styles.label}>Student ID:</Text> {userDetails.studentId}</Text>
        <Text><Text style={styles.label}>Learning Preference:</Text> {userDetails.learningPreference}</Text>
        <Text><Text style={styles.label}>Joined:</Text> {userDetails.joinedDate}</Text>
        <Text>
          <Text style={styles.label}>Enrolled Courses:</Text>{' '}
          {userDetails.enrolledCourses.map((c, i) => (
            <Text key={i} style={styles.tag}>{c}</Text>
          ))}
        </Text>
      </View>

      {/* Focus Score */}
      <View style={styles.section}>
        <Text style={styles.heading}>Focus Score</Text>
        <Text>Your Focus Score: {focusScore}%</Text>
        <Text>15% more focused than peers</Text>
      </View>

      {/* Peak Focus Hours */}
      <View style={styles.section}>
        <Text style={styles.heading}>Peak Focus Hours</Text>
        {peakHours.map((h, i) => (
          <View key={i}>
            <Text>{h.hour}: {h.score}%</Text>
            <View style={[styles.bar, { width: `${h.score}%` }]} />
          </View>
        ))}
      </View>

      {/* Struggle Points */}
      <View style={styles.section}>
        <Text style={styles.heading}>Struggle Points</Text>
        {strugglePoints.map((point, i) => (
          <View key={i} style={{ marginBottom: 6 }}>
            <Text>
              <Text style={styles.label}>{point.topic}</Text> (Confidence: {point.confidence}%)
            </Text>
            <Text>
              Resources:{' '}
              {point.resources.map((r, j) => (
                <Text key={j} style={styles.tag}>{r.title}</Text>
              ))}
            </Text>
          </View>
        ))}
      </View>

      {/* Intervention History */}
      <View style={styles.section}>
        <Text style={styles.heading}>Intervention History</Text>
        {interventions.map((intv, i) => (
          <View key={i} style={{ marginBottom: 4 }}>
            <Text>{intv.date}: {intv.action}</Text>
            <Text>
              Effectiveness:{' '}
              {[...Array(5)].map((_, idx) => (
                <Text key={idx} style={styles.star}>
                  {idx < intv.effectiveness ? '★' : '☆'}
                </Text>
              ))}
            </Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default LearnerReportPDF;