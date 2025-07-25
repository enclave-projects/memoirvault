"use client";

import { useState, useEffect } from 'react';

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

export default function StorageUsage() {
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
        console.log('Storage API response:', data); // Debug log
        setStorageInfo(data);
      } else {
        console.error('Storage API failed:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching storage info:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#EBEDE8]">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-2 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  // Default storage info for free tier when API fails
  const defaultStorageInfo = {
    plan: 'free',
    storageLimit: 2 * 1024 * 1024 * 1024, // 2GB
    storageUsed: 0,
    storageAvailable: 2 * 1024 * 1024 * 1024,
    usagePercentage: 0,
    formattedUsed: '0 Bytes',
    formattedLimit: '2 GB',
    formattedAvailable: '2 GB',
  };
  
  const info = storageInfo || defaultStorageInfo;

  // Debug log to see what values we're using
  console.log('Storage info being used:', {
    storageUsed: info.storageUsed,
    storageLimit: info.storageLimit,
    usagePercentage: info.usagePercentage,
    formattedUsed: info.formattedUsed,
    isUsingDefault: !storageInfo
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-[#EBEDE8] hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-xl font-semibold text-[#333F3C]">Storage Usage</h3>
        <span className="text-sm font-medium capitalize text-gray-600">
          Free Plan
        </span>
      </div>

      {/* Storage Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-[#333F3C] mb-2">
          <span>{info.formattedUsed} used</span>
          <span>{info.formattedLimit} total</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-300 ${getUsageColor(info.usagePercentage)}`}
            style={{ width: `${Math.min(info.usagePercentage, 100)}%` }}
          ></div>
        </div>
        <div className="text-center mt-2">
          <span className="text-sm text-[#333F3C] opacity-75">
            {info.usagePercentage === 0 ? '0' : info.usagePercentage}% used
          </span>
        </div>
      </div>

      {/* Storage Details */}
      <div className="space-y-2 text-sm text-[#333F3C]">
        <div className="flex justify-between">
          <span>Available:</span>
          <span className="font-medium">{info.formattedAvailable}</span>
        </div>
      </div>

      {/* Warning for high usage */}
      {info.usagePercentage >= 80 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm mb-2">
            {info.usagePercentage >= 95 
              ? '⚠️ Storage almost full!' 
              : '📊 Storage getting full'}
          </p>
          <p className="text-yellow-700 text-sm">
            Consider deleting some entries to free up space.
          </p>
        </div>
      )}

      {/* Storage Info */}
      <div className="mt-4 pt-4 border-t border-[#EBEDE8]">
        <div className="text-sm text-[#333F3C] opacity-75">
          <p>All users currently have 2GB of free storage.</p>
          <p className="mt-1">Premium plans with more storage will be available soon.</p>
        </div>
      </div>
    </div>
  );
}