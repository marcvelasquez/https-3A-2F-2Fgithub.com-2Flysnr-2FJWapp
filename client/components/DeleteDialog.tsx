import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  patientName: string;
  recordId: string;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  patientName, 
  recordId 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <h3 className="text-lg font-semibold text-foreground">Confirm Deletion</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-muted-foreground">
            Are you sure you want to delete the record for <strong>{patientName}</strong> (ID: {recordId})?
          </p>
          <p className="text-sm text-destructive mt-2">
            This action cannot be undone.
          </p>
        </div>
        
        <div className="flex space-x-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDialog;
