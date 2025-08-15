import React, { useState } from 'react';
import { Upload, Cloud, FileText, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UploadStudy = () => {
  const [patientName, setPatientName] = useState('John Doe');
  const [studyDescription, setStudyDescription] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file =>
      file.type.startsWith('image/') ||
      file.name.toLowerCase().endsWith('.dcm') ||
      file.name.toLowerCase().endsWith('.dicom') ||
      ['application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed'].includes(file.type)
    );
    setUploadedFiles(validFiles);
  };

  const handleUpload = async () => {
    if (!patientName || uploadedFiles.length === 0) {
      alert('Please enter patient name and select files to upload');
      return;
    }

    setIsUploading(true);

    // Simulate upload process
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Navigate to report page with uploaded file data
    const fileData = {
      patientName,
      studyDescription,
      files: uploadedFiles.map(f => ({ name: f.name, type: f.type, size: f.size }))
    };

    // Store file data in sessionStorage for the report page
    sessionStorage.setItem('uploadedStudy', JSON.stringify(fileData));

    navigate(`/report/${Date.now()}`);
  };

  return (
    <div className="p-6 bg-background min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Upload New Study</h1>
      </div>

      {/* Upload Form */}
      <div className="max-w-2xl mx-auto">
        <div className="medical-card p-8">
          <h2 className="text-xl font-semibold text-foreground mb-6">Upload DICOM Study</h2>
          <p className="text-sm text-muted-foreground mb-8">
            Select a DICOM file (max 25 or 3 compressed archive (.zip, .rar, .7z) to upload. You can also
          </p>

          {/* Patient Name Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              Patient Name
            </label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent"
              placeholder="Enter patient name"
            />
          </div>

          {/* Study Description Field */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-foreground mb-2">
              Study Description
            </label>
            <textarea
              value={studyDescription}
              onChange={(e) => setStudyDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent resize-none"
              placeholder="e.g., MRI scan of the brain..."
            />
          </div>

          {/* DICOM File Upload Area */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-foreground mb-2">
              DICOM File or Archive
            </label>
            <div
              className={`
                relative border-2 border-dashed rounded-lg p-12 text-center transition-colors
                ${isDragOver 
                  ? 'border-medical-blue bg-medical-blue/5' 
                  : 'border-border hover:border-medical-blue/50'
                }
              `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-medical-blue/10 rounded-full flex items-center justify-center mb-4">
                  <Cloud className="w-8 h-8 text-medical-blue" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Click to upload or drag and drop
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  DICOM files (.dcm, .dicom) or archives (.zip, .rar, .7z)
                </p>
                <button className="bg-medical-blue hover:bg-medical-blue-dark text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  Choose Files
                </button>
              </div>
              <input
                type="file"
                multiple
                accept=".dcm,.dicom,.zip,.rar,.7z"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Upload Button */}
          <button className="w-full bg-medical-blue hover:bg-medical-blue-dark text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
            <Upload className="w-5 h-5" />
            <span>Upload Study</span>
          </button>
        </div>

        {/* Upload Guidelines */}
        <div className="mt-6 p-6 bg-muted/50 rounded-lg">
          <h3 className="text-sm font-semibold text-foreground mb-3">Upload Guidelines</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-medical-blue rounded-full mt-2 flex-shrink-0"></div>
              <span>Maximum file size: 2GB per file</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-medical-blue rounded-full mt-2 flex-shrink-0"></div>
              <span>Supported formats: DICOM (.dcm, .dicom), Archives (.zip, .rar, .7z)</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-medical-blue rounded-full mt-2 flex-shrink-0"></div>
              <span>All uploads are encrypted and HIPAA compliant</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-medical-blue rounded-full mt-2 flex-shrink-0"></div>
              <span>Processing time varies based on study size and complexity</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UploadStudy;
