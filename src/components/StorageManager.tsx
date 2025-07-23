"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface StorageInfo {
  plan: string;
  storageLimit: number;
  storageUsed: number;
  storageAvailable: number;
  usagePercentage: number;
}

export default function StorageManager() {
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

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'free': return 'text-gray-600';
      case 'basic': return 'text-blue-600';
      case 'pro': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage < 70) return 'bg-green-500';
    if (percentage < 90) return 'bg-yellow-500';
    return 'bg-red-500';
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

  if (!storageInfo) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#EBEDE8]">
        <p className="text-red-600">Failed to load storage information</p>
      </div>
    );
  }

  const isNearLimit = storageInfo.usagePercentage > 80;
  const isAtLimit = storageInfo.usagePercentage >= 95;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-[#EBEDE8] hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-xl font-semibold text-[#333F3C]">Storage Usage</h3>
        <span className={`text-sm font-medium capitalize ${getPlanColor(storageInfo.plan)}`}>
          {storageInfo.plan} Plan
        </span>
      </div>

      {/* Storage Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-[#333F3C] mb-2">
          <span>{formatBytes(storageInfo.storageUsed)} used</span>
          <span>{formatBytes(storageInfo.storageLimit)} total</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(storageInfo.usagePercentage)}`}
            style={{ width: `${Math.min(storageInfo.usagePercentage, 100)}%` }}
          ></div>
        </div>
        <div className="text-center mt-2">
          <span className="text-sm text-[#333F3C] opacity-75">
            {storageInfo.usagePercentage}% used
          </span>
        </div>
      </div>

      {/* Storage Alerts */}
      {isAtLimit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-red-600">⚠️</span>
            <div>
              <p className="text-red-800 font-medium text-sm">Storage Limit Reached</p>
              <p className="text-red-700 text-sm">
                You've reached your storage limit. Upgrade your plan or delete some content to continue.
              </p>
            </div>
          </div>
        </div>
      )}

      {isNearLimit && !isAtLimit && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-yellow-600">⚠️</span>
            <div>
              <p className="text-yellow-800 font-medium text-sm">Storage Almost Full</p>
              <p className="text-yellow-700 text-sm">
                You're running low on storage space. Consider upgrading your plan.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Available Storage */}
      <div className="text-center mb-4">
        <p className="text-[#333F3C] text-sm">
          <span className="font-medium">{formatBytes(storageInfo.storageAvailable)}</span> available
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        {storageInfo.plan === 'free' && (
          <Link
            href="/pricing"
            className="block w-full text-center gradient-cta text-[#E2FB6C] px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
          >
            Upgrade for More Storage
          </Link>
        )}
        
        {storageInfo.plan === 'basic' && (
          <Link
            href="/pricing"
            className="block w-full text-center border-2 border-[#004838] text-[#004838] px-4 py-2 rounded-lg font-medium hover:bg-[#004838] hover:text-white transition-all duration-200"
          >
            Upgrade to Pro (50GB)
          </Link>
        )}

        <button
          onClick={() => window.location.reload()}
          className="w-full text-center text-[#333F3C] hover:text-[#004838] px-4 py-2 text-sm transition-colors"
        >
          Refresh Storage Info
        </button>
      </div>

      {/* Plan Comparison */}
      <div className="mt-6 pt-4 border-t border-[#EBEDE8]">
        <h4 className="font-semibold text-[#333F3C] text-sm mb-3">Storage Plans</h4>
        <div className="space-y-2 text-xs text-[#333F3C]">
          <div className="flex justify-between">
            <span className={storageInfo.plan === 'free' ? 'font-semibold' : ''}>Free</span>
            <span>2GB</span>
          </div>
          <div className="flex justify-between">
            <span className={storageInfo.plan === 'basic' ? 'font-semibold' : ''}>Basic</span>
            <span>30GB</span>
          </div>
          <div className="flex justify-between">
            <span className={storageInfo.plan === 'pro' ? 'font-semibold' : ''}>Pro</span>
            <span>50GB</span>
          </div>
        </div>
      </div>
    </div>
  );
}