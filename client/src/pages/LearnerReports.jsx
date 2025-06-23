import React, { useState } from 'react';
import {
  Download,
  Mail,
  Star,
  FileText,
  Video,
  BookOpen,
  Edit2,
  User
} from 'lucide-react';
import Header from '../components/headers/Header';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { PDFDownloadLink } from '@react-pdf/renderer';
import LearnerReportPDF from './LearnerReportPDF'

const LearnerReports = () => {
  // User Details with editable fields
  const [userDetails, setUserDetails] = useState({
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    studentId: "STU2023IN",
    learningPreference: "Visual",
    enrolledCourses: ["Web Development", "Data Structures", "System Design"],
    joinedDate: "January 2025"
  });

  // State management
  const [dateRange, setDateRange] = useState('7');
  const [emailDelivery, setEmailDelivery] = useState(false);
  const [editMode, setEditMode] = useState({
    name: false,
    email: false,
    learningPreference: false
  });

  // Mock data (non-editable stats)
  const [focusScore] = useState(85);
  const [peakHours] = useState([
    { hour: '9AM', score: 92 },
    { hour: '10AM', score: 88 },
    { hour: '11AM', score: 75 },
    { hour: '2PM', score: 82 },
    { hour: '3PM', score: 79 }
  ]);

  const [strugglePoints] = useState([
    {
      topic: 'Data Structures',
      confidence: 65,
      resources: [
        { type: 'video', link: '#', title: 'DS Fundamentals' },
        { type: 'text', link: '#', title: 'Practice Guide' }
      ]
    },
    {
      topic: 'Algorithms',
      confidence: 58,
      resources: [
        { type: 'quiz', link: '#', title: 'Algorithm Quiz' },
        { type: 'video', link: '#', title: 'Algorithm Workshop' }
      ]
    },
    {
      topic: 'System Design',
      confidence: 72,
      resources: [
        { type: 'text', link: '#', title: 'Design Patterns' },
        { type: 'video', link: '#', title: 'Architecture Basics' }
      ]
    }
  ]);

  const [interventions] = useState([
    {
      date: '2025-06-20',
      action: 'Focus reminder sent',
      effectiveness: 4
    },
    {
      date: '2025-06-21',
      action: 'Break suggested',
      effectiveness: 5
    },
    {
      date: '2025-06-22',
      action: 'Resource recommendation',
      effectiveness: 3
    }
  ]);

  // Handle edit mode for personal details
  const toggleEdit = (field) => {
    setEditMode(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Handle personal details updates
  const updateDetails = (field, value) => {
    setUserDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Download as CSV function (unchanged)
  const downloadAsCSV = () => {
    const csvData = [
      ['Student Details'],
      ['Name', userDetails.name],
      ['Email', userDetails.email],
      ['Student ID', userDetails.studentId],
      ['Learning Preference', userDetails.learningPreference],
      [''],
      ['Focus Score', focusScore],
      [''],
      ['Struggle Points'],
      ['Topic', 'Confidence'],
      ...strugglePoints.map(point => [point.topic, point.confidence]),
      [''],
      ['Interventions'],
      ['Date', 'Action', 'Effectiveness'],
      ...interventions.map(int => [int.date, int.action, int.effectiveness])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `learning_report_${userDetails.studentId}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5EFE6' }}>
      <Header />
      
      <div className="max-w-7xl mx-auto p-8" id="report-container">
        {/* User Details Section */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <User size={24} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {editMode.name ? (
                  <input
                    className="border rounded px-2 py-1"
                    value={userDetails.name}
                    onChange={e => updateDetails('name', e.target.value)}
                    onBlur={() => toggleEdit('name')}
                    autoFocus
                  />
                ) : (
                  <>
                    {userDetails.name}
                    <button className="ml-2" onClick={() => toggleEdit('name')}>
                      <Edit2 size={14} />
                    </button>
                  </>
                )}
              </h2>
              <p className="text-gray-600">
                {editMode.email ? (
                  <input
                    className="border rounded px-2 py-1"
                    value={userDetails.email}
                    onChange={e => updateDetails('email', e.target.value)}
                    onBlur={() => toggleEdit('email')}
                    autoFocus
                  />
                ) : (
                  <>
                    {userDetails.email}
                    <button className="ml-2" onClick={() => toggleEdit('email')}>
                      <Edit2 size={14} />
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <p className="text-sm text-gray-600">Student ID</p>
              <p className="font-medium">{userDetails.studentId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Learning Preference</p>
              <p className="font-medium">
                {editMode.learningPreference ? (
                  <input
                    className="border rounded px-2 py-1"
                    value={userDetails.learningPreference}
                    onChange={e => updateDetails('learningPreference', e.target.value)}
                    onBlur={() => toggleEdit('learningPreference')}
                    autoFocus
                  />
                ) : (
                  <>
                    {userDetails.learningPreference}
                    <button className="ml-2" onClick={() => toggleEdit('learningPreference')}>
                      <Edit2 size={14} />
                    </button>
                  </>
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Joined Date</p>
              <p className="font-medium">{userDetails.joinedDate}</p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-600">Enrolled Courses</p>
            <div className="flex gap-2 mt-1">
              {userDetails.enrolledCourses.map((course, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                  {course}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Report Controls */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Learning Progress Report</h1>
          
          <div className="flex gap-4">
            <select 
              className="px-4 py-2 rounded-lg border"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
              <option value="custom">Custom Range</option>
            </select>
            
            <div className="flex gap-2">
              <PDFDownloadLink
                document={
                  <LearnerReportPDF
                    userDetails={userDetails}
                    dateRange={dateRange}
                    focusScore={focusScore}
                    peakHours={peakHours}
                    strugglePoints={strugglePoints}
                    interventions={interventions}
                  />
                }
                fileName={`learning_report_${userDetails.studentId}.pdf`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
              >
                {({ loading }) => (
                  <>
                    <Download size={16} />
                    {loading ? 'Preparing...' : 'PDF'}
                  </>
                )}
              </PDFDownloadLink>
              <button 
                onClick={downloadAsCSV}
                className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2"
              >
                <Download size={16} />
                CSV
              </button>
            </div>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Focus Metrics Card */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Focus Score</h2>
            </div>
            <div className="w-32 h-32 mx-auto mb-4">
              <CircularProgressbar
                value={focusScore}
                text={`${focusScore}%`}
                styles={{
                  path: { stroke: '#4F46E5' },
                  text: { fill: '#4F46E5', fontSize: '16px' }
                }}
              />
            </div>
            <p className="text-center text-green-600 font-medium">
              15% more focused than peers
            </p>
          </div>

          {/* Struggle Points Card */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-4">Struggle Points</h2>
            {strugglePoints.map((point, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{point.topic}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${point.confidence}%` }}
                  ></div>
                </div>
                <div className="flex gap-2 mt-2">
                  {point.resources.map((resource, idx) => (
                    <a
                      key={idx}
                      href={resource.link}
                      className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                    >
                      {resource.type === 'video' && <Video size={14} />}
                      {resource.type === 'text' && <FileText size={14} />}
                      {resource.type === 'quiz' && <BookOpen size={14} />}
                      {resource.title}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Intervention History Card */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-4">Intervention History</h2>
            {interventions.map((intervention, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{intervention.date}</span>
                </div>
                <p className="font-medium">{intervention.action}</p>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < intervention.effectiveness ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Export Panel */}
        <div className="bg-white p-6 rounded-xl shadow-md mt-8">
          <h2 className="text-lg font-semibold mb-4">Email Report</h2>
          <div className="flex items-center gap-6">
            <PDFDownloadLink
              document={
                <LearnerReportPDF
                  userDetails={userDetails}
                  dateRange={dateRange}
                  focusScore={focusScore}
                  peakHours={peakHours}
                  strugglePoints={strugglePoints}
                  interventions={interventions}
                />
              }
              fileName={`learning_report_${userDetails.studentId}.pdf`}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center gap-2"
            >
              {({ loading }) => (
                <>
                  <FileText size={18} />
                  {loading ? 'Preparing...' : 'Generate & Email Report'}
                </>
              )}
            </PDFDownloadLink>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={emailDelivery}
                onChange={(e) => setEmailDelivery(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="flex items-center gap-1">
                <Mail size={16} />
                Send to {userDetails.email}
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnerReports;