"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import PublicProfileSettings from '@/components/PublicProfileSettings';
import PublicProfileSidebar from '@/components/PublicProfileSidebar';

interface PublicProfileClientProps {
    profile: {
        id: string;
        userId: string;
        username: string;
        fullName: string;
        bio: string | null;
        profilePicture: string | null;
        isJourneyPublic: boolean;
        allowSpecificEntries: boolean;
        followersCount: number;
        followingCount: number;
        publicEntriesCount: number;
        isActive: boolean;
        createdAt: string;
        updatedAt: string;
    };
    entries: Array<{
        id: string;
        title: string;
        description: string | null;
        createdAt: string;
        updatedAt: string;
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
    }>;
}

export default function PublicProfileClient({ profile, entries }: PublicProfileClientProps) {
    const { user } = useUser();
    const [isFollowing, setIsFollowing] = useState(false);
    const [followersCount, setFollowersCount] = useState(profile.followersCount);
    const [switchingToPlatform, setSwitchingToPlatform] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [loadingFollowStatus, setLoadingFollowStatus] = useState(false);
    const [followActionLoading, setFollowActionLoading] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [currentProfile, setCurrentProfile] = useState(profile);

    const isOwnProfile = user?.id === profile.userId;

    // Check follow status on component mount
    useEffect(() => {
        if (user && user.id && profile.userId && user.id !== profile.userId) {
            console.log('Checking follow status for:', profile.userId);
            checkFollowStatus();
        }
    }, [user?.id, profile.userId]);

    const checkFollowStatus = async () => {
        try {
            console.log('Fetching follow status...');
            const response = await fetch(`/api/public/follow-status?targetUserId=${profile.userId}`);
            if (response.ok) {
                const data = await response.json();
                console.log('Follow status response:', data);
                setIsFollowing(data.isFollowing);
            } else {
                console.error('Follow status check failed:', response.status);
            }
        } catch (error) {
            console.error('Error checking follow status:', error);
        }
    };

    // Handle follow/unfollow
    const handleFollowToggle = async () => {
        if (!user) {
            alert('Please sign in to follow users');
            return;
        }

        try {
            const response = await fetch('/api/public/follow', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    targetUserId: profile.userId,
                    action: isFollowing ? 'unfollow' : 'follow',
                }),
            });

            if (response.ok) {
                setIsFollowing(!isFollowing);
                setFollowersCount(prev => isFollowing ? prev - 1 : prev + 1);
            }
        } catch (error) {
            console.error('Error toggling follow:', error);
        }
    };

    // Handle switch to private platform
    const handleSwitchToPlatform = () => {
        setSwitchingToPlatform(true);
        setCountdown(15);

        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    window.location.href = '/dashboard';
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="min-h-screen bg-[#FEFEFE]">
            {/* Sidebar */}
            <PublicProfileSidebar 
                isOwnProfile={isOwnProfile}
                onSettingsClick={() => setShowSettings(true)}
            />

            {/* Main Content */}
            <div className="lg:ml-64">
                {/* Header */}
                <header className="bg-white border-b border-[#EBEDE8] sticky top-0 z-10">
                    <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                        <Link href="/public/discover" className="font-serif text-xl font-semibold text-[#333F3C]">
                            MemoirVault Public
                        </Link>

                        <div className="flex items-center gap-4">
                            {isOwnProfile && (
                                <>
                                    <button
                                        onClick={() => setShowSettings(true)}
                                        className="px-4 py-2 border border-[#004838] text-[#004838] rounded-lg font-medium hover:bg-[#004838] hover:text-[#E2FB6C] transition-colors"
                                    >
                                        ⚙️ Settings
                                    </button>
                                    <button
                                        onClick={handleSwitchToPlatform}
                                        disabled={switchingToPlatform}
                                        className="px-4 py-2 bg-[#004838] text-[#E2FB6C] rounded-lg font-medium hover:bg-[#073127] disabled:opacity-50 transition-colors"
                                    >
                                        {switchingToPlatform ? `Switch to Private (${countdown}s)` : 'Switch to Private Platform'}
                                    </button>
                                </>
                            )}

                            {user ? (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-[#333F3C]">Welcome, {user.firstName}</span>
                                    <div className="w-8 h-8 bg-[#004838] rounded-full flex items-center justify-center">
                                        <span className="text-[#E2FB6C] text-sm font-medium">
                                            {user.firstName?.[0] || 'U'}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    href="/sign-in"
                                    className="px-4 py-2 border border-[#004838] text-[#004838] rounded-lg font-medium hover:bg-[#004838] hover:text-[#E2FB6C] transition-colors"
                                >
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </div>
                </header>

            {/* Profile Section */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-sm border border-[#EBEDE8] p-8 mb-8">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Profile Picture */}
                        <div className="flex-shrink-0">
                            <div className="w-32 h-32 rounded-full bg-[#EBEDE8] flex items-center justify-center overflow-hidden">
                                {profile.profilePicture ? (
                                    <img
                                        src={profile.profilePicture}
                                        alt={profile.fullName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-4xl text-[#333F3C]">👤</span>
                                )}
                            </div>
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                <div>
                                    <h1 className="font-serif text-3xl font-semibold text-[#333F3C] mb-2">
                                        {profile.fullName}
                                    </h1>
                                    <p className="text-[#333F3C] opacity-75 mb-4">@{profile.username}</p>

                                    {profile.bio && (
                                        <p className="text-[#333F3C] leading-relaxed mb-4">
                                            {profile.bio}
                                        </p>
                                    )}

                                    <div className="flex gap-6 text-sm text-[#333F3C]">
                                        <span><strong>{followersCount}</strong> followers</span>
                                        <span><strong>{profile.followingCount}</strong> following</span>
                                        <span><strong>{entries.length}</strong> public entries</span>
                                    </div>
                                </div>

                                {/* Follow Button */}
                                {!isOwnProfile && user && (
                                    <button
                                        onClick={handleFollowToggle}
                                        className={`px-6 py-2 rounded-lg font-medium transition-colors ${isFollowing
                                            ? 'border border-[#EBEDE8] text-[#333F3C] hover:bg-[#EBEDE8]'
                                            : 'bg-[#004838] text-[#E2FB6C] hover:bg-[#073127]'
                                            }`}
                                    >
                                        {isFollowing ? 'Following' : 'Follow'}
                                    </button>
                                )}
                            </div>

                            <div className="mt-4 text-xs text-[#333F3C] opacity-75">
                                Member since {formatDate(profile.createdAt)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Entries Section */}
                <div className="space-y-6">
                    <h2 className="font-serif text-2xl font-semibold text-[#333F3C]">
                        Public Journey ({entries.length} entries)
                    </h2>

                    {entries.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl border border-[#EBEDE8]">
                            <div className="text-6xl mb-4">📖</div>
                            <h3 className="font-serif text-xl font-semibold text-[#333F3C] mb-2">
                                No public entries yet
                            </h3>
                            <p className="text-[#333F3C] opacity-75">
                                {isOwnProfile
                                    ? "You haven't made any entries public yet."
                                    : `${profile.fullName} hasn't shared any entries publicly yet.`
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {entries.map((entry) => (
                                <div key={entry.id} className="bg-white rounded-xl border border-[#EBEDE8] p-6 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-serif text-xl font-semibold text-[#333F3C] mb-2">
                                                {entry.title}
                                            </h3>
                                            <p className="text-sm text-[#333F3C] opacity-75">
                                                {formatDate(entry.createdAt)}
                                            </p>
                                        </div>
                                        {entry.media.length > 0 && (
                                            <div className="flex items-center gap-1 text-sm text-[#333F3C] opacity-75">
                                                <span>{entry.media.length}</span>
                                                <span>📎</span>
                                            </div>
                                        )}
                                    </div>

                                    {entry.description && (
                                        <p className="text-[#333F3C] mb-4 leading-relaxed">
                                            {entry.description}
                                        </p>
                                    )}

                                    {/* Media Preview (View Only) */}
                                    {entry.media.length > 0 && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                                                            <p className="text-xs text-[#333F3C] opacity-75 mt-2">
                                                                Audio file (view only)
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
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            </div>

            {/* Settings Modal */}
            {showSettings && isOwnProfile && (
                <PublicProfileSettings
                    profile={currentProfile}
                    onClose={() => setShowSettings(false)}
                    onProfileUpdate={(updatedProfile) => {
                        setCurrentProfile(updatedProfile);
                        // Update the profile data in the parent component if needed
                    }}
                />
            )}
        </div>
    );
}