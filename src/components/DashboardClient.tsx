"use client";

import { useState, useEffect } from 'react';
import { UserButton, SignedIn } from "@clerk/nextjs";
import NewEntryForm from './NewEntryForm';
import Timeline from './Timeline';
import Settings from './Settings';
import StorageUsage from './StorageUsage';
import AIHelper from './AIHelper';

interface MediaItem {
  id: string;
  fileType: string;
}

interface Entry {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  media: MediaItem[];
}

export default function DashboardClient() {
  const [showNewEntryForm, setShowNewEntryForm] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAIHelper, setShowAIHelper] = useState(false);
  const [stats, setStats] = useState({
    totalEntries: 0,
    wordsWritten: 0,
    photosAdded: 0,
    daysActive: 0,
  });

  const [showUpgradeMessage, setShowUpgradeMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [publicProfile, setPublicProfile] = useState<any>(null);
  const [loadingPublicProfile, setLoadingPublicProfile] = useState(true);

  useEffect(() => {
    fetchStats();
    checkPublicProfile();

    // Check for upgrade success or error in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('upgraded') === 'true') {
      setShowUpgradeMessage(true);
      // Hide message after 5 seconds
      setTimeout(() => setShowUpgradeMessage(false), 5000);
    }
    if (urlParams.get('error') === 'true') {
      setShowErrorMessage(true);
      // Hide message after 5 seconds
      setTimeout(() => setShowErrorMessage(false), 5000);
    }
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/entries');
      if (response.ok) {
        const entries: Entry[] = await response.json();

        const totalEntries = entries.length;
        const wordsWritten = entries.reduce((total, entry) => {
          return total + (entry.description?.split(' ').length || 0);
        }, 0);
        const photosAdded = entries.reduce((total, entry) => {
          return total + entry.media.filter(m => m.fileType === 'image').length;
        }, 0);

        // Calculate days active (unique days with entries)
        const uniqueDays = new Set(
          entries.map(entry => new Date(entry.createdAt).toDateString())
        );
        const daysActive = uniqueDays.size;

        setStats({
          totalEntries,
          wordsWritten,
          photosAdded,
          daysActive,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const checkPublicProfile = async () => {
    try {
      const response = await fetch('/api/public/profile-status');
      if (response.ok) {
        const data = await response.json();
        if (data.hasProfile) {
          setPublicProfile(data.profile);
        }
      }
    } catch (error) {
      console.error('Error checking public profile:', error);
    } finally {
      setLoadingPublicProfile(false);
    }
  };

  const handleNewEntrySuccess = () => {
    fetchStats(); // Refresh stats after creating new entry
  };

  const handleDataCleared = () => {
    // Reset stats and refresh the page after data is cleared
    setStats({
      totalEntries: 0,
      wordsWritten: 0,
      photosAdded: 0,
      daysActive: 0,
    });
    fetchStats();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFBFC] via-white to-[#F8F9FA]">
      {/* Modern Header with Glassmorphism */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-sm">
        <div className="px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src="/logo/memoirvault.png"
                alt="MemoirVault Logo"
                className="w-10 h-10 rounded-xl shadow-sm"
              />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <span className="font-serif text-xl font-bold text-[#1A1D29] tracking-tight">MemoirVault</span>
              <div className="text-xs text-[#6B7280] font-medium">Your Private Space</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <SignedIn>
              {/* Modern Action Buttons */}
              <div className="hidden md:flex items-center space-x-2">
                <button
                  onClick={() => setShowAIHelper(true)}
                  className="group relative p-3 text-[#6B7280] hover:text-[#004838] hover:bg-[#004838]/5 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#004838]/20"
                  title="AI Writing Assistant"
                  aria-label="Open AI Writing Assistant"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
                
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
              </div>
              
              <div className="w-px h-8 bg-[#E5E7EB] hidden md:block"></div>
              
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10 rounded-xl shadow-sm ring-2 ring-white hover:ring-[#004838]/20 transition-all duration-300"
                  }
                }}
              />
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Modern Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section with Modern Typography */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-serif text-5xl font-bold text-[#1A1D29] mb-3 tracking-tight">
                Welcome back
              </h1>
              <p className="text-xl text-[#6B7280] font-medium max-w-2xl leading-relaxed">
                Continue crafting your life story with complete privacy and control. 
                <span className="text-[#004838] font-semibold"> Your memories, your way.</span>
              </p>
            </div>
            
            {/* Quick Stats Badge */}
            <div className="hidden lg:flex items-center space-x-6 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#004838]">{stats.totalEntries}</div>
                <div className="text-xs text-[#6B7280] font-medium">Entries</div>
              </div>
              <div className="w-px h-8 bg-[#E5E7EB]"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#004838]">{stats.wordsWritten}</div>
                <div className="text-xs text-[#6B7280] font-medium">Words</div>
              </div>
            </div>
          </div>

          {/* Modern Alert Messages */}
          {showUpgradeMessage && (
            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-green-800 font-semibold">Plan upgraded successfully!</p>
                  <p className="text-green-700 text-sm">Your new storage limit is now available.</p>
                </div>
              </div>
            </div>
          )}

          {showErrorMessage && (
            <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200/50 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-red-800 font-semibold">Update failed</p>
                  <p className="text-red-700 text-sm">Please try again or contact support.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modern Action Cards Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Primary Action - New Entry */}
          <div className="lg:col-span-2">
            <div className="group relative bg-gradient-to-br from-[#004838] to-[#073127] p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-32 h-32 bg-[#E2FB6C] rounded-full -translate-x-16 -translate-y-16"></div>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-[#E2FB6C] rounded-full translate-x-12 translate-y-12"></div>
              </div>
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 bg-[#E2FB6C]/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-8 h-8 text-[#E2FB6C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div className="text-[#E2FB6C]/60 text-sm font-medium">Quick Action</div>
                </div>
                
                <h3 className="font-serif text-3xl font-bold text-white mb-3">
                  Create New Entry
                </h3>
                <p className="text-[#E2FB6C]/80 text-lg mb-8 leading-relaxed">
                  Capture your thoughts, memories, and experiences. Add photos, videos, or audio to bring your story to life.
                </p>
                
                <button
                  onClick={() => setShowNewEntryForm(true)}
                  className="group/btn inline-flex items-center px-8 py-4 bg-[#E2FB6C] text-[#004838] rounded-2xl font-bold text-lg hover:bg-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#E2FB6C]/30"
                  aria-label="Create a new memoir entry"
                >
                  <span>Start Writing</span>
                  <svg className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Secondary Actions */}
          <div className="space-y-6">
            {/* Recent Entries Card */}
            <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="text-xs text-[#6B7280] font-medium">{stats.totalEntries} entries</div>
              </div>
              
              <h3 className="font-bold text-[#1A1D29] text-lg mb-2">Recent Entries</h3>
              <p className="text-[#6B7280] text-sm mb-4 leading-relaxed">
                Continue where you left off and explore your journey
              </p>
              
              <button
                onClick={() => setShowTimeline(true)}
                className="w-full py-3 px-4 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#374151] rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#004838]/20"
                aria-label="View all memoir entries"
              >
                View Timeline
              </button>
            </div>

            {/* Storage Usage Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg overflow-hidden">
              <StorageUsage />
            </div>
          </div>
        </div>

        {/* Modern Stats Dashboard */}
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl p-8 mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-serif text-3xl font-bold text-[#1A1D29] mb-2">Your Journey So Far</h2>
              <p className="text-[#6B7280] text-lg">Track your progress and celebrate milestones</p>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm text-[#6B7280]">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live stats</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                label: 'Total Entries', 
                value: stats.totalEntries, 
                icon: '📝', 
                color: 'from-blue-500 to-cyan-500',
                bgColor: 'bg-blue-50'
              },
              { 
                label: 'Words Written', 
                value: stats.wordsWritten.toLocaleString(), 
                icon: '✍️', 
                color: 'from-purple-500 to-pink-500',
                bgColor: 'bg-purple-50'
              },
              { 
                label: 'Photos Added', 
                value: stats.photosAdded, 
                icon: '📸', 
                color: 'from-green-500 to-emerald-500',
                bgColor: 'bg-green-50'
              },
              { 
                label: 'Days Active', 
                value: stats.daysActive, 
                icon: '🗓️', 
                color: 'from-orange-500 to-red-500',
                bgColor: 'bg-orange-50'
              }
            ].map((stat, index) => (
              <div key={stat.label} className={`group relative ${stat.bgColor} rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl">{stat.icon}</div>
                  <div className={`w-8 h-8 bg-gradient-to-r ${stat.color} rounded-lg opacity-20 group-hover:opacity-30 transition-opacity`}></div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-[#1A1D29] group-hover:scale-110 transition-transform origin-left">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-[#6B7280]">{stat.label}</div>
                </div>
                
                {/* Hover effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity`}></div>
              </div>
            ))}
          </div>
        </div>

        {/* Modern Public Platform Status */}
        {!loadingPublicProfile && (
          <div className="mb-8 bg-gradient-to-r from-[#004838] via-[#073127] to-[#004838] rounded-3xl p-8 text-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#E2FB6C]/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#E2FB6C]/5 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-[#E2FB6C]/20 rounded-2xl flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                    <span className="text-3xl">{publicProfile ? '🌍' : '🔒'}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-2xl mb-2">
                      {publicProfile ? 'Public Profile Active' : 'Private Mode Only'}
                    </h3>
                    <p className="text-[#E2FB6C]/80 text-lg leading-relaxed max-w-2xl">
                      {publicProfile
                        ? `Your public profile @${publicProfile.username} is live and connected to this account. Share your journey with the world.`
                        : 'Your memoir is completely private. Create a public profile to share selected stories with others while maintaining full control.'
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                  {publicProfile ? (
                    <>
                      <button
                        onClick={() => window.location.href = `/public/profile/${publicProfile.username}`}
                        className="px-6 py-3 bg-[#E2FB6C] text-[#004838] rounded-2xl font-bold hover:bg-white hover:scale-105 transition-all duration-300 shadow-lg focus:outline-none focus:ring-4 focus:ring-[#E2FB6C]/30"
                      >
                        View Public Profile
                      </button>
                      <button
                        onClick={() => window.location.href = '/public/discover'}
                        className="px-6 py-3 border-2 border-[#E2FB6C] text-[#E2FB6C] rounded-2xl font-bold hover:bg-[#E2FB6C] hover:text-[#004838] hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#E2FB6C]/30"
                      >
                        Explore Community
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => window.location.href = '/public/setup'}
                      className="px-8 py-4 bg-[#E2FB6C] text-[#004838] rounded-2xl font-bold text-lg hover:bg-white hover:scale-105 transition-all duration-300 shadow-lg focus:outline-none focus:ring-4 focus:ring-[#E2FB6C]/30"
                    >
                      Create Public Profile
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modern Privacy Status */}
        <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-3xl p-8 border border-green-200/30">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-2xl text-[#1A1D29] mb-1">Privacy Status: Secure</h3>
                <p className="text-green-700 font-medium">Your data is protected with enterprise-grade security</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">All systems secure</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: '🔐', text: 'End-to-end encryption active' },
              { icon: '🛡️', text: 'Data stored securely' },
              { icon: '🚫', text: 'No tracking or analytics' },
              { icon: '👤', text: 'Full data control' }
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30">
                <span className="text-xl">{item.icon}</span>
                <span className="text-[#1A1D29] font-medium text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modals */}
      {showNewEntryForm && (
        <NewEntryForm
          onClose={() => setShowNewEntryForm(false)}
          onSuccess={handleNewEntrySuccess}
        />
      )}

      {showTimeline && (
        <Timeline
          onClose={() => setShowTimeline(false)}
        />
      )}

      {showSettings && (
        <Settings
          onClose={() => setShowSettings(false)}
          onDataCleared={handleDataCleared}
        />
      )}

      {showAIHelper && (
        <AIHelper
          onClose={() => setShowAIHelper(false)}
        />
      )}

      {/* Modern Floating AI Helper Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={() => setShowAIHelper(true)}
          className="group relative w-16 h-16 bg-gradient-to-r from-[#004838] via-[#073127] to-[#004838] text-[#E2FB6C] rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 flex items-center justify-center hover:scale-110 focus:outline-none focus:ring-4 focus:ring-[#004838]/30 animate-pulse hover:animate-none"
          title="AI Writing Assistant"
          aria-label="Open AI Writing Assistant"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#004838] to-[#073127] rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
          
          {/* Icon */}
          <div className="relative z-10">
            <svg className="w-7 h-7 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          
          {/* Notification dot */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white animate-bounce">
            <div className="w-full h-full bg-blue-400 rounded-full animate-ping"></div>
          </div>
        </button>
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-[#1A1D29] text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          AI Writing Assistant
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#1A1D29]"></div>
        </div>
      </div>
    </div>
  );
}