"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import PublicProfileSidebar from '@/components/PublicProfileSidebar';
import MediaViewer from '@/components/MediaViewer';

interface FeedEntry {
    id: string;
    title: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
    profile: {
        id: string;
        username: string;
        fullName: string;
        profilePicture: string | null;
    };
    media: Array<{
        id: string;
        fileName: string;
        originalName: string;
        fileType: string;
        mimeType: string;
        fileSize: number;
        publicUrl: string;
        createdAt: string;
    }>;
}

export default function FeedPage() {
    const { user } = useUser();
    const [entries, setEntries] = useState<FeedEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showMediaViewer, setShowMediaViewer] = useState(false);
    const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
    const [selectedEntryMedia, setSelectedEntryMedia] = useState<any[]>([]);

    useEffect(() => {
        if (user) {
            fetchFeed();
        }
    }, [user]);

    const fetchFeed = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/public/feed');
            
            if (response.ok) {
                const data = await response.json();
                setEntries(data.entries || []);
                if (data.message) {
                    setError(data.message);
                }
            } else {
                setError('Failed to load feed');
            }
        } catch (error) {
            console.error('Error fetching feed:', error);
            setError('Error loading feed');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTimeAgo = (dateString: string) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours}h ago`;
        if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
        return formatDate(dateString);
    };

    const handleMediaClick = (entryMedia: any[], mediaIndex: number) => {
        setSelectedEntryMedia(entryMedia);
        setSelectedMediaIndex(mediaIndex);
        setShowMediaViewer(true);
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-[#FEFEFE] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="font-serif text-2xl font-semibold text-[#333F3C] mb-4">
                        Sign in to view your feed
                    </h1>
                    <Link
                        href="/sign-in"
                        className="px-6 py-3 bg-[#004838] text-[#E2FB6C] rounded-lg font-medium hover:bg-[#073127] transition-colors"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FAFBFC] via-white to-[#F8F9FA]">
            {/* Sidebar */}
            <PublicProfileSidebar 
                isOwnProfile={true}
                onSettingsClick={() => {}}
            />

            {/* Main Content */}
            <div className="lg:ml-64">
                {/* Modern Header */}
                <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-sm">
                    <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-sm flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                    </svg>
                                </div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                            </div>
                            <div>
                                <h1 className="font-serif text-xl font-bold text-[#1A1D29] tracking-tight">
                                    Your Feed
                                </h1>
                                <p className="text-xs text-[#6B7280] font-medium">
                                    Latest entries from people you follow
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="hidden md:flex items-center space-x-2">
                                <Link
                                    href="/public/discover"
                                    className="group relative p-3 text-[#6B7280] hover:text-[#004838] hover:bg-[#004838]/5 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#004838]/20"
                                    title="Discover People"
                                >
                                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </Link>
                            </div>
                            
                            <div className="w-px h-8 bg-[#E5E7EB] hidden md:block"></div>
                            
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#004838] to-[#073127] text-[#E2FB6C] rounded-2xl font-bold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#004838]/30"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Private Space
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Modern Feed Content */}
                <div className="max-w-4xl mx-auto px-6 py-12">
                    {loading ? (
                        <div className="relative bg-white/60 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl p-12 text-center overflow-hidden">
                            <div className="absolute inset-0 opacity-5">
                                <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500 rounded-full -translate-x-16 -translate-y-16"></div>
                                <div className="absolute bottom-0 right-0 w-24 h-24 bg-purple-500 rounded-full translate-x-12 translate-y-12"></div>
                            </div>
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </div>
                                <p className="text-[#6B7280] text-lg font-medium">Loading your feed...</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="relative bg-white/60 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl p-12 text-center overflow-hidden">
                            <div className="absolute inset-0 opacity-5">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500 rounded-full translate-x-16 -translate-y-16"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-red-500 rounded-full -translate-x-12 translate-y-12"></div>
                            </div>
                            <div className="relative z-10">
                                <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                    <span className="text-4xl">📭</span>
                                </div>
                                <h3 className="font-serif text-2xl font-bold text-[#1A1D29] mb-4">
                                    Your feed is empty
                                </h3>
                                <p className="text-[#6B7280] text-lg max-w-md mx-auto leading-relaxed mb-8">
                                    {error}
                                </p>
                                <Link
                                    href="/public/discover"
                                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#004838] to-[#073127] text-[#E2FB6C] rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#004838]/30"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    Discover People to Follow
                                </Link>
                            </div>
                        </div>
                    ) : entries.length === 0 ? (
                        <div className="relative bg-white/60 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl p-12 text-center overflow-hidden">
                            <div className="absolute inset-0 opacity-5">
                                <div className="absolute top-0 left-0 w-32 h-32 bg-green-500 rounded-full -translate-x-16 -translate-y-16"></div>
                                <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-500 rounded-full translate-x-12 translate-y-12"></div>
                            </div>
                            <div className="relative z-10">
                                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                    <span className="text-4xl">📖</span>
                                </div>
                                <h3 className="font-serif text-2xl font-bold text-[#1A1D29] mb-4">
                                    No entries yet
                                </h3>
                                <p className="text-[#6B7280] text-lg max-w-md mx-auto leading-relaxed mb-8">
                                    The people you follow haven't shared any public entries yet.
                                </p>
                                <Link
                                    href="/public/discover"
                                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#004838] to-[#073127] text-[#E2FB6C] rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#004838]/30"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    Discover More People
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {entries.map((entry, index) => (
                                <div key={entry.id} className="group relative bg-white/60 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-1">
                                    {/* Background Pattern */}
                                    <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <div className={`absolute top-0 ${index % 2 === 0 ? 'left-0' : 'right-0'} w-32 h-32 bg-[#004838] rounded-full ${index % 2 === 0 ? '-translate-x-16' : 'translate-x-16'} -translate-y-16`}></div>
                                        <div className={`absolute bottom-0 ${index % 2 === 0 ? 'right-0' : 'left-0'} w-24 h-24 bg-[#E2FB6C] rounded-full ${index % 2 === 0 ? 'translate-x-12' : '-translate-x-12'} translate-y-12`}></div>
                                    </div>
                                    
                                    <div className="relative z-10 p-8">
                                        {/* Modern Author Info */}
                                        <div className="flex items-center gap-4 mb-6">
                                            <Link href={`/public/profile/${entry.profile.username}`} className="group/avatar">
                                                <div className="relative">
                                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#EBEDE8] to-[#F8F9FA] flex items-center justify-center overflow-hidden shadow-lg ring-2 ring-white group-hover/avatar:scale-110 transition-transform duration-300">
                                                        {entry.profile.profilePicture ? (
                                                            <img
                                                                src={entry.profile.profilePicture}
                                                                alt={entry.profile.fullName}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <span className="text-2xl text-[#6B7280]">👤</span>
                                                        )}
                                                    </div>
                                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-xl border-2 border-white"></div>
                                                </div>
                                            </Link>
                                            <div className="flex-1">
                                                <Link 
                                                    href={`/public/profile/${entry.profile.username}`}
                                                    className="font-bold text-[#1A1D29] text-lg hover:text-[#004838] transition-colors"
                                                >
                                                    {entry.profile.fullName}
                                                </Link>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[#6B7280] font-medium">@{entry.profile.username}</span>
                                                    <div className="w-1 h-1 bg-[#6B7280] rounded-full"></div>
                                                    <span className="text-[#6B7280] text-sm">{formatTimeAgo(entry.createdAt)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Modern Entry Content */}
                                        <div className="mb-6">
                                            <h3 className="font-serif text-2xl font-bold text-[#1A1D29] mb-4 group-hover:text-[#004838] transition-colors">
                                                {entry.title}
                                            </h3>
                                            {entry.description && (
                                                <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                                                    <p className="text-[#1A1D29] text-lg leading-relaxed font-medium">
                                                        {entry.description}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Modern Media Gallery */}
                                        {entry.media.length > 0 && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                                                {entry.media.slice(0, 3).map((mediaItem, mediaIndex) => (
                                                    <button
                                                        key={mediaItem.id}
                                                        onClick={() => handleMediaClick(entry.media, mediaIndex)}
                                                        className="group/media relative bg-white/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/30 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#004838]/30 w-full text-left"
                                                    >
                                                        {mediaItem.fileType === 'image' && (
                                                            <div className="relative">
                                                                <img
                                                                    src={mediaItem.publicUrl}
                                                                    alt={mediaItem.originalName}
                                                                    className="w-full h-56 object-cover group-hover/media:scale-105 transition-transform duration-500"
                                                                />
                                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/media:opacity-100 transition-opacity"></div>
                                                                {/* Click to view overlay */}
                                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/media:opacity-100 transition-opacity">
                                                                    <div className="w-16 h-16 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center">
                                                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                        </svg>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {mediaItem.fileType === 'video' && (
                                                            <div className="relative">
                                                                <video
                                                                    src={mediaItem.publicUrl}
                                                                    className="w-full h-56 object-cover"
                                                                    controls={false}
                                                                    preload="metadata"
                                                                />
                                                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover/media:bg-black/40 transition-colors">
                                                                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover/media:scale-110 transition-transform">
                                                                        <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                                                            <path d="M8 5v14l11-7z"/>
                                                                        </svg>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {mediaItem.fileType === 'audio' && (
                                                            <div className="p-6 text-center h-56 flex flex-col justify-center bg-gradient-to-br from-purple-50 to-blue-50">
                                                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover/media:scale-110 transition-transform">
                                                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                                                    </svg>
                                                                </div>
                                                                <p className="text-sm font-bold text-[#1A1D29] truncate mb-2">
                                                                    {mediaItem.originalName}
                                                                </p>
                                                                <p className="text-xs text-[#6B7280] font-medium">
                                                                    Audio file (view only)
                                                                </p>
                                                            </div>
                                                        )}

                                                        {/* View Only Badge */}
                                                        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-xl font-medium">
                                                            View Only
                                                        </div>
                                                    </button>
                                                ))}

                                                {entry.media.length > 3 && (
                                                    <div className="bg-white/40 backdrop-blur-sm rounded-2xl h-56 flex flex-col items-center justify-center border border-white/30 group-hover:bg-white/50 transition-colors">
                                                        <div className="w-16 h-16 bg-gradient-to-br from-[#004838] to-[#073127] rounded-2xl flex items-center justify-center mb-4">
                                                            <span className="text-[#E2FB6C] font-bold text-lg">+{entry.media.length - 3}</span>
                                                        </div>
                                                        <p className="text-[#1A1D29] font-bold text-lg">More Files</p>
                                                        <p className="text-[#6B7280] text-sm">Click to view all</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Modern Entry Actions */}
                                        <div className="flex items-center justify-between pt-6 border-t border-white/20">
                                            <div className="flex items-center gap-4 text-sm text-[#6B7280]">
                                                <div className="flex items-center gap-2">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <span className="font-medium">{formatDate(entry.createdAt)}</span>
                                                </div>
                                                {entry.media.length > 0 && (
                                                    <div className="flex items-center gap-2 bg-white/40 backdrop-blur-sm rounded-xl px-3 py-1 border border-white/30">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                                        </svg>
                                                        <span className="font-medium">{entry.media.length} files</span>
                                                    </div>
                                                )}
                                            </div>
                                            <Link
                                                href={`/public/profile/${entry.profile.username}`}
                                                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#004838] to-[#073127] text-[#E2FB6C] rounded-xl font-bold text-sm hover:scale-105 transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-[#004838]/30"
                                            >
                                                View Profile
                                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Media Viewer */}
            {showMediaViewer && (
                <MediaViewer
                    media={selectedEntryMedia}
                    initialIndex={selectedMediaIndex}
                    onClose={() => setShowMediaViewer(false)}
                />
            )}
        </div>
    );
}