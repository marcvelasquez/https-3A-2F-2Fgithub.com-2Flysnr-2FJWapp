import React, { useState, useEffect } from "react";
import {
  Search,
  X,
  MoreVertical,
  Calendar,
  Clock,
  FileText,
  FolderOpen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Load patient data from localStorage (same source as Patient Record page)
  useEffect(() => {
    const loadPatientData = () => {
      const savedRecords = localStorage.getItem("patientRecords");
      if (savedRecords) {
        const records = JSON.parse(savedRecords);
        // Take first 5 records and renumber them sequentially for dashboard display (01-05)
        // Keep originalId for functionality, use displayId for table display
        const recentRecords = records
          .slice(0, 5)
          .map((record: any, index: number) => ({
            ...record,
            originalId: record.id, // Keep original ID for navigation
            displayId: `${(index + 1).toString().padStart(2, "0")}.)`,
          }));
        setPatientData(recentRecords);
      } else {
        // Default data if no records exist - ensure proper sequential numbering
        const defaultData = [
          {
            name: "Jane Doe",
            bodyPart: "Left Knee",
            date: "Yesterday",
            time: "2:17 PM",
            file: "D",
          },
          {
            name: "Jake Doe",
            bodyPart: "Bilateral Knees",
            date: "April 19, 2025",
            time: "4:45 PM",
            file: "D",
          },
          {
            name: "Jane Doe",
            bodyPart: "Right Knee",
            date: "April 18, 2025",
            time: "11:22 AM",
            file: "D",
          },
          {
            name: "Jeff Doe",
            bodyPart: "Bilateral Knees",
            date: "April 16, 2025",
            time: "9:10 AM",
            file: "D",
          },
          {
            name: "Sarah Smith",
            bodyPart: "Left Knee",
            date: "April 15, 2025",
            time: "3:30 PM",
            file: "D",
          },
        ].map((record, index) => ({
          ...record,
          originalId: `${(index + 1).toString().padStart(2, "0")}.`, // Default original ID
          displayId: `${(index + 1).toString().padStart(2, "0")}.)`,
        }));

        setPatientData(defaultData);
      }
    };

    loadPatientData();

    // Listen for localStorage changes to update dashboard when records are modified
    const handleStorageChange = () => {
      // Use setTimeout to ensure localStorage has been updated
      setTimeout(() => {
        loadPatientData();
      }, 100);
    };

    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom events (when localStorage is updated from same tab)
    window.addEventListener("patientRecordsUpdated", handleStorageChange);

    // Listen for metadata updates as well
    window.addEventListener("metadataUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("patientRecordsUpdated", handleStorageChange);
      window.removeEventListener("metadataUpdated", handleStorageChange);
    };
  }, []);

  const handleFileFolder = (patientId: string) => {
    navigate(`/file-folder/${patientId}`);
  };

  // Search functions
  const handleSearch = (searchValue: string) => {
    setSearchTerm(searchValue);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  // Filter patient data based on search term
  const getFilteredPatientData = () => {
    if (!searchTerm) return patientData;

    return patientData.filter(
      (patient) =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.bodyPart.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.date.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  };

  const filteredPatientData = getFilteredPatientData();

  const stats = [
    {
      value: "24",
      label: "Total Patients",
      bgColor: "bg-gradient-to-br from-blue-500 to-blue-600",
    },
    {
      value: "6",
      label: "Pending Reviews",
      bgColor: "bg-gradient-to-br from-orange-500 to-orange-600",
    },
  ];

  // Patient data now loaded from localStorage in useEffect

  return (
    <div className="p-6 bg-background min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>&lt;/&gt;</span>
        </div>
      </div>

      {/* Recent Record Label */}
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Recent Record
      </h2>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="flex items-center bg-card border border-border rounded-lg px-4 py-3">
          <Search className="w-5 h-5 text-muted-foreground mr-3" />
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-foreground placeholder-muted-foreground"
          />
          <X
            onClick={handleClearSearch}
            className="w-5 h-5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
          />
        </div>
      </div>

      {/* Main Content: Table and Stats Cards Side by Side */}
      <div className="flex gap-6 mb-6">
        {/* Patient Data Table - Left Side */}
        <div className="flex-1 medical-card p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    No.
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Patient Name
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Body Part
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Time
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    File
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPatientData.map((patient) => (
                  <tr
                    key={patient.originalId || patient.id}
                    className="border-b border-border hover:bg-muted/50"
                  >
                    <td className="py-3 px-4 text-foreground">
                      {patient.displayId || patient.id}
                    </td>
                    <td className="py-3 px-4 text-foreground">
                      {patient.name}
                    </td>
                    <td className="py-3 px-4 text-foreground">
                      {patient.bodyPart}
                    </td>
                    <td className="py-3 px-4 text-foreground">
                      {patient.date}
                    </td>
                    <td className="py-3 px-4 text-foreground">
                      {patient.time}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          (patient.status || "Pending") === "Complete"
                            ? "bg-green-100 text-green-800"
                            : (patient.status || "Pending") === "In Progress"
                              ? "bg-blue-100 text-blue-800"
                              : (patient.status || "Pending") === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : (patient.status || "Pending") === "Follow Up"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {patient.status || "Pending"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() =>
                          handleFileFolder(patient.originalId || patient.id)
                        }
                        className="w-8 h-8 bg-medical-blue hover:bg-medical-blue-dark text-white rounded flex items-center justify-center transition-colors"
                        title="Open File Folder"
                      >
                        <FolderOpen className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* No Results Message */}
            {filteredPatientData.length === 0 &&
              patientData.length > 0 &&
              searchTerm && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No patients match your search for "{searchTerm}".
                  </p>
                  <button
                    onClick={handleClearSearch}
                    className="mt-2 text-medical-blue hover:underline text-sm"
                  >
                    Clear search
                  </button>
                </div>
              )}
          </div>
        </div>

        {/* Right Side: Stats Cards and Donut Chart */}
        <div className="w-80 space-y-4">
          {/* Stats Cards */}
          <div className="space-y-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`${stat.bgColor} rounded-lg p-4 text-white`}
              >
                <div className="text-xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* ACL and Meniscal Tear Distribution Donut Chart */}
          <div className="medical-card p-4">
            <h3 className="text-md font-semibold text-foreground mb-3">
              ACL & Meniscal Tear Distribution
            </h3>
            <div className="flex items-center justify-center">
              <div className="relative w-32 h-32">
                {/* Simple donut chart representation */}
                <svg
                  className="w-32 h-32 transform -rotate-90"
                  viewBox="0 0 100 100"
                >
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="35"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="10"
                  />
                  {/* ACL segment (60%) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="35"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="10"
                    strokeDasharray="131.95 87.96"
                    strokeDashoffset="0"
                  />
                  {/* Meniscal segment (40%) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="35"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="10"
                    strokeDasharray="87.96 131.95"
                    strokeDashoffset="-131.95"
                  />
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground">18</div>
                    <div className="text-xs text-muted-foreground">Total</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Legend */}
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm text-foreground">ACL</span>
                </div>
                <span className="text-sm font-medium text-foreground">
                  11 (60%)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
                  <span className="text-sm text-foreground">Meniscal</span>
                </div>
                <span className="text-sm font-medium text-foreground">
                  7 (40%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
