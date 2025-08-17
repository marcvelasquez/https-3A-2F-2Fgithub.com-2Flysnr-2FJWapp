import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, RotateCw, ZoomIn, ZoomOut, RotateCcw, Info, X, Edit, Save } from 'lucide-react';

const Report = () => {
  const { studyId } = useParams();
  const navigate = useNavigate();
  const [studyData, setStudyData] = useState<any>(null);
  const [currentSlice, setCurrentSlice] = useState(4);
  const [totalSlices] = useState(7);
  const [showMetadata, setShowMetadata] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<any>(null);
  const [metadata, setMetadata] = useState<any>(null);
  const [isEditingMetadata, setIsEditingMetadata] = useState(false);
  const [editMetadataForm, setEditMetadataForm] = useState({
    description: '',
    remarks: ''
  });

  useEffect(() => {
    // Get uploaded study data from sessionStorage
    const uploadedStudy = sessionStorage.getItem('uploadedStudy');
    if (uploadedStudy) {
      setStudyData(JSON.parse(uploadedStudy));
    }

    // Get current patient context
    const patientContext = sessionStorage.getItem('currentPatient');
    if (patientContext) {
      const patient = JSON.parse(patientContext);
      setCurrentPatient(patient);

      // Load metadata for this patient
      const metadataKey = `metadata_${patient.id || studyId}`;
      const savedMetadata = localStorage.getItem(metadataKey);
      if (savedMetadata) {
        setMetadata(JSON.parse(savedMetadata));
      }
    }

    // Listen for metadata updates
    const handleMetadataUpdate = (event: any) => {
      if (event.detail?.updatedRecords) {
        const currentPatientId = currentPatient?.id || studyId;
        const wasUpdated = event.detail.updatedRecords.some((record: any) => record.id === currentPatientId);

        if (wasUpdated) {
          // Reload metadata for current patient
          const metadataKey = `metadata_${currentPatientId}`;
          const savedMetadata = localStorage.getItem(metadataKey);
          if (savedMetadata) {
            setMetadata(JSON.parse(savedMetadata));
          }

          // Also update current patient data
          const savedRecords = localStorage.getItem('patientRecords');
          if (savedRecords) {
            const records = JSON.parse(savedRecords);
            const updatedPatient = records.find((record: any) => record.id === currentPatientId);
            if (updatedPatient) {
              setCurrentPatient(updatedPatient);
            }
          }
        }
      }
    };

    window.addEventListener('metadataUpdated', handleMetadataUpdate);

    return () => {
      window.removeEventListener('metadataUpdated', handleMetadataUpdate);
    };
  }, [studyId, currentPatient?.id]);

  const handlePreviousSlice = () => {
    setCurrentSlice(prev => Math.max(1, prev - 1));
  };

  const handleNextSlice = () => {
    setCurrentSlice(prev => Math.min(totalSlices, prev + 1));
  };

  const handleSliceSelect = (slice: number) => {
    setCurrentSlice(slice);
  };

  const handleReset = () => {
    setCurrentSlice(4);
  };

  const handleEditMetadata = () => {
    setEditMetadataForm({
      description: metadata?.description || studyData?.studyDescription || '',
      remarks: metadata?.remarks || currentPatient?.remarks || ''
    });
    setIsEditingMetadata(true);
  };

  const handleSaveMetadata = () => {
    const currentPatientId = currentPatient?.id || studyId;
    const metadataKey = `metadata_${currentPatientId}`;

    const updatedMetadata = {
      ...metadata,
      description: editMetadataForm.description,
      remarks: editMetadataForm.remarks,
      lastModified: new Date().toISOString()
    };

    localStorage.setItem(metadataKey, JSON.stringify(updatedMetadata));
    setMetadata(updatedMetadata);
    setIsEditingMetadata(false);

    // Also update patient records if needed
    const savedRecords = localStorage.getItem('patientRecords');
    if (savedRecords) {
      const records = JSON.parse(savedRecords);
      const updatedRecords = records.map((record: any) => {
        if (record.id === currentPatientId) {
          return {
            ...record,
            remarks: editMetadataForm.remarks
          };
        }
        return record;
      });
      localStorage.setItem('patientRecords', JSON.stringify(updatedRecords));
    }
  };

  const handleCancelEdit = () => {
    setIsEditingMetadata(false);
    setEditMetadataForm({ description: '', remarks: '' });
  };

  return (
    <div className="bg-background flex flex-col min-h-full">
      {/* Header */}
      <div className="bg-card border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold text-foreground">JointWise - Report</h1>
        </div>
        <button
          onClick={() => setShowMetadata(!showMetadata)}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
            showMetadata
              ? 'bg-medical-blue text-white'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          <Info className="w-4 h-4" />
          <span className="text-sm font-medium">Metadata</span>
        </button>
      </div>

      {/* Diagnosis Cards */}
      <div className="p-6 bg-background">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-medical-blue rounded-lg p-6 text-white">
            <div className="text-3xl font-bold mb-2">72%</div>
            <div className="text-sm opacity-90">ACL Tear Probability</div>
          </div>
          <div className="bg-blue-600 rounded-lg p-6 text-white">
            <div className="text-3xl font-bold mb-2">64%</div>
            <div className="text-sm opacity-90">Meniscus Tear Probability</div>
          </div>
          <div className="bg-blue-500 rounded-lg p-6 text-white">
            <div className="text-lg font-bold mb-2">Likely ACL Tear</div>
            <div className="text-sm opacity-90">AI Final Diagnosis</div>
          </div>
        </div>

        {/* Main Content */}
        <div className={`flex gap-6 h-96 ${showMetadata ? 'pr-80' : ''} transition-all duration-300`}>
          {/* Left Sidebar - MRI Slices */}
          <div className="w-32 space-y-2 overflow-y-auto max-h-96">
            {Array.from({ length: totalSlices }, (_, i) => i + 1).map((slice) => (
              <button
                key={slice}
                onClick={() => handleSliceSelect(slice)}
                className={`w-full h-16 rounded-lg border-2 flex items-center justify-center text-xs font-medium transition-all ${
                  currentSlice === slice
                    ? 'bg-medical-blue text-white border-medical-blue'
                    : 'bg-card text-muted-foreground border-border hover:border-medical-blue/50'
                }`}
              >
                MRI Slice {slice}
              </button>
            ))}
          </div>

          {/* Main Viewer */}
          <div className="flex-1 bg-medical-blue rounded-lg relative flex items-center justify-center">
            {/* Navigation Controls */}
            <button
              onClick={handlePreviousSlice}
              disabled={currentSlice === 1}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={handleNextSlice}
              disabled={currentSlice === totalSlices}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Main Content Display */}
            <div className="text-center text-white">
              <h2 className="text-4xl font-bold mb-4">MRI Slice {currentSlice}</h2>
              {(currentPatient || studyData) && (
                <div className="text-sm opacity-80">
                  Patient: {currentPatient?.name || studyData?.patientName || 'Unknown Patient'}
                  {studyData?.studyDescription && (
                    <div className="mt-1">{studyData.studyDescription}</div>
                  )}
                </div>
              )}
            </div>

            {/* Top Controls */}
            <div className="absolute top-4 right-4 flex items-center space-x-2">
              <button className="bg-black/20 hover:bg-black/40 text-white p-2 rounded transition-colors">
                <ZoomOut className="w-4 h-4" />
              </button>
              <button className="bg-black/20 hover:bg-black/40 text-white p-2 rounded transition-colors">
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={handleReset}
                className="bg-black/20 hover:bg-black/40 text-white p-2 rounded transition-colors"
              >
                <RotateCw className="w-4 h-4" />
              </button>
              <span className="text-white text-sm">Reset</span>
            </div>
          </div>
        </div>

        {/* Metadata Panel - Sliding from right */}
        {showMetadata && (
          <div className="fixed right-0 top-0 h-screen w-80 bg-card border-l border-border shadow-xl z-50 animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Study Metadata</h3>
              <button
                onClick={() => setShowMetadata(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4 overflow-y-auto h-full pb-20">
              {/* Study Information */}
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Study Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Study ID:</span>
                    <span className="text-foreground font-mono">{studyId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Patient:</span>
                    <span className="text-foreground">{metadata?.studyInfo?.patientName || currentPatient?.name || studyData?.patientName || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Study Date:</span>
                    <span className="text-foreground">{metadata?.studyInfo?.studyDate || currentPatient?.date || 'October 25, 2023'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Modality:</span>
                    <span className="text-foreground">{metadata?.studyInfo?.modality || 'MRI'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Body Part:</span>
                    <span className="text-foreground">{metadata?.studyInfo?.bodyPart || currentPatient?.bodyPart || 'Knee'}</span>
                  </div>
                </div>
              </div>

              {/* Technical Parameters */}
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Technical Parameters</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Slice Thickness:</span>
                    <span className="text-foreground">{metadata?.technicalParams?.sliceThickness || '3.0 mm'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">TR:</span>
                    <span className="text-foreground">{metadata?.technicalParams?.tr || '2500 ms'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">TE:</span>
                    <span className="text-foreground">{metadata?.technicalParams?.te || '85 ms'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Field Strength:</span>
                    <span className="text-foreground">{metadata?.technicalParams?.fieldStrength || '1.5 Tesla'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Matrix:</span>
                    <span className="text-foreground">{metadata?.technicalParams?.matrix || '512 x 512'}</span>
                  </div>
                </div>
              </div>

              {/* Current Slice Info */}
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Current Slice ({currentSlice})</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Position:</span>
                    <span className="text-foreground">{currentSlice} of {totalSlices}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="text-foreground">{-15 + (currentSlice * 3)} mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Window Level:</span>
                    <span className="text-foreground">350</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Window Width:</span>
                    <span className="text-foreground">1500</span>
                  </div>
                </div>
              </div>

              {/* AI Analysis */}
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">AI Analysis</h4>
                <div className="space-y-2 text-sm">
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-red-700 font-medium">ACL Tear</span>
                      <span className="text-red-600 font-bold">72%</span>
                    </div>
                    <p className="text-red-600 text-xs mt-1">High probability detected</p>
                  </div>
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-orange-700 font-medium">Meniscus Tear</span>
                      <span className="text-orange-600 font-bold">64%</span>
                    </div>
                    <p className="text-orange-600 text-xs mt-1">Moderate probability</p>
                  </div>
                </div>
              </div>

              {/* Equipment Info */}
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Equipment</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Manufacturer:</span>
                    <span className="text-foreground">{metadata?.equipment?.manufacturer || 'Siemens'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Model:</span>
                    <span className="text-foreground">{metadata?.equipment?.model || 'MAGNETOM Aera'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Software:</span>
                    <span className="text-foreground">{metadata?.equipment?.software || 'syngo MR E11'}</span>
                  </div>
                </div>
              </div>

              {/* Remarks */}
              {(metadata?.remarks || currentPatient?.remarks) && (
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">Remarks</h4>
                  <div className="p-3 bg-muted/50 border border-border rounded-lg">
                    <p className="text-sm text-foreground">
                      {metadata?.remarks || currentPatient?.remarks || 'No remarks available'}
                    </p>
                  </div>
                  {metadata?.lastModified && (
                    <p className="text-xs text-muted-foreground">
                      Last updated: {new Date(metadata.lastModified).toLocaleString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Overlay when metadata is open */}
        {showMetadata && (
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setShowMetadata(false)}
          />
        )}

        {/* Study Information */}
        {(studyData || metadata || currentPatient) && (
          <div className="mt-6 medical-card p-4">
            <h3 className="text-lg font-semibold text-foreground mb-3">Study Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Patient Name:</span>
                <span className="ml-2 text-foreground font-medium">{metadata?.studyInfo?.patientName || currentPatient?.name || studyData?.patientName || 'N/A'}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Body Part:</span>
                <span className="ml-2 text-foreground font-medium">{metadata?.studyInfo?.bodyPart || currentPatient?.bodyPart || 'N/A'}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Study Date:</span>
                <span className="ml-2 text-foreground font-medium">{metadata?.studyInfo?.studyDate || currentPatient?.date || 'N/A'}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Study Time:</span>
                <span className="ml-2 text-foreground font-medium">{currentPatient?.time || 'N/A'}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Study ID:</span>
                <span className="ml-2 text-foreground font-medium">{studyId}</span>
              </div>
              {studyData.studyDescription && (
                <div className="col-span-2">
                  <span className="text-muted-foreground">Description:</span>
                  <span className="ml-2 text-foreground font-medium">{studyData.studyDescription}</span>
                </div>
              )}
              <div className="col-span-2">
                <span className="text-muted-foreground">Files:</span>
                <div className="ml-2 mt-1 space-y-1">
                  {studyData.files?.map((file: any, index: number) => (
                    <div key={index} className="text-foreground text-xs">
                      {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Report;
