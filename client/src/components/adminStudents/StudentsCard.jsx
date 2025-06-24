import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import axios from 'axios';

export default function StudentCards() {
  // Sample student data as fallback
  const sampleStudents = [
    {
      id: "1",
      name: "Priya Sharma",
      photo: "https://randomuser.me/api/portraits/women/44.jpg",
      engagement: "92%",
      lastSessionTags: ["Math", "Problem Solving", "Algebra"],
      parentLinked: true
    },
    {
      id: "2",
      name: "Arjun Singh",
      photo: "https://randomuser.me/api/portraits/men/32.jpg",
      engagement: "85%",
      lastSessionTags: ["Science", "Physics", "Lab Work"],
      parentLinked: false
    },
    {
      id: "3",
      name: "Ananya Patel",
      photo: "https://randomuser.me/api/portraits/women/68.jpg",
      engagement: "96%",
      lastSessionTags: ["English", "Literature", "Writing"],
      parentLinked: true
    },
    {
      id: "4",
      name: "Rohit Kumar",
      photo: "https://randomuser.me/api/portraits/men/45.jpg",
      engagement: "78%",
      lastSessionTags: ["History", "Research", "Essay"],
      parentLinked: true
    },
    {
      id: "5",
      name: "Kavya Reddy",
      photo: "https://randomuser.me/api/portraits/women/72.jpg",
      engagement: "89%",
      lastSessionTags: ["Art", "Creative", "Portfolio"],
      parentLinked: false
    },
    {
      id: "6",
      name: "Aditya Gupta",
      photo: "https://randomuser.me/api/portraits/men/78.jpg",
      engagement: "91%",
      lastSessionTags: ["Computer Science", "Coding", "Python"],
      parentLinked: true
    }
  ];

  const [students, setStudents] = useState(sampleStudents);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingApiData, setUsingApiData] = useState(false);

  useEffect(() => {
    // Attempt to fetch students from API
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      // Make API call to get students
      const response = await axios.get('http://localhost:5001/api/admin/students');
      
      if (response.data && response.data.success && response.data.students.length > 0) {
        console.log("Successfully fetched student data from API:", response.data);
        setStudents(response.data.students);
        setUsingApiData(true);
      } else {
        console.log("API returned success=false or empty students array. Using sample data.");
        setStudents(sampleStudents); // Fallback to sample data
      }
    } catch (err) {
      console.error("Error fetching students from API:", err);
      setError("Couldn't connect to the server. Using sample data.");
      setStudents(sampleStudents); // Fallback to sample data
    } finally {
      setLoading(false);
    }
  };

  const handleViewAnalytics = (studentId, studentName) => {
    if (usingApiData) {
      console.log(`Redirecting to analytics for student ID: ${studentId}`);
      // This would typically use React Router navigation
      // navigate(`/admin/students/${studentId}/analytics`);
    } else {
      alert(`Viewing analytics for ${studentName} (sample data)`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-[#000000] border-t-transparent rounded-full"></div>
        <span className="ml-2 text-gray-600">Loading students...</span>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg">
          <p>{error}</p>
          <button
            onClick={fetchStudents}
            className="mt-2 text-xs bg-yellow-100 hover:bg-yellow-200 px-3 py-1 rounded-full"
          >
            Try Again
          </button>
        </div>
      )}
      
      {usingApiData && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg">
          <p>✅ Connected to API - Displaying real student data</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student) => (
          <div
            key={student.id || student.name}
            className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-5 shadow hover:shadow-md transition-all"
          >
            <div className="flex flex-col items-center">
              <img
                src={student.photo}
                alt={student.name}
                className="w-20 h-20 rounded-full border-2 border-[#000000] mb-3 object-cover"
                onError={(e) => {
                  // Fallback for broken image links
                  e.target.onerror = null;
                  e.target.src = `https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(student.name)}`;
                }}
              />
              <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
              <p className="text-sm text-gray-500 mb-2">Engagement Score: 
                <span className="text-[#000000] font-bold"> {student.engagement}</span>
              </p>
              <div className="mb-2">
                <p className="text-sm font-medium text-gray-600 text-center mb-1">Last Session Tags:</p>
                <div className="flex flex-wrap justify-center gap-1">
                  {student.lastSessionTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mb-3 flex items-center text-sm font-medium">
                {student.parentLinked ? (
                  <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600 mr-1" />
                )}
                <span className={student.parentLinked ? "text-green-600" : "text-red-600"}>
                  {student.parentLinked ? "Parent Linked" : "Parent Not Linked"}
                </span>
              </div>
              <button
                onClick={() => handleViewAnalytics(student.id, student.name)}
                className="bg-[#000000] hover:bg-[#e55b6d] text-white px-3 py-1.5 text-sm rounded-full transition"
              >
                View Detailed Analytics
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}