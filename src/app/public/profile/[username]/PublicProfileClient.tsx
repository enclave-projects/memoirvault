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
        <div className="min-h-screen bg-gradient-to-br from-[#FAFBFC] via-white to-[#F8F9FA]">
            {/* Sidebar */}
            <PublicProfileSidebar 
                isOwnProfile={isOwnProfile}
                onSettingsClick={() => setShowSettings(true)}
            />

            {/* Main Content */}
            <div className="lg:ml-64">
                {/* Modern Header with Glassmorphism */}
                <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-sm">
                    <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <div className="w-10 h-10 bg-gradient-to-br from-[#004838] to-[#073127] rounded-xl shadow-sm flex items-center justify-center">
                                    <span className="text-[#E2FB6C] font-bold text-sm">MV</span>
                                </div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white animate-pulse"></div>
                            </div>
                            <div>
                                <Link href="/public/discover" className="font-serif text-xl font-bold text-[#1A1D29] tracking-tight hover:text-[#004838] transition-colors">
                                    MemoirVault Public
                                </Link>
                                <div className="text-xs text-[#6B7280] font-medium">Community Space</div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            {isOwnProfile && (
                                <div className="hidden md:flex items-center space-x-2">
                                    <button
                                        onClick={() => setShowSettings(true)}
                                        className="group relative p-3 text-[#6B7280] hover:text-[#004838] hover:bg-[#004838]/5 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#004838]/20"
                                        title="Settings"
                                        aria-label="Open Settings"
                                    >
                                        <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </button>
                                    
                                    <button
                                        onClick={handleSwitchToPlatform}
                                        disabled={switchingToPlatform}
                                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#004838] to-[#073127] text-[#E2FB6C] rounded-2xl font-bold hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#004838]/30"
                                    >
                                        {switchingToPlatform ? (
                                            <>
                                                <svg className="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                                <span>Switching ({countdown}s)</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                                <span>Private Space</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                            
                            <div className="w-px h-8 bg-[#E5E7EB] hidden md:block"></div>

                            {user ? (
                                <div className="flex items-center gap-3">
                                    <div className="hidden md:block text-right">
                                        <div className="text-sm font-medium text-[#1A1D29]">Welcome, {user.firstName}</div>
                                        <div className="text-xs text-[#6B7280]">Public Profile</div>
                                    </div>
                                    <div className="w-10 h-10 bg-gradient-to-br from-[#004838] to-[#073127] rounded-xl shadow-sm ring-2 ring-white hover:ring-[#004838]/20 transition-all duration-300 flex items-center justify-center">
                                        <span className="text-[#E2FB6C] text-sm font-bold">
                                            {user.firstName?.[0] || 'U'}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    href="/sign-in"
                                    className="inline-flex items-center px-6 py-3 border-2 border-[#004838] text-[#004838] rounded-2xl font-bold hover:bg-[#004838] hover:text-[#E2FB6C] hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#004838]/20"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </div>
                </header>

            {/* Modern Profile Section */}
            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* Profile Hero Card */}
                <div className="relative bg-white/60 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl p-8 mb-12 overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute top-0 left-0 w-64 h-64 bg-[#004838] rounded-full -translate-x-32 -translate-y-32"></div>
                        <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#E2FB6C] rounded-full translate-x-24 translate-y-24"></div>
                    </div>
                    
                    <div className="relative z-10">
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Profile Picture */}
                            <div className="flex-shrink-0 flex justify-center lg:justify-start">
                                <div className="relative">
                                    <div className="w-40 h-40 rounded-3xl bg-gradient-to-br from-[#EBEDE8] to-[#F8F9FA] flex items-center justify-center overflow-hidden shadow-xl ring-4 ring-white">
                                        {profile.profilePicture ? (
                                            <img
                                                src={profile.profilePicture}
                                                alt={profile.fullName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-6xl text-[#6B7280]">👤</span>
                                        )}
                                    </div>
                                    {/* Online Status Indicator */}
                                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-2xl border-4 border-white flex items-center justify-center shadow-lg">
                                        <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Profile Info */}
                            <div className="flex-1 text-center lg:text-left">
                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <h1 className="font-serif text-4xl lg:text-5xl font-bold text-[#1A1D29] mb-3 tracking-tight">
                                                {profile.fullName}
                                            </h1>
                                            <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                                                <span className="text-xl text-[#6B7280] font-medium">@{profile.username}</span>
                                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                            </div>
                                        </div>

                                        {profile.bio && (
                                            <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                                                <p className="text-[#1A1D29] text-lg leading-relaxed font-medium">
                                                    {profile.bio}
                                                </p>
                                            </div>
                                        )}

                                        {/* Stats */}
                                        <div className="flex justify-center lg:justify-start gap-8">
                                            {[
                                                { label: 'Followers', value: followersCount, icon: '👥' },
                                                { label: 'Following', value: profile.followingCount, icon: '🤝' },
                                                { label: 'Public Entries', value: entries.length, icon: '📖' }
                                            ].map((stat, index) => (
                                                <div key={stat.label} className="text-center group cursor-pointer">
                                                    <div className="flex items-center justify-center gap-2 mb-1">
                                                        <span className="text-lg group-hover:scale-110 transition-transform">{stat.icon}</span>
                                                        <div className="text-2xl font-bold text-[#1A1D29] group-hover:text-[#004838] transition-colors">
                                                            {stat.value}
                                                        </div>
                                                    </div>
                                                    <div className="text-sm font-medium text-[#6B7280] group-hover:text-[#004838] transition-colors">
                                                        {stat.label}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Follow Button */}
                                    {!isOwnProfile && user && (
                                        <div className="flex justify-center lg:justify-end">
                                            <button
                                                onClick={handleFollowToggle}
                                                className={`group relative inline-flex items-center px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 ${
                                                    isFollowing
                                                        ? 'bg-white/80 backdrop-blur-sm border-2 border-[#E5E7EB] text-[#6B7280] hover:bg-red-50 hover:border-red-200 hover:text-red-600 focus:ring-red-500/20'
                                                        : 'bg-gradient-to-r from-[#004838] to-[#073127] text-[#E2FB6C] hover:scale-105 focus:ring-[#004838]/30'
                                                }`}
                                            >
                                                {isFollowing ? (
                                                    <>
                                                        <svg className="w-5 h-5 mr-2 group-hover:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        <svg className="w-5 h-5 mr-2 hidden group-hover:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                        <span className="group-hover:hidden">Following</span>
                                                        <span className="hidden group-hover:block">Unfollow</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                        </svg>
                                                        <span>Follow</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Member Since */}
                                <div className="mt-6 flex items-center justify-center lg:justify-start gap-2 text-[#6B7280]">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-sm font-medium">Member since {formatDate(profile.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modern Entries Section */}
                <div className="space-y-8">
                    {/* Section Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-serif text-3xl font-bold text-[#1A1D29] mb-2 tracking-tight">
                                Public Journey
                            </h2>
                            <p className="text-[#6B7280] text-lg">
                                {entries.length} {entries.length === 1 ? 'entry' : 'entries'} shared publicly
                            </p>
                        </div>
                        
                        {entries.length > 0 && (
                            <div className="hidden md:flex items-center space-x-2 text-sm text-[#6B7280]">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span>Live updates</span>
                            </div>
                        )}
                    </div>

                    {entries.length === 0 ? (
                        /* Empty State */
                        <div className="relative bg-white/60 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl p-12 text-center overflow-hidden">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-5">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#E2FB6C] rounded-full translate-x-16 -translate-y-16"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#004838] rounded-full -translate-x-12 translate-y-12"></div>
                            </div>
                            
                            <div className="relative z-10">
                                <div className="w-24 h-24 bg-gradient-to-br from-[#EBEDE8] to-[#F8F9FA] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                    <span className="text-4xl">📖</span>
                                </div>
                                <h3 className="font-serif text-2xl font-bold text-[#1A1D29] mb-4">
                                    No public entries yet
                                </h3>
                                <p className="text-[#6B7280] text-lg max-w-md mx-auto leading-relaxed">
                                    {isOwnProfile
                                        ? "You haven't made any entries public yet. Share your story with the world!"
                                        : `${profile.fullName} hasn't shared any entries publicly yet. Check back later for updates.`
                                    }
                                </p>
                                
                                {isOwnProfile && (
                                    <div className="mt-8">
                                        <button
                                            onClick={() => window.location.href = '/dashboard'}
                                            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#004838] to-[#073127] text-[#E2FB6C] rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#004838]/30"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Create Your First Entry
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        /* Entries Grid */
                        <div className="space-y-8">
                            {entries.map((entry, index) => (
                                <div key={entry.id} className="group relative bg-white/60 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-1">
                                    {/* Background Pattern */}
                                    <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <div className={`absolute top-0 ${index % 2 === 0 ? 'left-0' : 'right-0'} w-32 h-32 bg-[#004838] rounded-full ${index % 2 === 0 ? '-translate-x-16' : 'translate-x-16'} -translate-y-16`}></div>
                                        <div className={`absolute bottom-0 ${index % 2 === 0 ? 'right-0' : 'left-0'} w-24 h-24 bg-[#E2FB6C] rounded-full ${index % 2 === 0 ? 'translate-x-12' : '-translate-x-12'} translate-y-12`}></div>
                                    </div>
                                    
                                    <div className="relative z-10 p-8">
                                        {/* Entry Header */}
                                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                                            <div className="flex-1">
                                                <h3 className="font-serif text-2xl font-bold text-[#1A1D29] mb-3 group-hover:text-[#004838] transition-colors">
                                                    {entry.title}
                                                </h3>
                                                <div className="flex items-center gap-4 text-[#6B7280]">
                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <span className="text-sm font-medium">{formatDate(entry.createdAt)}</span>
                                                    </div>
                                                    
                                                    {entry.media.length > 0 && (
                                                        <div className="flex items-center gap-2 bg-white/40 backdrop-blur-sm rounded-xl px-3 py-1 border border-white/30">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                                            </svg>
                                                            <span className="text-sm font-medium">{entry.media.length} files</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Entry Content */}
                                        {entry.description && (
                                            <div className="mb-8">
                                                <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                                                    <p className="text-[#1A1D29] text-lg leading-relaxed font-medium">
                                                        {entry.description}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Modern Media Gallery */}
                                        {entry.media.length > 0 && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {entry.media.slice(0, 3).map((mediaItem) => (
                                                    <div key={mediaItem.id} className="group/media relative bg-white/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/30 hover:shadow-xl transition-all duration-300">
                                                        {mediaItem.fileType === 'image' && (
                                                            <div className="relative">
                                                                <img
                                                                    src={mediaItem.publicUrl}
                                                                    alt={mediaItem.originalName}
                                                                    className="w-full h-56 object-cover group-hover/media:scale-105 transition-transform duration-500"
                                                                />
                                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/media:opacity-100 transition-opacity"></div>
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
                                                    </div>
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
                                    </div>
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