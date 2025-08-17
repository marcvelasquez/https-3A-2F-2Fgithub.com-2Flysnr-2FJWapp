import React, { useState, useEffect } from 'react';
import { Search, X, FileText, Plus, FolderOpen, Trash2, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DeleteDialog from '../components/DeleteDialog';

const PatientRecord = () => {
  const navigate = useNavigate();
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, recordId: '', patientName: '' });
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [bulkDeleteDialog, setBulkDeleteDialog] = useState({ isOpen: false, count: 0 });
  const [patientRecords, setPatientRecords] = useState(() => {
    // Load records from localStorage or use default data
    const savedRecords = localStorage.getItem('patientRecords');
    return savedRecords ? JSON.parse(savedRecords) : [
      { id: '01.)', name: 'Jane Doe', bodyPart: 'Right Knee', date: 'Today', time: '10:34 AM', file: 'D' },
      { id: '02.)', name: 'Jane Doe', bodyPart: 'Left Knee', date: 'Yesterday', time: '2:17 PM', file: 'D' },
      { id: '03.)', name: 'Jake Doe', bodyPart: 'Bilateral Knees', date: 'April 20, 2025', time: '4:45 PM', file: 'D' },
      { id: '04.)', name: 'Jane Doe', bodyPart: 'Right Knee', date: 'April 19, 2025', time: '11:22 AM', file: 'D' },
      { id: '05.)', name: 'Jeff Doe', bodyPart: 'Bilateral Knees', date: 'April 18, 2025', time: '9:10 AM', file: 'D' },
      { id: '06.)', name: 'Jason Doe', bodyPart: 'Right Knee', date: 'Today', time: '10:34 AM', file: 'D' },
      { id: '07.)', name: 'Jane Doe', bodyPart: 'Left Knee', date: 'Yesterday', time: '2:17 PM', file: 'D' },
      { id: '08.)', name: 'Jude Doe', bodyPart: 'Bilateral Knees', date: 'April 20, 2025', time: '4:45 PM', file: 'D' },
      { id: '09.)', name: 'Jane Doe', bodyPart: 'Right Knee', date: 'April 19, 2025', time: '11:22 AM', file: 'D' },
      { id: '10.)', name: 'Jeff Doe', bodyPart: 'Bilateral Knees', date: 'April 20, 2025', time: '9:10 AM', file: 'D' },
      { id: '11.)', name: 'James Doe', bodyPart: 'Right Knee', date: 'Today', time: '10:34 AM', file: 'D' },
      { id: '12.)', name: 'Jane Doe', bodyPart: 'Left Knee', date: 'Yesterday', time: '2:17 PM', file: 'D' },
      { id: '13.)', name: 'Jude Doe', bodyPart: 'Bilateral Knees', date: 'April 20, 2025', time: '4:45 PM', file: 'D' },
      { id: '14.)', name: 'Jane Doe', bodyPart: 'Right Knee', date: 'April 19, 2025', time: '11:22 AM', file: 'D' },
      { id: '15.)', name: 'Jeff Doe', bodyPart: 'Bilateral Knees', date: 'April 18, 2025', time: '9:10 AM', file: 'D' },
      { id: '16.)', name: 'Jane Doe', bodyPart: 'Right Knee', date: 'April 19, 2025', time: '11:22 AM', file: 'D' },
      { id: '17.)', name: 'Jake Doe', bodyPart: 'Bilateral Knees', date: 'April 18, 2025', time: '9:10 AM', file: 'D' },
      { id: '18.)', name: 'Jane Doe', bodyPart: 'Right Knee', date: 'April 19, 2025', time: '11:22 AM', file: 'D' },
      { id: '19.)', name: 'Jeff Doe', bodyPart: 'Bilateral Knees', date: 'April 18, 2025', time: '9:10 AM', file: 'D' },
      { id: '20.)', name: 'Jane Doe', bodyPart: 'Right Knee', date: 'April 19, 2025', time: '11:22 AM', file: 'D' },
    ];
  });

  // Check for new uploads and append them
  useEffect(() => {
    const newUpload = sessionStorage.getItem('newPatientRecord');
    if (newUpload) {
      const uploadData = JSON.parse(newUpload);
      const newRecord = {
        id: `${patientRecords.length + 1}.)`,
        name: uploadData.patientName,
        bodyPart: uploadData.studyDescription || 'Study',
        date: 'Today',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        file: 'D'
      };

      const updatedRecords = [newRecord, ...patientRecords];
      setPatientRecords(updatedRecords);
      localStorage.setItem('patientRecords', JSON.stringify(updatedRecords));
      sessionStorage.removeItem('newPatientRecord');
    }
  }, []);

  const handleFileFolder = (patientId: string) => {
    navigate(`/file-folder/${patientId}`);
  };

  const handleDeleteClick = (recordId: string, patientName: string) => {
    setDeleteDialog({ isOpen: true, recordId, patientName });
  };

  const handleDeleteConfirm = () => {
    const updatedRecords = patientRecords.filter(record => record.id !== deleteDialog.recordId);
    setPatientRecords(updatedRecords);
    localStorage.setItem('patientRecords', JSON.stringify(updatedRecords));
    setDeleteDialog({ isOpen: false, recordId: '', patientName: '' });
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, recordId: '', patientName: '' });
  };

  const handleSelectRecord = (recordId: string) => {
    setSelectedRecords(prev =>
      prev.includes(recordId)
        ? prev.filter(id => id !== recordId)
        : [...prev, recordId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRecords.length === patientRecords.length) {
      setSelectedRecords([]);
    } else {
      setSelectedRecords(patientRecords.map(record => record.id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedRecords.length === 0) {
      alert('Please select records to delete');
      return;
    }
    setBulkDeleteDialog({ isOpen: true, count: selectedRecords.length });
  };

  const handleBulkDeleteConfirm = () => {
    const updatedRecords = patientRecords.filter(record => !selectedRecords.includes(record.id));
    setPatientRecords(updatedRecords);
    localStorage.setItem('patientRecords', JSON.stringify(updatedRecords));
    setSelectedRecords([]);
    setBulkDeleteDialog({ isOpen: false, count: 0 });
  };

  const handleBulkDeleteCancel = () => {
    setBulkDeleteDialog({ isOpen: false, count: 0 });
  };

  const handleAddPatient = () => {
    // Example of adding a new patient - this would normally open a form
    const newPatient = {
      id: `${patientRecords.length + 1}.)`,
      name: 'New Patient',
      bodyPart: 'To be determined',
      date: 'Today',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      file: 'D'
    };
    const updatedRecords = [newPatient, ...patientRecords];
    setPatientRecords(updatedRecords);
    localStorage.setItem('patientRecords', JSON.stringify(updatedRecords));
  };


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
          <X
            onClick={() => console.log('Clear search')}
            className="w-5 h-5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 mb-6">
        <button
          onClick={handleAddPatient}
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Patient</span>
        </button>
        <button
          onClick={handleBulkDelete}
          disabled={selectedRecords.length === 0}
          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Minus className="w-4 h-4" />
          <span>Remove ({selectedRecords.length})</span>
        </button>
      </div>

      {/* Patient Records Table */}
      <div className="medical-card p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground w-12">
                  <input
                    type="checkbox"
                    checked={selectedRecords.length === patientRecords.length && patientRecords.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-medical-blue bg-background border-border rounded focus:ring-medical-blue focus:ring-2"
                  />
                </th>
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
                <tr key={record.id} className={`border-b border-border hover:bg-muted/50 transition-colors ${
                  selectedRecords.includes(record.id) ? 'bg-medical-blue/10' : ''
                }`}>
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedRecords.includes(record.id)}
                      onChange={() => handleSelectRecord(record.id)}
                      className="w-4 h-4 text-medical-blue bg-background border-border rounded focus:ring-medical-blue focus:ring-2"
                    />
                  </td>
                  <td className="py-3 px-4 text-foreground">{record.id}</td>
                  <td className="py-3 px-4 text-foreground">{record.name}</td>
                  <td className="py-3 px-4 text-foreground">{record.bodyPart}</td>
                  <td className="py-3 px-4 text-foreground">{record.date}</td>
                  <td className="py-3 px-4 text-foreground">{record.time}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleFileFolder(record.id)}
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
        
        {/* Table Footer/Pagination could go here if needed */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {patientRecords.length} records
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => console.log('Previous page')}
              className="px-3 py-1 border border-border rounded text-sm text-muted-foreground hover:bg-muted transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => console.log('Page 1')}
              className="px-3 py-1 bg-medical-blue text-white rounded text-sm hover:bg-medical-blue-dark transition-colors"
            >
              1
            </button>
            <button
              onClick={() => console.log('Page 2')}
              className="px-3 py-1 border border-border rounded text-sm text-muted-foreground hover:bg-muted transition-colors"
            >
              2
            </button>
            <button
              onClick={() => console.log('Next page')}
              className="px-3 py-1 border border-border rounded text-sm text-muted-foreground hover:bg-muted transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Delete Dialog */}
      <DeleteDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        patientName={deleteDialog.patientName}
        recordId={deleteDialog.recordId}
      />

      {/* Bulk Delete Dialog */}
      {bulkDeleteDialog.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">Delete Selected Records</h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete {bulkDeleteDialog.count} selected record{bulkDeleteDialog.count > 1 ? 's' : ''}?
              This action cannot be undone.
            </p>
            <div className="flex space-x-3 justify-end">
              <button
                onClick={handleBulkDeleteCancel}
                className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDeleteConfirm}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Delete {bulkDeleteDialog.count} Record{bulkDeleteDialog.count > 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientRecord;
