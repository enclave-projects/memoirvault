"use client";

import { useState, useEffect } from 'react';
import { UserButton, SignedIn } from "@clerk/nextjs";
import NewEntryForm from './NewEntryForm';
import Timeline from './Timeline';
import Settings from './Settings';
import StorageUsage from './StorageUsage';

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
  const [stats, setStats] = useState({
    totalEntries: 0,
    wordsWritten: 0,
    photosAdded: 0,
    daysActive: 0,
  });

  const [showUpgradeMessage, setShowUpgradeMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  useEffect(() => {
    fetchStats();
    
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center max-w-7xl mx-auto border-b border-[#EBEDE8]">
        <div className="flex items-center space-x-2">
          <img 
            src="/logo/memoirvault.png" 
            alt="MemoirVault Logo" 
            className="w-8 h-8"
          />
          <span className="font-serif text-xl font-semibold text-[#333F3C]">MemoirVault</span>
        </div>
        <div className="flex items-center space-x-4">
          <SignedIn>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 text-[#333F3C] hover:text-[#004838] hover:bg-[#EBEDE8] rounded-lg transition-all duration-200"
              title="Settings"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8"
                }
              }}
            />
          </SignedIn>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-semibold text-[#333F3C] mb-2">
            Welcome to Your Private Space
          </h1>
          <p className="text-[#333F3C] opacity-75">
            Start documenting your life story with complete privacy and control.
          </p>
          
          {/* Success Message */}
          {showUpgradeMessage && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 flex items-center">
                <span className="mr-2">✓</span>
                Your plan has been successfully upgraded! Your new storage limit is now available.
              </p>
            </div>
          )}
          
          {/* Error Message */}
          {showErrorMessage && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 flex items-center">
                <span className="mr-2">⚠️</span>
                There was an error updating your plan. Please try again or contact support.
              </p>
            </div>
          )}
        </div>

        {/* Dashboard Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Quick Entry Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#EBEDE8] hover:shadow-md transition-shadow">
            <div className="text-3xl mb-4">✍️</div>
            <h3 className="font-serif text-xl font-semibold text-[#333F3C] mb-2">
              New Entry
            </h3>
            <p className="text-[#333F3C] opacity-75 mb-4">
              Start writing your next chapter
            </p>
            <button
              onClick={() => setShowNewEntryForm(true)}
              className="gradient-cta text-[#E2FB6C] px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
            >
              Create Entry
            </button>
          </div>

          {/* Recent Entries */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#EBEDE8] hover:shadow-md transition-shadow">
            <div className="text-3xl mb-4">📚</div>
            <h3 className="font-serif text-xl font-semibold text-[#333F3C] mb-2">
              Recent Entries
            </h3>
            <p className="text-[#333F3C] opacity-75 mb-4">
              Continue where you left off
            </p>
            <button
              onClick={() => setShowTimeline(true)}
              className="border-2 border-[#E2FB6C] text-[#004838] px-4 py-2 rounded-lg font-medium hover:bg-[#E2FB6C] transition-all duration-200"
            >
              View All
            </button>
          </div>

          {/* Storage Usage */}
          <StorageUsage />
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-br from-[#004838] to-[#073127] p-8 rounded-2xl text-white">
          <h2 className="font-serif text-2xl font-semibold mb-6">Your Journey So Far</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#E2FB6C] mb-2">{stats.totalEntries}</div>
              <div className="text-sm opacity-90">Total Entries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#E2FB6C] mb-2">{stats.wordsWritten}</div>
              <div className="text-sm opacity-90">Words Written</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#E2FB6C] mb-2">{stats.photosAdded}</div>
              <div className="text-sm opacity-90">Photos Added</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#E2FB6C] mb-2">{stats.daysActive}</div>
              <div className="text-sm opacity-90">Days Active</div>
            </div>
          </div>
        </div>

        {/* Privacy Status */}
        <div className="mt-8 p-6 bg-[#EBEDE8] rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🔒</span>
            <h3 className="font-semibold text-[#333F3C]">Privacy Status: Secure</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-[#333F3C]">
            <div className="flex items-center gap-2">
              <span className="text-[#004838]">✓</span>
              <span>End-to-end encryption active</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#004838]">✓</span>
              <span>Data stored securely</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#004838]">✓</span>
              <span>No tracking or analytics</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#004838]">✓</span>
              <span>Full data control</span>
            </div>
          </div>
        </div>
      </div>

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
    </div>
  );
}