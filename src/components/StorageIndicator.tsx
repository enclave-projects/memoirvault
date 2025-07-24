"use client";

import { useState, useEffect } from 'react';
// Storage indicator component - uses API endpoint for storage info

interface StorageInfo {
  plan: string;
  storageLimit: number;
  storageUsed: number;
  storageAvailable: number;
  usagePercentage: number;
  formattedUsed: string;
  formattedLimit: string;
  formattedAvailable: string;
}

export default function StorageIndicator() {
  const [storageInfo, setStorageInfo] = useState<StorageInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStorageInfo();
  }, []);

  const fetchStorageInfo = async () => {
    try {
      const response = await fetch('/api/user/storage');
      if (response.ok) {
        const data = await response.json();
        setStorageInfo(data);
      }
    } catch (error) {
      console.error('Error fetching storage info:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#EBEDE8]">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-2 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  if (!storageInfo) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#EBEDE8]">
        <p className="text-red-600">Unable to load storage information</p>
      </div>
    );
  }

  const getProgressColor = (percentage: number) => {
    if (percentage < 70) return 'bg-green-500';
    if (percentage < 90) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTextColor = (percentage: number) => {
    if (percentage < 70) return 'text-green-600';
    if (percentage < 90) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-[#EBEDE8] hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-xl font-semibold text-[#333F3C]">Storage Usage</h3>
        <span className="text-sm font-medium text-[#004838] bg-[#E2FB6C] px-2 py-1 rounded">
          {storageInfo.plan.charAt(0).toUpperCase() + storageInfo.plan.slice(1)} Plan
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-[#333F3C] mb-2">
          <span>{storageInfo.formattedUsed} used</span>
          <span>{storageInfo.formattedLimit} total</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(storageInfo.usagePercentage)}`}
            style={{ width: `${Math.min(storageInfo.usagePercentage, 100)}%` }}
          ></div>
        </div>
        <div className={`text-sm mt-2 font-medium ${getTextColor(storageInfo.usagePercentage)}`}>
          {storageInfo.usagePercentage}% used • {storageInfo.formattedAvailable} available
        </div>
      </div>

      {/* Storage Warning */}
      {storageInfo.usagePercentage > 80 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-yellow-600">⚠️</span>
            <p className="text-yellow-800 text-sm">
              {storageInfo.usagePercentage > 95 
                ? 'Storage almost full! Consider upgrading your plan or deleting some files.'
                : 'Storage getting full. Consider upgrading your plan for more space.'
              }
            </p>
          </div>
        </div>
      )}

      {/* Upgrade Prompt for Free Users */}
      {storageInfo.plan === 'free' && storageInfo.usagePercentage > 50 && (
        <div className="bg-[#E2FB6C] bg-opacity-20 border border-[#E2FB6C] rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#004838] text-sm font-medium">Need more space?</p>
              <p className="text-[#004838] text-xs">Upgrade to get up to 50GB storage</p>
            </div>
            <a
              href="/pricing"
              className="text-xs bg-[#004838] text-[#E2FB6C] px-3 py-1 rounded font-medium hover:bg-[#073127] transition-colors"
            >
              Upgrade
            </a>
          </div>
        </div>
      )}
    </div>
  );
}