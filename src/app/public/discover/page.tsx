"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

interface PublicProfile {
  id: string;
  userId: string;
  username: string;
  fullName: string;
  bio: string | null;
  profilePicture: string | null;
  followersCount: number;
  followingCount: number;
  publicEntriesCount: number;
  createdAt: string;
}

export default function DiscoverPage() {
  const { user } = useUser();
  const [profiles, setProfiles] = useState<PublicProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProfiles, setFilteredProfiles] = useState<PublicProfile[]>([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    fetchProfiles();
  }, []);

  useEffect(() => {
    // Filter profiles based on search query
    if (searchQuery.trim() === '') {
      setFilteredProfiles(profiles);
    } else {
      const filtered = profiles.filter(profile =>
        profile.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (profile.bio && profile.bio.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredProfiles(filtered);
    }
  }, [searchQuery, profiles]);

  const fetchProfiles = async () => {
    try {
      const response = await fetch('/api/public/discover');
      if (response.ok) {
        const data = await response.json();
        setProfiles(data.profiles);
        setFilteredProfiles(data.profiles);
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFBFC] via-white to-[#F8F9FA]">
      {/* Modern Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 text-[#6B7280] hover:text-[#004838] hover:bg-[#004838]/5 rounded-xl transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

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
            <div className="hidden md:flex items-center space-x-2">
              <Link
                href="/public/feed"
                className="group relative p-3 text-[#6B7280] hover:text-[#004838] hover:bg-[#004838]/5 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#004838]/20"
                title="Your Feed"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </Link>
            </div>

            <div className="w-px h-8 bg-[#E5E7EB] hidden md:block"></div>

            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#004838] to-[#073127] text-[#E2FB6C] rounded-2xl font-bold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#004838]/30"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Private Platform
                </Link>
                <div className="hidden md:block text-right">
                  <div className="text-sm font-medium text-[#1A1D29]">Welcome, {user.firstName}</div>
                  <div className="text-xs text-[#6B7280]">Discover Mode</div>
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

      {/* Modern Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Modern Page Header */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#004838] to-[#073127] rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
              <svg className="w-10 h-10 text-[#E2FB6C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-2xl border-4 border-white animate-bounce"></div>
          </div>
          <h1 className="font-serif text-5xl font-bold text-[#1A1D29] mb-4 tracking-tight">
            Discover Memoir Writers
          </h1>
          <p className="text-[#6B7280] text-xl max-w-2xl mx-auto leading-relaxed">
            Connect with fellow memoir writers and explore their public journeys. Find inspiring stories and build meaningful connections.
          </p>
        </div>

        {/* Modern Search Bar */}
        <div className="mb-12">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <svg className="w-6 h-6 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, username, or bio..."
                className="w-full pl-16 pr-6 py-5 bg-white/60 backdrop-blur-xl border border-white/20 rounded-3xl focus:outline-none focus:ring-4 focus:ring-[#004838]/20 focus:border-[#004838]/30 text-lg font-medium placeholder-[#6B7280] shadow-xl transition-all duration-300"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-6 flex items-center text-[#6B7280] hover:text-[#004838] transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-[#004838] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#333F3C]">Loading profiles...</p>
          </div>
        )}

        {/* Profiles Grid */}
        {!loading && (
          <>
            {filteredProfiles.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="font-serif text-xl font-semibold text-[#333F3C] mb-2">
                  {searchQuery ? 'No profiles found' : 'No public profiles yet'}
                </h3>
                <p className="text-[#333F3C] opacity-75">
                  {searchQuery
                    ? 'Try adjusting your search terms'
                    : 'Be the first to create a public profile!'
                  }
                </p>
                {!user && (
                  <Link
                    href="/sign-in"
                    className="inline-block mt-4 px-6 py-3 bg-[#004838] text-[#E2FB6C] rounded-lg font-medium hover:bg-[#073127] transition-colors"
                  >
                    Sign In to Create Profile
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProfiles.map((profile) => (
                  <Link
                    key={profile.id}
                    href={`/public/profile/${profile.username}`}
                    className="block bg-white rounded-xl border border-[#EBEDE8] p-6 hover:shadow-md transition-all duration-200 hover:scale-105"
                  >
                    {/* Profile Picture */}
                    <div className="flex justify-center mb-4">
                      <div className="w-20 h-20 rounded-full bg-[#EBEDE8] flex items-center justify-center overflow-hidden">
                        {profile.profilePicture ? (
                          <img
                            src={profile.profilePicture}
                            alt={profile.fullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl text-[#333F3C]">👤</span>
                        )}
                      </div>
                    </div>

                    {/* Profile Info */}
                    <div className="text-center">
                      <h3 className="font-serif text-lg font-semibold text-[#333F3C] mb-1">
                        {profile.fullName}
                      </h3>
                      <p className="text-sm text-[#333F3C] opacity-75 mb-3">
                        @{profile.username}
                      </p>

                      {profile.bio && (
                        <p className="text-sm text-[#333F3C] mb-4 line-clamp-2">
                          {profile.bio}
                        </p>
                      )}

                      {/* Stats */}
                      <div className="flex justify-center gap-4 text-xs text-[#333F3C] mb-4">
                        <span><strong>{profile.followersCount}</strong> followers</span>
                        <span><strong>{profile.publicEntriesCount}</strong> entries</span>
                      </div>

                      {/* Member Since */}
                      <p className="text-xs text-[#333F3C] opacity-50">
                        Member since {formatDate(profile.createdAt)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Results Count */}
            {filteredProfiles.length > 0 && (
              <div className="text-center mt-8">
                <p className="text-sm text-[#333F3C] opacity-75">
                  {searchQuery
                    ? `Found ${filteredProfiles.length} profile${filteredProfiles.length !== 1 ? 's' : ''} matching "${searchQuery}"`
                    : `Showing ${filteredProfiles.length} public profile${filteredProfiles.length !== 1 ? 's' : ''}`
                  }
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setShowMobileMenu(false)}
          ></div>

          {/* Mobile Menu Panel */}
          <div className="fixed top-0 left-0 h-full w-80 bg-white/90 backdrop-blur-xl border-r border-white/20 shadow-2xl z-50 md:hidden transform transition-transform duration-300">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#004838] to-[#073127] rounded-xl flex items-center justify-center">
                    <span className="text-[#E2FB6C] font-bold text-sm">MV</span>
                  </div>
                  <div>
                    <h2 className="font-serif font-bold text-[#1A1D29]">MemoirVault</h2>
                    <p className="text-xs text-[#6B7280]">Public Space</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2 text-[#6B7280] hover:text-[#004838] rounded-xl"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Navigation */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-4">Navigate</h3>

                <Link
                  href="/public/feed"
                  className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/60 transition-all duration-300"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <span className="text-xl">🏠</span>
                  </div>
                  <div>
                    <div className="font-bold text-[#1A1D29]">Feed</div>
                    <div className="text-xs text-[#6B7280]">Latest updates from people you follow</div>
                  </div>
                </Link>

                <Link
                  href="/public/discover"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/60 border border-white/30"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-[#004838] to-[#073127] rounded-xl flex items-center justify-center">
                    <span className="text-xl">🔍</span>
                  </div>
                  <div>
                    <div className="font-bold text-[#004838]">Discover</div>
                    <div className="text-xs text-[#6B7280]">Find new people and stories</div>
                  </div>
                </Link>

                <Link
                  href="/public/following"
                  className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/60 transition-all duration-300"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <span className="text-xl">👥</span>
                  </div>
                  <div>
                    <div className="font-bold text-[#1A1D29]">Following</div>
                    <div className="text-xs text-[#6B7280]">People you follow</div>
                  </div>
                </Link>

                {user && (
                  <>
                    <div className="my-6 border-t border-white/20"></div>
                    <h3 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-4">Quick Actions</h3>

                    <Link
                      href="/dashboard"
                      className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-[#004838] to-[#073127] text-white"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <div className="w-10 h-10 bg-[#E2FB6C]/20 rounded-xl flex items-center justify-center">
                        <span className="text-xl">🔒</span>
                      </div>
                      <div>
                        <div className="font-bold text-[#E2FB6C]">Private Space</div>
                        <div className="text-xs text-[#E2FB6C]/80">Switch to your private memoir space</div>
                      </div>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}