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
    <div className="min-h-screen bg-[#FEFEFE]">
      {/* Header */}
      <header className="bg-white border-b border-[#EBEDE8] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/public/discover" className="font-serif text-xl font-semibold text-[#333F3C]">
            MemoirVault Public
          </Link>
          
          <div className="flex items-center gap-4">
            <Link
              href="/public/feed"
              className="text-[#333F3C] hover:text-[#004838] font-medium"
            >
              Feed
            </Link>
            
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className="px-4 py-2 bg-[#004838] text-[#E2FB6C] rounded-lg font-medium hover:bg-[#073127] transition-colors"
                >
                  Private Platform
                </Link>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#333F3C]">Welcome, {user.firstName}</span>
                  <div className="w-8 h-8 bg-[#004838] rounded-full flex items-center justify-center">
                    <span className="text-[#E2FB6C] text-sm font-medium">
                      {user.firstName?.[0] || 'U'}
                    </span>
                  </div>
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

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-semibold text-[#333F3C] mb-2">
            Discover Memoir Writers
          </h1>
          <p className="text-[#333F3C] opacity-75">
            Connect with fellow memoir writers and explore their public journeys
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-md mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, username, or bio..."
              className="w-full p-3 border border-[#EBEDE8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004838] focus:border-transparent"
            />
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
    </div>
  );
}