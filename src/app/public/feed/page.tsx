"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import PublicProfileSidebar from '@/components/PublicProfileSidebar';

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
        <div className="min-h-screen bg-[#FEFEFE]">
            {/* Sidebar */}
            <PublicProfileSidebar 
                isOwnProfile={true}
                onSettingsClick={() => {}}
            />

            {/* Main Content */}
            <div className="lg:ml-64">
                {/* Header */}
                <header className="bg-white border-b border-[#EBEDE8] sticky top-0 z-10">
                    <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                        <div>
                            <h1 className="font-serif text-xl font-semibold text-[#333F3C]">
                                Your Feed
                            </h1>
                            <p className="text-sm text-[#333F3C] opacity-75">
                                Latest entries from people you follow
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <Link
                                href="/public/discover"
                                className="px-4 py-2 border border-[#004838] text-[#004838] rounded-lg font-medium hover:bg-[#004838] hover:text-[#E2FB6C] transition-colors"
                            >
                                🔍 Discover
                            </Link>
                            <Link
                                href="/dashboard"
                                className="px-4 py-2 bg-[#004838] text-[#E2FB6C] rounded-lg font-medium hover:bg-[#073127] transition-colors"
                            >
                                Private Space
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Feed Content */}
                <div className="max-w-4xl mx-auto px-4 py-8">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="text-4xl mb-4">⏳</div>
                            <p className="text-[#333F3C] opacity-75">Loading your feed...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12 bg-white rounded-xl border border-[#EBEDE8]">
                            <div className="text-6xl mb-4">📭</div>
                            <h3 className="font-serif text-xl font-semibold text-[#333F3C] mb-2">
                                Your feed is empty
                            </h3>
                            <p className="text-[#333F3C] opacity-75 mb-6">
                                {error}
                            </p>
                            <Link
                                href="/public/discover"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-[#004838] text-[#E2FB6C] rounded-lg font-medium hover:bg-[#073127] transition-colors"
                            >
                                <span>🔍</span>
                                Discover People to Follow
                            </Link>
                        </div>
                    ) : entries.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl border border-[#EBEDE8]">
                            <div className="text-6xl mb-4">📖</div>
                            <h3 className="font-serif text-xl font-semibold text-[#333F3C] mb-2">
                                No entries yet
                            </h3>
                            <p className="text-[#333F3C] opacity-75 mb-6">
                                The people you follow haven't shared any public entries yet.
                            </p>
                            <Link
                                href="/public/discover"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-[#004838] text-[#E2FB6C] rounded-lg font-medium hover:bg-[#073127] transition-colors"
                            >
                                <span>🔍</span>
                                Discover More People
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {entries.map((entry) => (
                                <div key={entry.id} className="bg-white rounded-xl border border-[#EBEDE8] p-6 hover:shadow-md transition-shadow">
                                    {/* Author Info */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <Link href={`/public/profile/${entry.profile.username}`}>
                                            <div className="w-10 h-10 rounded-full bg-[#EBEDE8] flex items-center justify-center overflow-hidden">
                                                {entry.profile.profilePicture ? (
                                                    <img
                                                        src={entry.profile.profilePicture}
                                                        alt={entry.profile.fullName}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-lg text-[#333F3C]">👤</span>
                                                )}
                                            </div>
                                        </Link>
                                        <div className="flex-1">
                                            <Link 
                                                href={`/public/profile/${entry.profile.username}`}
                                                className="font-medium text-[#333F3C] hover:text-[#004838] transition-colors"
                                            >
                                                {entry.profile.fullName}
                                            </Link>
                                            <p className="text-sm text-[#333F3C] opacity-75">
                                                @{entry.profile.username} • {formatTimeAgo(entry.createdAt)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Entry Content */}
                                    <div className="mb-4">
                                        <h3 className="font-serif text-xl font-semibold text-[#333F3C] mb-2">
                                            {entry.title}
                                        </h3>
                                        {entry.description && (
                                            <p className="text-[#333F3C] leading-relaxed">
                                                {entry.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Media Preview */}
                                    {entry.media.length > 0 && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                                            {entry.media.slice(0, 3).map((mediaItem) => (
                                                <div key={mediaItem.id} className="relative bg-[#EBEDE8] rounded-lg overflow-hidden">
                                                    {mediaItem.fileType === 'image' && (
                                                        <img
                                                            src={mediaItem.publicUrl}
                                                            alt={mediaItem.originalName}
                                                            className="w-full h-48 object-cover"
                                                        />
                                                    )}

                                                    {mediaItem.fileType === 'video' && (
                                                        <div className="relative">
                                                            <video
                                                                src={mediaItem.publicUrl}
                                                                className="w-full h-48 object-cover"
                                                                controls={false}
                                                                preload="metadata"
                                                            />
                                                            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                                                                <span className="text-white text-4xl">▶️</span>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {mediaItem.fileType === 'audio' && (
                                                        <div className="p-6 text-center h-48 flex flex-col justify-center">
                                                            <div className="text-4xl mb-4">🎵</div>
                                                            <p className="text-sm font-medium text-[#333F3C] truncate">
                                                                {mediaItem.originalName}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {/* View Only Overlay */}
                                                    <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                                                        View Only
                                                    </div>
                                                </div>
                                            ))}

                                            {entry.media.length > 3 && (
                                                <div className="bg-[#EBEDE8] rounded-lg h-48 flex items-center justify-center">
                                                    <span className="text-[#333F3C] font-medium">
                                                        +{entry.media.length - 3} more files
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Entry Actions */}
                                    <div className="flex items-center justify-between pt-4 border-t border-[#EBEDE8]">
                                        <div className="flex items-center gap-4 text-sm text-[#333F3C] opacity-75">
                                            <span>{formatDate(entry.createdAt)}</span>
                                            {entry.media.length > 0 && (
                                                <span>{entry.media.length} media files</span>
                                            )}
                                        </div>
                                        <Link
                                            href={`/public/profile/${entry.profile.username}`}
                                            className="text-sm text-[#004838] hover:text-[#073127] font-medium transition-colors"
                                        >
                                            View Profile →
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}