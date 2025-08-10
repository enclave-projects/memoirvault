"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

interface PublicProfileSidebarProps {
    isOwnProfile: boolean;
    onSettingsClick: () => void;
}

export default function PublicProfileSidebar({ isOwnProfile, onSettingsClick }: PublicProfileSidebarProps) {
    const { user, isLoaded } = useUser();
    const [isCollapsed, setIsCollapsed] = useState(true); // Start collapsed on mobile
    const [profileUrl, setProfileUrl] = useState('/public/setup');
    const [isClient, setIsClient] = useState(false);

    // Ensure we're on the client side to prevent hydration mismatch
    useEffect(() => {
        setIsClient(true);
        // Set initial state based on screen size
        const handleResize = () => {
            if (window.innerWidth >= 1024) { // lg breakpoint
                setIsCollapsed(false); // Show sidebar on desktop
            } else {
                setIsCollapsed(true); // Hide sidebar on mobile
            }
        };
        
        handleResize(); // Set initial state
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (isClient && user && isLoaded) {
            fetchProfileStatus();
        }
    }, [user, isLoaded, isClient]);

    const fetchProfileStatus = async () => {
        try {
            const response = await fetch('/api/public/profile-status');
            if (response.ok) {
                const data = await response.json();
                setProfileUrl(data.profileUrl);
            }
        } catch (error) {
            console.error('Error fetching profile status:', error);
        }
    };

    const navigationItems = [
        {
            icon: '🏠',
            label: 'Feed',
            href: '/public/feed',
            description: 'Latest updates from people you follow'
        },
        {
            icon: '🔍',
            label: 'Discover',
            href: '/public/discover',
            description: 'Find new people and stories'
        },
        {
            icon: '👥',
            label: 'Following',
            href: '/public/following',
            description: 'People you follow'
        },
        {
            icon: '📖',
            label: 'My Public Profile',
            href: profileUrl,
            description: 'Your public memoir profile',
            showOnlyForOwn: true
        },
    ];

    const quickActions = [
        {
            icon: '🔒',
            label: 'Private Space',
            action: () => {
                if (typeof window !== 'undefined') {
                    window.location.href = '/dashboard';
                }
            },
            description: 'Switch to your private memoir space'
        },
        {
            icon: '⚙️',
            label: 'Settings',
            action: onSettingsClick,
            description: 'Manage your public profile settings',
            showOnlyForOwn: true
        },
        {
            icon: '📝',
            label: 'New Entry',
            action: () => {
                if (typeof window !== 'undefined') {
                    window.location.href = '/dashboard?action=new-entry';
                }
            },
            description: 'Create a new memoir entry',
            showOnlyForOwn: true
        },
        {
            icon: '📊',
            label: 'Analytics',
            action: () => {
                if (typeof window !== 'undefined') {
                    alert('Analytics coming soon!');
                }
            },
            description: 'View your profile analytics',
            showOnlyForOwn: true
        },
    ];

    // Don't render until client-side hydration is complete
    if (!isClient) {
        return null;
    }

    return (
        <>
            {/* Modern Mobile Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="fixed top-6 left-6 z-50 lg:hidden bg-gradient-to-br from-[#004838] to-[#073127] text-[#E2FB6C] p-3 rounded-2xl shadow-2xl hover:scale-110 transition-all duration-300 backdrop-blur-sm border border-white/20"
            >
                <svg className={`w-6 h-6 transition-transform duration-300 ${!isCollapsed ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isCollapsed ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    )}
                </svg>
            </button>

            {/* Modern Sidebar */}
            <div className={`fixed left-0 top-0 h-full bg-white/80 backdrop-blur-xl border-r border-white/20 shadow-xl z-40 transition-all duration-300 flex flex-col ${
                isCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'
            } ${isCollapsed ? 'lg:w-16' : 'w-64'}`}>
                
                {/* Modern Header */}
                <div className="p-6 border-b border-white/20">
                    <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
                        <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#004838] to-[#073127] rounded-xl shadow-sm flex items-center justify-center">
                                <span className="text-[#E2FB6C] font-bold text-sm">MV</span>
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white animate-pulse"></div>
                        </div>
                        {!isCollapsed && (
                            <div>
                                <h2 className="font-serif font-bold text-[#1A1D29] tracking-tight">MemoirVault</h2>
                                <p className="text-xs text-[#6B7280] font-medium">Public Space</p>
                            </div>
                        )}
                    </div>
                    
                    {/* Modern Desktop Collapse Toggle */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden lg:block absolute -right-3 top-8 bg-white/80 backdrop-blur-sm border border-white/30 rounded-xl w-8 h-8 flex items-center justify-center text-sm text-[#6B7280] hover:bg-white hover:text-[#004838] hover:scale-110 transition-all duration-200 shadow-lg"
                    >
                        <svg className={`w-4 h-4 transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                </div>

                {/* Modern Scrollable Navigation Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-3">
                        <div className={`text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-6 ${isCollapsed ? 'text-center' : ''}`}>
                            {isCollapsed ? '•••' : 'Navigate'}
                        </div>
                        
                        {navigationItems.map((item) => {
                            if (item.showOnlyForOwn && !isOwnProfile) return null;
                            
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={`group relative flex items-center gap-4 p-4 rounded-2xl hover:bg-white/60 hover:backdrop-blur-sm hover:shadow-lg transition-all duration-300 border border-transparent hover:border-white/30 ${
                                        isCollapsed ? 'justify-center' : ''
                                    }`}
                                    title={isCollapsed ? item.description : ''}
                                >
                                    {/* Icon Container */}
                                    <div className="w-10 h-10 bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-[#004838]/10 group-hover:to-[#073127]/10 transition-all duration-300 border border-white/20">
                                        <span className="text-xl group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                                    </div>
                                    
                                    {!isCollapsed && (
                                        <div className="flex-1 min-w-0">
                                            <div className="font-bold text-[#1A1D29] group-hover:text-[#004838] transition-colors duration-300 text-sm">
                                                {item.label}
                                            </div>
                                            <div className="text-xs text-[#6B7280] group-hover:text-[#004838]/70 transition-colors duration-300 mt-1 leading-relaxed">
                                                {item.description}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Hover Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#004838]/5 to-[#073127]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Modern Quick Actions */}
                    <div className="mt-10 space-y-3">
                        <div className={`text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-6 ${isCollapsed ? 'text-center' : ''}`}>
                            {isCollapsed ? '⚡' : 'Quick Actions'}
                        </div>
                        
                        {quickActions.map((action) => {
                            if (action.showOnlyForOwn && !isOwnProfile) return null;
                            
                            return (
                                <button
                                    key={action.label}
                                    onClick={action.action}
                                    className={`group relative w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white/60 hover:backdrop-blur-sm hover:shadow-lg transition-all duration-300 border border-transparent hover:border-white/30 ${
                                        isCollapsed ? 'justify-center' : ''
                                    }`}
                                    title={isCollapsed ? action.description : ''}
                                >
                                    {/* Icon Container */}
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 border border-white/20 ${
                                        action.label === 'Private Space' 
                                            ? 'bg-gradient-to-br from-[#004838]/20 to-[#073127]/20 group-hover:from-[#004838]/30 group-hover:to-[#073127]/30' 
                                            : 'bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-sm group-hover:bg-gradient-to-br group-hover:from-[#004838]/10 group-hover:to-[#073127]/10'
                                    }`}>
                                        <span className={`text-xl group-hover:scale-110 transition-transform duration-300 ${
                                            action.label === 'Private Space' ? 'text-[#004838]' : ''
                                        }`}>{action.icon}</span>
                                    </div>
                                    
                                    {!isCollapsed && (
                                        <div className="flex-1 text-left min-w-0">
                                            <div className={`font-bold text-sm transition-colors duration-300 ${
                                                action.label === 'Private Space' 
                                                    ? 'text-[#004838] group-hover:text-[#073127]' 
                                                    : 'text-[#1A1D29] group-hover:text-[#004838]'
                                            }`}>
                                                {action.label}
                                            </div>
                                            <div className="text-xs text-[#6B7280] group-hover:text-[#004838]/70 transition-colors duration-300 mt-1 leading-relaxed">
                                                {action.description}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Special highlight for Private Space */}
                                    {action.label === 'Private Space' && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#004838]/5 to-[#073127]/5 rounded-2xl opacity-100 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    )}
                                    
                                    {/* Hover Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#004838]/5 to-[#073127]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Modern User Info */}
                    {user && !isCollapsed && (
                        <div className="mt-10 p-5 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#004838] to-[#073127] rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-white/50">
                                        <span className="text-[#E2FB6C] text-lg font-bold">
                                            {user.firstName?.[0] || 'U'}
                                        </span>
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-bold text-[#1A1D29] truncate text-sm">
                                        {user.firstName} {user.lastName}
                                    </div>
                                    <div className="text-xs text-[#6B7280] truncate mt-1">
                                        {user.emailAddresses[0]?.emailAddress}
                                    </div>
                                    <div className="flex items-center gap-1 mt-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-xs text-green-600 font-medium">Online</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Modern Collapsed User Avatar */}
                    {user && isCollapsed && (
                        <div className="mt-10 flex justify-center">
                            <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-br from-[#004838] to-[#073127] rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-white/50 hover:scale-110 transition-transform duration-300">
                                    <span className="text-[#E2FB6C] text-lg font-bold">
                                        {user.firstName?.[0] || 'U'}
                                    </span>
                                </div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Modern Footer */}
                <div className="flex-shrink-0 p-6 border-t border-white/20 bg-white/20 backdrop-blur-sm">
                    {!isCollapsed ? (
                        <div className="text-center space-y-2">
                            <div className="flex items-center justify-center gap-2 mb-3">
                                <div className="w-6 h-6 bg-gradient-to-br from-[#004838] to-[#073127] rounded-lg flex items-center justify-center">
                                    <span className="text-[#E2FB6C] text-xs font-bold">MV</span>
                                </div>
                                <div className="text-xs font-bold text-[#1A1D29]">
                                    Public v1.0
                                </div>
                            </div>
                            <div className="text-xs text-[#6B7280] font-medium leading-relaxed">
                                Privacy-first memoir sharing
                            </div>
                            <div className="flex items-center justify-center gap-1 mt-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-xs text-green-600 font-medium">All systems operational</span>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center">
                            <div className="w-8 h-8 bg-gradient-to-br from-[#004838] to-[#073127] rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg">
                                <span className="text-[#E2FB6C] text-xs font-bold">MV</span>
                            </div>
                            <div className="text-xs text-[#6B7280] font-bold">v1.0</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modern Overlay for mobile */}
            {!isCollapsed && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden animate-fade-in"
                    onClick={() => setIsCollapsed(true)}
                />
            )}
        </>
    );
}