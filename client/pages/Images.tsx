import React from 'react';
import { Search, X, ChevronLeft, Plus, Image as ImageIcon } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

const Images = () => {
  const { folderId } = useParams();
  const navigate = useNavigate();

  const handleBackToFolders = () => {
    navigate('/file-folder');
  };

  // Medical images data
  const medicalImages = [
    { id: 'K123456789-1', name: 'K123456789' },
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
            className="flex-1 bg-transparent border-none outline-none text-foreground placeholder-muted-foreground"
          />
          <X className="w-5 h-5 text-muted-foreground cursor-pointer" />
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
            <span className="text-sm text-foreground">Folder: {folderId || 'Unknown'}</span>
          </div>
        </div>
        <button className="flex items-center justify-center w-10 h-10 bg-medical-blue hover:bg-medical-blue-dark text-white rounded-lg transition-colors">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-6">
        {medicalImages.map((image) => (
          <div 
            key={image.id} 
            className="flex flex-col items-center p-4 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
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
          <button className="bg-medical-blue hover:bg-medical-blue-dark text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Upload Images
          </button>
        </div>
      )}
    </div>
  );
};

export default Images;
