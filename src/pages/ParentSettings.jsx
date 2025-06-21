import React, { useState } from "react";

const ParentSettings = () => {
  const [email, setEmail] = useState("parent@school.edu");
  const [password, setPassword] = useState("");
  const [notif, setNotif] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    alert("Settings saved (demo only)!");
  };

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label className="block font-semibold mb-1">Email</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Change Password</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
          />
        </div>
        <div className="flex items-center">
          <input
            id="notif"
            type="checkbox"
            checked={notif}
            onChange={() => setNotif(!notif)}
            className="mr-2"
          />
          <label htmlFor="notif" className="font-semibold">
            Enable Email Notifications
          </label>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
};

export default ParentSettings;
// This code defines a simple settings page for parents in a school management system.