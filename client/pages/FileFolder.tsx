import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronLeft, Plus, Folder, FileText } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const FileFolder = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const [patientName, setPatientName] = useState('Unknown Patient');
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Get patient name from localStorage
    const savedRecords = localStorage.getItem('patientRecords');
    if (savedRecords) {
      const records = JSON.parse(savedRecords);
      const patient = records.find((record: any) => record.id === patientId);
      if (patient) {
        // Check if this is a newly added patient (within last 5 minutes)
        const isRecentlyAdded = patient.isNewlyAdded &&
          patient.addedTimestamp &&
          (Date.now() - patient.addedTimestamp) < (5 * 60 * 1000); // 5 minutes

        // For newly added patients, show "New Patient" until they upload files
        if (isRecentlyAdded) {
          setPatientName('New Patient');
        } else {
          setPatientName(patient.name);
        }
      }
    }
  }, [patientId]);

  const handleFolderClick = (folderId: string) => {
    // Navigate to images page instead of report
    navigate(`/file-folder/${patientId}/images`);
  };

  const handleAddFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      console.log('Selected files:', Array.from(files).map(f => f.name));

      // Store files for this patient
      const fileList = Array.from(files).map(f => ({
        name: f.name,
        size: f.size,
        type: f.type,
        uploadedAt: new Date().toISOString()
      }));
      localStorage.setItem(`folderFiles_${patientId}`, JSON.stringify(fileList));

      // Clear the newly added flag since files have been uploaded
      const savedRecords = localStorage.getItem('patientRecords');
      if (savedRecords) {
        const records = JSON.parse(savedRecords);
        const updatedRecords = records.map((record: any) => {
          if (record.id === patientId && record.isNewlyAdded) {
            return { ...record, isNewlyAdded: false };
          }
          return record;
        });
        localStorage.setItem('patientRecords', JSON.stringify(updatedRecords));

        // Update the patient name display to show actual name instead of "New Patient"
        const patient = updatedRecords.find((record: any) => record.id === patientId);
        if (patient) {
          setPatientName(patient.name);
        }
      }

      // Refresh the page to show the uploaded files
      window.location.reload();
    }
  };

  // Check if patient is new (no folders yet)
  const isNewPatient = () => {
    const savedRecords = localStorage.getItem('patientRecords');
    if (savedRecords) {
      const records = JSON.parse(savedRecords);
      const patient = records.find((record: any) => record.id === patientId);

      // Check if patient was recently added (within last 5 minutes) or has isNewlyAdded flag
      const isRecentlyAdded = patient && patient.isNewlyAdded &&
        patient.addedTimestamp &&
        (Date.now() - patient.addedTimestamp) < (5 * 60 * 1000); // 5 minutes

      // Also check for any patient added today that hasn't had files uploaded yet
      const isTodayWithNoFiles = patient && patient.date === 'Today' &&
        !localStorage.getItem(`folderFiles_${patientId}`);

      return isRecentlyAdded || isTodayWithNoFiles;
    }
    return false;
  };

  // Patient folder data - check for uploaded files or use default data
  const getPatientFolders = () => {
    // Check if files have been uploaded for this patient
    const uploadedFiles = localStorage.getItem(`folderFiles_${patientId}`);

    if (isNewPatient() && !uploadedFiles) {
      // New patient with no uploaded files - show empty
      return [];
    } else if (uploadedFiles) {
      // Patient has uploaded files - create a folder for them
      const files = JSON.parse(uploadedFiles);
      return [
        { id: 'K123456789', name: 'K123456789', fileCount: files.length }
      ];
    } else {
      // Existing patient with default folders
      return [
        { id: 'K123456789', name: 'K123456789' },
        { id: 'K123456789-2', name: 'K123456789' },
        { id: 'K123456789-3', name: 'K123456789' },
        { id: 'K123456789-4', name: 'K123456789' },
        { id: 'K123456789-5', name: 'K123456789' },
        { id: 'K123456789-6', name: 'K123456789' },
        { id: 'K123456789-7', name: 'K123456789' },
        { id: 'K123456789-8', name: 'K123456789' },
        { id: 'K123456789-9', name: 'K123456789' },
        { id: 'K123456789-10', name: 'K123456789' },
      ];
    }
  };

  const patientFolders = getPatientFolders();

  // Search functions
  const handleSearch = (searchValue: string) => {
    setSearchTerm(searchValue);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  // Filter folders based on search term
  const getFilteredFolders = () => {
    if (!searchTerm) return patientFolders;

    return patientFolders.filter(folder =>
      folder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      folder.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredFolders = getFilteredFolders();

  return (
    <div className="p-6 bg-background min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-foreground">File Folder</h1>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="flex items-center bg-card border border-border rounded-lg px-4 py-3">
          <Search className="w-5 h-5 text-muted-foreground mr-3" />
          <input
            type="text"
            placeholder="Search folders..."
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

      {/* Navigation Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/patient-record')}
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">Back to Patient Record</span>
          </button>
          <div className="bg-card border border-border rounded-lg px-4 py-2">
            <span className="text-sm text-foreground">Patient: {patientName}</span>
          </div>
        </div>
        {!isNewPatient() && (
          <button
            onClick={handleAddFile}
            className="flex items-center justify-center w-10 h-10 bg-medical-blue hover:bg-medical-blue-dark text-white rounded-lg transition-colors"
            title="Add Files"
          >
            <Plus className="w-5 h-5" />
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".dcm,.dicom,.jpg,.jpeg,.png,.zip,.rar,.7z"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Folder Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-6">
        {filteredFolders.map((folder) => (
          <div
            key={folder.id}
            className="flex flex-col items-center p-4 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
            onClick={() => handleFolderClick(folder.id)}
          >
            {/* Folder Icon */}
            <div className="relative mb-3">
              <Folder className="w-16 h-16 text-yellow-500 fill-yellow-500" />
            </div>

            {/* Folder Name */}
            <div className="text-center">
              <div className="text-sm font-medium text-foreground mb-1">{folder.name}</div>
              {folder.fileCount && (
                <div className="text-xs text-muted-foreground">
                  {folder.fileCount} file{folder.fileCount !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State Message (if no folders) */}
      {patientFolders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <Folder className="w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            {isNewPatient() ? 'New Patient - No Files Yet' : 'No folders found'}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {isNewPatient()
              ? 'Click the + button above to upload files for this new patient'
              : 'Upload files or create a new folder to get started'
            }
          </p>
          <button
            onClick={handleAddFile}
            className="bg-medical-blue hover:bg-medical-blue-dark text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>{isNewPatient() ? 'Upload Files' : 'Add Files'}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default FileFolder;
