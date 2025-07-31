"use client";

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import EntryVisibilityManager from './EntryVisibilityManager';
import EntrySelectionPopup from './EntrySelectionPopup';

interface PublicProfileSettingsProps {
    profile: {
        id: string;
        userId: string;
        username: string;
        fullName: string;
        bio: string | null;
        profilePicture: string | null;
        isJourneyPublic: boolean;
        allowSpecificEntries: boolean;
        isActive: boolean;
    };
    onClose: () => void;
    onProfileUpdate: (updatedProfile: any) => void;
}

export default function PublicProfileSettings({ profile, onClose, onProfileUpdate }: PublicProfileSettingsProps) {
    const { user } = useUser();
    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(false);
    const [showEntryManager, setShowEntryManager] = useState(false);
    const [showEntrySelection, setShowEntrySelection] = useState(false);
    const [pendingJourneyPublic, setPendingJourneyPublic] = useState(false);
    const [formData, setFormData] = useState({
        fullName: profile.fullName || '',
        bio: profile.bio || '',
        isJourneyPublic: profile.isJourneyPublic || false,
        allowSpecificEntries: profile.allowSpecificEntries || false,
        isActive: profile.isActive || false,
    });

    const handleSave = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/public/update-profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const updatedProfile = await response.json();
                onProfileUpdate(updatedProfile);
                onClose();
            } else {
                alert('Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProfile = async () => {
        if (!confirm('Are you sure you want to delete your public profile? This action cannot be undone.')) {
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/public/delete-profile', {
                method: 'DELETE',
            });

            if (response.ok) {
                window.location.href = '/dashboard';
            } else {
                alert('Failed to delete profile');
            }
        } catch (error) {
            console.error('Error deleting profile:', error);
            alert('Error deleting profile');
        } finally {
            setLoading(false);
        }
    };

    const handleUnlinkProfile = async () => {
        if (!confirm('Are you sure you want to unlink your public profile? This will make it inactive but preserve your data.')) {
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/public/unlink-profile', {
                method: 'POST',
            });

            if (response.ok) {
                const updatedProfile = await response.json();
                onProfileUpdate(updatedProfile);
                onClose();
            } else {
                alert('Failed to unlink profile');
            }
        } catch (error) {
            console.error('Error unlinking profile:', error);
            alert('Error unlinking profile');
        } finally {
            setLoading(false);
        }
    };

    const handleJourneyPublicToggle = async (enabled: boolean) => {
        if (enabled && !formData.isJourneyPublic) {
            // User is enabling "Make All Entries Public" - make ALL entries public automatically
            if (!confirm('This will make ALL your memoir entries visible on your public profile. Are you sure?')) {
                return;
            }

            setLoading(true);
            try {
                // Get all entries first
                const response = await fetch('/api/entries/visibility');
                if (!response.ok) {
                    throw new Error('Failed to fetch entries');
                }

                const data = await response.json();
                const allEntryIds = data.entries.map((entry: any) => entry.id);

                if (allEntryIds.length > 0) {
                    // Make all entries public
                    const bulkResponse = await fetch('/api/entries/bulk-visibility', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            entryIds: allEntryIds,
                            isPublic: true,
                        }),
                    });

                    if (!bulkResponse.ok) {
                        throw new Error('Failed to update entry visibility');
                    }

                    alert(`Successfully made ${allEntryIds.length} entries public`);
                }

                // Update the form data and disable specific entry control since they are mutually exclusive
                setFormData({ ...formData, isJourneyPublic: true, allowSpecificEntries: false });

            } catch (error) {
                console.error('Error making entries public:', error);
                alert('Error updating entry visibility');
            } finally {
                setLoading(false);
            }
        } else {
            // User is disabling or it's already enabled - just update the form
            setFormData({ ...formData, isJourneyPublic: enabled });
        }
    };

    const handleSpecificEntryControlToggle = async (enabled: boolean) => {
        if (enabled && !formData.allowSpecificEntries) {
            // User is enabling "Allow Specific Entry Control" - show entry selection popup
            // Also disable "Make All Entries Public" since they are mutually exclusive
            setFormData({ ...formData, isJourneyPublic: false });
            
            // Clear all existing entry visibility settings first
            await clearAllEntryVisibility();
            
            setShowEntrySelection(true);
        } else {
            // User is disabling or it's already enabled - just update the form
            setFormData({ ...formData, allowSpecificEntries: enabled });
        }
    };

    const clearAllEntryVisibility = async () => {
        try {
            // Get all entries first
            const response = await fetch('/api/entries/visibility');
            if (!response.ok) {
                throw new Error('Failed to fetch entries');
            }

            const data = await response.json();
            const allEntryIds = data.entries.map((entry: any) => entry.id);

            if (allEntryIds.length > 0) {
                // Make all entries private to clear the state
                await fetch('/api/entries/bulk-visibility', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        entryIds: allEntryIds,
                        isPublic: false,
                    }),
                });
            }
        } catch (error) {
            console.error('Error clearing entry visibility:', error);
        }
    };

    const handleEntrySelectionConfirm = async (selectedEntryIds: string[]) => {
        setShowEntrySelection(false);
        setLoading(true);

        try {
            // Make selected entries public
            if (selectedEntryIds.length > 0) {
                const response = await fetch('/api/entries/bulk-visibility', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        entryIds: selectedEntryIds,
                        isPublic: true,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to update entry visibility');
                }

                alert(`Successfully made ${selectedEntryIds.length} entries public`);
            }

            // Update the "Allow Specific Entry Control" setting
            setFormData({ ...formData, allowSpecificEntries: true });

        } catch (error) {
            console.error('Error updating entries:', error);
            alert('Error updating entry visibility');
        } finally {
            setLoading(false);
        }
    };

    const handleEntrySelectionCancel = () => {
        setShowEntrySelection(false);
        setPendingJourneyPublic(false);
        // Keep the toggle in its original state
    };

    const handleMakeAllPrivate = async () => {
        if (!confirm('Are you sure you want to make all entries private? This will hide them from your public profile.')) {
            return;
        }

        setLoading(true);
        try {
            // Get all entries first
            const response = await fetch('/api/entries/visibility');
            if (!response.ok) {
                throw new Error('Failed to fetch entries');
            }

            const data = await response.json();
            const allEntryIds = data.entries.map((entry: any) => entry.id);

            if (allEntryIds.length > 0) {
                // Make all entries private
                const bulkResponse = await fetch('/api/entries/bulk-visibility', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        entryIds: allEntryIds,
                        isPublic: false,
                    }),
                });

                if (!bulkResponse.ok) {
                    throw new Error('Failed to update entry visibility');
                }

                alert(`Successfully made ${allEntryIds.length} entries private`);
            } else {
                alert('No entries found to update');
            }

        } catch (error) {
            console.error('Error making entries private:', error);
            alert('Error updating entry visibility');
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'general', name: 'General', icon: '⚙️' },
        { id: 'privacy', name: 'Privacy', icon: '🔒' },
        { id: 'entries', name: 'Entry Control', icon: '📝' },
        { id: 'danger', name: 'Danger Zone', icon: '⚠️' },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#EBEDE8]">
                    <h2 className="font-serif text-2xl font-semibold text-[#333F3C]">
                        Public Profile Settings
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-[#333F3C] hover:text-[#004838] text-2xl"
                    >
                        ×
                    </button>
                </div>

                <div className="flex h-[calc(90vh-120px)]">
                    {/* Sidebar */}
                    <div className="w-64 bg-[#FEFEFE] border-r border-[#EBEDE8] p-4">
                        <nav className="space-y-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === tab.id
                                        ? 'bg-[#004838] text-[#E2FB6C]'
                                        : 'text-[#333F3C] hover:bg-[#EBEDE8]'
                                        }`}
                                >
                                    <span className="text-lg">{tab.icon}</span>
                                    <span className="font-medium">{tab.name}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6 overflow-y-auto">
                        {activeTab === 'general' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-serif text-xl font-semibold text-[#333F3C] mb-4">
                                        General Settings
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[#333F3C] mb-2">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.fullName}
                                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                className="w-full px-4 py-2 border border-[#EBEDE8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004838]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-[#333F3C] mb-2">
                                                Bio
                                            </label>
                                            <textarea
                                                value={formData.bio}
                                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                                rows={4}
                                                className="w-full px-4 py-2 border border-[#EBEDE8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004838]"
                                                placeholder="Tell people about yourself..."
                                            />
                                        </div>

                                        <div className="bg-[#FEFEFE] p-4 rounded-lg border border-[#EBEDE8]">
                                            <h4 className="font-medium text-[#333F3C] mb-2">Profile Information</h4>
                                            <div className="text-sm text-[#333F3C] opacity-75 space-y-1">
                                                <p><strong>Username:</strong> @{profile.username}</p>
                                                <p><strong>Profile ID:</strong> {profile.id}</p>
                                                <p><strong>Status:</strong> {profile.isActive ? 'Active' : 'Inactive'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'privacy' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-serif text-xl font-semibold text-[#333F3C] mb-4">
                                        Privacy Settings
                                    </h3>

                                    <div className="space-y-6">
                                        <div className="bg-[#FEFEFE] p-4 rounded-lg border border-[#EBEDE8]">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-[#333F3C] mb-2">
                                                        Make All Entries Public
                                                    </h4>
                                                    <p className="text-sm text-[#333F3C] opacity-75">
                                                        When enabled, all your memoir entries will be visible on your public profile.
                                                    </p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer ml-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.isJourneyPublic}
                                                        onChange={(e) => handleJourneyPublicToggle(e.target.checked)}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#004838]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#004838]"></div>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="bg-[#FEFEFE] p-4 rounded-lg border border-[#EBEDE8]">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-[#333F3C] mb-2">
                                                        Allow Specific Entry Control
                                                    </h4>
                                                    <p className="text-sm text-[#333F3C] opacity-75">
                                                        Allow individual control over which entries are public or private.
                                                    </p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer ml-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.allowSpecificEntries}
                                                        onChange={(e) => handleSpecificEntryControlToggle(e.target.checked)}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#004838]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#004838]"></div>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                            <h4 className="font-medium text-blue-900 mb-2">💡 Privacy Tips</h4>
                                            <ul className="text-sm text-blue-800 space-y-1">
                                                <li>• You can always change these settings later</li>
                                                <li>• Individual entry visibility overrides global settings</li>
                                                <li>• Only you can see private entries in your dashboard</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'entries' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-serif text-xl font-semibold text-[#333F3C] mb-4">
                                        Entry Control
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="bg-[#FEFEFE] p-4 rounded-lg border border-[#EBEDE8]">
                                            <h4 className="font-medium text-[#333F3C] mb-3">Quick Actions</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <button
                                                    onClick={async () => {
                                                        if (!confirm('This will make ALL your memoir entries visible on your public profile. Are you sure?')) {
                                                            return;
                                                        }

                                                        setLoading(true);
                                                        try {
                                                            // Get all entries first
                                                            const response = await fetch('/api/entries/visibility');
                                                            if (!response.ok) {
                                                                throw new Error('Failed to fetch entries');
                                                            }

                                                            const data = await response.json();
                                                            const allEntryIds = data.entries.map((entry: any) => entry.id);

                                                            if (allEntryIds.length > 0) {
                                                                // Make all entries public
                                                                const bulkResponse = await fetch('/api/entries/bulk-visibility', {
                                                                    method: 'PUT',
                                                                    headers: {
                                                                        'Content-Type': 'application/json',
                                                                    },
                                                                    body: JSON.stringify({
                                                                        entryIds: allEntryIds,
                                                                        isPublic: true,
                                                                    }),
                                                                });

                                                                if (!bulkResponse.ok) {
                                                                    throw new Error('Failed to update entry visibility');
                                                                }

                                                                alert(`Successfully made ${allEntryIds.length} entries public`);
                                                            } else {
                                                                alert('No entries found to update');
                                                            }

                                                        } catch (error) {
                                                            console.error('Error making entries public:', error);
                                                            alert('Error updating entry visibility');
                                                        } finally {
                                                            setLoading(false);
                                                        }
                                                    }}
                                                    disabled={loading}
                                                    className="flex items-center gap-3 p-3 border border-[#EBEDE8] rounded-lg hover:bg-[#FEFEFE] transition-colors disabled:opacity-50"
                                                >
                                                    <span className="text-lg">👁️</span>
                                                    <div className="text-left">
                                                        <div className="font-medium text-[#333F3C]">Make All Public</div>
                                                        <div className="text-xs text-[#333F3C] opacity-75">Show all entries</div>
                                                    </div>
                                                </button>

                                                <button
                                                    onClick={handleMakeAllPrivate}
                                                    className="flex items-center gap-3 p-3 border border-[#EBEDE8] rounded-lg hover:bg-[#FEFEFE] transition-colors"
                                                >
                                                    <span className="text-lg">🔒</span>
                                                    <div className="text-left">
                                                        <div className="font-medium text-[#333F3C]">Make All Private</div>
                                                        <div className="text-xs text-[#333F3C] opacity-75">Hide all entries</div>
                                                    </div>
                                                </button>

                                                <button
                                                    onClick={() => setShowEntryManager(true)}
                                                    className="flex items-center gap-3 p-3 border border-[#EBEDE8] rounded-lg hover:bg-[#FEFEFE] transition-colors"
                                                >
                                                    <span className="text-lg">📝</span>
                                                    <div className="text-left">
                                                        <div className="font-medium text-[#333F3C]">Manage Individual</div>
                                                        <div className="text-xs text-[#333F3C] opacity-75">Control per entry</div>
                                                    </div>
                                                </button>

                                                <button className="flex items-center gap-3 p-3 border border-[#EBEDE8] rounded-lg hover:bg-[#FEFEFE] transition-colors">
                                                    <span className="text-lg">📊</span>
                                                    <div className="text-left">
                                                        <div className="font-medium text-[#333F3C]">View Analytics</div>
                                                        <div className="text-xs text-[#333F3C] opacity-75">Entry performance</div>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                            <h4 className="font-medium text-yellow-900 mb-2">⚡ Coming Soon</h4>
                                            <p className="text-sm text-yellow-800">
                                                Advanced entry management features including bulk operations,
                                                scheduled publishing, and detailed analytics are coming soon.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'danger' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-serif text-xl font-semibold text-red-600 mb-4">
                                        Danger Zone
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-4">
                                            <h4 className="font-medium text-yellow-900 mb-3">Data Maintenance</h4>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-medium text-yellow-900">Fix Profile Counts</div>
                                                    <div className="text-sm text-yellow-700">
                                                        Recalculate follower, following, and entry counts if they appear incorrect
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={async () => {
                                                        setLoading(true);
                                                        try {
                                                            const response = await fetch('/api/public/fix-counts', {
                                                                method: 'POST',
                                                            });
                                                            
                                                            if (response.ok) {
                                                                const data = await response.json();
                                                                alert(`Counts fixed successfully! ${data.results.fixedProfiles} profiles updated.`);
                                                                // Refresh the page to show updated counts
                                                                window.location.reload();
                                                            } else {
                                                                alert('Failed to fix counts');
                                                            }
                                                        } catch (error) {
                                                            console.error('Error fixing counts:', error);
                                                            alert('Error fixing counts');
                                                        } finally {
                                                            setLoading(false);
                                                        }
                                                    }}
                                                    disabled={loading}
                                                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 transition-colors"
                                                >
                                                    Fix Counts
                                                </button>
                                            </div>
                                        </div>

                                        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                            <h4 className="font-medium text-red-900 mb-3">Profile Actions</h4>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <div className="font-medium text-red-900">Unlink Public Profile</div>
                                                        <div className="text-sm text-red-700">
                                                            Make your profile inactive but preserve data
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={handleUnlinkProfile}
                                                        disabled={loading}
                                                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors"
                                                    >
                                                        Unlink
                                                    </button>
                                                </div>

                                                <div className="border-t border-red-200 pt-3">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <div className="font-medium text-red-900">Delete Public Profile</div>
                                                            <div className="text-sm text-red-700">
                                                                Permanently delete your public profile and all associated data
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={handleDeleteProfile}
                                                            disabled={loading}
                                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <h4 className="font-medium text-gray-900 mb-2">⚠️ Important Notes</h4>
                                            <ul className="text-sm text-gray-700 space-y-1">
                                                <li>• Unlinking makes your profile inactive but preserves data</li>
                                                <li>• Deletion permanently removes all public profile data</li>
                                                <li>• Your private memoir entries are never affected</li>
                                                <li>• These actions cannot be undone</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-[#EBEDE8] bg-[#FEFEFE]">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 border border-[#EBEDE8] text-[#333F3C] rounded-lg hover:bg-[#EBEDE8] transition-colors"
                    >
                        Cancel
                    </button>

                    {activeTab !== 'danger' && (
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="px-6 py-2 bg-[#004838] text-[#E2FB6C] rounded-lg hover:bg-[#073127] disabled:opacity-50 transition-colors"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    )}
                </div>
            </div>

            {/* Entry Visibility Manager Modal */}
            {showEntryManager && (
                <EntryVisibilityManager
                    onClose={() => setShowEntryManager(false)}
                />
            )}

            {/* Entry Selection Popup */}
            {showEntrySelection && (
                <EntrySelectionPopup
                    onClose={handleEntrySelectionCancel}
                    onConfirm={handleEntrySelectionConfirm}
                    title="Select Specific Entries to Make Public"
                    description="Choose which memoir entries you want to make visible on your public profile with individual control."
                    confirmButtonText="Make Selected Public"
                    confirmButtonColor="bg-green-600"
                />
            )}
        </div>
    );
}