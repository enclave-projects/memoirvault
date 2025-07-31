"use client";

import { useState, useEffect } from 'react';

interface Entry {
    id: string;
    title: string;
    description: string | null;
    createdAt: string;
    isPublic: boolean;
    mediaCount: number;
}

interface EntryVisibilityManagerProps {
    onClose: () => void;
}

export default function EntryVisibilityManager({ onClose }: EntryVisibilityManagerProps) {
    const [entries, setEntries] = useState<Entry[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'public' | 'private'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchEntries();
    }, []);

    const fetchEntries = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/entries/visibility');
            if (response.ok) {
                const data = await response.json();
                setEntries(data.entries || []);
            }
        } catch (error) {
            console.error('Error fetching entries:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleEntryVisibility = async (entryId: string, currentlyPublic: boolean) => {
        setUpdating(entryId);
        try {
            const response = await fetch('/api/entries/visibility', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    entryId,
                    isPublic: !currentlyPublic,
                }),
            });

            if (response.ok) {
                setEntries(prev => prev.map(entry => 
                    entry.id === entryId 
                        ? { ...entry, isPublic: !currentlyPublic }
                        : entry
                ));
            } else {
                alert('Failed to update entry visibility');
            }
        } catch (error) {
            console.error('Error updating entry visibility:', error);
            alert('Error updating entry visibility');
        } finally {
            setUpdating(null);
        }
    };

    const bulkUpdateVisibility = async (makePublic: boolean) => {
        const filteredEntries = getFilteredEntries();
        const entriesToUpdate = filteredEntries.filter(entry => entry.isPublic !== makePublic);
        
        if (entriesToUpdate.length === 0) {
            alert(`All visible entries are already ${makePublic ? 'public' : 'private'}`);
            return;
        }

        if (!confirm(`Make ${entriesToUpdate.length} entries ${makePublic ? 'public' : 'private'}?`)) {
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/entries/bulk-visibility', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    entryIds: entriesToUpdate.map(e => e.id),
                    isPublic: makePublic,
                }),
            });

            if (response.ok) {
                setEntries(prev => prev.map(entry => 
                    entriesToUpdate.some(e => e.id === entry.id)
                        ? { ...entry, isPublic: makePublic }
                        : entry
                ));
            } else {
                alert('Failed to update entries');
            }
        } catch (error) {
            console.error('Error bulk updating entries:', error);
            alert('Error updating entries');
        } finally {
            setLoading(false);
        }
    };

    const getFilteredEntries = () => {
        return entries.filter(entry => {
            const matchesFilter = filter === 'all' || 
                (filter === 'public' && entry.isPublic) || 
                (filter === 'private' && !entry.isPublic);
            
            const matchesSearch = searchTerm === '' || 
                entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (entry.description && entry.description.toLowerCase().includes(searchTerm.toLowerCase()));
            
            return matchesFilter && matchesSearch;
        });
    };

    const filteredEntries = getFilteredEntries();
    const publicCount = entries.filter(e => e.isPublic).length;
    const privateCount = entries.length - publicCount;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#EBEDE8]">
                    <div>
                        <h2 className="font-serif text-2xl font-semibold text-[#333F3C]">
                            Entry Visibility Manager
                        </h2>
                        <p className="text-sm text-[#333F3C] opacity-75 mt-1">
                            Control which entries are visible on your public profile
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-[#333F3C] hover:text-[#004838] text-2xl"
                    >
                        ×
                    </button>
                </div>

                {/* Controls */}
                <div className="p-6 border-b border-[#EBEDE8] bg-[#FEFEFE]">
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                        {/* Stats */}
                        <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="text-[#333F3C]">{publicCount} Public</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                                <span className="text-[#333F3C]">{privateCount} Private</span>
                            </div>
                            <div className="text-[#333F3C] opacity-75">
                                Total: {entries.length} entries
                            </div>
                        </div>

                        {/* Search and Filter */}
                        <div className="flex items-center gap-4">
                            <input
                                type="text"
                                placeholder="Search entries..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="px-3 py-2 border border-[#EBEDE8] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#004838]"
                            />
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value as any)}
                                className="px-3 py-2 border border-[#EBEDE8] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#004838]"
                            >
                                <option value="all">All Entries</option>
                                <option value="public">Public Only</option>
                                <option value="private">Private Only</option>
                            </select>
                        </div>
                    </div>

                    {/* Bulk Actions */}
                    <div className="flex items-center gap-3 mt-4">
                        <span className="text-sm font-medium text-[#333F3C]">Bulk Actions:</span>
                        <button
                            onClick={() => bulkUpdateVisibility(true)}
                            disabled={loading}
                            className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                        >
                            Make All Public
                        </button>
                        <button
                            onClick={() => bulkUpdateVisibility(false)}
                            disabled={loading}
                            className="px-3 py-1 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
                        >
                            Make All Private
                        </button>
                        <span className="text-xs text-[#333F3C] opacity-75">
                            (Applies to {filteredEntries.length} visible entries)
                        </span>
                    </div>
                </div>

                {/* Entries List */}
                <div className="flex-1 overflow-y-auto max-h-[60vh]">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <div className="text-4xl mb-4">⏳</div>
                                <p className="text-[#333F3C] opacity-75">Loading entries...</p>
                            </div>
                        </div>
                    ) : filteredEntries.length === 0 ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <div className="text-4xl mb-4">📝</div>
                                <p className="text-[#333F3C] opacity-75">
                                    {searchTerm || filter !== 'all' 
                                        ? 'No entries match your filters' 
                                        : 'No entries found'
                                    }
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="divide-y divide-[#EBEDE8]">
                            {filteredEntries.map((entry) => (
                                <div key={entry.id} className="p-4 hover:bg-[#FEFEFE] transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-medium text-[#333F3C] truncate">
                                                    {entry.title}
                                                </h3>
                                                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    entry.isPublic 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {entry.isPublic ? 'Public' : 'Private'}
                                                </div>
                                            </div>
                                            
                                            {entry.description && (
                                                <p className="text-sm text-[#333F3C] opacity-75 mb-2 line-clamp-2">
                                                    {entry.description}
                                                </p>
                                            )}
                                            
                                            <div className="flex items-center gap-4 text-xs text-[#333F3C] opacity-75">
                                                <span>{formatDate(entry.createdAt)}</span>
                                                {entry.mediaCount > 0 && (
                                                    <span>{entry.mediaCount} media files</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 ml-4">
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={entry.isPublic}
                                                    onChange={() => toggleEntryVisibility(entry.id, entry.isPublic)}
                                                    disabled={updating === entry.id}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#004838]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#004838] peer-disabled:opacity-50"></div>
                                            </label>
                                            
                                            {updating === entry.id && (
                                                <div className="text-sm text-[#333F3C] opacity-75">
                                                    Updating...
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-[#EBEDE8] bg-[#FEFEFE]">
                    <div className="text-sm text-[#333F3C] opacity-75">
                        💡 Tip: Public entries appear on your profile and in followers' feeds
                    </div>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-[#004838] text-[#E2FB6C] rounded-lg hover:bg-[#073127] transition-colors"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}