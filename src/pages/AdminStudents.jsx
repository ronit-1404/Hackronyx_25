import React, { useState } from "react";
import { User, Search, BarChart2, AlertCircle, CheckCircle, XCircle } from "lucide-react";

const students = [
  {
    name: "Aarav Sharma",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    engagement: 92,
    lastSessionTags: ["Focused", "Quiz"],
    parentLinked: true,
  },
  {
    name: "Priya Singh",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
    engagement: 85,
    lastSessionTags: ["Confused", "Video"],
    parentLinked: false,
  },
  {
    name: "Rohan Patel",
    photo: "https://randomuser.me/api/portraits/men/45.jpg",
    engagement: 78,
    lastSessionTags: ["Bored", "Article"],
    parentLinked: true,
  },
];

const AdminStudents = () => {
  const [query, setQuery] = useState("");
  const [sortByEngagement, setSortByEngagement] = useState(false);

  const filteredStudents = students
    .filter((student) => student.name.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) =>
      sortByEngagement ? b.engagement - a.engagement : 0
    );

  return (
    <div className="min-h-screen bg-[#F5EFE6] p-8">
      <div className="bg-white rounded-xl shadow border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-3">
            <User className="w-6 h-6 text-[#F67280]" />
            <h2 className="text-xl font-semibold text-gray-900">Student Engagement Dashboard</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-500 absolute top-2.5 left-3" />
              <input
                type="text"
                placeholder="Search students..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#F67280] focus:outline-none text-sm"
              />
            </div>
            <button
              onClick={() => setSortByEngagement(!sortByEngagement)}
              className="flex items-center px-3 py-2 bg-[#F67280] hover:bg-[#e55b6d] text-white text-sm rounded-lg transition"
            >
              <BarChart2 className="w-4 h-4 mr-2" />
              {sortByEngagement ? "Unsort" : "Sort by Engagement"}
            </button>
          </div>
        </div>
      </div>

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
                className="w-20 h-20 rounded-full border-2 border-[#F67280] mb-3 object-cover"
              />
              <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
              <p className="text-sm text-gray-500 mb-2">Engagement Score: 
                <span className="text-[#F67280] font-bold"> {student.engagement}</span>
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
                onClick={() => alert(`Redirecting to analytics for ${student.name}`)}
                className="bg-[#F67280] hover:bg-[#e55b6d] text-white px-3 py-1.5 text-sm rounded-full transition"
              >
                View Detailed Analytics
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminStudents;
