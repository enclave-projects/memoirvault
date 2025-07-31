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
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [profileUrl, setProfileUrl] = useState('/public/setup');
    const [isClient, setIsClient] = useState(false);

    // Ensure we're on the client side to prevent hydration mismatch
    useEffect(() => {
        setIsClient(true);
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
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="fixed top-4 left-4 z-50 lg:hidden bg-[#004838] text-[#E2FB6C] p-2 rounded-lg shadow-lg"
            >
                {isCollapsed ? '☰' : '×'}
            </button>

            {/* Sidebar */}
            <div className={`fixed left-0 top-0 h-full bg-white border-r border-[#EBEDE8] shadow-lg z-40 transition-transform duration-300 flex flex-col ${
                isCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'
            } ${isCollapsed ? 'lg:w-16' : 'w-64'}`}>
                
                {/* Header */}
                <div className="p-4 border-b border-[#EBEDE8]">
                    <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
                        <div className="w-8 h-8 bg-[#004838] rounded-lg flex items-center justify-center">
                            <span className="text-[#E2FB6C] font-bold text-sm">MV</span>
                        </div>
                        {!isCollapsed && (
                            <div>
                                <h2 className="font-serif font-semibold text-[#333F3C]">MemoirVault</h2>
                                <p className="text-xs text-[#333F3C] opacity-75">Public Space</p>
                            </div>
                        )}
                    </div>
                    
                    {/* Desktop Collapse Toggle */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden lg:block absolute -right-3 top-6 bg-white border border-[#EBEDE8] rounded-full w-6 h-6 flex items-center justify-center text-xs text-[#333F3C] hover:bg-[#FEFEFE]"
                    >
                        {isCollapsed ? '→' : '←'}
                    </button>
                </div>

                {/* Scrollable Navigation Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-2">
                        <div className={`text-xs font-medium text-[#333F3C] opacity-75 uppercase tracking-wide mb-3 ${isCollapsed ? 'text-center' : ''}`}>
                            {isCollapsed ? '•' : 'Navigate'}
                        </div>
                        
                        {navigationItems.map((item) => {
                            if (item.showOnlyForOwn && !isOwnProfile) return null;
                            
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={`flex items-center gap-3 p-3 rounded-lg hover:bg-[#FEFEFE] transition-colors group ${
                                        isCollapsed ? 'justify-center' : ''
                                    }`}
                                    title={isCollapsed ? item.description : ''}
                                >
                                    <span className="text-lg">{item.icon}</span>
                                    {!isCollapsed && (
                                        <div className="flex-1">
                                            <div className="font-medium text-[#333F3C] group-hover:text-[#004838]">
                                                {item.label}
                                            </div>
                                            <div className="text-xs text-[#333F3C] opacity-75">
                                                {item.description}
                                            </div>
                                        </div>
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-8 space-y-2">
                        <div className={`text-xs font-medium text-[#333F3C] opacity-75 uppercase tracking-wide mb-3 ${isCollapsed ? 'text-center' : ''}`}>
                            {isCollapsed ? '⚡' : 'Quick Actions'}
                        </div>
                        
                        {quickActions.map((action) => {
                            if (action.showOnlyForOwn && !isOwnProfile) return null;
                            
                            return (
                                <button
                                    key={action.label}
                                    onClick={action.action}
                                    className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#FEFEFE] transition-colors group ${
                                        isCollapsed ? 'justify-center' : ''
                                    }`}
                                    title={isCollapsed ? action.description : ''}
                                >
                                    <span className="text-lg">{action.icon}</span>
                                    {!isCollapsed && (
                                        <div className="flex-1 text-left">
                                            <div className="font-medium text-[#333F3C] group-hover:text-[#004838]">
                                                {action.label}
                                            </div>
                                            <div className="text-xs text-[#333F3C] opacity-75">
                                                {action.description}
                                            </div>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* User Info */}
                    {user && !isCollapsed && (
                        <div className="mt-8 p-3 bg-[#FEFEFE] rounded-lg border border-[#EBEDE8]">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-[#004838] rounded-full flex items-center justify-center">
                                    <span className="text-[#E2FB6C] text-sm font-medium">
                                        {user.firstName?.[0] || 'U'}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-[#333F3C] truncate">
                                        {user.firstName} {user.lastName}
                                    </div>
                                    <div className="text-xs text-[#333F3C] opacity-75 truncate">
                                        {user.emailAddresses[0]?.emailAddress}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Collapsed User Avatar */}
                    {user && isCollapsed && (
                        <div className="mt-8 flex justify-center">
                            <div className="w-8 h-8 bg-[#004838] rounded-full flex items-center justify-center">
                                <span className="text-[#E2FB6C] text-sm font-medium">
                                    {user.firstName?.[0] || 'U'}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 p-4 border-t border-[#EBEDE8] bg-white">
                    {!isCollapsed ? (
                        <div className="text-center">
                            <div className="text-xs text-[#333F3C] opacity-75">
                                MemoirVault Public v1.0
                            </div>
                            <div className="text-xs text-[#333F3C] opacity-50 mt-1">
                                Privacy-first memoir sharing
                            </div>
                        </div>
                    ) : (
                        <div className="text-center">
                            <div className="text-xs text-[#333F3C] opacity-75">v1.0</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Overlay for mobile */}
            {!isCollapsed && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={() => setIsCollapsed(true)}
                />
            )}
        </>
    );
}