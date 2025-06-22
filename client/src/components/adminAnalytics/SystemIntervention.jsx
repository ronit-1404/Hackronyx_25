import React from "react";
import {
  Brain,
  CheckCircle,
  XCircle,
  Zap,
  Activity,
  TrendingUp,
  Shield,
  AlertTriangle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const SystemIntervention = () => {
  // Sample data for ML Model Performance
  const mlModelData = [
    { month: "Jan", successRate: 89 },
    { month: "Feb", successRate: 91 },
    { month: "Mar", successRate: 88 },
    { month: "Apr", successRate: 93 },
    { month: "May", successRate: 95 },
    { month: "Jun", successRate: 93 },
  ];

  // Sample data for Intervention Types
  const interventionTypes = [
    { name: "Academic Support", value: 35, color: "#10B981" },
    { name: "Behavioral", value: 20, color: "#F59E0B" },
    { name: "Attendance", value: 25, color: "#EF4444" },
    { name: "Mental Health", value: 20, color: "#8B5CF6" },
  ];

  // Sample data for False Positive Analysis
  const falsePositiveData = [
    { category: "Tech Issues", count: 5, percentage: 45 },
    { category: "Late Submit", count: 3, percentage: 27 },
    { category: "Network", count: 2, percentage: 18 },
    { category: "Other", count: 1, percentage: 10 },
  ];

  // Sample data for 24-Hour Success Pattern
  const interventionSuccess = [
    { time: "00:00", successful: 12, failed: 2 },
    { time: "04:00", successful: 8, failed: 1 },
    { time: "08:00", successful: 25, failed: 3 },
    { time: "12:00", successful: 32, failed: 4 },
    { time: "16:00", successful: 28, failed: 3 },
    { time: "20:00", successful: 15, failed: 2 },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Brain className="w-6 h-6 text-purple-600" />
        <h2 className="text-xl font-semibold text-gray-900">
          System Intervention Analysis
        </h2>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
              Current
            </span>
          </div>
          <p className="text-2xl font-bold text-green-700">93%</p>
          <p className="text-sm text-green-600">ML Success Rate</p>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-4 border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <XCircle className="w-8 h-8 text-red-600" />
            <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">
              Low
            </span>
          </div>
          <p className="text-2xl font-bold text-red-700">2%</p>
          <p className="text-sm text-red-600">False Positives</p>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-8 h-8 text-purple-600" />
            <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
              Active
            </span>
          </div>
          <p className="text-2xl font-bold text-purple-700">67</p>
          <p className="text-sm text-purple-600">Interventions</p>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-8 h-8 text-blue-600" />
            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
              Avg
            </span>
          </div>
          <p className="text-2xl font-bold text-blue-700">2.1s</p>
          <p className="text-sm text-blue-600">Response Time</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ML Model Performance Trend */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
            ML Model Performance Trend
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={mlModelData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="successRate"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.3}
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Intervention Types Distribution */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-purple-600" />
            Intervention Categories
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={interventionTypes}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {interventionTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {interventionTypes.map((type) => (
              <div key={type.name} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: type.color }}
                ></div>
                <span className="text-xs text-gray-600">{type.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* False Positive Analysis */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-amber-600" />
            False Positive Analysis
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={falsePositiveData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="category"
                stroke="#64748b"
                fontSize={10}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
                formatter={(value, name) => [value, "Cases"]}
                labelFormatter={(label) => `Category: ${label}`}
              />
              <Bar dataKey="count" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {falsePositiveData.map((item) => (
              <div
                key={item.category}
                className="flex items-center justify-between text-xs"
              >
                <span className="text-gray-600">{item.category}</span>
                <span className="font-bold text-amber-600">
                  {item.count} ({item.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Success Rate */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-600" />
            24-Hour Success Pattern
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={interventionSuccess}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="successful"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="failed"
                stroke="#EF4444"
                strokeWidth={3}
                dot={{ fill: "#EF4444", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 border border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-indigo-600 font-medium">
                Model Accuracy
              </p>
              <p className="text-2xl font-bold text-indigo-700">94.2%</p>
            </div>
            <div className="text-indigo-600">
              <Brain className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-lg p-4 border border-teal-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-teal-600 font-medium">
                Intervention Efficiency
              </p>
              <p className="text-2xl font-bold text-teal-700">87.5%</p>
            </div>
            <div className="text-teal-600">
              <Zap className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">
                Error Reduction
              </p>
              <p className="text-2xl font-bold text-orange-700">78%</p>
            </div>
            <div className="text-orange-600">
              <Shield className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemIntervention;