import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";
import {
  FileText,
  Settings,
  LogOut,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  Brain,
  Zap,
  Activity,
  BarChart2,
} from "lucide-react";

const Header = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("today");
  const navigate = useNavigate();
  return (
    <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Learning Analytics Dashboard
        </h2>
        <p className="text-sm text-gray-600">
          Real-time insights and performance tracking
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <select
          value={selectedTimeRange}
          onChange={(e) => setSelectedTimeRange(e.target.value)}
          className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#F67280] focus:border-transparent"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
        <button
          onClick={() => navigate("/learner/analytics")}
          className="flex items-center space-x-2 py-2 px-4 rounded-lg text-white font-medium transition-all shadow-sm hover:shadow-md"
          style={{ backgroundColor: "#F67280" }}
        >
          <BarChart2 className="w-5 h-5" />
          <span>Advance Analysis</span>
        </button>
        <button
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          onClick={() => navigate("/learner/resources")}
        >
          <FileText className="w-4 h-4 text-gray-600" />
        </button>
        <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
          <Settings
            onClick={() => navigate("/learner/settings")}
            className="w-4 h-4 text-gray-600"
          />
        </button>
        <button
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          onClick={() => navigate("/signout")}
        >
          <LogOut className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default Header;
