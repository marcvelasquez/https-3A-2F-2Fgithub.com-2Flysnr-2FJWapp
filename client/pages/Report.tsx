import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, RotateCw, ZoomIn, ZoomOut, RotateCcw, Info, X } from 'lucide-react';

const Report = () => {
  const { studyId } = useParams();
  const navigate = useNavigate();
  const [studyData, setStudyData] = useState<any>(null);
  const [currentSlice, setCurrentSlice] = useState(4);
  const [totalSlices] = useState(7);
  const [showMetadata, setShowMetadata] = useState(false);
  
  useEffect(() => {
    // Get uploaded study data from sessionStorage
    const uploadedStudy = sessionStorage.getItem('uploadedStudy');
    if (uploadedStudy) {
      setStudyData(JSON.parse(uploadedStudy));
    }
  }, []);

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

  return (
    <div className="h-screen bg-background flex flex-col">
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
        <div className="text-sm text-muted-foreground">
          Metadata
        </div>
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
        <div className="flex gap-6 h-96">
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
              {studyData && (
                <div className="text-sm opacity-80">
                  Patient: {studyData.patientName}
                  {studyData.studyDescription && (
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

        {/* Study Information */}
        {studyData && (
          <div className="mt-6 medical-card p-4">
            <h3 className="text-lg font-semibold text-foreground mb-3">Study Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Patient Name:</span>
                <span className="ml-2 text-foreground font-medium">{studyData.patientName}</span>
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
