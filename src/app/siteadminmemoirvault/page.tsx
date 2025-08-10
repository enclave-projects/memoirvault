'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    userId: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [ipCheckLoading, setIpCheckLoading] = useState(true);
  const [ipAllowed, setIpAllowed] = useState(false);
  const [clientIP, setClientIP] = useState('');

  useEffect(() => {
    // Check for IP blocked error in URL params
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('error') === 'ip_blocked') {
      setIpAllowed(false);
      setError('Access denied: Your IP address is not authorized for admin access');
      setIpCheckLoading(false);
      return;
    }

    // Check IP restriction on component mount
    checkIPRestriction();
  }, []);

  const checkIPRestriction = async () => {
    try {
      const response = await fetch('/api/admin/ip-check');
      const data = await response.json();

      if (response.ok) {
        setIpAllowed(true);
        setClientIP(data.clientIP);
      } else {
        setIpAllowed(false);
        setError(data.message || 'Access denied from your IP address');
      }
    } catch (error) {
      console.error('IP check failed:', error);
      setIpAllowed(false);
      setError('Unable to verify IP access. Please try again.');
    } finally {
      setIpCheckLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ipAllowed) {
      setError('Access denied from your IP address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Authenticate via API route
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: credentials.userId,
          password: credentials.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store admin session
        sessionStorage.setItem('admin_authenticated', 'true');
        sessionStorage.setItem('admin_login_time', Date.now().toString());
        sessionStorage.setItem('admin_ip', clientIP);

        // Redirect to admin dashboard
        router.push('/siteadminmemoirvault/dashboard');
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  // Show loading screen while checking IP
  if (ipCheckLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#004838] to-[#333F3C] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004838] mx-auto mb-4"></div>
          <p className="text-[#333F3C]">Verifying access permissions...</p>
        </div>
      </div>
    );
  }

  // Show access denied if IP is not allowed
  if (!ipAllowed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#004838] to-[#333F3C] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-[#333F3C] mb-4">
            Admin panel access is restricted to authorized IP addresses only.
          </p>
          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <p className="text-sm text-[#333F3C]">
              <strong>Your IP:</strong> {clientIP || 'Unknown'}
            </p>
          </div>
          <p className="text-xs text-[#333F3C]">
            If you believe this is an error, please contact the system administrator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#004838] to-[#333F3C] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-3xl">📖</span>
            <span className="text-2xl font-bold text-[#004838]">MemoirVault</span>
          </div>
          <h1 className="text-2xl font-bold text-[#004838] mb-2">Admin Panel</h1>
          <p className="text-[#333F3C]">Site Administration Access</p>
          <div className="mt-2 text-xs text-green-600 bg-green-50 rounded-lg p-2">
            ✅ IP Authorized: {clientIP}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <span className="text-red-500 mr-2">⚠️</span>
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-[#333F3C] mb-2">
              Admin User ID
            </label>
            <input
              type="text"
              id="userId"
              name="userId"
              required
              value={credentials.userId}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004838] focus:border-transparent"
              placeholder="Enter admin user ID"
              autoComplete="username"
              disabled={!ipAllowed}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#333F3C] mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={credentials.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004838] focus:border-transparent"
              placeholder="Enter password"
              autoComplete="current-password"
              disabled={!ipAllowed}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !ipAllowed}
            className="w-full bg-[#004838] text-white py-3 px-6 rounded-lg font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Authenticating...' : 'Access Admin Panel'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-[#333F3C]">
            🔒 Secure admin access for authorized personnel only
          </p>
          <p className="text-xs text-[#333F3C] mt-2">
            Session expires after 2 hours of inactivity
          </p>
          <p className="text-xs text-green-600 mt-2">
            🌐 IP-restricted access enabled
          </p>
        </div>
      </div>
    </div>
  );
}