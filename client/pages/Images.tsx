import React, { useState, useEffect } from 'react';
import { Search, X, ChevronLeft, Plus, Image as ImageIcon, Edit } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

const Images = () => {
  const { folderId, patientId } = useParams();
  const navigate = useNavigate();
  const [patientName, setPatientName] = useState('Unknown Patient');
  const [searchTerm, setSearchTerm] = useState('');
  const [showStatusWarning, setShowStatusWarning] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<any>(null);

  useEffect(() => {
    // Get patient data from localStorage
    const savedRecords = localStorage.getItem('patientRecords');
    if (savedRecords) {
      const records = JSON.parse(savedRecords);
      const patient = records.find((record: any) => record.id === patientId);
      if (patient) {
        setPatientName(patient.name);
        setCurrentPatient(patient);

        // Automatically check status and show popup if needed
        const status = patient.status || 'Pending';
        if (status === 'Pending' || status === 'In Progress') {
          // Show warning after 2 seconds to ensure page is loaded
          setTimeout(() => {
            setShowStatusWarning(true);
          }, 2000);
        }
      }
    }
  }, [patientId]);

  const handleBackToFolders = () => {
    navigate(`/file-folder/${patientId}`);
  };

  const handleImageClick = (imageId: string) => {
    // Store patient context for the report page
    sessionStorage.setItem('currentPatient', JSON.stringify({
      id: patientId,
      name: patientName
    }));
    // Navigate to report page when image is clicked
    navigate(`/report/${imageId}`);
  };

  const handleUpdateStatus = () => {
    setShowStatusWarning(false);
    // Navigate to patient record where they can edit the status
    navigate('/patient-record');
  };

  const handleRemindLater = () => {
    if (currentPatient) {
      // Update status to Pending
      const savedRecords = localStorage.getItem('patientRecords');
      if (savedRecords) {
        const records = JSON.parse(savedRecords);
        const updatedRecords = records.map((record: any) => {
          if (record.id === patientId) {
            return { ...record, status: 'Pending' };
          }
          return record;
        });
        localStorage.setItem('patientRecords', JSON.stringify(updatedRecords));

        // Dispatch events to sync across all pages
        window.dispatchEvent(new CustomEvent('patientRecordsUpdated'));
        window.dispatchEvent(new CustomEvent('metadataUpdated', {
          detail: { updatedRecords: [{ id: patientId, status: 'Pending' }] }
        }));
      }
    }
    setShowStatusWarning(false);
  };

  const handleContinue = () => {
    setShowStatusWarning(false);
  };

  // Medical images data - replaced with actual image filenames
  const medicalImages = [
    { id: 'IMG-001', name: 'MRI_KNEE_001.dcm' },
    { id: 'IMG-002', name: 'MRI_KNEE_002.dcm' },
    { id: 'IMG-003', name: 'MRI_KNEE_003.dcm' },
    { id: 'IMG-004', name: 'MRI_KNEE_004.dcm' },
    { id: 'IMG-005', name: 'MRI_KNEE_005.dcm' },
    { id: 'IMG-006', name: 'MRI_KNEE_006.dcm' },
    { id: 'IMG-007', name: 'MRI_KNEE_007.dcm' },
    { id: 'IMG-008', name: 'MRI_KNEE_008.dcm' },
    { id: 'IMG-009', name: 'MRI_KNEE_009.dcm' },
    { id: 'IMG-010', name: 'MRI_KNEE_010.dcm' },
  ];

  return (
    <div className="p-6 bg-background min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Images</h1>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="flex items-center bg-card border border-border rounded-lg px-4 py-3">
          <Search className="w-5 h-5 text-muted-foreground mr-3" />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-foreground placeholder-muted-foreground"
          />
          <X
            onClick={() => setSearchTerm('')}
            className="w-5 h-5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
          />
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBackToFolders}
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">Back to Folders</span>
          </button>
          <div className="bg-card border border-border rounded-lg px-4 py-2">
            <span className="text-sm text-foreground">Patient: {patientName}</span>
          </div>
        </div>
        <button
          onClick={() => console.log('Add new image clicked')}
          className="flex items-center justify-center w-10 h-10 bg-medical-blue hover:bg-medical-blue-dark text-white rounded-lg transition-colors"
          title="Add New Image"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-6">
        {medicalImages.map((image) => (
          <div
            key={image.id}
            className="flex flex-col items-center p-4 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
            onClick={() => handleImageClick(image.id)}
          >
            {/* Image Thumbnail */}
            <div className="relative mb-3 w-20 h-20 bg-card border-2 border-medical-blue rounded-lg flex items-center justify-center">
              {/* Medical image placeholder with icon */}
              <div className="relative w-full h-full rounded-lg overflow-hidden bg-gradient-to-br from-green-100 to-green-200">
                <ImageIcon className="absolute top-2 right-2 w-4 h-4 text-yellow-500" />
                {/* Simple mountain/waveform shape to represent medical imaging */}
                <svg 
                  className="absolute bottom-0 left-0 w-full h-8" 
                  viewBox="0 0 80 32" 
                  fill="none"
                >
                  <path 
                    d="M0 20 L20 15 L40 10 L60 18 L80 12 L80 32 L0 32 Z" 
                    fill="rgb(34 197 94)" 
                    opacity="0.7"
                  />
                </svg>
              </div>
            </div>
            
            {/* Image Name */}
            <div className="text-center">
              <div className="text-sm font-medium text-foreground mb-1">{image.name}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State Message (if no images) */}
      {medicalImages.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <ImageIcon className="w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No images found</h3>
          <p className="text-sm text-muted-foreground mb-4">Upload medical images to get started</p>
          <button
            onClick={() => console.log('Upload images clicked')}
            className="bg-medical-blue hover:bg-medical-blue-dark text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Upload Images
          </button>
        </div>
      )}

    </div>
  );
};

export default Images;
