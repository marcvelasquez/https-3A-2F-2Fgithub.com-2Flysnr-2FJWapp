import React from 'react';
import { Search, X, MoreVertical, Calendar, Clock, FileText, FolderOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleFileFolder = (patientId: string) => {
    navigate(`/file-folder/${patientId}`);
  };

  // Sample data for the dashboard
  const stats = [
    { value: '12', label: 'Total Scans This Week', bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600' },
    { value: '9', label: 'Scans with Detected Issues', bgColor: 'bg-gradient-to-br from-orange-500 to-orange-600' },
    { value: 'Meniscus Tear', label: 'Most Common Finding', bgColor: 'bg-gradient-to-br from-purple-500 to-purple-600' },
  ];

  const patientData = [
    { id: '02)', name: 'Jane Doe', bodyPart: 'Left Knee', date: 'Yesterday', time: '2:17 PM', status: 'details' },
    { id: '03)', name: 'Jake Doe', bodyPart: 'Bilateral Knees', date: 'April 19, 2025', time: '4:45 PM', status: 'details' },
    { id: '04)', name: 'Jane Doe', bodyPart: 'Right Knee', date: 'April 18, 2025', time: '11:22 AM', status: 'details' },
    { id: '05)', name: 'Jeff Doe', bodyPart: 'Bilateral Knees', date: 'April 16, 2025', time: '9:10 AM', status: 'details' },
  ];

  const radiologistActivity = [
    { day: 'Monday', value: 85, reports: 34, color: '#3b82f6' },
    { day: 'Tuesday', value: 92, reports: 37, color: '#10b981' },
    { day: 'Wednesday', value: 78, reports: 31, color: '#8b5cf6' },
    { day: 'Thursday', value: 95, reports: 38, color: '#f97316' },
    { day: 'Friday', value: 88, reports: 35, color: '#ec4899' },
  ];

  const progressData = [
    { id: '01', completed: 75, inProgress: 20, pending: 5, label: 'Right Knee Cases' },
    { id: '02', completed: 60, inProgress: 30, pending: 10, label: 'Left Knee Cases' },
    { id: '03', completed: 85, inProgress: 10, pending: 5, label: 'Bilateral Cases' },
    { id: '04', completed: 90, inProgress: 8, pending: 2, label: 'Follow-up Cases' },
  ];

  return (
    <div className="p-6 bg-background min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>&lt;/&gt;</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.bgColor} rounded-lg p-6 text-white`}>
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm opacity-90">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="flex items-center bg-card border border-border rounded-lg px-4 py-3">
          <Search className="w-5 h-5 text-muted-foreground mr-3" />
          <input
            type="text"
            placeholder="Search"
            className="flex-1 bg-transparent border-none outline-none text-foreground placeholder-muted-foreground"
          />
          <X className="w-5 h-5 text-muted-foreground cursor-pointer" />
        </div>
      </div>

      {/* Patient Data Table - Full Width */}
      <div className="medical-card p-6 mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">No.</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Patient Name</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Body Part</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Time</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">File</th>
              </tr>
            </thead>
            <tbody>
              {patientData.map((patient) => (
                <tr key={patient.id} className="border-b border-border hover:bg-muted/50">
                  <td className="py-3 px-4 text-foreground">{patient.id}</td>
                  <td className="py-3 px-4 text-foreground">{patient.name}</td>
                  <td className="py-3 px-4 text-foreground">{patient.bodyPart}</td>
                  <td className="py-3 px-4 text-foreground">{patient.date}</td>
                  <td className="py-3 px-4 text-foreground">{patient.time}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleFileFolder(patient.id)}
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
        </div>
      </div>

      {/* Bottom Row - Therapist Activity and Case Progress Status Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radiologist Activity Chart - Vertical */}
        <div className="medical-card p-4">
          <h3 className="text-lg font-semibold text-foreground mb-3">Radiologist Activity</h3>
          <div className="mb-3">
            <p className="text-sm text-muted-foreground">Weekly diagnostic report completion rates</p>
          </div>
          <div className="flex items-end justify-between h-56 space-x-2 px-1">
            {radiologistActivity.map((item) => {
              // Calculate height primarily based on percentage (reports as visual indicator)
              // Scale percentage directly for bar height
              const barHeight = item.value; // Direct percentage mapping

              return (
                <div key={item.day} className="flex flex-col items-center flex-1">
                  <div className="text-xs font-semibold text-foreground mb-1 text-center">
                    {item.reports}
                  </div>
                  <div className="flex-1 flex items-end h-full w-full">
                    <div
                      className="rounded-t w-full relative border transition-all hover:scale-105"
                      style={{
                        height: `${barHeight}%`,
                        backgroundColor: item.color,
                        borderColor: item.color,
                        minHeight: '25px',
                        minWidth: '35px'
                      }}
                      title={`${item.day}: ${item.value}% completion - ${item.reports} reports`}
                    >
                      <div className="absolute inset-x-0 bottom-1 text-center">
                        <div className="text-xs font-bold text-white drop-shadow">
                          {item.value}%
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-center mt-1">
                    <div className="font-medium text-foreground">
                      {item.day.slice(0, 3)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 p-2 bg-muted/50 rounded-lg">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Weekly Average:</span>
              <span className="font-medium text-foreground">
                {Math.round(radiologistActivity.reduce((acc, item) => acc + item.value, 0) / radiologistActivity.length)}%
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Total Reports:</span>
              <span className="font-medium text-foreground">
                {radiologistActivity.reduce((acc, item) => acc + item.reports, 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Case Progress Status */}
        <div className="medical-card p-4">
          <h3 className="text-lg font-semibold text-foreground mb-3">Case Progress Status</h3>
          <div className="space-y-3">
            {progressData.map((item) => (
              <div key={item.id} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-foreground">{item.label}</span>
                  <span className="text-xs text-muted-foreground">{item.id}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                  <div className="h-full flex">
                    <div
                      className="bg-green-500 h-full"
                      style={{ width: `${item.completed}%` }}
                      title={`Completed: ${item.completed}%`}
                    ></div>
                    <div
                      className="bg-medical-blue h-full"
                      style={{ width: `${item.inProgress}%` }}
                      title={`In Progress: ${item.inProgress}%`}
                    ></div>
                    <div
                      className="bg-gray-400 h-full"
                      style={{ width: `${item.pending}%` }}
                      title={`Pending: ${item.pending}%`}
                    ></div>
                  </div>
                </div>
                <div className="flex text-xs text-muted-foreground">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Completed</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-medical-blue rounded-full"></div>
                      <span>In Progress</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span>Pending</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
