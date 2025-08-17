import React, { useState, useEffect } from 'react';
import { Search, X, FileText, Plus, FolderOpen, Trash2, Minus, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DeleteDialog from '../components/DeleteDialog';

const PatientRecord = () => {
  const navigate = useNavigate();
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, recordId: '', patientName: '' });
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [bulkDeleteDialog, setBulkDeleteDialog] = useState({ isOpen: false, count: 0 });
  const [editDialog, setEditDialog] = useState({ isOpen: false, records: [] as any[] });
  const [editFormData, setEditFormData] = useState({ name: '', bodyPart: '', remarks: '', status: 'Pending' });
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState({ isOpen: false, message: '', onConfirm: () => {} });
  const [newPatientDialog, setNewPatientDialog] = useState({ isOpen: false });
  const [newPatientData, setNewPatientData] = useState({ name: '', bodyPart: '', remarks: '', status: 'Pending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [dateSort, setDateSort] = useState<'asc' | 'desc' | 'none'>('none');
  const [bodyPartFilter, setBodyPartFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Function to reassign all patient IDs sequentially starting from 01
  const reassignPatientIds = (records: any[]) => {
    return records.map((record, index) => ({
      ...record,
      id: `${(index + 1).toString().padStart(2, '0')}.)`
    }));
  };

  // Function to generate next patient ID (always sequential)
  const getNextPatientId = (records: any[]) => {
    const nextNumber = records.length + 1;
    return `${nextNumber.toString().padStart(2, '0')}.)`;
  };

  const [patientRecords, setPatientRecords] = useState(() => {
    // Load records from localStorage or use default data
    const savedRecords = localStorage.getItem('patientRecords');
    const records = savedRecords ? JSON.parse(savedRecords) : [
      { id: '01.)', name: 'Jane Doe', bodyPart: 'Right Knee', date: 'Today', time: '10:34 AM', file: 'D', remarks: 'Initial scan', status: 'Complete' },
      { id: '02.)', name: 'Jane Doe', bodyPart: 'Left Knee', date: 'Yesterday', time: '2:17 PM', file: 'D', remarks: 'Follow-up examination', status: 'In Progress' },
      { id: '03.)', name: 'Jake Doe', bodyPart: 'Bilateral Knees', date: 'April 20, 2025', time: '4:45 PM', file: 'D', remarks: 'Comparative study', status: 'Complete' },
      { id: '04.)', name: 'Jane Doe', bodyPart: 'Right Knee', date: 'April 19, 2025', time: '11:22 AM', file: 'D', remarks: 'Post-surgery assessment', status: 'Follow Up' },
      { id: '05.)', name: 'Jeff Doe', bodyPart: 'Bilateral Knees', date: 'April 18, 2025', time: '9:10 AM', file: 'D', remarks: 'Routine check-up', status: 'Complete' },
      { id: '06.)', name: 'Jason Doe', bodyPart: 'Right Knee', date: 'Today', time: '10:34 AM', file: 'D', remarks: 'Sports injury evaluation', status: 'Pending' },
      { id: '07.)', name: 'Jane Doe', bodyPart: 'Left Knee', date: 'Yesterday', time: '2:17 PM', file: 'D', remarks: 'Pain assessment', status: 'In Progress' },
      { id: '08.)', name: 'Jude Doe', bodyPart: 'Bilateral Knees', date: 'April 20, 2025', time: '4:45 PM', file: 'D', remarks: 'Arthritis monitoring', status: 'Complete' },
      { id: '09.)', name: 'Jane Doe', bodyPart: 'Right Knee', date: 'April 19, 2025', time: '11:22 AM', file: 'D', remarks: 'Recovery progress', status: 'Follow Up' },
      { id: '10.)', name: 'Jeff Doe', bodyPart: 'Bilateral Knees', date: 'April 20, 2025', time: '9:10 AM', file: 'D', remarks: 'Annual screening', status: 'Complete' },
      { id: '11.)', name: 'James Doe', bodyPart: 'Right Knee', date: 'Today', time: '10:34 AM', file: 'D', remarks: 'Injury diagnosis', status: 'Pending' },
      { id: '12.)', name: 'Jane Doe', bodyPart: 'Left Knee', date: 'Yesterday', time: '2:17 PM', file: 'D', remarks: 'Treatment planning', status: 'In Progress' },
      { id: '13.)', name: 'Jude Doe', bodyPart: 'Bilateral Knees', date: 'April 20, 2025', time: '4:45 PM', file: 'D', remarks: 'Joint stability test', status: 'Complete' },
      { id: '14.)', name: 'Jane Doe', bodyPart: 'Right Knee', date: 'April 19, 2025', time: '11:22 AM', file: 'D', remarks: 'Mobility assessment', status: 'Follow Up' },
      { id: '15.)', name: 'Jeff Doe', bodyPart: 'Bilateral Knees', date: 'April 18, 2025', time: '9:10 AM', file: 'D', remarks: 'Preventive care', status: 'Complete' },
      { id: '16.)', name: 'Jane Doe', bodyPart: 'Right Knee', date: 'April 19, 2025', time: '11:22 AM', file: 'D', remarks: 'Surgical planning', status: 'Pending' },
      { id: '17.)', name: 'Jake Doe', bodyPart: 'Bilateral Knees', date: 'April 18, 2025', time: '9:10 AM', file: 'D', remarks: 'Consultation', status: 'Complete' },
      { id: '18.)', name: 'Jane Doe', bodyPart: 'Right Knee', date: 'April 19, 2025', time: '11:22 AM', file: 'D', remarks: 'Second opinion', status: 'In Progress' },
      { id: '19.)', name: 'Jeff Doe', bodyPart: 'Bilateral Knees', date: 'April 18, 2025', time: '9:10 AM', file: 'D', remarks: 'Baseline study', status: 'Complete' },
      { id: '20.)', name: 'Jane Doe', bodyPart: 'Right Knee', date: 'April 19, 2025', time: '11:22 AM', file: 'D', remarks: 'Progress monitoring', status: 'Follow Up' },
    ];

    // Initialize metadata for default records if not already present
    if (!savedRecords) {
      records.forEach(record => {
        const metadataKey = `metadata_${record.id}`;
        if (!localStorage.getItem(metadataKey)) {
          const metadata = {
            studyInfo: {
              studyId: record.id,
              patientName: record.name,
              studyDate: record.date,
              modality: 'MRI',
              bodyPart: record.bodyPart
            },
            technicalParams: {
              sliceThickness: '3.0 mm',
              tr: '2500 ms',
              te: '85 ms',
              fieldStrength: '1.5 Tesla',
              matrix: '512 x 512'
            },
            equipment: {
              manufacturer: 'Siemens',
              model: 'MAGNETOM Aera',
              software: 'syngo MR E11'
            },
            remarks: record.remarks || '',
            created: new Date().toISOString()
          };
          localStorage.setItem(metadataKey, JSON.stringify(metadata));
        }
      });
    }

    // Ensure all records have proper sequential numbering
    return reassignPatientIds(records);
  });

  // Check for new uploads and append them
  useEffect(() => {
    const newUpload = sessionStorage.getItem('newPatientRecord');
    if (newUpload) {
      const uploadData = JSON.parse(newUpload);
      const newRecord = {
        id: getNextPatientId(patientRecords),
        name: uploadData.patientName,
        bodyPart: uploadData.bodyPart || uploadData.studyDescription || 'Study',
        date: 'Today',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        file: 'D',
        remarks: uploadData.studyDescription || uploadData.remarks || 'Uploaded study',
        status: uploadData.status || 'Pending'
      };

      const updatedRecords = reassignPatientIds([newRecord, ...patientRecords]);
      setPatientRecords(updatedRecords);
      localStorage.setItem('patientRecords', JSON.stringify(updatedRecords));

      // Initialize metadata for uploaded patient
      const metadataKey = `metadata_${newRecord.id}`;
      const metadata = {
        studyInfo: {
          studyId: newRecord.id,
          patientName: newRecord.name,
          studyDate: newRecord.date,
          modality: 'MRI',
          bodyPart: newRecord.bodyPart
        },
        technicalParams: {
          sliceThickness: '3.0 mm',
          tr: '2500 ms',
          te: '85 ms',
          fieldStrength: '1.5 Tesla',
          matrix: '512 x 512'
        },
        equipment: {
          manufacturer: 'Siemens',
          model: 'MAGNETOM Aera',
          software: 'syngo MR E11'
        },
        remarks: newRecord.remarks || '',
        created: new Date().toISOString()
      };
      localStorage.setItem(metadataKey, JSON.stringify(metadata));

      // Dispatch event to sync with Dashboard
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('patientRecordsUpdated'));
      }, 50);
      sessionStorage.removeItem('newPatientRecord');
    }
  }, []);

  const checkStatusBeforeNavigation = (action: string, patientId?: string, navigationCallback?: () => void) => {
    if (patientId) {
      // Find the patient record to check status
      const patientRecord = patientRecords.find(record => record.id === patientId);
      if (patientRecord) {
        const status = patientRecord.status || 'Pending';

        // Check if status is Pending or In Progress
        if (status === 'Pending' || status === 'In Progress') {
          // Store navigation info and show popup
          setPendingNavigation({
            action: action,
            patientId: patientId,
            patientName: patientRecord.name,
            status: status
          });
          setShowNavigationWarning(true);
          return false; // Don't proceed with navigation
        }
      }
    }

    // Status is Complete/Follow Up or no patient specified, proceed
    if (navigationCallback) {
      navigationCallback();
    }
    return true;
  };

  const handleFileFolder = (patientId: string) => {
    navigate(`/file-folder/${patientId}`);
  };

  const handleNavigateAnyway = () => {
    if (pendingNavigation) {
      if (pendingNavigation.action === 'fileFolder' && pendingNavigation.patientId) {
        navigate(`/file-folder/${pendingNavigation.patientId}`);
      }
      // Add other navigation actions here as needed
    }
    setShowNavigationWarning(false);
    setPendingNavigation(null);
  };

  const handleUpdateStatusFirst = () => {
    if (pendingNavigation && pendingNavigation.patientId) {
      // Find and update the patient record to edit it
      const recordsToEdit = patientRecords.filter(record => record.id === pendingNavigation.patientId);
      setEditDialog({ isOpen: true, records: recordsToEdit });
      setEditFormData({
        name: pendingNavigation.patientName || '',
        bodyPart: recordsToEdit[0]?.bodyPart || '',
        remarks: recordsToEdit[0]?.remarks || '',
        status: pendingNavigation.status || 'Pending'
      });
    }
    setShowNavigationWarning(false);
    setPendingNavigation(null);
  };

  const handleRemindLater = () => {
    if (pendingNavigation && pendingNavigation.patientId) {
      // Update status to Pending
      const updatedRecords = patientRecords.map(record => {
        if (record.id === pendingNavigation.patientId) {
          return { ...record, status: 'Pending' };
        }
        return record;
      });
      setPatientRecords(updatedRecords);
      localStorage.setItem('patientRecords', JSON.stringify(updatedRecords));

      // Dispatch events to sync across all pages
      window.dispatchEvent(new CustomEvent('patientRecordsUpdated'));
      window.dispatchEvent(new CustomEvent('metadataUpdated', {
        detail: { updatedRecords: [{ id: pendingNavigation.patientId, status: 'Pending' }] }
      }));
    }
    setShowNavigationWarning(false);
    setPendingNavigation(null);
  };

  const handleDeleteClick = (recordId: string, patientName: string) => {
    setDeleteDialog({ isOpen: true, recordId, patientName });
  };

  const handleDeleteConfirm = () => {
    // Remove metadata for the deleted record
    const metadataKey = `metadata_${deleteDialog.recordId}`;
    localStorage.removeItem(metadataKey);

    const filteredRecords = patientRecords.filter(record => record.id !== deleteDialog.recordId);
    const updatedRecords = reassignPatientIds(filteredRecords);
    setPatientRecords(updatedRecords);
    localStorage.setItem('patientRecords', JSON.stringify(updatedRecords));
    // Dispatch event to sync with Dashboard
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('patientRecordsUpdated'));
    }, 50);
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
    const currentPageRecordIds = currentPageRecords.map(record => record.id);
    const allCurrentPageSelected = currentPageRecordIds.every(id => selectedRecords.includes(id));

    if (allCurrentPageSelected) {
      // Deselect all records on current page
      setSelectedRecords(prev => prev.filter(id => !currentPageRecordIds.includes(id)));
    } else {
      // Select all records on current page
      setSelectedRecords(prev => [...new Set([...prev, ...currentPageRecordIds])]);
    }
  };

  const handleBulkDelete = () => {
    if (selectedRecords.length === 0) {
      alert('Please select records to delete');
      return;
    }

    setDeleteConfirmDialog({
      isOpen: true,
      message: `Are you sure you want to delete ${selectedRecords.length} selected record${selectedRecords.length > 1 ? 's' : ''}? This action cannot be undone.`,
      onConfirm: () => {
        // Remove metadata for all deleted records
        selectedRecords.forEach(recordId => {
          const metadataKey = `metadata_${recordId}`;
          localStorage.removeItem(metadataKey);
        });

        const filteredRecords = patientRecords.filter(record => !selectedRecords.includes(record.id));
        const updatedRecords = reassignPatientIds(filteredRecords);
        setPatientRecords(updatedRecords);
        localStorage.setItem('patientRecords', JSON.stringify(updatedRecords));
        window.dispatchEvent(new CustomEvent('patientRecordsUpdated'));
        setSelectedRecords([]);
        setDeleteConfirmDialog({ isOpen: false, message: '', onConfirm: () => {} });
      }
    });
  };

  const handleDeleteConfirmCancel = () => {
    setDeleteConfirmDialog({ isOpen: false, message: '', onConfirm: () => {} });
  };

  const handleBulkEdit = () => {
    if (selectedRecords.length === 0) {
      alert('Please select records to edit');
      return;
    }

    const recordsToEdit = patientRecords.filter(record => selectedRecords.includes(record.id));
    // If editing multiple records, use the first record's data as default
    const firstRecord = recordsToEdit[0];
    setEditFormData({
      name: firstRecord.name,
      bodyPart: firstRecord.bodyPart,
      remarks: firstRecord.remarks || '',
      status: firstRecord.status || 'Pending'
    });
    setEditDialog({ isOpen: true, records: recordsToEdit });
  };

  const handleEditSave = () => {
    const updatedRecords = patientRecords.map(record => {
      if (selectedRecords.includes(record.id)) {
        return {
          ...record,
          name: editFormData.name,
          bodyPart: editFormData.bodyPart,
          remarks: editFormData.remarks,
          status: editFormData.status,
          date: record.date, // Keep original date
          time: record.time   // Keep original time
        };
      }
      return record;
    });

    setPatientRecords(updatedRecords);
    localStorage.setItem('patientRecords', JSON.stringify(updatedRecords));

    // Update metadata for each edited record
    const editedRecords = updatedRecords.filter(record => selectedRecords.includes(record.id));
    editedRecords.forEach(record => {
      // Create or update metadata for this patient
      const metadataKey = `metadata_${record.id}`;
      const existingMetadata = localStorage.getItem(metadataKey);

      const metadata = existingMetadata ? JSON.parse(existingMetadata) : {
        // Default metadata structure
        studyInfo: {
          studyId: record.id,
          patientName: record.name,
          studyDate: record.date,
          modality: 'MRI',
          bodyPart: record.bodyPart
        },
        technicalParams: {
          sliceThickness: '3.0 mm',
          tr: '2500 ms',
          te: '85 ms',
          fieldStrength: '1.5 Tesla',
          matrix: '512 x 512'
        },
        equipment: {
          manufacturer: 'Siemens',
          model: 'MAGNETOM Aera',
          software: 'syngo MR E11'
        },
        remarks: record.remarks || ''
      };

      // Update metadata with new values
      metadata.studyInfo.patientName = record.name;
      metadata.studyInfo.bodyPart = record.bodyPart;
      metadata.remarks = record.remarks || '';
      metadata.lastModified = new Date().toISOString();

      // Save updated metadata
      localStorage.setItem(metadataKey, JSON.stringify(metadata));
    });

    // Dispatch events to sync with Dashboard and other components
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('patientRecordsUpdated'));
      window.dispatchEvent(new CustomEvent('metadataUpdated', {
        detail: { updatedRecords: editedRecords }
      }));
    }, 50);

    setEditDialog({ isOpen: false, records: [] });
    setSelectedRecords([]);
  };

  const handleEditCancel = () => {
    setEditDialog({ isOpen: false, records: [] });
    setEditFormData({ name: '', bodyPart: '', remarks: '', status: 'Pending' });
  };

  const handleAddPatient = () => {
    setNewPatientData({ name: '', bodyPart: '', remarks: '', status: 'Pending' });
    setNewPatientDialog({ isOpen: true });
  };

  const handleNewPatientSave = () => {
    if (!newPatientData.name || !newPatientData.bodyPart) {
      alert('Please enter patient name and select body part');
      return;
    }

    const newPatient = {
      id: getNextPatientId(patientRecords),
      name: newPatientData.name,
      bodyPart: newPatientData.bodyPart,
      date: 'Today',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      file: 'D',
      remarks: newPatientData.remarks || 'Newly added patient',
      status: newPatientData.status,
      isNewlyAdded: true,
      addedTimestamp: Date.now()
    };
    const updatedRecords = reassignPatientIds([newPatient, ...patientRecords]);
    setPatientRecords(updatedRecords);
    localStorage.setItem('patientRecords', JSON.stringify(updatedRecords));

    // Initialize metadata for new patient
    const metadataKey = `metadata_${newPatient.id}`;
    const metadata = {
      studyInfo: {
        studyId: newPatient.id,
        patientName: newPatient.name,
        studyDate: newPatient.date,
        modality: 'MRI',
        bodyPart: newPatient.bodyPart
      },
      technicalParams: {
        sliceThickness: '3.0 mm',
        tr: '2500 ms',
        te: '85 ms',
        fieldStrength: '1.5 Tesla',
        matrix: '512 x 512'
      },
      equipment: {
        manufacturer: 'Siemens',
        model: 'MAGNETOM Aera',
        software: 'syngo MR E11'
      },
      remarks: newPatient.remarks || '',
      created: new Date().toISOString()
    };
    localStorage.setItem(metadataKey, JSON.stringify(metadata));

    // Dispatch event to sync with Dashboard
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('patientRecordsUpdated'));
    }, 50);
    setNewPatientDialog({ isOpen: false });
  };

  const handleNewPatientCancel = () => {
    setNewPatientDialog({ isOpen: false });
    setNewPatientData({ name: '', bodyPart: '', remarks: '', status: 'Pending' });
  };

  // Search and filter functions
  const handleClearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Convert date string to Date object for sorting
  const parseDate = (dateStr: string) => {
    if (dateStr === 'Today') return new Date();
    if (dateStr === 'Yesterday') {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return yesterday;
    }
    return new Date(dateStr);
  };

  // Filter and sort patient records
  const getFilteredAndSortedRecords = () => {
    let filtered = patientRecords;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.bodyPart.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.remarks?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.id.includes(searchTerm)
      );
    }

    // Apply body part filter
    if (bodyPartFilter) {
      filtered = filtered.filter(record => record.bodyPart === bodyPartFilter);
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(record => record.status === statusFilter);
    }

    // Apply date sorting
    if (dateSort !== 'none') {
      filtered = [...filtered].sort((a, b) => {
        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);
        return dateSort === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
      });
    }

    return filtered;
  };

  const filteredRecords = getFilteredAndSortedRecords();

  // Pagination logic
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentPageRecords = filteredRecords.slice(startIndex, endIndex);

  // Pagination functions
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedRecords([]); // Clear selections when changing pages
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  // Reset to first page when filters change
  const handleSearch = (searchValue: string) => {
    setSearchTerm(searchValue);
    setCurrentPage(1);
  };

  const handleDateSort = (sortType: 'asc' | 'desc' | 'none') => {
    setDateSort(sortType);
    setCurrentPage(1);
  };

  const handleBodyPartFilter = (bodyPart: string) => {
    setBodyPartFilter(bodyPart);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };


  return (
    <div className="p-6 bg-background min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Patient Record</h1>
      </div>

      {/* Search Bar with New Button */}
      <div className="relative mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 flex items-center bg-card border border-border rounded-lg px-4 py-3">
            <Search className="w-5 h-5 text-muted-foreground mr-3" />
            <input
              type="text"
              placeholder="Search by name, body part, or remarks..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-foreground placeholder-muted-foreground"
            />
            <X
              onClick={handleClearSearch}
              className="w-5 h-5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
            />
          </div>
          <button
            onClick={() => setFilterDialogOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl flex items-center space-x-2"
          >
            <span>Filter</span>
          </button>
          <button
            onClick={handleAddPatient}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New</span>
          </button>
        </div>
      </div>

      {/* Edit and Delete Options (shows when checkboxes are selected) */}
      {selectedRecords.length > 0 && (
        <div className="mb-6 flex space-x-3">
          <button
            onClick={handleBulkEdit}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl flex items-center space-x-2"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Selected ({selectedRecords.length})</span>
          </button>
          <button
            onClick={handleBulkDelete}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl flex items-center space-x-2"
          >
            <Minus className="w-4 h-4" />
            <span>Delete Selected ({selectedRecords.length})</span>
          </button>
        </div>
      )}

      {/* Patient Records Table */}
      <div className="medical-card p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground w-12">
                  <input
                    type="checkbox"
                    checked={currentPageRecords.length > 0 && currentPageRecords.every(record => selectedRecords.includes(record.id))}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-medical-blue bg-background border-border rounded focus:ring-medical-blue focus:ring-2"
                  />
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">No.</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Patient Name</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Body Part</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Time</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">File</th>
              </tr>
            </thead>
            <tbody>
              {currentPageRecords.map((record, index) => (
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
                  <td className="py-3 px-4 text-foreground">{(startIndex + index + 1).toString().padStart(2, '0')}.)</td>
                  <td className="py-3 px-4 text-foreground">{record.name}</td>
                  <td className="py-3 px-4 text-foreground">{record.bodyPart}</td>
                  <td className="py-3 px-4 text-foreground">{record.date}</td>
                  <td className="py-3 px-4 text-foreground">{record.time}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      (record.status || 'Pending') === 'Complete' ? 'bg-green-100 text-green-800' :
                      (record.status || 'Pending') === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      (record.status || 'Pending') === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      (record.status || 'Pending') === 'Follow Up' ? 'bg-purple-100 text-purple-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {record.status || 'Pending'}
                    </span>
                  </td>
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

          {/* No Results Message */}
          {filteredRecords.length === 0 && patientRecords.length > 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm || bodyPartFilter ?
                  'No records match your current filters.' :
                  'No records found.'
                }
              </p>
              {(searchTerm || bodyPartFilter) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setBodyPartFilter('');
                    setDateSort('none');
                    setCurrentPage(1);
                  }}
                  className="mt-2 text-medical-blue hover:underline text-sm"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Table Footer/Pagination could go here if needed */}
        {/* Pagination Controls */}
        {filteredRecords.length > 0 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredRecords.length)} of {filteredRecords.length} records
              (Page {currentPage} of {totalPages})
            </div>

            {totalPages > 1 && (
              <div className="flex space-x-2">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-border rounded text-sm text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {/* Page Numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        currentPage === pageNum
                          ? 'bg-medical-blue text-white hover:bg-medical-blue-dark'
                          : 'border border-border text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-border rounded text-sm text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Dialog */}
      <DeleteDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        patientName={deleteDialog.patientName}
        recordId={deleteDialog.recordId}
      />

      {/* Edit Form Dialog */}
      {editDialog.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Edit {editDialog.records.length > 1 ? `${editDialog.records.length} Records` : 'Record'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Patient Name
                </label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                  placeholder="Enter patient name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Body Part
                </label>
                <select
                  value={editFormData.bodyPart}
                  onChange={(e) => setEditFormData({ ...editFormData, bodyPart: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                >
                  <option value="">Select knee</option>
                  <option value="Left Knee">Left Knee</option>
                  <option value="Right Knee">Right Knee</option>
                  <option value="Bilateral Knees">Bilateral Knees</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Status
                </label>
                <select
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Complete">Complete</option>
                  <option value="Follow Up">Follow Up</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Remarks
                </label>
                <textarea
                  value={editFormData.remarks}
                  onChange={(e) => setEditFormData({ ...editFormData, remarks: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent resize-none"
                  placeholder="Enter remarks or notes"
                />
              </div>
            </div>

            <div className="flex space-x-3 justify-end mt-6">
              <button
                onClick={handleEditCancel}
                className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="px-4 py-2 bg-medical-blue hover:bg-medical-blue-dark text-white rounded-lg transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {deleteConfirmDialog.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">Confirm Delete</h3>
            <p className="text-muted-foreground mb-6">
              {deleteConfirmDialog.message}
            </p>
            <div className="flex space-x-3 justify-end">
              <button
                onClick={handleDeleteConfirmCancel}
                className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteConfirmDialog.onConfirm}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Patient Dialog */}
      {newPatientDialog.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Add New Patient
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Patient Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newPatientData.name}
                  onChange={(e) => setNewPatientData({ ...newPatientData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                  placeholder="Enter patient name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Body Part <span className="text-red-500">*</span>
                </label>
                <select
                  value={newPatientData.bodyPart}
                  onChange={(e) => setNewPatientData({ ...newPatientData, bodyPart: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                >
                  <option value="">Select knee</option>
                  <option value="Left Knee">Left Knee</option>
                  <option value="Right Knee">Right Knee</option>
                  <option value="Bilateral Knees">Bilateral Knees</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={newPatientData.status}
                  onChange={(e) => setNewPatientData({ ...newPatientData, status: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Complete">Complete</option>
                  <option value="Follow Up">Follow Up</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Remarks (Optional)
                </label>
                <textarea
                  value={newPatientData.remarks}
                  onChange={(e) => setNewPatientData({ ...newPatientData, remarks: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent resize-none"
                  placeholder="Enter remarks or notes (optional)"
                />
              </div>
            </div>

            <div className="flex space-x-3 justify-end mt-6">
              <button
                onClick={handleNewPatientCancel}
                className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleNewPatientSave}
                className="px-4 py-2 bg-medical-blue hover:bg-medical-blue-dark text-white rounded-lg transition-colors"
              >
                Add Patient
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Dialog */}
      {filterDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Filter Options</h3>
              <button
                onClick={() => setFilterDialogOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Date Sort Section */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">Date Sorting</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="dateSort"
                      checked={dateSort === 'none'}
                      onChange={() => handleDateSort('none')}
                      className="text-medical-blue focus:ring-medical-blue"
                    />
                    <span className="text-sm text-foreground">No Sort</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="dateSort"
                      checked={dateSort === 'desc'}
                      onChange={() => handleDateSort('desc')}
                      className="text-medical-blue focus:ring-medical-blue"
                    />
                    <span className="text-sm text-foreground">Newest First</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="dateSort"
                      checked={dateSort === 'asc'}
                      onChange={() => handleDateSort('asc')}
                      className="text-medical-blue focus:ring-medical-blue"
                    />
                    <span className="text-sm text-foreground">Oldest First</span>
                  </label>
                </div>
              </div>

              {/* Body Part Filter Section */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">Body Part</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="bodyPart"
                      checked={bodyPartFilter === ''}
                      onChange={() => handleBodyPartFilter('')}
                      className="text-medical-blue focus:ring-medical-blue"
                    />
                    <span className="text-sm text-foreground">All</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="bodyPart"
                      checked={bodyPartFilter === 'Left Knee'}
                      onChange={() => handleBodyPartFilter('Left Knee')}
                      className="text-medical-blue focus:ring-medical-blue"
                    />
                    <span className="text-sm text-foreground">Left Knee</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="bodyPart"
                      checked={bodyPartFilter === 'Right Knee'}
                      onChange={() => handleBodyPartFilter('Right Knee')}
                      className="text-medical-blue focus:ring-medical-blue"
                    />
                    <span className="text-sm text-foreground">Right Knee</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="bodyPart"
                      checked={bodyPartFilter === 'Bilateral Knees'}
                      onChange={() => handleBodyPartFilter('Bilateral Knees')}
                      className="text-medical-blue focus:ring-medical-blue"
                    />
                    <span className="text-sm text-foreground">Bilateral Knees</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 justify-end mt-6">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setBodyPartFilter('');
                  setDateSort('none');
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={() => setFilterDialogOpen(false)}
                className="px-4 py-2 bg-medical-blue hover:bg-medical-blue-dark text-white rounded-lg transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Warning Popup */}
      {showNavigationWarning && pendingNavigation && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md mx-4 shadow-xl">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                <Edit className="w-5 h-5 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Status Needs Attention</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              <strong>{pendingNavigation.patientName}</strong> has status: <strong>{pendingNavigation.status}</strong>
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Do you want to update the status before proceeding, or continue without updating?
            </p>
            <div className="flex space-x-3 justify-end">
              <button
                onClick={handleRemindLater}
                className="px-4 py-2 text-sm border border-border rounded-lg text-muted-foreground hover:bg-muted transition-colors"
              >
                Remind Later
              </button>
              <button
                onClick={handleNavigateAnyway}
                className="px-4 py-2 text-sm border border-border rounded-lg text-muted-foreground hover:bg-muted transition-colors"
              >
                Continue Anyway
              </button>
              <button
                onClick={handleUpdateStatusFirst}
                className="px-4 py-2 text-sm bg-medical-blue text-white rounded-lg hover:bg-medical-blue-dark transition-colors"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientRecord;
