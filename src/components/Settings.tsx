"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import ReportIssue from './ReportIssue';

interface SettingsProps {
  onClose: () => void;
  onDataCleared: () => void;
}

export default function Settings({ onClose, onDataCleared }: SettingsProps) {
  const { user } = useUser();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState<'all' | 'specific' | null>(null);
  const [confirmationText, setConfirmationText] = useState('');
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [entries, setEntries] = useState<any[]>([]);
  const [showEntryList, setShowEntryList] = useState(false);
  const [showReportIssue, setShowReportIssue] = useState(false);
  const [publicProfile, setPublicProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Check for existing public profile on component mount
  useEffect(() => {
    checkPublicProfile();
  }, []);

  const checkPublicProfile = async () => {
    try {
      const response = await fetch('/api/public/profile-status');
      if (response.ok) {
        const data = await response.json();
        if (data.hasProfile) {
          setPublicProfile(data.profile);
        }
      }
    } catch (error) {
      console.error('Error checking public profile:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  // Fetch entries for deletion selection
  const fetchEntries = async () => {
    try {
      const response = await fetch('/api/entries');
      if (response.ok) {
        const data = await response.json();
        setEntries(data);
        setShowEntryList(true);
      }
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  // Clear all user data
  const handleClearAllData = async () => {
    if (confirmationText !== 'DELETE ALL MY DATA') {
      alert('Please type "DELETE ALL MY DATA" to confirm');
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch('/api/user/clear-all-data', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('All your data has been permanently deleted.');
        onDataCleared();
        onClose();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error clearing data:', error);
      alert('An error occurred while clearing your data.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Delete specific entry
  const handleDeleteEntry = async (entryId: string) => {
    if (confirmationText !== 'DELETE THIS ENTRY') {
      alert('Please type "DELETE THIS ENTRY" to confirm');
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/entries/${entryId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Entry has been permanently deleted.');
        // Refresh entries list
        await fetchEntries();
        setShowConfirmation(null);
        setConfirmationText('');
        setSelectedEntryId(null);
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
      alert('An error occurred while deleting the entry.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-[#EBEDE8] flex justify-between items-center">
          <h2 className="font-serif text-2xl font-semibold text-[#333F3C]">Settings & Security</h2>
          <button
            onClick={onClose}
            className="text-[#333F3C] hover:text-[#004838] text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!showConfirmation && !showEntryList && (
            <>
              {/* User Info */}
              <div className="mb-8 p-4 bg-[#EBEDE8] rounded-lg">
                <h3 className="font-semibold text-[#333F3C] mb-2">Account Information</h3>
                <p className="text-[#333F3C] text-sm">
                  Email: {user?.emailAddresses[0]?.emailAddress}
                </p>
                <p className="text-[#333F3C] text-sm">
                  Member since: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                </p>
              </div>

              {/* Storage Information */}
              <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Storage Information</h3>
                <p className="text-blue-700 text-sm mb-2">
                  All users currently have 2GB of free storage.
                </p>
                <p className="text-blue-700 text-sm">
                  Premium plans with additional storage will be available soon.
                </p>
              </div>

              {/* Public Platform Section */}
              <div className="space-y-6">
                <h3 className="font-serif text-xl font-semibold text-[#333F3C]">Public Platform</h3>
                
                {loadingProfile ? (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-[#004838] border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-[#333F3C]">Checking public profile...</span>
                    </div>
                  </div>
                ) : publicProfile ? (
                  /* Existing Public Profile */
                  <div className="bg-gradient-to-r from-[#004838] to-[#073127] text-white rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">✅</span>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2">Your Public Profile</h4>
                        <p className="text-sm opacity-90 mb-2">
                          <strong>@{publicProfile.username}</strong> - {publicProfile.fullName}
                        </p>
                        <p className="text-sm opacity-90 mb-3">
                          {publicProfile.isJourneyPublic 
                            ? "All your entries are public" 
                            : "You can choose specific entries to make public"
                          }
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              window.location.href = `/public/profile/${publicProfile.username}`;
                            }}
                            className="px-4 py-2 bg-[#E2FB6C] text-[#004838] rounded-lg font-medium hover:bg-[#d4e85c] transition-colors text-sm"
                          >
                            View Public Profile
                          </button>
                          <button
                            onClick={() => {
                              window.location.href = '/public/discover';
                            }}
                            className="px-4 py-2 border border-[#E2FB6C] text-[#E2FB6C] rounded-lg font-medium hover:bg-[#E2FB6C] hover:text-[#004838] transition-colors text-sm"
                          >
                            Go to Public Platform
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* No Public Profile */
                  <div className="bg-gradient-to-r from-[#004838] to-[#073127] text-white rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🌍</span>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2">Share Your Journey Publicly</h4>
                        <p className="text-sm opacity-90 mb-3">
                          Create a public profile to share your memoir journey with others. 
                          You can control which entries are public and connect with fellow memoir writers.
                        </p>
                        <button
                          onClick={() => {
                            window.location.href = '/public/setup';
                          }}
                          className="px-4 py-2 bg-[#E2FB6C] text-[#004838] rounded-lg font-medium hover:bg-[#d4e85c] transition-colors text-sm"
                        >
                          Create Public Profile
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Support Section */}
              <div className="space-y-6">
                <h3 className="font-serif text-xl font-semibold text-[#333F3C]">Support & Feedback</h3>
                
                {/* Report Issue */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🐛</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#333F3C] mb-2">Report an Issue</h4>
                      <p className="text-sm text-[#333F3C] opacity-75 mb-3">
                        Found a bug or having trouble with MemoirVault? Let us know so we can fix it.
                      </p>
                      <button
                        onClick={() => setShowReportIssue(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
                      >
                        Report Issue
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Management Section */}
              <div className="space-y-6">
                <h3 className="font-serif text-xl font-semibold text-[#333F3C]">Data Management</h3>
                
                {/* Delete Specific Entry */}
                <div className="border border-[#EBEDE8] rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🗑️</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#333F3C] mb-2">Delete Specific Entry</h4>
                      <p className="text-[#333F3C] text-sm mb-4">
                        Remove individual memoir entries and their associated media files permanently.
                      </p>
                      <button
                        onClick={fetchEntries}
                        className="border-2 border-orange-500 text-orange-600 px-4 py-2 rounded-lg font-medium hover:bg-orange-50 transition-all duration-200"
                      >
                        Select Entry to Delete
                      </button>
                    </div>
                  </div>
                </div>

                {/* Clear All Data */}
                <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-red-800 mb-2">Clear All Data</h4>
                      <p className="text-red-700 text-sm mb-4">
                        Permanently delete all your memoir entries, media files, and account data. 
                        This action cannot be undone and will remove everything from our database and storage.
                      </p>
                      <button
                        onClick={() => setShowConfirmation('all')}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-all duration-200"
                      >
                        Clear All My Data
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Privacy Information */}
              <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Your Privacy Rights</h4>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• You have complete control over your data</li>
                  <li>• All deletions are permanent and immediate</li>
                  <li>• We never retain copies after deletion</li>
                  <li>• Your data is never shared with third parties</li>
                </ul>
              </div>
            </>
          )}

          {/* Entry Selection List */}
          {showEntryList && !showConfirmation && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-xl font-semibold text-[#333F3C]">Select Entry to Delete</h3>
                <button
                  onClick={() => setShowEntryList(false)}
                  className="text-[#333F3C] hover:text-[#004838]"
                >
                  ← Back
                </button>
              </div>
              
              {entries.length === 0 ? (
                <p className="text-[#333F3C] text-center py-8">No entries found.</p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {entries.map((entry) => (
                    <div key={entry.id} className="border border-[#EBEDE8] rounded-lg p-4 hover:bg-[#EBEDE8] transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-[#333F3C] mb-1">{entry.title}</h4>
                          <p className="text-[#333F3C] text-sm opacity-75 mb-2">
                            {new Date(entry.createdAt).toLocaleDateString()}
                          </p>
                          {entry.description && (
                            <p className="text-[#333F3C] text-sm line-clamp-2">
                              {entry.description.substring(0, 100)}...
                            </p>
                          )}
                          {entry.media && entry.media.length > 0 && (
                            <p className="text-[#333F3C] text-xs mt-2">
                              📎 {entry.media.length} media file(s)
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            setSelectedEntryId(entry.id);
                            setShowConfirmation('specific');
                          }}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Confirmation Dialog */}
          {showConfirmation && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="font-semibold text-red-800 mb-4">
                {showConfirmation === 'all' ? 'Confirm Complete Data Deletion' : 'Confirm Entry Deletion'}
              </h3>
              
              <div className="mb-4 p-3 bg-red-100 rounded border-l-4 border-red-500">
                <p className="text-red-800 text-sm font-medium">
                  ⚠️ This action is permanent and cannot be undone!
                </p>
              </div>

              <p className="text-red-700 mb-4">
                {showConfirmation === 'all' 
                  ? 'This will permanently delete ALL your memoir entries, media files, and account data from our database and storage systems.'
                  : 'This will permanently delete the selected entry and all its associated media files from our database and storage systems.'
                }
              </p>

              <div className="mb-4">
                <label className="block text-red-800 text-sm font-medium mb-2">
                  Type "{showConfirmation === 'all' ? 'DELETE ALL MY DATA' : 'DELETE THIS ENTRY'}" to confirm:
                </label>
                <input
                  type="text"
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  className="w-full p-2 border border-red-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder={showConfirmation === 'all' ? 'DELETE ALL MY DATA' : 'DELETE THIS ENTRY'}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowConfirmation(null);
                    setConfirmationText('');
                    setSelectedEntryId(null);
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (showConfirmation === 'all') {
                      handleClearAllData();
                    } else if (selectedEntryId) {
                      handleDeleteEntry(selectedEntryId);
                    }
                  }}
                  disabled={isDeleting}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-all duration-200 disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Permanently'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Report Issue Modal */}
      {showReportIssue && (
        <ReportIssue onClose={() => setShowReportIssue(false)} />
      )}
    </div>
  );
}