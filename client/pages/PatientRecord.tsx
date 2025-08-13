import React from 'react';
import { Search, X, FileText, Plus } from 'lucide-react';

const PatientRecord = () => {
  // Extended patient data for the Patient Record page
  const patientRecords = [
    { id: '01)', name: 'Jane Doe', bodyPart: 'Right Knee', date: 'Today', time: '10:34 AM', file: 'D' },
    { id: '02)', name: 'Jane Doe', bodyPart: 'Left Knee', date: 'Yesterday', time: '2:17 PM', file: 'D' },
    { id: '03)', name: 'Jake Doe', bodyPart: 'Bilateral Knees', date: 'April 20, 2025', time: '4:45 PM', file: 'D' },
    { id: '04)', name: 'Jane Doe', bodyPart: 'Right Knee', date: 'April 19, 2025', time: '11:22 AM', file: 'D' },
    { id: '05)', name: 'Jeff Doe', bodyPart: 'Bilateral Knees', date: 'April 18, 2025', time: '9:10 AM', file: 'D' },
    { id: '06)', name: 'Jason Doe', bodyPart: 'Right Knee', date: 'Today', time: '10:34 AM', file: 'D' },
    { id: '07)', name: 'Jane Doe', bodyPart: 'Left Knee', date: 'Yesterday', time: '2:17 PM', file: 'D' },
    { id: '08)', name: 'Jude Doe', bodyPart: 'Bilateral Knees', date: 'April 20, 2025', time: '4:45 PM', file: 'D' },
    { id: '09)', name: 'Jane Doe', bodyPart: 'Right Knee', date: 'April 19, 2025', time: '11:22 AM', file: 'D' },
    { id: '10)', name: 'Jeff Doe', bodyPart: 'Bilateral Knees', date: 'April 20, 2025', time: '9:10 AM', file: 'D' },
    { id: '11)', name: 'James Doe', bodyPart: 'Right Knee', date: 'Today', time: '10:34 AM', file: 'D' },
    { id: '12)', name: 'Jane Doe', bodyPart: 'Left Knee', date: 'Yesterday', time: '2:17 PM', file: 'D' },
    { id: '13)', name: 'Jude Doe', bodyPart: 'Bilateral Knees', date: 'April 20, 2025', time: '4:45 PM', file: 'D' },
    { id: '14)', name: 'Jane Doe', bodyPart: 'Right Knee', date: 'April 19, 2025', time: '11:22 AM', file: 'D' },
    { id: '15)', name: 'Jeff Doe', bodyPart: 'Bilateral Knees', date: 'April 18, 2025', time: '9:10 AM', file: 'D' },
    { id: '16)', name: 'Jane Doe', bodyPart: 'Right Knee', date: 'April 19, 2025', time: '11:22 AM', file: 'D' },
    { id: '17)', name: 'Jake Doe', bodyPart: 'Bilateral Knees', date: 'April 18, 2025', time: '9:10 AM', file: 'D' },
    { id: '18)', name: 'Jane Doe', bodyPart: 'Right Knee', date: 'April 19, 2025', time: '11:22 AM', file: 'D' },
    { id: '19)', name: 'Jeff Doe', bodyPart: 'Bilateral Knees', date: 'April 18, 2025', time: '9:10 AM', file: 'D' },
    { id: '20)', name: 'Jane Doe', bodyPart: 'Right Knee', date: 'April 19, 2025', time: '11:22 AM', file: 'D' },
  ];

  return (
    <div className="p-6 bg-background min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Patient Record</h1>
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

      {/* Action Buttons */}
      <div className="flex space-x-3 mb-6">
        <button className="bg-medical-blue hover:bg-medical-blue-dark text-white px-4 py-2 rounded-lg font-medium transition-colors">
          Add
        </button>
        <button className="bg-medical-blue hover:bg-medical-blue-dark text-white px-4 py-2 rounded-lg font-medium transition-colors">
          Remove
        </button>
      </div>

      {/* Patient Records Table */}
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
              {patientRecords.map((record, index) => (
                <tr key={record.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 text-foreground">{record.id}</td>
                  <td className="py-3 px-4 text-foreground">{record.name}</td>
                  <td className="py-3 px-4 text-foreground">{record.bodyPart}</td>
                  <td className="py-3 px-4 text-foreground">{record.date}</td>
                  <td className="py-3 px-4 text-foreground">{record.time}</td>
                  <td className="py-3 px-4">
                    <div className="w-6 h-6 bg-medical-blue text-white rounded flex items-center justify-center text-sm font-medium">
                      {record.file}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Table Footer/Pagination could go here if needed */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {patientRecords.length} records
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-border rounded text-sm text-muted-foreground hover:bg-muted transition-colors">
              Previous
            </button>
            <button className="px-3 py-1 bg-medical-blue text-white rounded text-sm hover:bg-medical-blue-dark transition-colors">
              1
            </button>
            <button className="px-3 py-1 border border-border rounded text-sm text-muted-foreground hover:bg-muted transition-colors">
              2
            </button>
            <button className="px-3 py-1 border border-border rounded text-sm text-muted-foreground hover:bg-muted transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientRecord;
