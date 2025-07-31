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

interface EntrySelectionPopupProps {
    onClose: () => void;
    onConfirm: (selectedEntryIds: string[]) => void;
    title: string;
    description: string;
    confirmButtonText: string;
    confirmButtonColor?: string;
}

export default function EntrySelectionPopup({ 
    onClose, 
    onConfirm, 
    title, 
    description, 
    confirmButtonText,
    confirmButtonColor = 'bg-[#004838]'
}: EntrySelectionPopupProps) {
    const [entries, setEntries] = useState<Entry[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEntries, setSelectedEntries] = useState<Set<string>>(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const [selectAll, setSelectAll] = useState(false);

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

    const filteredEntries = entries.filter(entry => {
        const matchesSearch = searchTerm === '' || 
            entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (entry.description && entry.description.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesSearch;
    });

    const handleEntryToggle = (entryId: string) => {
        const newSelected = new Set(selectedEntries);
        if (newSelected.has(entryId)) {
            newSelected.delete(entryId);
        } else {
            newSelected.add(entryId);
        }
        setSelectedEntries(newSelected);
        
        // Update select all state
        setSelectAll(newSelected.size === filteredEntries.length);
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedEntries(new Set());
        } else {
            setSelectedEntries(new Set(filteredEntries.map(e => e.id)));
        }
        setSelectAll(!selectAll);
    };

    const handleConfirm = () => {
        onConfirm(Array.from(selectedEntries));
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#EBEDE8] bg-[#FEFEFE]">
                    <div>
                        <h2 className="font-serif text-xl font-semibold text-[#333F3C]">
                            {title}
                        </h2>
                        <p className="text-sm text-[#333F3C] opacity-75 mt-1">
                            {description}
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
                <div className="p-4 border-b border-[#EBEDE8] bg-[#FEFEFE]">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        {/* Search */}
                        <div className="flex-1 max-w-md">
                            <input
                                type="text"
                                placeholder="Search entries..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-3 py-2 border border-[#EBEDE8] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#004838]"
                            />
                        </div>

                        {/* Select All */}
                        <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectAll}
                                    onChange={handleSelectAll}
                                    className="w-4 h-4 text-[#004838] border-gray-300 rounded focus:ring-[#004838]"
                                />
                                <span className="text-sm font-medium text-[#333F3C]">
                                    Select All ({filteredEntries.length})
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Selection Summary */}
                    <div className="mt-3 flex items-center gap-4 text-sm text-[#333F3C] opacity-75">
                        <span>{selectedEntries.size} of {filteredEntries.length} entries selected</span>
                        {selectedEntries.size > 0 && (
                            <button
                                onClick={() => setSelectedEntries(new Set())}
                                className="text-[#004838] hover:text-[#073127] font-medium"
                            >
                                Clear Selection
                            </button>
                        )}
                    </div>
                </div>

                {/* Entries List */}
                <div className="flex-1 overflow-y-auto max-h-[50vh]">
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
                                    {searchTerm ? 'No entries match your search' : 'No entries found'}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="divide-y divide-[#EBEDE8]">
                            {filteredEntries.map((entry) => (
                                <div key={entry.id} className="p-4 hover:bg-[#FEFEFE] transition-colors">
                                    <div className="flex items-start gap-4">
                                        {/* Checkbox */}
                                        <label className="flex items-center cursor-pointer mt-1">
                                            <input
                                                type="checkbox"
                                                checked={selectedEntries.has(entry.id)}
                                                onChange={() => handleEntryToggle(entry.id)}
                                                className="w-4 h-4 text-[#004838] border-gray-300 rounded focus:ring-[#004838]"
                                            />
                                        </label>

                                        {/* Entry Info */}
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
                                                    {entry.isPublic ? 'Currently Public' : 'Currently Private'}
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
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-[#EBEDE8] bg-[#FEFEFE]">
                    <div className="text-sm text-[#333F3C] opacity-75">
                        💡 You can change individual entry visibility later in settings
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 border border-[#EBEDE8] text-[#333F3C] rounded-lg hover:bg-[#EBEDE8] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={selectedEntries.size === 0}
                            className={`px-6 py-2 ${confirmButtonColor} text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                        >
                            {confirmButtonText} ({selectedEntries.size})
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}