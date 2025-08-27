import React, { useEffect, useState } from "react";

const SettingsPanel = () => {
  const [settings, setSettings] = useState({
    libraryName: "LibraryHub",
    borrowDays: 15,
    maxBorrows: 3,
    finePerDay: 10,
    emailNotifications: true,
  });

  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    // Load saved settings
    const saved = localStorage.getItem("library_settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings((prev) => ({ ...prev, ...parsed }));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    localStorage.setItem("theme", theme);
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = () => {
    // Persist locally for now (wire to backend later)
    localStorage.setItem("library_settings", JSON.stringify(settings));
    console.log("Settings saved", settings, { theme });
    alert("Settings saved");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Library Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Library Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Library Name
              </label>
              <input
                type="text"
                name="libraryName"
                value={settings.libraryName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Borrow Days
                </label>
                <input
                  type="number"
                  name="borrowDays"
                  min="1"
                  value={settings.borrowDays}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Borrows
                </label>
                <input
                  type="number"
                  name="maxBorrows"
                  min="1"
                  value={settings.maxBorrows}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fine/Day (Rs)
                </label>
                <input
                  type="number"
                  name="finePerDay"
                  min="0"
                  value={settings.finePerDay}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notifications & Theme */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Preferences
          </h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Email Notifications
                </p>
                <p className="text-xs text-gray-500">
                  Send emails for approvals, reminders and overdue notices
                </p>
              </div>
              <label className="inline-flex items-center cursor-pointer">
                <span className="mr-3 text-sm text-gray-700">Off</span>
                <input
                  type="checkbox"
                  className="sr-only"
                  name="emailNotifications"
                  checked={settings.emailNotifications}
                  onChange={handleChange}
                />
                <div
                  className={`w-11 h-6 rounded-full transition-colors ${
                    settings.emailNotifications ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform translate-y-0.5 ${
                      settings.emailNotifications
                        ? "translate-x-6"
                        : "translate-x-0.5"
                    }`}
                  ></div>
                </div>
                <span className="ml-3 text-sm text-gray-700">On</span>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Theme</p>
                <p className="text-xs text-gray-500">
                  Switch between light and dark
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setTheme("light")}
                  className={`px-3 py-1 rounded-md text-sm border ${
                    theme === "light"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  Light
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`px-3 py-1 rounded-md text-sm border ${
                    theme === "dark"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  Dark
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="inline-flex items-center px-5 py-2.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Save Changes
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          System Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
          <div className="p-3 bg-gray-50 rounded-md border border-gray-100">
            <p className="font-medium">App Version</p>
            <p className="text-gray-600">1.0.0</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-md border border-gray-100">
            <p className="font-medium">Theme</p>
            <p className="text-gray-600 capitalize">{theme}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-md border border-gray-100">
            <p className="font-medium">Notifications</p>
            <p className="text-gray-600">
              {settings.emailNotifications ? "Enabled" : "Disabled"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
