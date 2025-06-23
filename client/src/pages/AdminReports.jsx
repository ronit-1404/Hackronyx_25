import React, { useState } from 'react';
import {
  Download,
  FileText,
  Users,
  BarChart2,
  TrendingUp,
  TrendingDown,
  Calendar,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Settings,
  ClipboardList,
  Repeat,
  ArrowRightLeft,
  Edit2,
  Mail,
  Building,
  Video,
} from 'lucide-react';
import Header from '../components/headers/Header';
import { PDFDownloadLink } from '@react-pdf/renderer';
import AdminReportPDF from './AdminReportPDF';

// Mock data
const mockClasses = ['Cohort A', 'Cohort B', 'Cohort C', 'Cohort D'];
const mockMetrics = [
  { id: 'engagement', label: 'Engagement' },
  { id: 'content', label: 'Content' },
  { id: 'system', label: 'System' }
];
const mockCourses = [
  { name: 'Web Development', avgScore: 87, confusion: 12 },
  { name: 'Data Structures', avgScore: 78, confusion: 22 },
  { name: 'System Design', avgScore: 91, confusion: 8 },
  { name: 'AI Fundamentals', avgScore: 69, confusion: 31 }
];
const mockStudents = [
  { name: 'Rahul Sharma', trend: 'up', lastIntervention: '2025-06-21', id: 'stu1' },
  { name: 'Priya Singh', trend: 'down', lastIntervention: '2025-06-20', id: 'stu2' },
  { name: 'Amit Verma', trend: 'up', lastIntervention: '2025-06-18', id: 'stu3' },
  { name: 'Sara Khan', trend: 'down', lastIntervention: '2025-06-22', id: 'stu4' }
];
const mockLectures = [
  { title: 'Intro to React', effectiveness: 92 },
  { title: 'Sorting Algorithms', effectiveness: 78 },
  { title: 'REST APIs', effectiveness: 85 },
  { title: 'System Design Basics', effectiveness: 69 }
];
const mockHeatmap = [
  { video: 'Intro to React', timestamps: [5, 12, 18, 24] },
  { video: 'Sorting Algorithms', timestamps: [2, 7, 15, 20] }
];

