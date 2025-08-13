import React from 'react';
import { Search, X, MoreVertical, Calendar, Clock, FileText } from 'lucide-react';

const Dashboard = () => {
  // Sample data for the dashboard
  const stats = [
    { value: '12', label: 'Total Scans This Week', bgColor: 'bg-blue-500' },
    { value: '9', label: 'Scans with Detected Issues', bgColor: 'bg-blue-600' },
    { value: 'Meniscus Tear', label: 'Most Common Finding', bgColor: 'bg-blue-700' },
  ];

  const patientData = [
    { id: '02.1', name: 'Jane Doe', bodyPart: 'Left Knee', date: 'Yesterday', time: '2:17 PM', status: 'details' },
    { id: '03.1', name: 'Jake Doe', bodyPart: 'Bilateral Knees', date: 'April 19, 2025', time: '4:45 PM', status: 'details' },
    { id: '04.1', name: 'Jane Doe', bodyPart: 'Right Knee', date: 'April 18, 2025', time: '11:22 AM', status: 'details' },
    { id: '05.1', name: 'Jeff Doe', bodyPart: 'Bilateral Knees', date: 'April 16, 2025', time: '9:10 AM', status: 'details' },
  ];

  const therapistActivity = [
    { day: 'Monday', value: 85 },
    { day: 'Tuesday', value: 92 },
    { day: 'Wednesday', value: 78 },
    { day: 'Thursday', value: 95 },
    { day: 'Friday', value: 88 },
  ];

  const progressData = [
    { id: '01.1', completed: 75, inProgress: 20, pending: 5, label: 'Right Knee Cases' },
    { id: '02.1', completed: 60, inProgress: 30, pending: 10, label: 'Left Knee Cases' },
    { id: '03.1', completed: 85, inProgress: 10, pending: 5, label: 'Bilateral Cases' },
    { id: '04.1', completed: 90, inProgress: 8, pending: 2, label: 'Follow-up Cases' },
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Data Table */}
        <div className="lg:col-span-2">
          <div className="medical-card p-6">
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
                        <FileText className="w-4 h-4 text-muted-foreground" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Therapist Activity Chart */}
          <div className="medical-card p-6 mt-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Therapist Activity</h3>
            <div className="space-y-3">
              {therapistActivity.map((item) => (
                <div key={item.day} className="flex items-center space-x-4">
                  <div className="w-16 text-sm text-muted-foreground">{item.day}</div>
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div 
                      className="bg-medical-blue h-2 rounded-full" 
                      style={{ width: `${item.value}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-foreground">{item.value}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Patient Recovery Status */}
          <div className="medical-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Patient Recovery Status</h3>
            <div className="relative w-32 h-32 mx-auto mb-4">
              <div className="w-full h-full rounded-full border-8 border-muted relative">
                <div 
                  className="absolute inset-0 rounded-full border-8 border-medical-blue"
                  style={{
                    borderTopColor: 'hsl(var(--medical-blue))',
                    borderRightColor: 'hsl(var(--muted))',
                    borderBottomColor: 'hsl(var(--muted))',
                    borderLeftColor: 'hsl(var(--muted))',
                    transform: `rotate(${(recoveryStatus.completed / 100) * 360}deg)`
                  }}
                ></div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-medical-blue rounded-full"></div>
                  <span className="text-muted-foreground">Completed Recovery</span>
                </div>
                <span className="text-foreground">{recoveryStatus.completed}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span className="text-muted-foreground">In Progress</span>
                </div>
                <span className="text-foreground">{recoveryStatus.inProgress}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-muted rounded-full"></div>
                  <span className="text-muted-foreground">Not Started</span>
                </div>
                <span className="text-foreground">{recoveryStatus.notStarted}%</span>
              </div>
            </div>
          </div>

          {/* Progress Status */}
          <div className="medical-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Progress Status</h3>
            <div className="space-y-3">
              {progressData.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <div className="text-sm font-medium text-foreground">{item.id}</div>
                    <div className="text-xs text-muted-foreground">{item.status}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{item.bodyPart}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
