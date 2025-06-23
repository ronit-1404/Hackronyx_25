import React, { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export default function StudentCards() {
  // Sample student data - replace with actual data from props or API
  const [students] = useState([
    {
      name: "Priya Sharma",
      photo: "https://randomuser.me/api/portraits/women/44.jpg",
      engagement: "92%",
      lastSessionTags: ["Math", "Problem Solving", "Algebra"],
      parentLinked: true
    },
    {
      name: "Arjun Singh",
      photo: "https://randomuser.me/api/portraits/men/32.jpg",
      engagement: "85%",
      lastSessionTags: ["Science", "Physics", "Lab Work"],
      parentLinked: false
    },
    {
      name: "Ananya Patel",
      photo: "https://randomuser.me/api/portraits/women/68.jpg",
      engagement: "96%",
      lastSessionTags: ["English", "Literature", "Writing"],
      parentLinked: true
    },
    {
      name: "Rohit Kumar",
      photo: "https://randomuser.me/api/portraits/men/45.jpg",
      engagement: "78%",
      lastSessionTags: ["History", "Research", "Essay"],
      parentLinked: true
    },
    {
      name: "Kavya Reddy",
      photo: "https://randomuser.me/api/portraits/women/72.jpg",
      engagement: "89%",
      lastSessionTags: ["Art", "Creative", "Portfolio"],
      parentLinked: false
    },
    {
      name: "Aditya Gupta",
      photo: "https://randomuser.me/api/portraits/men/78.jpg",
      engagement: "91%",
      lastSessionTags: ["Computer Science", "Coding", "Python"],
      parentLinked: true
    }
  ]);

  // For demonstration, using all students as filtered students
  // In real implementation, this would be filtered based on search/filter criteria
  const filteredStudents = students;

  const handleViewAnalytics = (studentName) => {
    alert(`Redirecting to analytics for ${studentName}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredStudents.map((student) => (
        <div
          key={student.name}
          className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-5 shadow hover:shadow-md transition-all"
        >
          <div className="flex flex-col items-center">
            <img
              src={student.photo}
              alt={student.name}
              className="w-20 h-20 rounded-full border-2 border-[#000000] mb-3 object-cover"
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
              onClick={() => handleViewAnalytics(student.name)}
              className="bg-[#000000] hover:bg-[#e55b6d] text-white px-3 py-1.5 text-sm rounded-full transition"
            >
              View Detailed Analytics
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}