const AdminReports = () => {
  // Organization details (editable)
  const [orgDetails, setOrgDetails] = useState({
    name: "TechEd Institute",
    email: "admin@teched.edu.in",
    address: "Bangalore, Karnataka"
  });
  const [editMode, setEditMode] = useState(false);

  // Filters
  const [selectedClasses, setSelectedClasses] = useState([mockClasses[0]]);
  const [dateRange, setDateRange] = useState('7');
  const [selectedMetrics, setSelectedMetrics] = useState(['engagement']);
  const [compareMode, setCompareMode] = useState(false);

  // Student selection
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Table sort
  const [sortField, setSortField] = useState('name');
  const [sortAsc, setSortAsc] = useState(true);

  // Handle multi-select
  const toggleClass = (cls) => {
    setSelectedClasses(prev =>
      prev.includes(cls) ? prev.filter(c => c !== cls) : [...prev, cls]
    );
  };

  const toggleMetric = (metric) => {
    setSelectedMetrics(prev =>
      prev.includes(metric)
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  // Table sort
  const handleSort = (field) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Student selection for batch export
  const toggleStudent = (id) => {
    setSelectedStudents(prev =>
      prev.includes(id)
        ? prev.filter(s => s !== id)
        : [...prev, id]
    );
  };

  // CSV Export
  const downloadAsCSV = () => {
    const csvData = [
      ['Student Name', 'Engagement Trend', 'Last Intervention'],
      ...mockStudents.map(stu => [
        stu.name,
        stu.trend,
        stu.lastIntervention
      ])
    ];
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `admin_report_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
  };

  // Sort students
  const sortedStudents = [...mockStudents].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    if (sortField === 'lastIntervention') {
      valA = new Date(valA);
      valB = new Date(valB);
    }
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5EFE6' }}>
      <Header />
      <div className="max-w-7xl mx-auto p-8" id="admin-report-container">
        {/* Organization Details */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Building className="text-blue-600" />
              {editMode ? (
                <input
                  type="text"
                  value={orgDetails.name}
                  onChange={(e) => setOrgDetails({...orgDetails, name: e.target.value})}
                  className="border-b-2 border-blue-500 px-2"
                  autoFocus
                />
              ) : (
                orgDetails.name
              )}
            </h2>
            <button 
              onClick={() => setEditMode(!editMode)}
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <Edit2 size={16} />
              {editMode ? 'Save' : 'Edit'}
            </button>
          </div>

          {editMode ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  value={orgDetails.email}
                  onChange={(e) => setOrgDetails({...orgDetails, email: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Address</label>
                <input
                  type="text"
                  value={orgDetails.address}
                  onChange={(e) => setOrgDetails({...orgDetails, address: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{orgDetails.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-medium">{orgDetails.address}</p>
              </div>
            </div>
          )}
        </div>

        {/* Control Panel */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            {/* Classes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Classes</label>
              <div className="flex gap-2 flex-wrap">
                {mockClasses.map(cls => (
                  <button
                    key={cls}
                    onClick={() => toggleClass(cls)}
                    className={`px-3 py-1 rounded-full border transition-all duration-200 text-sm ${
                      selectedClasses.includes(cls)
                        ? 'bg-blue-100 text-blue-700 border-blue-400'
                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {cls}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <select
                className="px-4 py-2 rounded-lg border"
                value={dateRange}
                onChange={e => setDateRange(e.target.value)}
              >
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            
            {/* Metrics */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Metrics</label>
              <div className="flex gap-2 flex-wrap">
                {mockMetrics.map(m => (
                  <button
                    key={m.id}
                    onClick={() => toggleMetric(m.id)}
                    className={`px-3 py-1 rounded-full border transition-all duration-200 text-sm ${
                      selectedMetrics.includes(m.id)
                        ? 'bg-green-100 text-green-700 border-green-400'
                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Export Options */}
          <div className="flex gap-3 flex-wrap">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
              onClick={downloadAsCSV}
            >
              <Download size={16} />
              Export CSV
            </button>
            <PDFDownloadLink
              document={
                <AdminReportPDF
                  orgDetails={orgDetails}
                  selectedClasses={selectedClasses}
                  dateRange={dateRange}
                  selectedMetrics={selectedMetrics}
                  mockCourses={mockCourses}
                  mockStudents={mockStudents}
                  mockLectures={mockLectures}
                  mockHeatmap={mockHeatmap}
                />
              }
              fileName={`${orgDetails.name.replace(/\s+/g, '_')}_report_${new Date().toISOString().slice(0,10)}.pdf`}
              className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
            >
              {({ loading }) => (
                <>
                  <FileText size={16} />
                  {loading ? 'Preparing PDF...' : 'Export PDF'}
                </>
              )}
            </PDFDownloadLink>
          </div>
        </div>

        {/* Report Sections */}
        {/* A. Institutional Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Key Metrics */}
          <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center">
            <BarChart2 size={32} className="text-blue-600 mb-2" />
            <h2 className="text-lg font-semibold mb-2">Key Metrics</h2>
            <div className="w-full">
              <div className="flex justify-between text-sm mb-1">
                <span>Avg. Score</span>
                <span className="font-bold text-blue-700">82%</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span>Confusion Rate</span>
                <span className="font-bold text-red-500">18%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Active Students</span>
                <span className="font-bold text-green-600">124</span>
              </div>
            </div>
          </div>
          
          {/* Top Courses */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-2">Top Courses</h2>
            {mockCourses
              .sort((a, b) => b.avgScore - a.avgScore)
              .slice(0, 2)
              .map((course, idx) => (
                <div key={idx} className="flex justify-between items-center mb-2">
                  <span>{course.name}</span>
                  <span className="font-bold text-blue-700">{course.avgScore}%</span>
                </div>
              ))}
          </div>
          
          {/* Bottom Courses */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-2">Bottom Courses</h2>
            {mockCourses
              .sort((a, b) => a.avgScore - b.avgScore)
              .slice(0, 2)
              .map((course, idx) => (
                <div key={idx} className="flex justify-between items-center mb-2">
                  <span>{course.name}</span>
                  <span className="font-bold text-red-500">{course.avgScore}%</span>
                </div>
              ))}
          </div>
        </div>

        {/* B. Student Performance Matrix */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Student Performance</h2>
            <button
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
              onClick={() => setSelectedStudents(
                selectedStudents.length === mockStudents.length 
                  ? [] 
                  : mockStudents.map(s => s.id)
              )}
            >
              {selectedStudents.length === mockStudents.length ? 'Clear All' : 'Select All'}
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">
                    <input
                      type="checkbox"
                      checked={selectedStudents.length === mockStudents.length}
                      onChange={() => setSelectedStudents(
                        selectedStudents.length === mockStudents.length 
                          ? [] 
                          : mockStudents.map(s => s.id)
                      )}
                      className="w-4 h-4"
                    />
                  </th>
                  <th
                    className="text-left py-2 cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    Student Name{' '}
                    {sortField === 'name' &&
                      (sortAsc ? <ChevronUp size={14} className="inline" /> : <ChevronDown size={14} className="inline" />)}
                  </th>
                  <th
                    className="text-left py-2 cursor-pointer"
                    onClick={() => handleSort('trend')}
                  >
                    Engagement{' '}
                    {sortField === 'trend' &&
                      (sortAsc ? <ChevronUp size={14} className="inline" /> : <ChevronDown size={14} className="inline" />)}
                  </th>
                  <th
                    className="text-left py-2 cursor-pointer"
                    onClick={() => handleSort('lastIntervention')}
                  >
                    Last Action{' '}
                    {sortField === 'lastIntervention' &&
                      (sortAsc ? <ChevronUp size={14} className="inline" /> : <ChevronDown size={14} className="inline" />)}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedStudents.map((stu) => (
                  <tr key={stu.id} className="border-b hover:bg-gray-50">
                    <td className="py-3">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(stu.id)}
                        onChange={() => toggleStudent(stu.id)}
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="py-3 font-medium">{stu.name}</td>
                    <td className="py-3">
                      {stu.trend === 'up' ? (
                        <span className="flex items-center text-green-600">
                          <TrendingUp size={16} className="mr-1" /> Improving
                        </span>
                      ) : (
                        <span className="flex items-center text-red-500">
                          <TrendingDown size={16} className="mr-1" /> Declining
                        </span>
                      )}
                    </td>
                    <td className="py-3">{stu.lastIntervention}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Batch Actions */}
          {selectedStudents.length > 0 && (
            <div className="mt-4 flex gap-3">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                onClick={downloadAsCSV}
              >
                <Download size={16} />
                Export Selected ({selectedStudents.length})
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
              >
                <ArrowRightLeft size={16} />
                Assign Resources
              </button>
            </div>
          )}
        </div>

        {/* C. Content Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Lecture Effectiveness */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-4">Lecture Effectiveness</h2>
            {mockLectures.map((lec, idx) => (
              <div key={idx} className="flex justify-between items-center mb-3">
                <span className="flex items-center gap-2">
                  <Video size={16} className="text-blue-600" />
                  {lec.title}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${lec.effectiveness}%` }}
                    ></div>
                  </div>
                  <span className="font-bold">{lec.effectiveness}%</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Rewatch Heatmap */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-4">Rewatch Hotspots</h2>
            {mockHeatmap.map((vid, idx) => (
              <div key={idx} className="mb-4">
                <div className="font-medium mb-2 flex items-center gap-2">
                  <Video size={16} className="text-blue-600" />
                  {vid.video}
                </div>
                <div className="flex flex-wrap gap-2">
                  {vid.timestamps.map((t, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs hover:bg-blue-200 transition-colors"
                    >
                      {t} min
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;